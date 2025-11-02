import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelStyle?: "default" | "small";
  variant?: "default" | "small";
}

export const Input: React.FC<InputProps> = ({labelStyle="default", label, variant = "default", className = "", id, ...props }) => {
  const variants = {
    default:
      "w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-gray-600",
    small:
      "w-1/2 px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-gray-600",
  };
  const labelStyles = {
    default:
      "text-m text-gray-500",
    small:
      "px-4 py-2 bg-white/10 text-white rounded w-full max-w-[90px] focus:outline-none focus:ring-2 focus:ring-blue-500",
  };


  const inputId = id || props.name; // auto-use name if id not provided

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className={`${labelStyles[labelStyle]} ${className}`}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={`${variants[variant]} ${className}`}
      />
    </div>
  );
};
