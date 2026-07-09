"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const INTERNAL_DOMAIN = "crm.wooteacher.local";

function toInternalEmail(loginId: string) {
  return `${loginId}@${INTERNAL_DOMAIN}`;
}

export async function createStaff(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const loginId = String(formData.get("login_id") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "staff");
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !loginId || !password) return;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: toInternalEmail(loginId),
    password,
    email_confirm: true,
  });

  if (error) {
    console.error(error);
    return;
  }

  await supabaseAdmin.from("staff_members").insert({
    auth_user_id: data.user.id,
    name,
    login_id: loginId,
    role,
    phone,
    active: true,
  });

  revalidatePath("/admin/staff");
}

export async function unassignStaffCustomers(formData: FormData) {
  const staffId = String(formData.get("staff_id") ?? "");

  if (!staffId) return;

  await supabaseAdmin
    .from("consultations")
    .update({ assigned_to: null })
    .eq("assigned_to", staffId);

  revalidatePath("/admin/staff");
  revalidatePath("/admin");
}