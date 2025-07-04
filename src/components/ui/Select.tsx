import React, { forwardRef } from "react";
import { HiChevronDown } from "react-icons/hi";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  variant?: "default" | "filled" | "outlined";
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      variant = "default",
      placeholder = "Select an option",
      className = "",
      id,
      ...props
    }: SelectProps,
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const baseClasses = `
      w-full px-4 py-3 rounded-xl text-text-primary
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-60 disabled:cursor-not-allowed
      form-focus-ring appearance-none cursor-pointer
      pr-12
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

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-text-secondary mb-1 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            id={selectId}
            className={`
              ${baseClasses}
              ${variantClasses[variant]}
              ${errorClasses}
              ${className}
            `}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <HiChevronDown className="w-5 h-5 text-text-muted group-focus-within:text-primary-500 transition-colors duration-200" />
          </div>
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

Select.displayName = "Select";

export default Select;
