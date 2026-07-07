import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}