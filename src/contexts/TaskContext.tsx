"use client";

import TaskAPI from "@/lib/taskApi";
import { ApiError } from "@/types/auth";
import {
  CreateTaskRequest,
  Task,
  TaskFilters,
  UpdateTaskRequest,
} from "@/types/task";
import { createContext, ReactNode, useContext, useState } from "react";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  selectedTasks: number[];

  // Actions
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTask: (id: number, data: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  bulkDeleteTasks: (ids: number[]) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  toggleTaskSelection: (id: number) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<TaskFilters>({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    order: "desc",
  });
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const fetchTasks = async (newFilters?: TaskFilters) => {
    setLoading(true);
    setError(null);

    try {
      const finalFilters = newFilters || filters;
      const data = await TaskAPI.getTasks(finalFilters);
      setTasks(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: CreateTaskRequest) => {
    setLoading(true);
    setError(null);

    try {
      await TaskAPI.createTask(data);
      await fetchTasks(); // Refresh tasks
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, data: UpdateTaskRequest) => {
    setLoading(true);
    setError(null);

    try {
      await TaskAPI.updateTask(id, data);
      await fetchTasks(); // Refresh tasks
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to update task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await TaskAPI.deleteTask(id);
      await fetchTasks(); // Refresh tasks
      setSelectedTasks((prev) => {
        const safeArray = Array.isArray(prev) ? prev : [];
        return safeArray.filter((taskId) => taskId !== id);
      });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to delete task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkDeleteTasks = async (ids: number[]) => {
    setLoading(true);
    setError(null);

    try {
      await TaskAPI.bulkDeleteTasks({ ids });
      await fetchTasks(); // Refresh tasks
      setSelectedTasks([]);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to delete tasks");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setFilters = (newFilters: TaskFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const toggleTaskSelection = (id: number) => {
    setSelectedTasks((prev) => {
      const safeArray = Array.isArray(prev) ? prev : [];
      return safeArray.includes(id)
        ? safeArray.filter((taskId) => taskId !== id)
        : [...safeArray, id];
    });
  };

  const selectAllTasks = () => {
    setSelectedTasks(Array.isArray(tasks) ? tasks.map((task) => task.id) : []);
  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: Array.isArray(tasks) ? tasks : [],
        loading,
        error,
        filters,
        selectedTasks: Array.isArray(selectedTasks) ? selectedTasks : [],
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        bulkDeleteTasks,
        setFilters,
        toggleTaskSelection,
        selectAllTasks,
        clearSelection,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
}
