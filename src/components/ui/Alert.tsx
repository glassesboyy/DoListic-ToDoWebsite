import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiX,
} from "react-icons/hi";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
  title?: string;
  variant?: "default" | "filled" | "outlined";
}

export default function Alert({
  type,
  message,
  onClose,
  title,
  variant = "default",
}: AlertProps) {
  const baseClasses = `
    px-5 py-4 rounded-xl text-sm border-2 flex items-start gap-3 
    relative overflow-hidden transition-all duration-200 ease-in-out
    animate-slide-in shadow-lg
  `;

  const variantClasses = {
    default: {
      success: "bg-success-50 border-success-200 text-success-800",
      error: "bg-error-50 border-error-200 text-error-800",
      warning: "bg-warning-50 border-warning-200 text-warning-800",
      info: "bg-info-50 border-info-200 text-info-800",
    },
    filled: {
      success: "bg-gradient-success text-white border-success-600 shadow-xl",
      error: "bg-gradient-error text-white border-error-600 shadow-xl",
      warning: "bg-gradient-warning text-white border-warning-600 shadow-xl",
      info: "bg-gradient-info text-white border-info-600 shadow-xl",
    },
    outlined: {
      success: "bg-transparent border-success-400 text-success-700",
      error: "bg-transparent border-error-400 text-error-700",
      warning: "bg-transparent border-warning-400 text-warning-700",
      info: "bg-transparent border-info-400 text-info-700",
    },
  };

  const iconClasses = {
    success: "text-success-500",
    error: "text-error-500",
    warning: "text-warning-500",
    info: "text-info-500",
  };

  const filledIconClasses = {
    success: "text-white",
    error: "text-white",
    warning: "text-white",
    info: "text-white",
  };

  const icons = {
    success: HiCheckCircle,
    error: HiExclamationCircle,
    warning: HiExclamationCircle,
    info: HiInformationCircle,
  };

  const IconComponent = icons[type];
  const iconColor =
    variant === "filled" ? filledIconClasses[type] : iconClasses[type];

  return (
    <div className={`${baseClasses} ${variantClasses[variant][type]}`}>
      {/* Animated background accent */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse" />
      </div>

      <div className="relative z-10 flex items-start gap-3 w-full">
        <IconComponent
          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`}
        />

        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold mb-1 text-current">{title}</h4>
          )}
          <p className="text-current leading-relaxed">{message}</p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`
              flex-shrink-0 p-1 rounded-lg transition-all duration-200
              hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current/20
              ${
                variant === "filled"
                  ? "text-white hover:bg-white/20"
                  : "text-current"
              }
            `}
            aria-label="Close alert"
          >
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
