"use client";

import TodosAPI from "@/lib/todos";
import {
  CreateTodoRequest,
  Todo,
  TodoFilters,
  UpdateTodoRequest,
} from "@/types/todo";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer,
} from "react";

interface TodoState {
  todos: Todo[];
  currentTodo: Todo | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  } | null;
}

interface TodoContextType extends TodoState {
  fetchTodos: (filters?: TodoFilters) => Promise<void>;
  fetchTodo: (id: number) => Promise<void>;
  createTodo: (data: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: number, data: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  bulkDeleteTodos: (ids: number[]) => Promise<void>;
  clearError: () => void;
  clearCurrentTodo: () => void;
}

type TodoAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TODOS"; payload: { todos: Todo[]; pagination: any } }
  | { type: "SET_CURRENT_TODO"; payload: Todo | null }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: number }
  | { type: "DELETE_TODOS"; payload: number[] };

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_TODOS":
      return {
        ...state,
        todos: action.payload.todos,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };
    case "SET_CURRENT_TODO":
      return { ...state, currentTodo: action.payload, isLoading: false };
    case "ADD_TODO":
      return {
        ...state,
        todos: [action.payload, ...state.todos],
        isLoading: false,
      };
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        ),
        currentTodo:
          state.currentTodo?.id === action.payload.id
            ? action.payload
            : state.currentTodo,
        isLoading: false,
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
        currentTodo:
          state.currentTodo?.id === action.payload ? null : state.currentTodo,
        isLoading: false,
      };
    case "DELETE_TODOS":
      return {
        ...state,
        todos: state.todos.filter((todo) => !action.payload.includes(todo.id)),
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: TodoState = {
  todos: [],
  currentTodo: null,
  isLoading: false,
  error: null,
  pagination: null,
};

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const fetchTodos = useCallback(async (filters?: TodoFilters) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await TodosAPI.getTodos(filters);
      dispatch({
        type: "SET_TODOS",
        payload: {
          todos: response.data.todos,
          pagination: response.data.pagination,
        },
      });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }, []);

  const fetchTodo = useCallback(async (id: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await TodosAPI.getTodo(id);
      dispatch({ type: "SET_CURRENT_TODO", payload: response.data });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }, []);

  const createTodo = useCallback(async (data: CreateTodoRequest) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await TodosAPI.createTodo(data);
      dispatch({ type: "ADD_TODO", payload: response.data });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, []);

  const updateTodo = useCallback(
    async (id: number, data: UpdateTodoRequest) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await TodosAPI.updateTodo(id, data);
        dispatch({ type: "UPDATE_TODO", payload: response.data });
      } catch (error: any) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        throw error;
      }
    },
    []
  );

  const deleteTodo = useCallback(async (id: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await TodosAPI.deleteTodo(id);
      dispatch({ type: "DELETE_TODO", payload: id });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, []);

  const bulkDeleteTodos = useCallback(async (ids: number[]) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await TodosAPI.bulkDeleteTodos({ ids });
      dispatch({ type: "DELETE_TODOS", payload: ids });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  const clearCurrentTodo = useCallback(() => {
    dispatch({ type: "SET_CURRENT_TODO", payload: null });
  }, []);

  return (
    <TodoContext.Provider
      value={{
        ...state,
        fetchTodos,
        fetchTodo,
        createTodo,
        updateTodo,
        deleteTodo,
        bulkDeleteTodos,
        clearError,
        clearCurrentTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
}
