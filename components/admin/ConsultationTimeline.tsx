type ConsultationLog = {
  id: string;
  content: string | null;
  created_by: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ConsultationTimeline({
  logs,
}: {
  logs: ConsultationLog[];
}) {
  if (logs.length === 0) {
    return (
      <div className="rounded-2xl bg-gray-50 p-8 text-center">
        <p className="font-bold text-gray-500">
          아직 등록된 상담 이력이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-0">
      {logs.map((log, index) => {
        const isLast = index === logs.length - 1;

        return (
          <li key={log.id} className="relative flex gap-4 pb-7">
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute left-[11px] top-7 h-full w-0.5 bg-gray-200"
              />
            )}

            <span
              aria-hidden="true"
              className="relative z-10 mt-1.5 h-6 w-6 shrink-0 rounded-full border-4 border-white bg-green-500 ring-1 ring-green-200"
            />

            <article className="min-w-0 flex-1 rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-black text-gray-950">
                  {log.created_by || "관리자"}
                </p>

                <time className="text-sm font-bold text-gray-500">
                  {formatDate(log.created_at)}
                </time>
              </div>

              <p className="mt-3 whitespace-pre-wrap break-words font-medium leading-7 text-gray-700">
                {log.content || "기록 내용이 없습니다."}
              </p>
            </article>
          </li>
        );
      })}
    </ol>
  );
}