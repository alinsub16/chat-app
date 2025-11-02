import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "default" | "green";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = "default",
  className = "",
  ...props
}) => {
  const variants = {
    default:
      "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200",
    green:
      "px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors duration-200",
  };

  return (
    <button
      {...props}
      className={`${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
