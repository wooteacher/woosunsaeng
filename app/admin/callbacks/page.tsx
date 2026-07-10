import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

function getKoreanDateKey(value: string | Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function CallbacksPage() {
  const cookieStore = await cookies();

  const isAdmin = cookieStore.get("admin-auth")?.value === "true";
  const role = cookieStore.get("staff-role")?.value ?? "super_admin";
  const staffId = cookieStore.get("staff-id")?.value ?? "";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  let query = supabaseAdmin
    .from("consultations")
    .select("*, staff_members(name, role)")
    .not("callback_at", "is", null)
    .order("callback_at", { ascending: true });

  if (role === "staff" && staffId) {
    query = query.eq("assigned_to", staffId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("재통화 일정 조회 오류:", error);
  }

  const list = data ?? [];

  const now = new Date();
  const todayKey = getKoreanDateKey(now);

  const overdueList = list.filter((item) => {
    if (!item.callback_at) return false;

    return (
      new Date(item.callback_at).getTime() < now.getTime() &&
      getKoreanDateKey(item.callback_at) !== todayKey
    );
  });

  const todayList = list.filter((item) => {
    if (!item.callback_at) return false;

    return getKoreanDateKey(item.callback_at) === todayKey;
  });

  const upcomingList = list.filter((item) => {
    if (!item.callback_at) return false;

    return getKoreanDateKey(item.callback_at) > todayKey;
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-4xl font-black text-gray-950">재통화 관리</h1>

          <p className="mt-2 font-bold text-gray-600">
            예정된 재통화와 지나간 일정을 확인합니다.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <p className="font-black text-red-600">⚠️ 지난 재통화</p>
            <p className="mt-3 text-4xl font-black text-gray-950">
              {overdueList.length}건
            </p>
          </Card>

          <Card className="p-6">
            <p className="font-black text-green-600">☎️ 오늘 재통화</p>
            <p className="mt-3 text-4xl font-black text-gray-950">
              {todayList.length}건
            </p>
          </Card>

          <Card className="p-6">
            <p className="font-black text-blue-600">📅 예정 재통화</p>
            <p className="mt-3 text-4xl font-black text-gray-950">
              {upcomingList.length}건
            </p>
          </Card>
        </div>

        <CallbackSection
          title="⚠️ 지난 재통화"
          description="예정 시간이 지나 확인이 필요한 고객입니다."
          items={overdueList}
          emptyMessage="지난 재통화 일정이 없습니다."
          variant="overdue"
        />

        <CallbackSection
          title="☎️ 오늘 재통화"
          description="오늘 연락해야 하는 고객입니다."
          items={todayList}
          emptyMessage="오늘 재통화 일정이 없습니다."
          variant="today"
        />

        <CallbackSection
          title="📅 예정 재통화"
          description="앞으로 예정된 재통화 일정입니다."
          items={upcomingList}
          emptyMessage="예정된 재통화 일정이 없습니다."
          variant="upcoming"
        />
      </div>
    </main>
  );
}

function CallbackSection({
  title,
  description,
  items,
  emptyMessage,
  variant,
}: {
  title: string;
  description: string;
  items: any[];
  emptyMessage: string;
  variant: "overdue" | "today" | "upcoming";
}) {
  const itemClass =
    variant === "overdue"
      ? "bg-red-50 ring-red-100"
      : variant === "today"
        ? "bg-green-50 ring-green-100"
        : "bg-white ring-gray-100";

  return (
    <Card className="mt-8 p-6">
      <h2 className="text-2xl font-black text-gray-950">{title}</h2>

      <p className="mt-2 font-bold text-gray-500">{description}</p>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl p-5 ring-1 ${itemClass}`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-black text-gray-950">
                    {item.name}
                  </h3>

                  <Badge>{item.status ?? "신규접수"}</Badge>
                </div>

                <a
                  href={`tel:${item.phone}`}
                  className="mt-2 block font-black text-green-700"
                >
                  📞 {item.phone}
                </a>

                <p className="mt-3 font-black text-gray-800">
                  재통화: {formatDateTime(item.callback_at)}
                </p>

                <div className="mt-3 grid gap-2 text-sm font-bold text-gray-600 sm:grid-cols-3">
                  <p>서비스: {item.service || "-"}</p>
                  <p>통신사: {item.carrier || "-"}</p>
                  <p>
                    담당자: {item.staff_members?.name ?? "미배정"}
                  </p>
                </div>
              </div>

              <Link
                href={`/admin/consultations/${item.id}`}
                className="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-5 py-3 font-black text-white transition hover:bg-black"
              >
                고객 상세
              </Link>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-2xl bg-gray-50 p-8 text-center">
            <p className="font-bold text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </div>
    </Card>
  );
}