import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
  className?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={[
        "rounded-[28px]",
        "border border-gray-100",
        "bg-white",
        "p-6",
        "shadow-[0_20px_60px_-35px_rgba(17,24,39,0.35)]",
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        "hover:shadow-[0_24px_70px_-35px_rgba(17,24,39,0.4)]",
        className,
      ].join(" ")}
    >

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
        {icon}
      </div>


      <p className="mt-5 text-sm font-bold text-gray-500">
        {title}
      </p>


      <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-gray-950 sm:text-4xl">
        {value}
      </p>

    </div>
  );
}