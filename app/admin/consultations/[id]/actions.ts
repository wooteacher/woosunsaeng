"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function updateConsultationDetail(formData: FormData) {
  const id = String(formData.get("id"));

  await supabaseAdmin
    .from("consultations")
    .update({
      status: String(formData.get("status") ?? "신규접수"),
      carrier: String(formData.get("carrier") ?? ""),
      desired_speed: String(formData.get("desired_speed") ?? ""),
      desired_tv_plan: String(formData.get("desired_tv_plan") ?? ""),
      install_date: String(formData.get("install_date") || "") || null,
      callback_at: String(formData.get("callback_at") || "") || null,
      payment_status: String(formData.get("payment_status") ?? "미지급"),
    })
    .eq("id", id);

  revalidatePath(`/admin/consultations/${id}`);
  revalidatePath("/admin");
}

export async function addConsultationLog(formData: FormData) {
  const id = String(formData.get("id"));
  const content = String(formData.get("content") ?? "").trim();

  if (!content) return;

  await supabaseAdmin.from("consultation_logs").insert({
    consultation_id: id,
    content,
    created_by: "관리자",
  });

  revalidatePath(`/admin/consultations/${id}`);
}

export async function quickUpdateStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

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
    content: `진행상태가 '${status}'로 변경되었습니다.`,
    created_by: "관리자",
  });

  revalidatePath(`/admin/consultations/${id}`);
  revalidatePath("/admin");
}