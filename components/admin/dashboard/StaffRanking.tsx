export default function StaffRanking({ staffRanking }: { staffRanking: any[] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h2 className="text-2xl font-black text-gray-950">👨 직원 현황</h2>

      <div className="mt-5 space-y-4">
        {staffRanking.slice(0, 5).map((staff) => (
          <div key={staff.name} className="rounded-2xl bg-gray-50 p-4">
            <p className="font-black text-gray-950">{staff.name}</p>
            <div className="mt-2 grid grid-cols-3 text-sm font-bold text-gray-600">
              <p>상담 {staff.total}</p>
              <p>설치 {staff.installed}</p>
              <p>지급 {staff.paid}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}