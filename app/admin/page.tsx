import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { updateConsultation } from "./actions";

const statuses = [
  "접수",
  "상담중",
  "가입완료",
  "설치완료",
  "지급완료",
  "완료",
];

export default async function AdminPage() {
      const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }
  const { data } = await supabaseAdmin
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black">우선생 관리자</h1>
        <p className="mt-2 font-bold text-gray-600">
          접수된 견적 요청을 관리합니다.
        </p>

        <div className="mt-8 space-y-4">
          {data?.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{item.name}</h2>
                  <a
                    href={`tel:${item.phone}`}
                    className="mt-1 block text-lg font-bold text-green-600"
                  >
                    {item.phone}
                  </a>
                </div>

                <form action={updateConsultation} className="mt-5 space-y-4">
  <input type="hidden" name="id" value={item.id} />

  <select
    name="status"
    defaultValue={item.status ?? "접수"}
    className="rounded-xl border border-gray-200 px-4 py-3 font-bold"
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
    placeholder="상담 메모를 입력하세요. 예: LG 희망, 7월 10일 설치 예정"
    className="w-full rounded-xl border border-gray-200 p-4 font-bold"
    rows={3}
  />

  <button className="rounded-xl bg-green-600 px-5 py-3 font-black text-white">
    저장
  </button>
</form>
              </div>

              <div className="mt-5 grid gap-3 text-sm font-bold text-gray-600 md:grid-cols-3">
                <p>서비스: {item.service}</p>
                <p>
                  접수일:{" "}
                  {new Date(item.created_at).toLocaleString("ko-KR")}
                </p>
                <p>ID: {item.id.slice(0, 8)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}