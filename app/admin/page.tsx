import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminPage() {
  const { data } = await supabaseAdmin
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black">우선생 관리자</h1>
        <p className="mt-2 font-bold text-gray-600">
          접수된 견적 요청을 확인합니다.
        </p>

        <div className="mt-8 space-y-4">
          {data?.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black">{item.name}</h2>
                  <a
                    href={`tel:${item.phone}`}
                    className="mt-1 block text-lg font-bold text-green-600"
                    
                  >
                    {item.phone}
                  </a>
                </div>

                <span className="rounded-full bg-green-100 px-4 py-2 font-black text-green-700">
                  {item.status ?? "접수"}
                </span>
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

          {data?.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center font-bold text-gray-500">
              아직 접수된 문의가 없습니다.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}