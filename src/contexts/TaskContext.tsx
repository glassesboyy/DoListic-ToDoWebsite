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
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  pageLimit: number;

  // Actions
  fetchTasks: (filters?: TaskFilters, page?: number) => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTask: (id: number, data: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  bulkDeleteTasks: (ids: number[]) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  toggleTaskSelection: (id: number) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  clearError: () => void;
  goToPage: (page: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<TaskFilters>({
    sort_by: "created_at",
    order: "desc",
  });
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);

  const fetchTasks = async (newFilters?: TaskFilters, page?: number) => {
    setLoading(true);
    setError(null);

    try {
      const finalFilters = { ...filters, ...newFilters };
      const pageToFetch = page ?? currentPage;
      const filtersWithPage = {
        ...finalFilters,
        page: pageToFetch,
        limit: pageLimit,
      };
      const response = await TaskAPI.getTasks(filtersWithPage);
      // Ambil data dan pagination dari response.data
      const tasksData = response.data?.data ?? [];
      const pagination = response.data?.pagination ?? {};
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setCurrentPage(pagination.page || 1);
      setTotalPages(pagination.total_pages || 1);
      setTotalTasks(pagination.total || 0);
      setPageLimit(pagination.limit || 10);
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
      await fetchTasks(undefined, 1); // Refresh to page 1
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
      await fetchTasks();
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
      await fetchTasks();
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
      await fetchTasks();
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

  const goToPage = (page: number) => {
    fetchTasks(undefined, page);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: Array.isArray(tasks) ? tasks : [],
        loading,
        error,
        filters,
        selectedTasks: Array.isArray(selectedTasks) ? selectedTasks : [],
        currentPage,
        totalPages,
        totalTasks,
        pageLimit,
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
        goToPage,
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
