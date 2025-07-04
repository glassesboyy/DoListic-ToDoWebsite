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
        relative w-10 h-10 rounded-xl border-2 border-border-light
        bg-gradient-card hover:bg-gradient-primary hover:border-primary-300
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2
        shadow-lg hover:shadow-glow
        group overflow-hidden
        ${className}
      `}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icons with smooth transition */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {theme === "light" ? (
          <HiOutlineMoon className="w-5 h-5 text-text-secondary group-hover:text-white transition-all duration-300 transform group-hover:scale-110" />
        ) : (
          <HiOutlineSun className="w-5 h-5 text-text-secondary group-hover:text-white transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-90" />
        )}
      </div>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 transition-opacity duration-150">
        <div className="absolute inset-0 bg-white/30 rounded-xl scale-0 group-active:scale-100 transition-transform duration-150" />
      </div>
    </button>
  );
};

export default ThemeToggle;
