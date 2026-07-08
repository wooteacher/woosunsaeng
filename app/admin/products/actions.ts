"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function createProduct(formData: FormData) {
  const carrier = String(formData.get("carrier") ?? "");

  await supabaseAdmin.from("products").insert({
    carrier,
    internet_speed: String(formData.get("internet_speed") ?? ""),
    tv_plan: String(formData.get("tv_plan") ?? ""),
    service_type: String(formData.get("service_type") ?? "인터넷 + TV"),
    base_price: Number(formData.get("base_price") ?? 0),
    reward_amount: Number(formData.get("reward_amount") ?? 0),
    extra_benefit: String(formData.get("extra_benefit") ?? "추가혜택"),
    badge: String(formData.get("badge") ?? "🏆 우선생 추천"),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    display_order: Number(formData.get("display_order") ?? 0),
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${encodeURIComponent(carrier)}`);
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id"));
  const carrier = String(formData.get("carrier") ?? "");

  await supabaseAdmin
    .from("products")
    .update({
      carrier,
      internet_speed: String(formData.get("internet_speed") ?? ""),
      tv_plan: String(formData.get("tv_plan") ?? ""),
      service_type: String(formData.get("service_type") ?? ""),
      base_price: Number(formData.get("base_price") ?? 0),
      reward_amount: Number(formData.get("reward_amount") ?? 0),
      extra_benefit: String(formData.get("extra_benefit") ?? ""),
      badge: String(formData.get("badge") ?? ""),
      featured: formData.get("featured") === "on",
      active: formData.get("active") === "on",
      display_order: Number(formData.get("display_order") ?? 0),
    })
    .eq("id", id);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${encodeURIComponent(carrier)}`);
}