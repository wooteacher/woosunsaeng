import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export default function Badge({
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "rounded-full",
        "border border-green-200",
        "bg-green-50",
        "px-4 py-2",
        "text-sm font-black",
        "tracking-tight",
        "text-green-700",
        "transition-colors",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}