import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  id?: string;
}

export default function Textarea({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full px-3 py-2 border rounded-lg bg-bg-main text-text-primary
          placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-colors resize-vertical
          ${
            error
              ? "border-error-500 focus:ring-error-500"
              : "border-border-light focus:ring-primary-500"
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-error-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  );
}
