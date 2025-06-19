import Button from "@/components/ui/Button";
import { Todo, TodoStatus } from "@/types/todo";
import Link from "next/link";

interface TaskCardProps {
  task: Todo;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TodoStatus) => void;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

export default function TaskCard({
  task,
  onDelete,
  onStatusChange,
  isSelected = false,
  onSelect,
}: TaskCardProps) {
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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = () => {
    const endDate = new Date(task.end_date);
    const now = new Date();
    return endDate < now && task.status !== "completed";
  };

  return (
    <div
      className={`bg-bg-card rounded-lg shadow-custom border ${
        isSelected ? "border-primary" : "border-border-light"
      } p-6 hover:shadow-custom-md transition-shadow`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(task.id)}
              className="mt-1 w-4 h-4 text-primary bg-bg-main border-border-light rounded focus:ring-primary focus:ring-2"
            />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {task.title}
            </h3>
            <p className="text-text-secondary text-sm mb-3 line-clamp-2">
              {task.description}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/dashboard/tasks/detail/${task.id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
          <Link href={`/dashboard/tasks/edit/${task.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {getStatusLabel(task.status)}
          </span>
          {isOverdue() && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-error-100 text-error-700">
              Overdue
            </span>
          )}
        </div>
        <div className="text-sm text-text-secondary">
          {formatDate(task.start_date)} - {formatDate(task.end_date)}
        </div>
      </div>

      {task.status !== "completed" && (
        <div className="mt-4 flex space-x-2">
          {task.status === "not_started" && (
            <Button
              size="sm"
              onClick={() => onStatusChange(task.id, "in_progress")}
            >
              Start Task
            </Button>
          )}
          {task.status === "in_progress" && (
            <Button
              size="sm"
              onClick={() => onStatusChange(task.id, "completed")}
            >
              Mark Complete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
