import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
};

const styles = {
  primary:
    "bg-green-600 text-white shadow-[0_14px_28px_-14px_rgba(22,163,74,0.65)] hover:bg-green-700",
  secondary:
    "bg-slate-950 text-white shadow-[0_14px_28px_-16px_rgba(15,23,42,0.7)] hover:bg-slate-800",
  outline:
    "border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-700",
};

export default function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3",
    "text-[15px] font-extrabold tracking-[-0.02em] sm:min-h-13 sm:px-6 sm:text-base",
    "transition-[transform,background-color,border-color,color,box-shadow] duration-200",
    "hover:-translate-y-0.5 active:translate-y-0",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500/20",
    "disabled:pointer-events-none disabled:opacity-45",
    styles[variant],
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled || undefined}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}
