import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getDashboardData(q = "", role = "super_admin", staffId = "") {
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

  const today = new Date().toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  return {
    list,
    stats: {
      today: list.filter(
        (item) =>
          new Date(item.created_at).toLocaleDateString("ko-KR", {
            timeZone: "Asia/Seoul",
          }) === today
      ).length,
      unassigned: list.filter((item) => !item.assigned_to).length,
      consulting: list.filter((item) => item.status === "상담중").length,
      callback: list.filter((item) => item.status === "재통화 예정").length,
      reviewing: list.filter((item) => item.status === "고객검토중").length,
      submitted: list.filter((item) => item.status === "통신사 접수").length,
      installConfirmed: list.filter((item) => item.status === "설치일 확정").length,
      installed: list.filter((item) => item.status === "설치완료").length,
      paid: list.filter((item) => item.status === "지급완료").length,
    },
  };
}