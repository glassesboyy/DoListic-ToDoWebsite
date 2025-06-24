import { TrashTask } from "@/types/trash";
import { TaskStatus } from "@/types/task";
import Button from "@/components/ui/Button";

interface TrashTaskCardProps {
  task: TrashTask;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onRestore: (id: number) => void;
  onPermanentDelete: (id: number) => void;
}

export default function TrashTaskCard({
  task,
  isSelected,
  onSelect,
  onRestore,
  onPermanentDelete,
}: TrashTaskCardProps) {
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

  return (
    <div
      className={`
      bg-bg-card border rounded-lg p-4 transition-all duration-200 opacity-75
      ${
        isSelected
          ? "border-primary-300 ring-2 ring-primary-100"
          : "border-border-light"
      }
      hover:shadow-custom-md hover:opacity-90
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
            <div className="flex items-center space-x-2">
              <span
                className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                ${getStatusColor(task.status)}
              `}
              >
                {getStatusText(task.status)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-700 border border-error-200">
                Deleted
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRestore(task.id)}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Restore
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onPermanentDelete(task.id)}
          >
            <svg
              className="w-4 h-4 mr-1"
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
            Delete Forever
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
        <span>Deleted: {formatDate(task.deleted_at)}</span>
      </div>
    </div>
  );
}
