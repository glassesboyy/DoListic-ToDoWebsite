import Button from "@/components/ui/Button";
import { Task, TaskStatus } from "@/types/task";
import { useState } from "react";
import { HiOutlineClock, HiOutlineDocument } from "react-icons/hi";

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onView?: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({
  task,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [showDetails] = useState(false);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "not_started":
        return "bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-800 border-neutral-300";
      case "in_progress":
        return "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 border-warning-300";
      case "completed":
        return "bg-gradient-to-r from-success-100 to-success-200 text-success-800 border-success-300";
      default:
        return "bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-800 border-neutral-300";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "not_started":
        return "⏸️";
      case "in_progress":
        return "⚡";
      case "completed":
        return "✅";
      default:
        return "⏸️";
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
    if (!dateString || dateString === "0001-01-01T00:00:00Z") return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = () => {
    if (!task.end_date || task.end_date === "0001-01-01T00:00:00Z")
      return false;
    return new Date(task.end_date) < new Date() && task.status !== "completed";
  };

  const getDaysUntilDeadline = () => {
    if (!task.end_date || task.end_date === "0001-01-01T00:00:00Z") return null;
    const today = new Date();
    const deadline = new Date(task.end_date);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeadline = getDaysUntilDeadline();

  return (
    <div
      className={`
      bg-gradient-card border-2 rounded-2xl p-6 transition-all duration-300 ease-in-out
      card-hover shadow-lg hover:shadow-xl
      ${
        isSelected
          ? "border-primary-400 ring-4 ring-primary-200 shadow-glow"
          : "border-border-light hover:border-primary-300"
      }
      ${
        isOverdue()
          ? "border-l-4 border-l-error-500 bg-gradient-to-r from-error-50 to-white"
          : ""
      }
      relative overflow-hidden group
    `}
    >
      {/* Animated background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50 via-transparent to-accent-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="relative">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(task.id)}
                className="w-5 h-5 text-primary-500 border-2 border-border-medium rounded-lg
                          focus:ring-primary-300 focus:ring-offset-2 transition-all duration-200
                          hover:border-primary-400 hover:shadow-sm"
              />
              {isSelected && <div className="absolute inset-0" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-text-primary text-xl mb-2 line-clamp-2 leading-tight">
                {task.title}
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 shadow-sm
                  ${getStatusColor(task.status)}
                `}
                >
                  <span className="mr-1">{getStatusIcon(task.status)}</span>
                  {getStatusText(task.status)}
                </span>

                {daysUntilDeadline !== null && (
                  <div
                    className={`
                    inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 shadow-sm
                    ${
                      daysUntilDeadline < 0
                        ? "bg-gradient-to-r from-error-100 to-error-200 text-error-800 border-error-300"
                        : daysUntilDeadline <= 3
                        ? "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 border-warning-300"
                        : "bg-gradient-to-r from-info-100 to-info-200 text-info-800 border-info-300"
                    }
                  `}
                  >
                    <HiOutlineClock className="w-3 h-3 mr-1" />
                    {daysUntilDeadline < 0
                      ? `${Math.abs(daysUntilDeadline)} days overdue`
                      : daysUntilDeadline === 0
                      ? "Due today"
                      : `${daysUntilDeadline} days left`}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(task)}>
                View
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
          </div>
        </div>

        {task.description && (
          <div className="mb-4">
            <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed bg-bg-secondary/50 rounded-lg p-3">
              {task.description}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-text-muted">
            <div className="flex items-center gap-1">
              <span className="font-medium">Start:</span>
              <span className="bg-bg-secondary px-2 py-1 rounded-md">
                {formatDate(task.start_date)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">End:</span>
              <span className="bg-bg-secondary px-2 py-1 rounded-md">
                {formatDate(task.end_date)}
              </span>
            </div>
          </div>

          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1 text-text-muted">
              <HiOutlineDocument className="w-4 h-4" />
              <span className="text-xs font-medium">
                {task.attachments.length} attachment
                {task.attachments.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {showDetails && (
          <div className="mt-6 pt-4 border-t border-border-light space-y-3 animate-fade-in">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-bg-secondary/50 rounded-lg p-3">
                <span className="font-semibold text-text-secondary block mb-1">
                  Created:
                </span>
                <p className="text-text-primary">
                  {formatDate(task.created_at)}
                </p>
              </div>
              <div className="bg-bg-secondary/50 rounded-lg p-3">
                <span className="font-semibold text-text-secondary block mb-1">
                  Updated:
                </span>
                <p className="text-text-primary">
                  {formatDate(task.updated_at)}
                </p>
              </div>
            </div>

            {task.attachments && task.attachments.length > 0 && (
              <div className="bg-bg-secondary/50 rounded-lg p-3">
                <span className="font-semibold text-text-secondary block mb-1">
                  Attachments:
                </span>
                <p className="text-text-primary flex items-center gap-1">
                  <HiOutlineDocument className="w-4 h-4" />
                  {task.attachments.length} file(s)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
