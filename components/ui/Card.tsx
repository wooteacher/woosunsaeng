import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-[24px] border border-slate-200/80 bg-white p-5",
        "shadow-[0_20px_55px_-34px_rgba(15,23,42,0.28)]",
        "transition-[transform,border-color,box-shadow] duration-200",
        "sm:rounded-[28px] sm:p-7",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
