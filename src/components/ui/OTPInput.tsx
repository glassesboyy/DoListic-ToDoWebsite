import React, { useEffect, useRef } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  label?: string;
  disabled?: boolean;
}

export default function OTPInput({
  value,
  onChange,
  length = 4,
  error,
  label,
  disabled = false,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, digit: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split("");
    newValue[index] = digit;

    // Pad with empty strings if needed
    while (newValue.length < length) {
      newValue.push("");
    }

    const updatedValue = newValue.slice(0, length).join("");
    onChange(updatedValue);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current input is empty, move to previous input
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numericData = pastedData.replace(/\D/g, "").slice(0, length);
    onChange(numericData);

    // Focus the next empty input or the last input
    const nextEmptyIndex = Math.min(numericData.length, length - 1);
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing
    inputRefs.current[index]?.select();
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}

      <div className="flex justify-center space-x-3">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={`
              w-12 h-12 text-center text-xl font-semibold
              border-2 rounded-lg bg-bg-main text-text-primary
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-all duration-200
              ${
                error
                  ? "border-error-500 focus:ring-error-500"
                  : "border-border-light focus:ring-primary-500"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${
                value[index]
                  ? "border-primary-300 bg-primary-50"
                  : "border-border-light"
              }
            `}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {error && <p className="text-sm text-error-600 text-center">{error}</p>}

      <p className="text-xs text-text-muted text-center">
        Enter the 4-digit code sent to your email
      </p>
    </div>
  );
}
