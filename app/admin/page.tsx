import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateConsultation } from "./actions";
import { getAdminDashboard } from "@/services/dashboard.service";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import KpiCard from "@/components/admin/KpiCard";
import TodayTodo from "@/components/admin/TodayTodo";
import StaffRanking from "@/components/admin/StaffRanking";
import DashboardFunnel from "@/components/admin/DashboardFunnel";
import OldConsultationAlert from "@/components/admin/OldConsultationAlert";

const statuses = [
  "신규접수",
  "담당배정",
  "상담중",
  "부재",
  "재통화 예정",
  "고객검토중",
  "보류",
  "취소",
  "상품확정",
  "통신사 접수",
  "설치일 확정",
  "설치완료",
  "지급완료",
  "완료",
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{
  q?: string;
  status?: string;
}>;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) redirect("/admin/login");

  const params = await searchParams;
  const q = params?.q?.trim() ?? "";

  const role = cookieStore.get("staff-role")?.value ?? "super_admin";
  const staffId = cookieStore.get("staff-id")?.value ?? "";

  const {
  list,
  kpi,
  oldConsultationList,
  staffRanking,
} = await getAdminDashboard(q, role, staffId);

const statusFilter = params?.status?.trim() ?? "";

const filteredList = statusFilter
  ? list.filter((item: any) => item.status === statusFilter)
  : list;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-4xl font-black text-gray-950">우선생 Dashboard</h1>
          <p className="mt-2 font-bold text-gray-600">
            오늘 해야 할 업무와 회사 현황을 확인합니다.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <KpiCard title="오늘 신규" value={kpi.todayNew} icon="📞" />
          <KpiCard title="오늘 재통화" value={kpi.todayCallbacks} icon="☎️" />
          <KpiCard title="오늘 설치" value={kpi.todayInstalls} icon="📅" />
          <KpiCard title="지급 예정" value={kpi.paymentTodos} icon="💰" />
          <KpiCard title="미배정" value={kpi.unassigned} icon="👤" />
          <KpiCard title="오래된 상담" value={kpi.oldConsultations} icon="🚨" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <KpiCard title="이번달 신규" value={kpi.monthNew} icon="📊" />
          <KpiCard title="이번달 설치" value={kpi.monthInstalled} icon="🏠" />
          <KpiCard title="이번달 지급" value={kpi.monthPaid} icon="💵" />
          <KpiCard title="설치율" value={kpi.installRate} icon="📈" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TodayTodo kpi={kpi} />
          </div>

          <StaffRanking staffRanking={staffRanking} />
        </div>

        <OldConsultationAlert items={oldConsultationList} />

        <div className="mt-8">
       <DashboardFunnel
    data={{
    newCount: kpi.newCount,
    consultingCount: kpi.consultingCount,
    confirmedCount: kpi.confirmedCount,
    installConfirmedCount: kpi.installConfirmedCount,
    installedCount: kpi.installedCount,
    paidCount: kpi.paidCount,
   }}
   />
        </div>

        <Card className="mt-8 p-5">
  <form className="grid gap-3 md:grid-cols-[1fr_220px_120px]">
    <input
      name="q"
      defaultValue={q}
      placeholder="이름, 연락처, 서비스로 검색"
      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none focus:border-green-500"
    />

    <select
      name="status"
      defaultValue={statusFilter}
      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none focus:border-green-500"
    >
      <option value="">전체 상태</option>

      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>

    <Button type="submit" className="w-full">
      검색
    </Button>
  </form>

  {(q || statusFilter) && (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-bold text-gray-600">
        검색 결과 {filteredList.length}건
      </p>

      <Link
        href="/admin"
        className="text-sm font-black text-green-700 hover:underline"
      >
        필터 초기화
      </Link>
    </div>
  )}
</Card>

        <div className="mt-6 space-y-5">
          {filteredList.map((item: any) => (
            <Card key={item.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-950">
                    {item.name}
                  </h2>

                  <a
                    href={`tel:${item.phone}`}
                    className="mt-1 block text-lg font-black text-green-600"
                  >
                    📞 {item.phone}
                  </a>
                </div>

                <Badge>{item.status ?? "신규접수"}</Badge>
              </div>

              <div className="mt-5 grid gap-3 text-sm font-bold text-gray-600 md:grid-cols-4">
                <p>서비스: {item.service}</p>
                <p>통신사: {item.carrier || "-"}</p>
                <p>속도: {item.desired_speed || "-"}</p>
                <p>
                  담당자:{" "}
                  {item.staff_members?.name
                    ? `${item.staff_members.name} / ${item.staff_members.role}`
                    : "미배정"}
                </p>
                <p className="md:col-span-2">
                  접수일: {new Date(item.created_at).toLocaleString("ko-KR")}
                </p>
              </div>

              <form action={updateConsultation} className="mt-6 space-y-4">
                <input type="hidden" name="id" value={item.id} />

                <select
                  name="status"
                  defaultValue={item.status ?? "신규접수"}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none focus:border-green-500 md:w-auto"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <textarea
                  name="memo"
                  defaultValue={item.memo ?? ""}
                  placeholder="간단 메모를 입력하세요."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none focus:border-green-500"
                  rows={3}
                />

                <div className="flex flex-col gap-3 md:flex-row">
                  <Button type="submit" className="w-full md:w-auto">
                    저장
                  </Button>

                  <Link
                    href={`/admin/consultations/${item.id}`}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-5 py-4 font-black text-white transition hover:bg-black md:w-auto"
                  >
                    상세보기
                  </Link>
                </div>
              </form>
            </Card>
          ))}

          {filteredList.length === 0 && (
            <Card className="p-10 text-center">
              <p className="font-bold text-gray-500">검색 결과가 없습니다.</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}