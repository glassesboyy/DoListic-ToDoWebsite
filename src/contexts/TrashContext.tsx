"use client";

import TrashAPI from "@/lib/trashApi";
import { ApiError } from "@/types/auth";
import {
  PermanentDeleteRequest,
  RestoreRequest,
  TrashTask,
} from "@/types/trash";
import { createContext, ReactNode, useContext, useState } from "react";

interface TrashContextType {
  trashedTasks: TrashTask[];
  loading: boolean;
  error: string | null;
  selectedTasks: number[];

  // Actions
  fetchTrashedTasks: () => Promise<void>;
  restoreTask: (id: number) => Promise<void>;
  permanentDeleteTask: (id: number) => Promise<void>;
  bulkRestoreTasks: (ids: number[]) => Promise<void>;
  bulkPermanentDeleteTasks: (ids: number[]) => Promise<void>;
  toggleTaskSelection: (id: number) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  clearError: () => void;
}

const TrashContext = createContext<TrashContextType | undefined>(undefined);

export function TrashProvider({ children }: { children: ReactNode }) {
  const [trashedTasks, setTrashedTasks] = useState<TrashTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const fetchTrashedTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await TrashAPI.getTrashedTasks();
      setTrashedTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 404) {
        setTrashedTasks([]);
        setError(null);
      } else {
        setError(apiError.message || "Failed to fetch trashed tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  const restoreTask = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await TrashAPI.restoreTask(id);
      await fetchTrashedTasks();
      setSelectedTasks((prev) =>
        Array.isArray(prev) ? prev.filter((taskId) => taskId !== id) : []
      );
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to restore task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const permanentDeleteTask = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await TrashAPI.permanentDeleteTask(id);
      await fetchTrashedTasks();
      setSelectedTasks((prev) =>
        Array.isArray(prev) ? prev.filter((taskId) => taskId !== id) : []
      );
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to permanently delete task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkRestoreTasks = async (ids: number[]) => {
    setLoading(true);
    setError(null);

    try {
      await TrashAPI.bulkRestoreTasks({ ids });
      await fetchTrashedTasks();
      setSelectedTasks([]);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to restore tasks");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkPermanentDeleteTasks = async (ids: number[]) => {
    setLoading(true);
    setError(null);

    try {
      await TrashAPI.bulkPermanentDeleteTasks({ ids });
      await fetchTrashedTasks();
      setSelectedTasks([]);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to permanently delete tasks");
      throw err;
    } finally {
      setLoading(false);
    }
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
    setSelectedTasks(
      Array.isArray(trashedTasks) ? trashedTasks.map((task) => task.id) : []
    );
  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <TrashContext.Provider
      value={{
        trashedTasks: Array.isArray(trashedTasks) ? trashedTasks : [],
        loading,
        error,
        selectedTasks: Array.isArray(selectedTasks) ? selectedTasks : [],
        fetchTrashedTasks,
        restoreTask,
        permanentDeleteTask,
        bulkRestoreTasks,
        bulkPermanentDeleteTasks,
        toggleTaskSelection,
        selectAllTasks,
        clearSelection,
        clearError,
      }}
    >
      {children}
    </TrashContext.Provider>
  );
}

export function useTrash() {
  const context = useContext(TrashContext);
  if (context === undefined) {
    throw new Error("useTrash must be used within a TrashProvider");
  }
  return context;
}
