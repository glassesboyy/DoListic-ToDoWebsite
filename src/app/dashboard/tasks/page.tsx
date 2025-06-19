"use client";

import TaskCard from "@/components/tasks/TaskCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useTodos } from "@/contexts/TodoContext";
import { TodoFilters, TodoStatus } from "@/types/todo";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TasksPage() {
  const {
    todos,
    isLoading,
    error,
    pagination,
    fetchTodos,
    deleteTodo,
    updateTodo,
    bulkDeleteTodos,
    clearError,
  } = useTodos();

  const [filters, setFilters] = useState<TodoFilters>({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    order: "desc",
  });

  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchTodos(filters);
  }, [fetchTodos, filters]);

  const handleFilterChange = (key: keyof TodoFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to page 1 when other filters change
    }));
  };

  const handleStatusChange = async (id: number, status: TodoStatus) => {
    try {
      const task = todos.find((t) => t.id === id);
      if (task) {
        await updateTodo(id, {
          title: task.title,
          description: task.description,
          status,
          start_date: task.start_date,
          end_date: task.end_date,
        });
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTodo(id);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (
      selectedTasks.length > 0 &&
      window.confirm(
        `Are you sure you want to delete ${selectedTasks.length} selected task(s)?`
      )
    ) {
      try {
        await bulkDeleteTodos(selectedTasks);
        setSelectedTasks([]);
        setShowBulkActions(false);
      } catch (error) {
        console.error("Failed to bulk delete tasks:", error);
      }
    }
  };

  const handleSelectTask = (id: number) => {
    setSelectedTasks((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((taskId) => taskId !== id)
        : [...prev, id];
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === todos.length) {
      setSelectedTasks([]);
      setShowBulkActions(false);
    } else {
      const allIds = todos.map((task) => task.id);
      setSelectedTasks(allIds);
      setShowBulkActions(true);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error-600 mb-4">{error}</div>
        <Button onClick={clearError}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">All Tasks</h1>
        <Link href="/dashboard/tasks/create">
          <Button>Create New Task</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Filters & Search
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Search by title"
            placeholder="Enter task title..."
            value={filters.title || ""}
            onChange={(e) => handleFilterChange("title", e.target.value)}
          />
          <Select
            label="Status"
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            options={[
              { value: "", label: "All Statuses" },
              { value: "not_started", label: "Not Started" },
              { value: "in_progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ]}
          />
          <Select
            label="Sort by"
            value={filters.sort_by || "created_at"}
            onChange={(e) => handleFilterChange("sort_by", e.target.value)}
            options={[
              { value: "created_at", label: "Created Date" },
              { value: "title", label: "Title" },
              { value: "status", label: "Status" },
              { value: "start_date", label: "Start Date" },
              { value: "end_date", label: "End Date" },
            ]}
          />
          <Select
            label="Order"
            value={filters.order || "desc"}
            onChange={(e) => handleFilterChange("order", e.target.value)}
            options={[
              { value: "desc", label: "Descending" },
              { value: "asc", label: "Ascending" },
            ]}
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-primary-700">
              {selectedTasks.length} task(s) selected
            </span>
            <div className="space-x-2">
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                Delete Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTasks([]);
                  setShowBulkActions(false);
                }}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {/* Select All */}
        {todos.length > 0 && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedTasks.length === todos.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-primary bg-bg-main border-border-light rounded focus:ring-primary focus:ring-2"
            />
            <label className="text-text-secondary text-sm">
              Select all tasks
            </label>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-text-muted mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No tasks found
            </h3>
            <p className="text-text-secondary mb-4">
              Get started by creating your first task.
            </p>
            <Link href="/dashboard/tasks/create">
              <Button>Create Task</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {todos.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                isSelected={selectedTasks.includes(task.id)}
                onSelect={handleSelectTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-text-secondary text-sm">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => handleFilterChange("page", pagination.page - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm text-text-secondary">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => handleFilterChange("page", pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
