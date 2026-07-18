import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={[
        "min-h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5",
        "text-base font-bold tracking-[-0.02em] text-slate-950",
        "placeholder:font-semibold placeholder:text-slate-400",
        "outline-none transition-[background-color,border-color,box-shadow] duration-200",
        "hover:border-slate-300 hover:bg-white",
        "focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10",
        "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
        className,
      ].join(" ")}
    />
  );
}
