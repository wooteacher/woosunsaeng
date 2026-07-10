type CustomerCardItem = {
  name: string;
  phone: string;
  service?: string | null;
  status?: string | null;
  carrier?: string | null;
  desired_speed?: string | null;
  desired_tv_plan?: string | null;
  callback_at?: string | null;
  install_date?: string | null;
  payment_status?: string | null;
};

type CustomerCardProps = {
  item: CustomerCardItem;
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
  const normalizedStatus =
    statusAliases[status ?? ""] ?? status ?? "신규접수";

  const index = progressSteps.indexOf(normalizedStatus);
  const safeIndex = index >= 0 ? index : 0;

  const percentage = Math.round(
    ((safeIndex + 1) / progressSteps.length) * 100
  );

  const nextStatus =
    safeIndex < progressSteps.length - 1
      ? progressSteps[safeIndex + 1]
      : "모든 절차 완료";

  return {
    percentage,
    currentStatus: normalizedStatus,
    nextStatus,
  };
}

function formatSchedule(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: value.includes("T") ? "2-digit" : undefined,
    minute: value.includes("T") ? "2-digit" : undefined,
  }).format(new Date(value));
}

export default function CustomerCard({
  item,
  assignedName,
}: CustomerCardProps) {
  const { percentage, currentStatus, nextStatus } = getProgress(item.status);

  const smsBody = encodeURIComponent(
    `안녕하세요, ${item.name} 고객님. 우선생입니다.`
  );

  return (
    <section className="mt-6 overflow-hidden rounded-3xl bg-gray-950 text-white shadow-xl">
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-black text-green-400">CUSTOMER</p>

            <h1 className="mt-2 text-4xl font-black">{item.name}</h1>

            <a
              href={`tel:${item.phone}`}
              className="mt-3 block text-2xl font-black text-green-400"
            >
              📞 {item.phone}
            </a>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`tel:${item.phone}`}
                className="rounded-2xl bg-green-500 px-5 py-3 font-black text-white transition hover:bg-green-600"
              >
                📞 전화하기
              </a>

              <a
                href={`sms:${item.phone}?body=${smsBody}`}
                className="rounded-2xl bg-white px-5 py-3 font-black text-gray-950 transition hover:bg-gray-100"
              >
                💬 문자 보내기
              </a>

              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-2xl bg-yellow-400/20 px-5 py-3 font-black text-yellow-300 opacity-70"
                title="카카오 연동 준비 중"
              >
                🟡 카카오 준비 중
              </button>
            </div>
          </div>

          <div className="min-w-56 rounded-2xl bg-white/10 p-5">
            <p className="text-sm font-bold text-gray-300">현재 상태</p>
            <p className="mt-1 text-xl font-black text-green-400">
              {item.status ?? "신규접수"}
            </p>

            <p className="mt-4 text-sm font-bold text-gray-300">담당자</p>
            <p className="mt-1 text-lg font-black">{assignedName}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl bg-white/5 p-5 text-sm font-bold text-gray-300 sm:grid-cols-2 lg:grid-cols-4">
          <p>서비스: {item.service || "-"}</p>
          <p>통신사: {item.carrier || "-"}</p>
          <p>속도: {item.desired_speed || "-"}</p>
          <p>TV: {item.desired_tv_plan || "-"}</p>
          <p>재통화: {formatSchedule(item.callback_at)}</p>
          <p>설치일: {formatSchedule(item.install_date)}</p>
          <p>지급상태: {item.payment_status || "미지급"}</p>
          <p>담당자: {assignedName}</p>
        </div>

        <div className="mt-6 rounded-2xl bg-white/10 p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-300">고객 진행률</p>
              <p className="mt-1 text-4xl font-black">{percentage}%</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-gray-300">현재 단계</p>
              <p className="mt-1 font-black text-green-400">
                {currentStatus}
              </p>
            </div>
          </div>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 text-sm font-bold">
            <span className="text-gray-300">다음 단계</span>
            <span>{nextStatus}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/5 p-6 md:p-8">
        <p className="font-black text-purple-300">🤖 AI 브리핑</p>
        <p className="mt-2 font-bold leading-7 text-gray-300">
          상담 이력을 자동으로 요약하고 다음 업무를 추천하는 기능이
          준비될 예정입니다.
        </p>
      </div>
    </section>
  );
}