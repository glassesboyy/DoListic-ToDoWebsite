import React from "react";
import { HiOutlineRefresh } from "react-icons/hi";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "success"
    | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  icon,
  iconPosition = "left",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
    relative overflow-hidden group
    btn-hover-lift
  `;

  const variantClasses = {
    primary: `
      bg-gradient-primary text-white shadow-colored
      hover:shadow-glow hover:scale-105
      focus:ring-primary-300 focus:ring-offset-2
      active:scale-95
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-100%] before:transition-transform before:duration-500
      hover:before:translate-x-[100%]
    `,
    secondary: `
      bg-gradient-secondary text-white shadow-lg
      hover:shadow-xl hover:scale-105
      focus:ring-secondary-300 focus:ring-offset-2
      active:scale-95
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-100%] before:transition-transform before:duration-500
      hover:before:translate-x-[100%]
    `,
    outline: `
      border-2 border-primary bg-transparent text-primary shadow-sm
      hover:bg-primary hover:text-white hover:shadow-glow hover:scale-105
      focus:ring-primary-300 focus:ring-offset-2
      active:scale-95
      transition-all duration-200
    `,
    danger: `
      bg-gradient-error text-white shadow-lg
      hover:shadow-xl hover:scale-105
      focus:ring-error-300 focus:ring-offset-2
      active:scale-95
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-100%] before:transition-transform before:duration-500
      hover:before:translate-x-[100%]
    `,
    success: `
      bg-gradient-success text-white shadow-lg
      hover:shadow-xl hover:scale-105
      focus:ring-success-300 focus:ring-offset-2
      active:scale-95
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-100%] before:transition-transform before:duration-500
      hover:before:translate-x-[100%]
    `,
    gradient: `
      bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 text-white shadow-xl
      hover:shadow-glow hover:scale-105
      focus:ring-primary-300 focus:ring-offset-2
      active:scale-95
      animate-pulse hover:animate-none
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
      before:translate-x-[-100%] before:transition-transform before:duration-700
      hover:before:translate-x-[100%]
    `,
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm min-h-[32px] gap-1.5",
    md: "px-4 py-2 text-sm min-h-[40px] gap-2",
    lg: "px-6 py-3 text-base min-h-[48px] gap-2.5",
    xl: "px-8 py-4 text-lg min-h-[56px] gap-3",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const loadingSpinnerSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const renderIcon = () => {
    if (isLoading) {
      return (
        <HiOutlineRefresh
          className={`animate-spin ${loadingSpinnerSizeClasses[size]} ${
            iconPosition === "right" ? "ml-2" : "mr-2"
          }`}
        />
      );
    }

    if (icon) {
      return (
        <span
          className={`${iconSizeClasses[size]} ${
            iconPosition === "right" ? "ml-2" : "mr-2"
          }`}
        >
          {icon}
        </span>
      );
    }

    return null;
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      <span className="relative z-10 font-medium">{children}</span>
      {iconPosition === "right" && renderIcon()}
    </button>
  );
}
