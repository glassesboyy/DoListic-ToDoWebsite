"use client";

import Button from "@/components/ui/Button";
import { useTodos } from "@/contexts/TodoContext";
import { TodoStatus } from "@/types/todo";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    currentTodo,
    isLoading,
    error,
    fetchTodo,
    deleteTodo,
    updateTodo,
    clearError,
    clearCurrentTodo,
  } = useTodos();

  useEffect(() => {
    if (id) {
      fetchTodo(Number(id));
    }
    return () => {
      clearCurrentTodo();
    };
  }, [id, fetchTodo, clearCurrentTodo]);

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case "not_started":
        return "bg-neutral-100 text-neutral-700";
      case "in_progress":
        return "bg-warning-100 text-warning-700";
      case "completed":
        return "bg-success-100 text-success-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const getStatusLabel = (status: TodoStatus) => {
    switch (status) {
      case "not_started":
        return "Not Started";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = () => {
    if (!currentTodo) return false;
    const endDate = new Date(currentTodo.end_date);
    const now = new Date();
    return endDate < now && currentTodo.status !== "completed";
  };

  const getDaysUntilDeadline = () => {
    if (!currentTodo) return 0;
    const endDate = new Date(currentTodo.end_date);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleStatusChange = async (status: TodoStatus) => {
    if (!currentTodo) return;
    try {
      await updateTodo(currentTodo.id, {
        title: currentTodo.title,
        description: currentTodo.description,
        status,
        start_date: currentTodo.start_date,
        end_date: currentTodo.end_date,
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleDelete = async () => {
    if (!currentTodo) return;
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTodo(currentTodo.id);
        router.push("/dashboard/tasks");
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  if (isLoading && !currentTodo) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading task...</p>
      </div>
    );
  }

  if (error || !currentTodo) {
    return (
      <div className="text-center py-12">
        <div className="text-error-600 mb-4">{error || "Task not found"}</div>
        <Link href="/dashboard/tasks">
          <Button>Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  const daysUntilDeadline = getDaysUntilDeadline();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/tasks"
            className="text-primary hover:text-primary-dark text-sm mb-2 inline-block"
          >
            ← Back to Tasks
          </Link>
          <h1 className="text-3xl font-bold text-text-primary">Task Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/dashboard/tasks/edit/${currentTodo.id}`}>
            <Button variant="outline">Edit Task</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete Task
          </Button>
        </div>
      </div>

      {/* Task Info Card */}
      <div className="bg-bg-card rounded-lg shadow-custom border border-border-light p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-text-primary mb-3">
              {currentTodo.title}
            </h2>
            <div className="flex items-center space-x-4 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  currentTodo.status
                )}`}
              >
                {getStatusLabel(currentTodo.status)}
              </span>
              {isOverdue() && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-error-100 text-error-700">
                  Overdue
                </span>
              )}
              {!isOverdue() && currentTodo.status !== "completed" && (
                <span className="text-sm text-text-secondary">
                  {daysUntilDeadline > 0 ? (
                    <span className="text-success-600">
                      {daysUntilDeadline} days remaining
                    </span>
                  ) : daysUntilDeadline === 0 ? (
                    <span className="text-warning-600">Due today</span>
                  ) : (
                    <span className="text-error-600">
                      {Math.abs(daysUntilDeadline)} days overdue
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Description
            </h3>
            <div className="bg-bg-main rounded-lg p-4 border border-border-light">
              <p className="text-text-secondary whitespace-pre-wrap">
                {currentTodo.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Task Details */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Task Information
            </h3>
            <div className="space-y-4">
              <div className="bg-bg-main rounded-lg p-4 border border-border-light">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-text-secondary">
                      Start Date:
                    </span>
                    <span className="text-sm text-text-primary">
                      {formatShortDate(currentTodo.start_date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-text-secondary">
                      End Date:
                    </span>
                    <span className="text-sm text-text-primary">
                      {formatShortDate(currentTodo.end_date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-text-secondary">
                      Created:
                    </span>
                    <span className="text-sm text-text-primary">
                      {formatShortDate(currentTodo.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-text-secondary">
                      Last Updated:
                    </span>
                    <span className="text-sm text-text-primary">
                      {formatShortDate(currentTodo.updated_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned User */}
              <div className="bg-bg-main rounded-lg p-4 border border-border-light">
                <h4 className="text-sm font-medium text-text-secondary mb-2">
                  Assigned to:
                </h4>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {currentTodo.user.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      @{currentTodo.user.username} • {currentTodo.user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {currentTodo.status !== "completed" && (
          <div className="mt-8 pt-6 border-t border-border-light">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Quick Actions
            </h3>
            <div className="flex space-x-3">
              {currentTodo.status === "not_started" && (
                <Button onClick={() => handleStatusChange("in_progress")}>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-10 0V8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2z"
                    />
                  </svg>
                  Start Task
                </Button>
              )}
              {currentTodo.status === "in_progress" && (
                <Button onClick={() => handleStatusChange("completed")}>
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Mark as Completed
                </Button>
              )}
              <Link href={`/dashboard/tasks/edit/${currentTodo.id}`}>
                <Button variant="outline">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Task
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Completed Status */}
        {currentTodo.status === "completed" && (
          <div className="mt-8 pt-6 border-t border-border-light">
            <div className="flex items-center space-x-3 text-success-600">
              <svg
                className="w-6 h-6"
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
              <span className="font-medium">Task completed! Great job! 🎉</span>
            </div>
          </div>
        )}

        {/* Attachments */}
        {currentTodo.attachments && currentTodo.attachments.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border-light">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Attachments ({currentTodo.attachments.length})
            </h3>
            <div className="grid gap-3">
              {currentTodo.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-4 bg-bg-main rounded-lg border border-border-light hover:bg-bg-hover transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {attachment.original_name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {(attachment.file_size / 1024).toFixed(1)} KB •{" "}
                        {attachment.mime_type}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline/Activity */}
        <div className="mt-8 pt-6 border-t border-border-light">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Task Timeline
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Task created
                </p>
                <p className="text-xs text-text-secondary">
                  {formatDate(currentTodo.created_at)}
                </p>
              </div>
            </div>
            {currentTodo.updated_at !== currentTodo.created_at && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Task updated
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatDate(currentTodo.updated_at)}
                  </p>
                </div>
              </div>
            )}
            {currentTodo.status === "completed" && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Task completed
                  </p>
                  <p className="text-xs text-text-secondary">
                    Status changed to completed
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
