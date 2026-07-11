import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
};


const styles = {
  primary:
    "bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700",

  secondary:
    "bg-gray-950 text-white shadow-lg shadow-gray-900/20 hover:bg-black",

  outline:
    "border border-gray-200 bg-white text-gray-900 shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-700",
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
    "inline-flex items-center justify-center gap-2",
    "min-h-14 rounded-2xl px-6 py-4",
    "text-base font-black tracking-tight",
    "transition-all duration-200",
    "hover:-translate-y-0.5",
    "focus-visible:outline-none",
    "focus-visible:ring-4 focus-visible:ring-green-500/20",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    styles[variant],
    className,
  ].join(" ");


  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled || undefined}
      >
        {children}
      </Link>
    );
  }


  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}