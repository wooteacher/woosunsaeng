import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type CalendarItem = {
  id: string;
  name: string;
  phone: string;
  status?: string | null;
  callback_at?: string | null;
  install_date?: string | null;
  assigned_to?: string | null;
  staff_members?: {
    name?: string | null;
    role?: string | null;
  } | null;
};

type CalendarEvent = {
  id: string;
  consultationId: string;
  dateKey: string;
  type: "callback" | "installation";
  title: string;
  customerName: string;
  time?: string;
};

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

function getKoreanDateKey(value: string | Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function getKoreanTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const leadingEmptyDays = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const cells: Array<number | null> = [];

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function getMonthLink(year: number, month: number, offset: number) {
  const target = new Date(year, month - 1 + offset, 1);

  return `/admin/calendar?year=${target.getFullYear()}&month=${
    target.getMonth() + 1
  }`;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams?: Promise<{
    year?: string;
    month?: string;
  }>;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";
  const role = cookieStore.get("staff-role")?.value ?? "super_admin";
  const staffId = cookieStore.get("staff-id")?.value ?? "";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const today = new Date();

  const requestedYear = Number(params?.year);
  const requestedMonth = Number(params?.month);

  const year =
    Number.isInteger(requestedYear) && requestedYear >= 2000
      ? requestedYear
      : today.getFullYear();

  const month =
    Number.isInteger(requestedMonth) &&
    requestedMonth >= 1 &&
    requestedMonth <= 12
      ? requestedMonth
      : today.getMonth() + 1;

  let query = supabaseAdmin
    .from("consultations")
    .select(`
      id,
      name,
      phone,
      status,
      callback_at,
      install_date,
      assigned_to,
      staff_members(name, role)
    `)
    .order("created_at", { ascending: false });

  if (role === "staff" && staffId) {
    query = query.eq("assigned_to", staffId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("일정 조회 오류:", error);
  }

  const items = (data ?? []) as CalendarItem[];
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;

  const events: CalendarEvent[] = [];

  items.forEach((item) => {
    if (item.callback_at) {
      const dateKey = getKoreanDateKey(item.callback_at);

      if (dateKey.startsWith(monthPrefix)) {
        events.push({
          id: `callback-${item.id}`,
          consultationId: item.id,
          dateKey,
          type: "callback",
          title: "재통화",
          customerName: item.name,
          time: getKoreanTime(item.callback_at),
        });
      }
    }

    if (item.install_date) {
      const dateKey = item.install_date.slice(0, 10);

      if (dateKey.startsWith(monthPrefix)) {
        events.push({
          id: `installation-${item.id}`,
          consultationId: item.id,
          dateKey,
          type: "installation",
          title: "설치",
          customerName: item.name,
        });
      }
    }
  });

  const calendarCells = getMonthGrid(year, month);
  const todayKey = getKoreanDateKey(today);

  const callbackCount = events.filter(
    (event) => event.type === "callback"
  ).length;

  const installationCount = events.filter(
    (event) => event.type === "installation"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-black text-green-600">SCHEDULE</p>

            <h1 className="mt-2 text-4xl font-black text-gray-950">
              일정 관리
            </h1>

            <p className="mt-2 font-bold text-gray-600">
              재통화와 설치 일정을 한눈에 확인합니다.
            </p>
          </div>

          <Link
            href="/admin"
            className="font-black text-green-700 hover:underline"
          >
            ← 대시보드로 돌아가기
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-yellow-50 p-6 ring-1 ring-yellow-100">
            <p className="font-black text-yellow-700">☎️ 이번 달 재통화</p>
            <p className="mt-2 text-4xl font-black text-gray-950">
              {callbackCount}건
            </p>
          </div>

          <div className="rounded-3xl bg-green-50 p-6 ring-1 ring-green-100">
            <p className="font-black text-green-700">🏠 이번 달 설치</p>
            <p className="mt-2 text-4xl font-black text-gray-950">
              {installationCount}건
            </p>
          </div>
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 p-5 md:p-6">
            <Link
              href={getMonthLink(year, month, -1)}
              className="rounded-2xl bg-gray-100 px-4 py-3 font-black text-gray-700 hover:bg-gray-200"
            >
              ← 이전
            </Link>

            <h2 className="text-xl font-black text-gray-950 md:text-3xl">
              {year}년 {month}월
            </h2>

            <Link
              href={getMonthLink(year, month, 1)}
              className="rounded-2xl bg-gray-100 px-4 py-3 font-black text-gray-700 hover:bg-gray-200"
            >
              다음 →
            </Link>
          </div>

          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`p-3 text-center text-sm font-black ${
                  index === 0
                    ? "text-red-500"
                    : index === 6
                      ? "text-blue-500"
                      : "text-gray-600"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarCells.map((day, index) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-32 border-b border-r border-gray-100 bg-gray-50/50"
                  />
                );
              }

              const dateKey = `${year}-${String(month).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;

              const dayEvents = events.filter(
                (event) => event.dateKey === dateKey
              );

              const isToday = dateKey === todayKey;

              return (
                <div
                  key={dateKey}
                  className={`min-h-32 border-b border-r border-gray-100 p-2 md:min-h-40 md:p-3 ${
                    isToday ? "bg-green-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                        isToday
                          ? "bg-green-600 text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {day}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="text-xs font-black text-gray-400">
                        {dayEvents.length}건
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-2">
                    {dayEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`/admin/consultations/${event.consultationId}`}
                        className={`block rounded-xl p-2 text-xs font-black transition hover:shadow-sm ${
                          event.type === "callback"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <span>
                          {event.type === "callback" ? "☎️" : "🏠"}{" "}
                          {event.customerName}
                        </span>

                        {event.time && (
                          <span className="mt-1 block opacity-70">
                            {event.time}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}