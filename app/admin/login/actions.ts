"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function login(formData: FormData) {
  const loginId = String(formData.get("login_id") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!loginId || !password) {
    redirect("/admin/login?error=empty");
  }

  const { data, error } = await signIn(loginId, password);

  if (error || !data.user) {
    redirect("/admin/login?error=invalid");
  }

  const { data: staff } = await supabaseAdmin
    .from("staff_members")
    .select("*")
    .eq("auth_user_id", data.user.id)
    .eq("active", true)
    .single();

  if (!staff) {
    await signOut();
    redirect("/admin/login?error=staff");
  }

  const cookieStore = await cookies();

  cookieStore.set("admin-auth", "true", {
    httpOnly: true,
    path: "/",
  });

  cookieStore.set("staff-id", staff.id, {
    httpOnly: true,
    path: "/",
  });

  cookieStore.set("staff-name", staff.name, {
    httpOnly: true,
    path: "/",
  });

  cookieStore.set("staff-role", staff.role, {
    httpOnly: true,
    path: "/",
  });

  redirect("/admin");
}