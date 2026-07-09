export default function KpiCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <p className="font-black text-gray-500">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>

      <p className="mt-4 text-4xl font-black text-gray-950">{value}</p>

      {description && (
        <p className="mt-2 text-sm font-bold text-gray-500">{description}</p>
      )}
    </div>
  );
}