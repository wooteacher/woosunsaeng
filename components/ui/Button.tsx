import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "outline";
  className?: string;
};

const styles = {
  primary:
    "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100",
  secondary:
    "bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200",
  outline:
    "border-2 border-green-600 bg-white text-green-700 hover:bg-green-50",
};

export default function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-black transition";

  const finalClass = `${base} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={finalClass}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={finalClass}>
      {children}
    </button>
  );
}