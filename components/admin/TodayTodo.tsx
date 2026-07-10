import Link from "next/link";

type TodayTodoProps = {
  kpi: {
    todayNew: number;
    todayCallbacks: number;
    todayInstalls: number;
    paymentTodos: number;
    oldConsultations: number;
  };
};

const todoItems = [
  {
    key: "oldConsultations",
    label: "긴급 상담",
    description: "오래된 상담을 먼저 확인하세요.",
    icon: "🚨",
    href: "/admin",
    className: "bg-red-50 ring-red-100",
    labelClassName: "text-red-700",
  },
  {
    key: "todayCallbacks",
    label: "오늘 재통화",
    description: "오늘 연락해야 하는 고객입니다.",
    icon: "☎️",
    href: "/admin/callbacks",
    className: "bg-yellow-50 ring-yellow-100",
    labelClassName: "text-yellow-700",
  },
  {
    key: "todayInstalls",
    label: "오늘 설치",
    description: "오늘 설치 예정인 고객입니다.",
    icon: "🏠",
    href: "/admin/installations",
    className: "bg-green-50 ring-green-100",
    labelClassName: "text-green-700",
  },
  {
    key: "paymentTodos",
    label: "지급 예정",
    description: "지급 처리가 필요한 고객입니다.",
    icon: "💰",
    href: "/admin/payments",
    className: "bg-emerald-50 ring-emerald-100",
    labelClassName: "text-emerald-700",
  },
  {
    key: "todayNew",
    label: "오늘 신규",
    description: "오늘 새로 접수된 상담입니다.",
    icon: "🆕",
    href: "/admin?status=신규접수",
    className: "bg-blue-50 ring-blue-100",
    labelClassName: "text-blue-700",
  },
] as const;

export default function TodayTodo({ kpi }: TodayTodoProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div>
        <p className="font-black text-green-600">TODAY</p>
        <h2 className="mt-2 text-2xl font-black text-gray-950">
          오늘 해야 할 업무
        </h2>
        <p className="mt-2 font-bold text-gray-500">
          우선순위가 높은 업무부터 확인하세요.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {todoItems.map((item) => {
          const count = kpi[item.key];

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-2xl p-5 ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${item.className}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`font-black ${item.labelClassName}`}>
                    {item.icon} {item.label}
                  </p>

                  <p className="mt-2 text-3xl font-black text-gray-950">
                    {count}건
                  </p>
                </div>

                {count > 0 && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-gray-700 shadow-sm">
                    확인 필요
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm font-bold leading-6 text-gray-600">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}