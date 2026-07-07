import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateConsultation } from "./actions";
import { getDashboardData } from "@/lib/dashboard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";

const statuses = ["접수", "상담중", "가입완료", "설치완료", "지급완료", "완료"];

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const q = params?.q?.trim() ?? "";

  const { list, stats } = await getDashboardData(q);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-4xl font-black text-gray-950">우선생 CRM</h1>
          <p className="mt-2 font-bold text-gray-600">
            상담 접수와 진행 상태를 관리합니다.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard title="오늘 문의" value={stats.today} icon="📞" />
          <StatCard title="상담중" value={stats.consulting} icon="🟢" />
          <StatCard title="설치완료" value={stats.installed} icon="🛠️" />
          <StatCard title="지급완료" value={stats.paid} icon="💰" />
        </div>

        <Card className="mt-8 p-5">
          <form className="flex flex-col gap-3 md:flex-row">
            <input
              name="q"
              defaultValue={q}
              placeholder="이름, 연락처, 서비스로 검색"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none focus:border-green-500"
            />

            <Button type="submit" className="md:w-32">
              검색
            </Button>
          </form>
        </Card>

        <div className="mt-6 space-y-5">
          {list.map((item) => (
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
                    {item.phone}
                  </a>
                </div>

                <Badge>{item.status ?? "접수"}</Badge>
              </div>

              <div className="mt-5 grid gap-3 text-sm font-bold text-gray-600 md:grid-cols-3">
                <p>서비스: {item.service}</p>
                <p>
                  접수일: {new Date(item.created_at).toLocaleString("ko-KR")}
                </p>
                <p>ID: {item.id.slice(0, 8)}</p>
              </div>

              <form action={updateConsultation} className="mt-6 space-y-4">
                <input type="hidden" name="id" value={item.id} />

                <select
                  name="status"
                  defaultValue={item.status ?? "접수"}
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
                  placeholder="상담 메모를 입력하세요."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none focus:border-green-500"
                  rows={3}
                />

                <Button type="submit" className="w-full md:w-auto">
                  저장
                </Button>
              </form>
            </Card>
          ))}

          {list.length === 0 && (
            <Card className="p-10 text-center">
              <p className="font-bold text-gray-500">검색 결과가 없습니다.</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}