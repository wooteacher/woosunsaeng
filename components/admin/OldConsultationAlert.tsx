import Link from "next/link";

type OldConsultation = {
  id: string;
  name: string;
  phone: string;
  status?: string | null;
  carrier?: string | null;
  desired_speed?: string | null;
  created_at: string;
  staff_members?: {
    name?: string | null;
  } | null;
};

function getElapsedDays(value: string) {
  const created = new Date(value).getTime();
  const now = Date.now();

  return Math.max(
    0,
    Math.floor((now - created) / (1000 * 60 * 60 * 24))
  );
}

function getPriority(days: number) {
  if (days >= 7) {
    return {
      label: "긴급",
      className: "bg-red-100 text-red-700",
      cardClassName: "border-red-200 bg-red-50",
    };
  }

  return {
    label: "주의",
    className: "bg-yellow-100 text-yellow-700",
    cardClassName: "border-yellow-200 bg-yellow-50",
  };
}

export default function OldConsultationAlert({
  items,
}: {
  items: OldConsultation[];
}) {
  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div>
        <p className="font-black text-red-600">ATTENTION</p>

        <h2 className="mt-2 text-2xl font-black text-gray-950">
          🚨 오래된 상담
        </h2>

        <p className="mt-2 font-bold text-gray-500">
          접수 후 오래 처리되지 않은 고객을 먼저 확인하세요.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const elapsedDays = getElapsedDays(item.created_at);
          const priority = getPriority(elapsedDays);

          return (
            <article
              key={item.id}
              className={`rounded-2xl border p-5 ${priority.cardClassName}`}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-black text-gray-950">
                      {item.name}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${priority.className}`}
                    >
                      {priority.label}
                    </span>

                    <span className="text-sm font-black text-gray-600">
                      {elapsedDays}일 경과
                    </span>
                  </div>

                  <a
                    href={`tel:${item.phone}`}
                    className="mt-3 block text-lg font-black text-green-700"
                  >
                    📞 {item.phone}
                  </a>

                  <div className="mt-4 grid gap-2 text-sm font-bold text-gray-600 sm:grid-cols-4">
                    <p>상태: {item.status ?? "신규접수"}</p>
                    <p>통신사: {item.carrier || "-"}</p>
                    <p>속도: {item.desired_speed || "-"}</p>
                    <p>
                      담당자: {item.staff_members?.name || "미배정"}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/consultations/${item.id}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-gray-950 px-5 py-3 font-black text-white transition hover:bg-black"
                >
                  고객 상세
                </Link>
              </div>
            </article>
          );
        })}

        {items.length === 0 && (
          <div className="rounded-2xl bg-gray-50 p-8 text-center">
            <p className="font-bold text-gray-500">
              오래된 상담이 없습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}