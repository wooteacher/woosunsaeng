"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function updateConsultation(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const memo = String(formData.get("memo") ?? "");

  await supabaseAdmin
    .from("consultations")
    .update({ status, memo })
    .eq("id", id);

  revalidatePath("/admin");
}