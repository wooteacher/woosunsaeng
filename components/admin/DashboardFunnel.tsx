const steps = [
  { label: "신규접수", key: "newCount" },
  { label: "상담중", key: "consultingCount" },
  { label: "상품확정", key: "confirmedCount" },
  { label: "설치일 확정", key: "installConfirmedCount" },
  { label: "설치완료", key: "installedCount" },
  { label: "지급완료", key: "paidCount" },
];

export default function DashboardFunnel({
  data,
}: {
  data: Record<string, number>;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h2 className="text-2xl font-black text-gray-950">📈 상담 진행 현황</h2>

      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div key={step.key}>
            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
              <p className="font-black text-gray-700">{step.label}</p>
              <p className="text-2xl font-black text-gray-950">
                {data[step.key] ?? 0}건
              </p>
            </div>

            {index < steps.length - 1 && (
              <p className="py-2 text-center text-xl font-black text-gray-300">
                ↓
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}