"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function updateConsultationStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

  await supabaseAdmin
    .from("consultations")
    .update({ status })
    .eq("id", id);

  revalidatePath("/admin");
}