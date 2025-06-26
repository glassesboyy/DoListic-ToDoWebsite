"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-10 h-10 rounded-lg border border-border-light
        bg-bg-card hover:bg-bg-hover
        flex items-center justify-center
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${className}
      `}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <HiOutlineMoon className="w-5 h-5 text-text-secondary" />
      ) : (
        <HiOutlineSun className="w-5 h-5 text-text-secondary" />
      )}
    </button>
  );
};

export default ThemeToggle;
