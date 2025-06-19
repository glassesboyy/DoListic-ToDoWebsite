import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export default function Select({
  label,
  error,
  helperText,
  options,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full px-3 py-2 border rounded-lg bg-bg-main text-text-primary
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-colors
          ${
            error
              ? "border-error-500 focus:ring-error-500"
              : "border-border-light focus:ring-primary-500"
          }
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-error-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  );
}
