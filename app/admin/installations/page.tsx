import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

function isToday(value?: string | null) {
  if (!value) return false;

  const today = new Date().toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  const target = new Date(value).toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  return today === target;
}

export default async function InstallationsPage() {
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
    .not("install_date", "is", null)
    .order("install_date", { ascending: true });

  if (role === "staff" && staffId) {
    query = query.eq("assigned_to", staffId);
  }

  const { data } = await query;
  const list = data ?? [];

  const todayList = list.filter((item) => isToday(item.install_date));
  const upcomingList = list.filter((item) => !isToday(item.install_date));

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black text-gray-950">설치관리</h1>
        <p className="mt-2 font-bold text-gray-600">
          설치일이 확정된 고객을 확인합니다.
        </p>

        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-black text-gray-950">
            📅 오늘 설치 {todayList.length}건
          </h2>

          <div className="mt-5 space-y-4">
            {todayList.map((item: any) => (
              <Link
                key={item.id}
                href={`/admin/consultations/${item.id}`}
                className="block rounded-2xl bg-green-50 p-5 ring-1 ring-green-100"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xl font-black text-gray-950">
                      {item.name}
                    </p>
                    <p className="mt-1 font-bold text-green-700">
                      📞 {item.phone}
                    </p>
                  </div>

                  <Badge>{item.status ?? "설치일 확정"}</Badge>
                </div>

                <div className="mt-4 grid gap-2 text-sm font-bold text-gray-600 md:grid-cols-4">
                  <p>통신사: {item.carrier || "-"}</p>
                  <p>속도: {item.desired_speed || "-"}</p>
                  <p>TV: {item.desired_tv_plan || "-"}</p>
                  <p>
                    담당자:{" "}
                    {item.staff_members?.name
                      ? `${item.staff_members.name}`
                      : "미배정"}
                  </p>
                </div>
              </Link>
            ))}

            {todayList.length === 0 && (
              <p className="font-bold text-gray-500">오늘 설치 일정이 없습니다.</p>
            )}
          </div>
        </Card>

        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-black text-gray-950">
            예정 설치 {upcomingList.length}건
          </h2>

          <div className="mt-5 space-y-4">
            {upcomingList.map((item: any) => (
              <Link
                key={item.id}
                href={`/admin/consultations/${item.id}`}
                className="block rounded-2xl bg-white p-5 ring-1 ring-gray-100"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xl font-black text-gray-950">
                      {item.name}
                    </p>
                    <p className="mt-1 font-bold text-gray-500">
                      설치일: {item.install_date}
                    </p>
                  </div>

                  <Badge>{item.status ?? "설치일 확정"}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}