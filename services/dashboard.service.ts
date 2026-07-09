import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

function isThisMonth(value?: string | null) {
  if (!value) return false;

  const now = new Date();
  const target = new Date(value);

  return (
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth()
  );
}

function isOldConsultation(createdAt?: string | null, status?: string | null) {
  if (!createdAt) return false;

  const activeStatuses = [
    "신규접수",
    "담당배정",
    "상담중",
    "부재",
    "재통화 예정",
    "고객검토중",
    "보류",
  ];

  if (!activeStatuses.includes(status ?? "")) return false;

  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);

  return diffDays >= 3;
}

function won(value: number) {
  return `${Number(value ?? 0).toLocaleString()}원`;
}

export async function getAdminDashboard(q = "", role = "super_admin", staffId = "") {
  let query = supabaseAdmin
    .from("consultations")
    .select("*, staff_members(name, role)")
    .order("created_at", { ascending: false });

  if (role === "staff" && staffId) {
    query = query.eq("assigned_to", staffId);
  }

  if (q) {
    query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,service.ilike.%${q}%`);
  }

  const { data } = await query;
  const list = data ?? [];

  const todayNew = list.filter((item: any) => isToday(item.created_at));
  const todayCallbacks = list.filter((item: any) => isToday(item.callback_at));
  const todayInstalls = list.filter((item: any) => isToday(item.install_date));
  const paymentTodos = list.filter(
    (item: any) => item.payment_status === "지급예정"
  );
  const unassigned = list.filter((item: any) => !item.assigned_to);
  const oldConsultations = list.filter((item: any) =>
    isOldConsultation(item.created_at, item.status)
  );

  const monthItems = list.filter((item: any) => isThisMonth(item.created_at));
  const monthInstalled = list.filter(
    (item: any) =>
      isThisMonth(item.installed_at) || item.status === "설치완료" || item.status === "지급완료"
  );
  const monthPaid = list.filter(
    (item: any) =>
      item.payment_status === "지급완료" &&
      (isThisMonth(item.paid_at) || isThisMonth(item.created_at))
  );

  const monthPayout = monthPaid.reduce(
    (sum: number, item: any) => sum + Number(item.payout_amount ?? 0),
    0
  );

  const staffMap = new Map<
    string,
    { name: string; total: number; installed: number; paid: number }
  >();

  list.forEach((item: any) => {
    const name = item.staff_members?.name ?? "미배정";

    if (!staffMap.has(name)) {
      staffMap.set(name, {
        name,
        total: 0,
        installed: 0,
        paid: 0,
      });
    }

    const current = staffMap.get(name)!;
    current.total += 1;

    if (item.status === "설치완료" || item.status === "지급완료") {
      current.installed += 1;
    }

    if (item.payment_status === "지급완료") {
      current.paid += 1;
    }
  });

  const staffRanking = Array.from(staffMap.values()).sort(
    (a, b) => b.total - a.total
  );

  const installRate =
    monthItems.length === 0
      ? 0
      : Math.round((monthInstalled.length / monthItems.length) * 100);

  return {
    list,
    kpi: {
      todayNew: todayNew.length,
      todayCallbacks: todayCallbacks.length,
      todayInstalls: todayInstalls.length,
      paymentTodos: paymentTodos.length,
      unassigned: unassigned.length,
      oldConsultations: oldConsultations.length,
      monthNew: monthItems.length,
      monthInstalled: monthInstalled.length,
      monthPaid: monthPaid.length,
      monthPayout: won(monthPayout),
      installRate: `${installRate}%`,
    },
    staffRanking,
  };
}