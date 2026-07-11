import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={[
        "rounded-[28px]",
        "border border-gray-100",
        "bg-white",
        "p-6",
        "shadow-[0_20px_60px_-35px_rgba(17,24,39,0.35)]",
        "transition-all duration-200",
        "sm:p-7",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}