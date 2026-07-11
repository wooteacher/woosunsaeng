import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      className={[
        "min-h-14 w-full",
        "rounded-2xl",
        "border border-gray-200",
        "bg-gray-50",
        "px-5 py-4",
        "text-base font-bold text-gray-950",
        "placeholder:font-semibold placeholder:text-gray-400",
        "outline-none",
        "transition-all duration-200",
        "hover:border-gray-300 hover:bg-white",
        "focus:border-green-500",
        "focus:bg-white",
        "focus:ring-4 focus:ring-green-500/10",
        "disabled:cursor-not-allowed",
        "disabled:bg-gray-100",
        "disabled:text-gray-400",
        className,
      ].join(" ")}
    />
  );
}