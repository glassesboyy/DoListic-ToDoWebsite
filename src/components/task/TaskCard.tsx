import Button from "@/components/ui/Button";
import { Task, TaskStatus } from "@/types/task";
import { useState } from "react";

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
  const [showDetails, setShowDetails] = useState(false);

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
    if (!dateString || dateString === "0001-01-01T00:00:00Z") return "No date";
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = () => {
    if (!task.end_date || task.end_date === "0001-01-01T00:00:00Z")
      return false;
    return new Date(task.end_date) < new Date() && task.status !== "completed";
  };

  return (
    <div
      className={`
      bg-bg-card border rounded-lg p-4 transition-all duration-200
      ${
        isSelected
          ? "border-primary-300 ring-2 ring-primary-100"
          : "border-border-light"
      }
      ${isOverdue() ? "border-l-4 border-l-error-500" : ""}
      hover:shadow-custom-md
    `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(task.id)}
            className="mt-1 w-4 h-4 text-primary focus:ring-primary border-border-medium rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary text-lg mb-1">
              {task.title}
            </h3>
            <span
              className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
              ${getStatusColor(task.status)}
            `}
            >
              {getStatusText(task.status)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(task)}>
              View
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-text-muted">
        <div className="flex items-center space-x-4">
          <span>Start: {formatDate(task.start_date)}</span>
          <span>End: {formatDate(task.end_date)}</span>
        </div>
        {isOverdue() && (
          <span className="text-error-600 font-medium">Overdue!</span>
        )}
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-border-light space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-text-secondary">Created:</span>
              <p className="text-text-primary">{formatDate(task.created_at)}</p>
            </div>
            <div>
              <span className="font-medium text-text-secondary">Updated:</span>
              <p className="text-text-primary">{formatDate(task.updated_at)}</p>
            </div>
          </div>

          {task.attachments && task.attachments.length > 0 && (
            <div>
              <span className="font-medium text-text-secondary">
                Attachments:
              </span>
              <p className="text-text-primary">
                {task.attachments.length} file(s)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
