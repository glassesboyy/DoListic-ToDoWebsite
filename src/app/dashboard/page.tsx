"use client";

import TaskCard from "@/components/tasks/TaskCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useTodos } from "@/contexts/TodoContext";
import { TodoStatus } from "@/types/todo";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    todos,
    isLoading,
    error,
    fetchTodos,
    deleteTodo,
    updateTodo,
    clearError,
  } = useTodos();

  useEffect(() => {
    // Fetch recent todos for dashboard (get all todos to calculate statistics)
    fetchTodos({ limit: 50, sort_by: "created_at", order: "desc" });
  }, [fetchTodos]);

  const getTaskStats = () => {
    const notStarted = todos.filter(
      (todo) => todo.status === "not_started"
    ).length;
    const inProgress = todos.filter(
      (todo) => todo.status === "in_progress"
    ).length;
    const completed = todos.filter(
      (todo) => todo.status === "completed"
    ).length;
    const overdue = todos.filter((todo) => {
      const endDate = new Date(todo.end_date);
      const now = new Date();
      return endDate < now && todo.status !== "completed";
    }).length;

    return { notStarted, inProgress, completed, overdue, total: todos.length };
  };

  const getRecentTasks = () => {
    return todos.slice(0, 5); // Show only the 5 most recent tasks
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

  const stats = getTaskStats();
  const recentTasks = getRecentTasks();

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error-600 mb-4">{error}</div>
        <Button onClick={clearError}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-text-secondary">
          Here's an overview of your tasks and progress.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-neutral-100">
              <svg
                className="w-6 h-6 text-neutral-600"
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
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">
                Total Tasks
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {isLoading ? "..." : stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-warning-100">
              <svg
                className="w-6 h-6 text-warning-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">
                In Progress
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {isLoading ? "..." : stats.inProgress}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success-100">
              <svg
                className="w-6 h-6 text-success-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">
                Completed
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {isLoading ? "..." : stats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-error-100">
              <svg
                className="w-6 h-6 text-error-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Overdue</p>
              <p className="text-2xl font-bold text-text-primary">
                {isLoading ? "..." : stats.overdue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/tasks/create">
            <Button>Create New Task</Button>
          </Link>
          <Link href="/dashboard/tasks">
            <Button variant="outline">View All Tasks</Button>
          </Link>
          <Link href="/dashboard/tasks?status=in_progress">
            <Button variant="outline">View In Progress</Button>
          </Link>
          <Link href="/dashboard/tasks?status=not_started">
            <Button variant="outline">View Pending</Button>
          </Link>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Recent Tasks
          </h2>
          <Link href="/dashboard/tasks">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading tasks...</p>
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-text-muted mx-auto mb-4"
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
              No tasks yet
            </h3>
            <p className="text-text-secondary mb-4">
              Get started by creating your first task.
            </p>
            <Link href="/dashboard/tasks/create">
              <Button>Create Task</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
            {todos.length > 5 && (
              <div className="text-center pt-4">
                <Link href="/dashboard/tasks">
                  <Button variant="outline">
                    View {todos.length - 5} more tasks
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      {stats.total > 0 && (
        <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Progress Summary
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Completion Rate</span>
              <span className="font-semibold text-text-primary">
                {((stats.completed / stats.total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-success-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Not Started: </span>
                <span className="font-medium text-neutral-600">
                  {stats.notStarted}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">In Progress: </span>
                <span className="font-medium text-warning-600">
                  {stats.inProgress}
                </span>
              </div>
            </div>
            {stats.overdue > 0 && (
              <div className="text-sm">
                <span className="text-text-secondary">⚠️ Overdue tasks: </span>
                <span className="font-medium text-error-600">
                  {stats.overdue}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
