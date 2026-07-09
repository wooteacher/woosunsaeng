"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function getChangedText(label: string, beforeValue: string | null, afterValue: string | null) {
  const beforeText = beforeValue || "없음";
  const afterText = afterValue || "없음";

  if (beforeText === afterText) return null;

  return `${label} 변경: ${beforeText} → ${afterText}`;
}

async function getActorName() {
  const cookieStore = await cookies();
  return cookieStore.get("staff-name")?.value ?? "관리자";
}
export async function processPayment(formData: FormData) {
  const id = String(formData.get("id"));
  const actorName = await getActorName();

  await supabaseAdmin
    .from("consultations")
    .update({
      payment_status: "지급완료",
      status: "지급완료",
      paid_at: new Date().toISOString(),
    })
    .eq("id", id);

  await supabaseAdmin
    .from("consultation_logs")
    .insert({
      consultation_id: id,
      created_by: actorName,
      content: "💰 사은품 지급 완료",
    });

  revalidatePath(`/admin/consultations/${id}`);
  revalidatePath("/admin");
  revalidatePath("/admin/payments");
}
export async function updateConsultationDetail(formData: FormData) {
  const id = String(formData.get("id"));
  const actorName = await getActorName();

  const assignedTo = String(formData.get("assigned_to") || "") || null;

  const updateData = {
    status: String(formData.get("status") ?? "신규접수"),
    carrier: String(formData.get("carrier") ?? ""),
    desired_speed: String(formData.get("desired_speed") ?? ""),
    desired_tv_plan: String(formData.get("desired_tv_plan") ?? ""),
    install_date: String(formData.get("install_date") || "") || null,
    callback_at: String(formData.get("callback_at") || "") || null,
    payment_status: String(formData.get("payment_status") ?? "미지급"),
    assigned_to: assignedTo,

    payout_amount: Number(formData.get("payout_amount") ?? 0),
    payout_bank: String(formData.get("payout_bank") ?? ""),
    payout_account: String(formData.get("payout_account") ?? ""),
    payout_holder: String(formData.get("payout_holder") ?? ""),
    payout_memo: String(formData.get("payout_memo") ?? ""),
  };

  const { data: before } = await supabaseAdmin
    .from("consultations")
    .select("status, assigned_to, staff_members(name)")
    .eq("id", id)
    .single();

  await supabaseAdmin.from("consultations").update(updateData).eq("id", id);

  let beforeStaffName = "미배정";
  let afterStaffName = "미배정";

  if (before?.assigned_to) {
    const { data: staff } = await supabaseAdmin
      .from("staff_members")
      .select("name")
      .eq("id", before.assigned_to)
      .single();

    beforeStaffName = staff?.name ?? "미배정";
  }

  if (assignedTo) {
    const { data: staff } = await supabaseAdmin
      .from("staff_members")
      .select("name")
      .eq("id", assignedTo)
      .single();

    afterStaffName = staff?.name ?? "미배정";
  }

  const logs = [
    getChangedText("진행상태", before?.status ?? null, updateData.status),
    getChangedText("담당자", beforeStaffName, afterStaffName),
  ].filter(Boolean);

  if (logs.length > 0) {
    await supabaseAdmin.from("consultation_logs").insert(
      logs.map((content) => ({
        consultation_id: id,
        content,
        created_by: actorName,
      }))
    );
  }

  revalidatePath(`/admin/consultations/${id}`);
  revalidatePath("/admin");
}

export async function addConsultationLog(formData: FormData) {
  const id = String(formData.get("id"));
  const content = String(formData.get("content") ?? "").trim();
  const actorName = await getActorName();

  if (!content) return;

  await supabaseAdmin.from("consultation_logs").insert({
    consultation_id: id,
    content,
    created_by: actorName,
  });

  revalidatePath(`/admin/consultations/${id}`);
}

export async function quickUpdateStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const actorName = await getActorName();

  const updateData: Record<string, string> = { status };

  if (status === "통신사 접수") {
    updateData.carrier_submitted_at = new Date().toISOString();
  }

  if (status === "설치완료") {
    updateData.installed_at = new Date().toISOString();
  }

  if (status === "지급완료") {
    updateData.paid_at = new Date().toISOString();
    updateData.payment_status = "지급완료";
  }

  await supabaseAdmin.from("consultations").update(updateData).eq("id", id);

  await supabaseAdmin.from("consultation_logs").insert({
    consultation_id: id,
    content: `진행상태 변경: ${status}`,
    created_by: actorName,
  });

  revalidatePath(`/admin/consultations/${id}`);
  revalidatePath("/admin");
}