"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function updateConsultation(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const memo = String(formData.get("memo") ?? "");
  const carrier = String(formData.get("carrier") ?? "");
  const install_date = String(formData.get("install_date") || "");
  const payment_status = String(formData.get("payment_status") ?? "미지급");
  const source = String(formData.get("source") ?? "");

  await supabaseAdmin
    .from("consultations")
    .update({
      status,
      memo,
      carrier,
      install_date: install_date || null,
      payment_status,
      source,
    })
    .eq("id", id);

  revalidatePath("/admin");
}