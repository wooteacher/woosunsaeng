export default function CustomerSummary({
  item,
  assignedName,
}: {
  item: any;
  assignedName: string;
}) {
  const payout = Number(item.payout_amount ?? 0).toLocaleString();

  return (
    <div className="mt-6 rounded-[32px] bg-gray-950 p-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-green-400">CUSTOMER</p>
          <h1 className="mt-2 text-4xl font-black">{item.name}</h1>

          <a
            href={`tel:${item.phone}`}
            className="mt-3 block text-2xl font-black text-green-400"
          >
            📞 {item.phone}
          </a>
        </div>

        <span className="rounded-full bg-green-500 px-5 py-3 font-black">
          {item.status ?? "신규접수"}
        </span>
      </div>

      <div className="mt-8 grid gap-4 text-sm font-bold md:grid-cols-4">
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-gray-400">서비스</p>
          <p className="mt-1 text-lg">{item.service || "-"}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-gray-400">통신사</p>
          <p className="mt-1 text-lg">{item.carrier || "-"}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-gray-400">담당자</p>
          <p className="mt-1 text-lg">{assignedName}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-gray-400">지급액</p>
          <p className="mt-1 text-lg">{payout}원</p>
        </div>
      </div>
    </div>
  );
}