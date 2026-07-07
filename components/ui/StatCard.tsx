import { ReactNode } from "react";

export default function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="text-3xl">{icon}</div>
      <p className="mt-4 font-bold text-gray-500">{title}</p>
      <p className="mt-2 text-4xl font-black text-gray-950">{value}</p>
    </div>
  );
}