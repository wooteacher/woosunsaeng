import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

function won(value: number) {
  return `${Number(value ?? 0).toLocaleString()}원`;
}

export default async function PaymentsPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const { data } = await supabaseAdmin
    .from("consultations")
    .select("*, staff_members(name, role)")
    .in("payment_status", ["지급예정", "미지급"])
    .order("created_at", { ascending: false });

  const list = data ?? [];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black text-gray-950">지급관리</h1>
        <p className="mt-2 font-bold text-gray-600">
          지급 예정 고객과 지급 정보를 확인합니다.
        </p>

        <div className="mt-8 space-y-5">
          {list.map((item: any) => (
            <Link
              key={item.id}
              href={`/admin/consultations/${item.id}`}
              className="block"
            >
              <Card className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-950">
                      {item.name}
                    </h2>
                    <p className="mt-1 font-black text-green-600">
                      📞 {item.phone}
                    </p>
                  </div>

                  <Badge>{item.payment_status ?? "미지급"}</Badge>
                </div>

                <div className="mt-5 grid gap-3 text-sm font-bold text-gray-600 md:grid-cols-4">
                  <p>지급액: {won(item.payout_amount ?? 0)}</p>
                  <p>은행: {item.payout_bank || "-"}</p>
                  <p>계좌: {item.payout_account || "-"}</p>
                  <p>예금주: {item.payout_holder || "-"}</p>
                  <p>통신사: {item.carrier || "-"}</p>
                  <p>속도: {item.desired_speed || "-"}</p>
                  <p>
                    담당자:{" "}
                    {item.staff_members?.name
                      ? item.staff_members.name
                      : "미배정"}
                  </p>
                  <p>상태: {item.status || "-"}</p>
                </div>
              </Card>
            </Link>
          ))}

          {list.length === 0 && (
            <Card className="p-10 text-center">
              <p className="font-bold text-gray-500">
                지급 대기 고객이 없습니다.
              </p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}