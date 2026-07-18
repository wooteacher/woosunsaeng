"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { carrierOrder, internetData } from "@/lib/internet/data";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function assertAdmin() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin-auth")?.value !== "true") {
    throw new Error("관리자 로그인이 필요합니다.");
  }
}

function text(formData: FormData, name: string, fallback = "") {
  return String(formData.get(name) ?? fallback).trim();
}

function number(formData: FormData, name: string, fallback = 0) {
  const value = Number(formData.get(name) ?? fallback);
  return Number.isFinite(value) ? value : fallback;
}

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function revalidateInternet(carrier?: string) {
  revalidatePath("/internet");
  revalidatePath("/admin/internet");
  if (carrier) {
    revalidatePath(`/admin/internet/${encodeURIComponent(carrier)}`);
  }
}

export async function importLocalInternetCatalog() {
  await assertAdmin();

  const carrierRows = carrierOrder.map((carrier, index) => {
    const data = internetData[carrier];
    return {
      id: data.id,
      label: data.label,
      logo: data.logo,
      max_card_discount: data.maxCardDiscount,
      price_verified_at: data.priceVerifiedAt ?? null,
      pricing_basis: data.pricingBasis ?? null,
      equipment_note: data.equipmentNote ?? null,
      active: true,
      display_order: index + 1,
    };
  });

  const { error: carrierError } = await supabaseAdmin
    .from("internet_carriers")
    .upsert(carrierRows, { onConflict: "id" });

  if (carrierError) throw new Error(carrierError.message);

  const internetPlanRows = carrierOrder.flatMap((carrier) =>
    internetData[carrier].internetPlans.map((plan, index) => ({
      id: plan.id,
      carrier_id: carrier,
      speed: plan.speed,
      name: plan.name,
      description: plan.description,
      monthly_price: plan.monthlyPrice,
      mobile_discount: plan.mobileDiscount,
      reward_amount: plan.reward.amount,
      reward_extra_benefit: plan.reward.extraBenefit,
      recommended: plan.recommended ?? false,
      active: true,
      display_order: index + 1,
    })),
  );

  const { error: internetPlanError } = await supabaseAdmin
    .from("internet_plans")
    .upsert(internetPlanRows, { onConflict: "id" });

  if (internetPlanError) throw new Error(internetPlanError.message);

  const tvPlanRows = carrierOrder.flatMap((carrier) =>
    internetData[carrier].tvPlans.map((plan, index) => ({
      id: plan.id,
      carrier_id: carrier,
      name: plan.name,
      channels: plan.channels,
      description: plan.description,
      monthly_price: plan.monthlyPrice,
      recommended: plan.recommended ?? false,
      active: true,
      display_order: index + 1,
    })),
  );

  const { error: tvPlanError } = await supabaseAdmin
    .from("internet_tv_plans")
    .upsert(tvPlanRows, { onConflict: "id" });

  if (tvPlanError) throw new Error(tvPlanError.message);

  const bundleRows = carrierOrder.flatMap((carrier) =>
    internetData[carrier].bundleRules.map((rule, index) => ({
      id: rule.id,
      carrier_id: carrier,
      speed: rule.speed,
      tv_plan_id: rule.tvPlanId,
      bundle_monthly_price: rule.bundleMonthlyPrice,
      mobile_discount: rule.mobileDiscount,
      reward_amount: rule.reward.amount,
      reward_extra_benefit: rule.reward.extraBenefit,
      active: true,
      display_order: index + 1,
    })),
  );

  const { error: bundleError } = await supabaseAdmin
    .from("internet_bundle_rules")
    .upsert(bundleRows, { onConflict: "id" });

  if (bundleError) throw new Error(bundleError.message);

  revalidateInternet();
}

export async function updateInternetCarrier(formData: FormData) {
  await assertAdmin();
  const id = text(formData, "id");
  if (!id) throw new Error("통신사 ID가 필요합니다.");

  const { error } = await supabaseAdmin
    .from("internet_carriers")
    .update({
      label: text(formData, "label", id),
      logo: text(formData, "logo"),
      max_card_discount: number(formData, "max_card_discount"),
      price_verified_at: text(formData, "price_verified_at") || null,
      pricing_basis: text(formData, "pricing_basis") || null,
      equipment_note: text(formData, "equipment_note") || null,
      active: checked(formData, "active"),
      display_order: number(formData, "display_order"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateInternet(id);
}

export async function createInternetPlan(formData: FormData) {
  await assertAdmin();
  const carrier = text(formData, "carrier_id");
  const id = text(formData, "id");
  if (!carrier || !id) throw new Error("통신사와 상품 ID가 필요합니다.");

  const { error } = await supabaseAdmin.from("internet_plans").insert({
    id,
    carrier_id: carrier,
    speed: text(formData, "speed", "100M"),
    name: text(formData, "name"),
    description: text(formData, "description") || null,
    monthly_price: number(formData, "monthly_price"),
    mobile_discount: number(formData, "mobile_discount"),
    reward_amount: number(formData, "reward_amount"),
    reward_extra_benefit:
      text(formData, "reward_extra_benefit") || "추가 혜택은 상담 시 안내",
    recommended: checked(formData, "recommended"),
    active: checked(formData, "active"),
    display_order: number(formData, "display_order"),
  });

  if (error) throw new Error(error.message);
  revalidateInternet(carrier);
}

export async function updateInternetPlan(formData: FormData) {
  await assertAdmin();
  const carrier = text(formData, "carrier_id");
  const id = text(formData, "id");

  const { error } = await supabaseAdmin
    .from("internet_plans")
    .update({
      speed: text(formData, "speed", "100M"),
      name: text(formData, "name"),
      description: text(formData, "description") || null,
      monthly_price: number(formData, "monthly_price"),
      mobile_discount: number(formData, "mobile_discount"),
      reward_amount: number(formData, "reward_amount"),
      reward_extra_benefit:
        text(formData, "reward_extra_benefit") || "추가 혜택은 상담 시 안내",
      recommended: checked(formData, "recommended"),
      active: checked(formData, "active"),
      display_order: number(formData, "display_order"),
    })
    .eq("id", id)
    .eq("carrier_id", carrier);

  if (error) throw new Error(error.message);
  revalidateInternet(carrier);
}

export async function deleteInternetPlan(formData: FormData) {
  await assertAdmin();
  const carrier = text(formData, "carrier_id");
  const id = text(formData, "id");

  const { error } = await supabaseAdmin
    .from("internet_plans")
    .delete()
    .eq("id", id)
    .eq("carrier_id", carrier);

  if (error) throw new Error(error.message);
  revalidateInternet(carrier);
}

export async function createTvPlan(formData: FormData) {
  await assertAdmin();
  const carrier = text(formData, "carrier_id");
  const id = text(formData, "id");
  if (!carrier || !id) throw new Error("통신사와 TV 상품 ID가 필요합니다.");

  const { error } = await supabaseAdmin.from("internet_tv_plans").insert({
    id,
    carrier_id: carrier,
    name: text(formData, "name"),
    channels: number(formData, "channels"),
    description: text(formData, "description") || null,
    monthly_price: number(formData, "monthly_price"),
    recommended: checked(formData, "recommended"),
    active: checked(formData, "active"),
    display_order: number(formData, "display_order"),
  });

  if (error) throw new Error(error.message);
  revalidateInternet(carrier);
}

export async function updateTvPlan(formData: FormData) {
  await assertAdmin();
  const carrier = text(formData, "carrier_id");
  const id = text(formData, "id");

  const { error } = await supabaseAdmin
    .from("internet_tv_plans")
    .update({
      name: text(formData, "name"),
      channels: number(formData, "channels"),
      description: text(formData, "description") || null,
      monthly_price: number(formData, "monthly_price"),
      recommended: checked(formData, "recommended"),
      active: checked(formData, "active"),
      display_order: number(formData, "display_order"),
    })
    .eq("id", id)
    .eq("carrier_id", carrier);

  if (error) throw new Error(error.message);
  revalidateInternet(carrier);
}

export async function deleteTvPlan(formData: FormData) {
  await assertAdmin();
  const carrier = text(formData, "carrier_id");
  const id = text(formData, "id");

  const { error } = await supabaseAdmin
    .from("internet_tv_plans")
    .delete()
    .eq("id", id)
    .eq("carrier_id", carrier);

  if (error) throw new Error(error.message);
  revalidateInternet(carrier);
}

export async function createBundleRule(formData: FormData) {
  await assertAdmin();
  const carrier = text(formData, "carrier_id");
  const id = text(formData, "id");
  if (!carrier || !id) throw new Error("통신사와 결합 규칙 ID가 필요합니다.");

  const { error } = await supabaseAdmin.from("internet_bundle_rules").insert({
    id,
    carrier_id: carrier,
    speed: text(formData, "speed", "100M"),
    tv_plan_id: text(formData, "tv_plan_id"),
    bundle_monthly_price: number(formData, "bundle_monthly_price"),
    mobile_discount: number(formData, "mobile_discount"),
    reward_amount: number(formData, "reward_amount"),
    reward_extra_benefit:
      text(formData, "reward_extra_benefit") || "추가 혜택은 상담 시 안내",
    active: checked(formData, "active"),
    display_order: number(formData, "display_order"),
  });

  if (error) throw new Error(error.message);
  revalidateInternet(carrier);
}

export async function updateBundleRule(formData: FormData) {
  await assertAdmin();
  const carrier = text(formData, "carrier_id");
  const id = text(formData, "id");

  const { error } = await supabaseAdmin
    .from("internet_bundle_rules")
    .update({
      speed: text(formData, "speed", "100M"),
      tv_plan_id: text(formData, "tv_plan_id"),
      bundle_monthly_price: number(formData, "bundle_monthly_price"),
      mobile_discount: number(formData, "mobile_discount"),
      reward_amount: number(formData, "reward_amount"),
      reward_extra_benefit:
        text(formData, "reward_extra_benefit") || "추가 혜택은 상담 시 안내",
      active: checked(formData, "active"),
      display_order: number(formData, "display_order"),
    })
    .eq("id", id)
    .eq("carrier_id", carrier);

  if (error) throw new Error(error.message);
  revalidateInternet(carrier);
}

export async function deleteBundleRule(formData: FormData) {
  await assertAdmin();
  const carrier = text(formData, "carrier_id");
  const id = text(formData, "id");

  const { error } = await supabaseAdmin
    .from("internet_bundle_rules")
    .delete()
    .eq("id", id)
    .eq("carrier_id", carrier);

  if (error) throw new Error(error.message);
  revalidateInternet(carrier);
}
