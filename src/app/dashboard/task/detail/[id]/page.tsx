"use client";

import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { useTask } from "@/contexts/TaskContext";
import { Task, TaskStatus } from "@/types/task";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TaskAPI from "@/lib/taskApi";
import { ApiError } from "@/types/auth";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = parseInt(params.id as string);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteTask } = useTask();

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        const data = await TaskAPI.getTaskById(taskId);
        setTask(data);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to fetch task details");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTaskDetail();
    }
  }, [taskId]);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "not_started":
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
      case "in_progress":
        return "bg-warning-100 text-warning-700 border-warning-200";
      case "completed":
        return "bg-success-100 text-success-700 border-success-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const getStatusText = (status: TaskStatus) => {
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
    if (!dateString || dateString === "0001-01-01T00:00:00Z")
      return "No date set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = () => {
    if (!task?.end_date || task.end_date === "0001-01-01T00:00:00Z")
      return false;
    return new Date(task.end_date) < new Date() && task.status !== "completed";
  };

  const handleDelete = async () => {
    if (!task) return;

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      router.push("/dashboard/task");
    } catch (err) {
      setError("Failed to delete task");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-primary">Task Details</h1>
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>

        <Alert
          type="error"
          message={error || "Task not found"}
          onClose={() => setError(null)}
        />

        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Task not found
          </h3>
          <Button onClick={() => router.push("/dashboard/task")}>
            Go to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Task Details</h1>
          <p className="text-text-secondary mt-1">
            View and manage task information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/task/edit/${task.id}`)}
          >
            Edit Task
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Task Details Card */}
      <div className="bg-bg-card border border-border-light rounded-lg overflow-hidden">
        {/* Header with status */}
        <div
          className={`px-6 py-4 border-l-4 ${
            isOverdue() ? "border-l-error-500" : "border-l-primary"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                {task.title}
              </h2>
              <div className="flex items-center space-x-4">
                <span
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
                    ${getStatusColor(task.status)}
                  `}
                >
                  {getStatusText(task.status)}
                </span>
                {isOverdue() && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error-100 text-error-700 border border-error-200">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-3">
                Description
              </h3>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-text-secondary whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            </div>
          )}

          {/* Dates and Times */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-secondary rounded-lg p-4">
                <h4 className="font-medium text-text-secondary mb-1">
                  Start Date
                </h4>
                <p className="text-text-primary">
                  {formatDate(task.start_date)}
                </p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <h4 className="font-medium text-text-secondary mb-1">
                  End Date
                </h4>
                <p className="text-text-primary">{formatDate(task.end_date)}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">
              Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-secondary rounded-lg p-4">
                <h4 className="font-medium text-text-secondary mb-1">
                  Created
                </h4>
                <p className="text-text-primary">
                  {formatDate(task.created_at)}
                </p>
              </div>
              <div className="bg-bg-secondary rounded-lg p-4">
                <h4 className="font-medium text-text-secondary mb-1">
                  Last Updated
                </h4>
                <p className="text-text-primary">
                  {formatDate(task.updated_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-3">
                Attachments
              </h3>
              <div className="bg-bg-secondary rounded-lg p-4">
                <p className="text-text-primary">
                  {task.attachments.length} file(s) attached
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-bg-overlay" />

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-bg-card shadow-custom-xl rounded-lg border border-border-light">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-error-100 rounded-full mb-4">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-text-primary text-center mb-2">
                Delete Task
              </h3>
              <p className="text-text-secondary text-center mb-6">
                Are you sure you want to delete "{task.title}"? This action
                cannot be undone.
              </p>

              <div className="flex items-center justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                >
                  Delete Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
