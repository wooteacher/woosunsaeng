type CustomerSummaryProps = {
  item: {
    name: string;
    phone: string;
    service?: string | null;
    status?: string | null;
    carrier?: string | null;
    desired_speed?: string | null;
  };
  assignedName: string;
};

const progressSteps = [
  "신규접수",
  "담당배정",
  "상담중",
  "상품확정",
  "통신사 접수",
  "설치일 확정",
  "설치완료",
  "지급완료",
];

const statusAliases: Record<string, string> = {
  부재: "상담중",
  "재통화 예정": "상담중",
  고객검토중: "상담중",
  보류: "상담중",
  완료: "지급완료",
};

function getProgress(status?: string | null) {
  const currentStatus = statusAliases[status ?? ""] ?? status ?? "신규접수";
  const currentIndex = progressSteps.indexOf(currentStatus);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  const progress = Math.round(
    ((safeIndex + 1) / progressSteps.length) * 100
  );

  const nextStatus =
    safeIndex < progressSteps.length - 1
      ? progressSteps[safeIndex + 1]
      : "모든 절차 완료";

  return {
    progress,
    currentStatus,
    nextStatus,
  };
}

export default function CustomerSummary({
  item,
  assignedName,
}: CustomerSummaryProps) {
  const { progress, currentStatus, nextStatus } = getProgress(item.status);

  return (
    <section className="mt-6 rounded-3xl bg-gray-950 p-6 text-white shadow-xl md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-black text-green-400">
            고객 상세
          </p>

          <h1 className="mt-2 text-4xl font-black">
            {item.name}
          </h1>

          <a
            href={`tel:${item.phone}`}
            className="mt-3 block text-2xl font-black text-green-400"
          >
            📞 {item.phone}
          </a>
        </div>

        <div className="rounded-2xl bg-white/10 px-5 py-4">
          <p className="text-sm font-bold text-gray-300">
            현재 상태
          </p>

          <p className="mt-1 text-xl font-black">
            {item.status ?? "신규접수"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 text-sm font-bold text-gray-300 md:grid-cols-4">
        <p>서비스: {item.service || "-"}</p>
        <p>통신사: {item.carrier || "-"}</p>
        <p>속도: {item.desired_speed || "-"}</p>
        <p>담당자: {assignedName}</p>
      </div>

      <div className="mt-8 rounded-2xl bg-white/10 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-gray-300">
              고객 진행률
            </p>

            <p className="mt-1 text-3xl font-black">
              {progress}%
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-gray-300">
              현재 단계
            </p>

            <p className="mt-1 font-black text-green-400">
              {currentStatus}
            </p>
          </div>
        </div>

        <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-bold">
          <p className="text-gray-300">
            다음 단계
          </p>

          <p className="text-white">
            {nextStatus}
          </p>
        </div>
      </div>
    </section>
  );
}