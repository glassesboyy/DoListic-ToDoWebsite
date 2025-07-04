import React, { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "filled" | "outlined";
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "default",
      resize = "vertical",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const baseClasses = `
    w-full px-4 py-3 rounded-xl text-text-primary placeholder:text-text-muted
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-60 disabled:cursor-not-allowed
    form-focus-ring min-h-[120px]
  `;

    const variantClasses = {
      default: `
      bg-bg-card border-2 border-border-light
      hover:border-border-medium hover:shadow-sm
      focus:border-primary-400 focus:ring-primary-200
      focus:shadow-glow
    `,
      filled: `
      bg-bg-secondary border-2 border-transparent
      hover:bg-bg-tertiary hover:shadow-sm
      focus:bg-bg-card focus:border-primary-400 focus:ring-primary-200
      focus:shadow-glow
    `,
      outlined: `
      bg-transparent border-2 border-border-medium
      hover:border-border-dark hover:shadow-sm
      focus:border-primary-400 focus:ring-primary-200
      focus:bg-bg-card focus:shadow-glow
    `,
    };

    const errorClasses = error
      ? `
      border-error-400 focus:border-error-400 focus:ring-error-200
      bg-error-50 text-error-700
    `
      : "";

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-text-secondary mb-1 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          <textarea
            ref={ref}
            id={textareaId}
            className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${errorClasses}
            ${resizeClasses[resize]}
            ${className}
          `}
            {...props}
          />
          {/* Focus ring enhancement */}
          <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 ring-2 ring-primary-200 ring-offset-2" />
        </div>
        {error && (
          <p className="text-sm text-error-600 font-medium animate-slide-in flex items-center gap-1">
            <span className="w-4 h-4 text-error-500">⚠</span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-text-muted flex items-center gap-1">
            <span className="w-4 h-4 text-text-muted">ℹ</span>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
