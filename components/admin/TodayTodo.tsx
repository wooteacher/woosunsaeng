import Link from "next/link";

export default function TodayTodo({ kpi }: { kpi: any }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h2 className="text-2xl font-black text-gray-950">🔥 오늘 해야 할 일</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Link href="/admin/installations" className="rounded-2xl bg-green-50 p-5">
          <p className="font-black text-green-700">📅 오늘 설치</p>
          <p className="mt-2 text-3xl font-black">{kpi.todayInstalls}건</p>
        </Link>

        <Link href="/admin/payments" className="rounded-2xl bg-emerald-50 p-5">
          <p className="font-black text-emerald-700">💰 지급 예정</p>
          <p className="mt-2 text-3xl font-black">{kpi.paymentTodos}건</p>
        </Link>

        <Link
          href="/admin/callbacks"
          className="rounded-2xl bg-yellow-50 p-5"
          >
          <p className="font-black text-yellow-700">☎️ 오늘 재통화</p>
          <p className="mt-2 text-3xl font-black">{kpi.todayCallbacks}건</p>
        </Link>

        <Link href="/admin" className="rounded-2xl bg-red-50 p-5">
          <p className="font-black text-red-700">🚨 오래된 상담</p>
          <p className="mt-2 text-3xl font-black">{kpi.oldConsultations}건</p>
        </Link>
      </div>
    </div>
  );
}