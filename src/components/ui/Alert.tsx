interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const baseClasses =
    "px-4 py-3 rounded-lg text-sm border flex items-center justify-between";

  const typeClasses = {
    success: "bg-success-50 border-success-200 text-success-700",
    error: "bg-error-50 border-error-200 text-error-700",
    warning: "bg-warning-50 border-warning-200 text-warning-700",
    info: "bg-info-50 border-info-200 text-info-700",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex items-center">
        <span className="mr-2 font-semibold">{icons[type]}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-current hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}
