import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelStyle?: "default" | "small";
  variant?: "default" | "small" | "type_input" | "search_input";
  error?: string; 
}

export const Input: React.FC<InputProps> = ({
  labelStyle = "default",
  label,
  variant = "default",
  className = "",
  id,
  error,
  ...props
}) => {
  const variants = {
    default:
      "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-gray-600",
    small:
      "w-1/2 px-3 py-3 border rounded focus:outline-none focus:ring-2 text-gray-600",
    type_input:
      "w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none",
    search_input:
      "w-full text-gray-400 font-normal focus:outline-none",
  };

  const labelStyles = {
    default: "text-m text-gray-500",
    small:
      "px-4 py-2 bg-white/10 text-white rounded w-full max-w-[90px]",
  };

  const inputId = id || props.name;

  return (
    <div className="w-full flex flex-col space-y-1">
      {/* LABEL */}
      {label && (
        <label
          htmlFor={inputId}
          className={labelStyles[labelStyle]}
        >
          {label}
        </label>
      )}

      {/* INPUT */}
      <input
        id={inputId}
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`
          ${variants[variant]}
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary"}
          ${className}
        `}
      />

      {/* ERROR MESSAGE */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-red-500 text-xs"
        >
          {error}
        </p>
      )}
    </div>
  );
};