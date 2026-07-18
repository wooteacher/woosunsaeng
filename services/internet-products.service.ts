import { createClient } from "@/lib/supabase/server";
import {
  carrierOrder as localCarrierOrder,
  type Carrier,
  type CarrierData,
  type InternetPlan,
  type TvPlan,
  type BundleRule,
} from "@/lib/internet/data";
import {
  getLocalInternetCatalog,
  type InternetCatalog,
} from "@/lib/internet/catalog";

type CarrierRow = {
  id: string;
  label: string;
  logo: string;
  max_card_discount: number | null;
  price_verified_at: string | null;
  pricing_basis: string | null;
  equipment_note: string | null;
  display_order: number | null;
};

type InternetPlanRow = {
  id: string;
  carrier_id: string;
  speed: string;
  name: string;
  description: string | null;
  monthly_price: number | null;
  mobile_discount: number | null;
  reward_amount: number | null;
  reward_extra_benefit: string | null;
  recommended: boolean | null;
  display_order: number | null;
};

type TvPlanRow = {
  id: string;
  carrier_id: string;
  name: string;
  channels: number | null;
  description: string | null;
  monthly_price: number | null;
  recommended: boolean | null;
  display_order: number | null;
};

type BundleRuleRow = {
  id: string;
  carrier_id: string;
  speed: string;
  tv_plan_id: string;
  bundle_monthly_price: number | null;
  mobile_discount: number | null;
  reward_amount: number | null;
  reward_extra_benefit: string | null;
  display_order: number | null;
};

const carrierIds = new Set<string>(localCarrierOrder);
const speedIds = new Set<string>(["100M", "500M", "1G"]);

function isCarrier(value: string): value is Carrier {
  return carrierIds.has(value);
}

function isSpeed(value: string): value is InternetPlan["speed"] {
  return speedIds.has(value);
}

export async function fetchInternetCatalog(): Promise<InternetCatalog> {
  try {
    const supabase = await createClient();

    const [carrierResult, internetPlanResult, tvPlanResult, bundleResult] =
      await Promise.all([
        supabase
          .from("internet_carriers")
          .select(
            "id,label,logo,max_card_discount,price_verified_at,pricing_basis,equipment_note,display_order",
          )
          .eq("active", true)
          .order("display_order", { ascending: true }),
        supabase
          .from("internet_plans")
          .select(
            "id,carrier_id,speed,name,description,monthly_price,mobile_discount,reward_amount,reward_extra_benefit,recommended,display_order",
          )
          .eq("active", true)
          .order("display_order", { ascending: true }),
        supabase
          .from("internet_tv_plans")
          .select(
            "id,carrier_id,name,channels,description,monthly_price,recommended,display_order",
          )
          .eq("active", true)
          .order("display_order", { ascending: true }),
        supabase
          .from("internet_bundle_rules")
          .select(
            "id,carrier_id,speed,tv_plan_id,bundle_monthly_price,mobile_discount,reward_amount,reward_extra_benefit,display_order",
          )
          .eq("active", true)
          .order("display_order", { ascending: true }),
      ]);

    if (
      carrierResult.error ||
      internetPlanResult.error ||
      tvPlanResult.error ||
      bundleResult.error
    ) {
      return getLocalInternetCatalog();
    }

    const carrierRows = (carrierResult.data ?? []) as CarrierRow[];
    const internetPlanRows = (internetPlanResult.data ?? []) as InternetPlanRow[];
    const tvPlanRows = (tvPlanResult.data ?? []) as TvPlanRow[];
    const bundleRows = (bundleResult.data ?? []) as BundleRuleRow[];

    if (carrierRows.length === 0) {
      return getLocalInternetCatalog();
    }

    const catalogData: Partial<Record<Carrier, CarrierData>> = {};
    const order: Carrier[] = [];

    for (const carrierRow of carrierRows) {
      if (!isCarrier(carrierRow.id)) continue;

      const internetPlans: InternetPlan[] = internetPlanRows
        .filter(
          (row) => row.carrier_id === carrierRow.id && isSpeed(row.speed),
        )
        .map((row) => ({
          id: row.id,
          speed: row.speed as InternetPlan["speed"],
          name: row.name,
          description: row.description ?? "",
          monthlyPrice: row.monthly_price ?? 0,
          mobileDiscount: row.mobile_discount ?? 0,
          reward: {
            amount: row.reward_amount ?? 0,
            extraBenefit:
              row.reward_extra_benefit ?? "추가 혜택은 상담 시 안내",
          },
          recommended: row.recommended ?? false,
        }));

      if (internetPlans.length === 0) continue;

      const tvPlans: TvPlan[] = tvPlanRows
        .filter((row) => row.carrier_id === carrierRow.id)
        .map((row) => ({
          id: row.id,
          name: row.name,
          channels: row.channels ?? 0,
          description: row.description ?? "",
          monthlyPrice: row.monthly_price ?? 0,
          recommended: row.recommended ?? false,
        }));

      const validTvPlanIds = new Set(tvPlans.map((plan) => plan.id));

      const bundleRules: BundleRule[] = bundleRows
        .filter(
          (row) =>
            row.carrier_id === carrierRow.id &&
            isSpeed(row.speed) &&
            validTvPlanIds.has(row.tv_plan_id),
        )
        .map((row) => ({
          id: row.id,
          speed: row.speed as BundleRule["speed"],
          tvPlanId: row.tv_plan_id,
          bundleMonthlyPrice: row.bundle_monthly_price ?? 0,
          mobileDiscount: row.mobile_discount ?? 0,
          reward: {
            amount: row.reward_amount ?? 0,
            extraBenefit:
              row.reward_extra_benefit ?? "추가 혜택은 상담 시 안내",
          },
        }));

      catalogData[carrierRow.id] = {
        id: carrierRow.id,
        label: carrierRow.label,
        logo: carrierRow.logo,
        maxCardDiscount: carrierRow.max_card_discount ?? 0,
        priceVerifiedAt: carrierRow.price_verified_at ?? "상담 시 확인",
        pricingBasis: carrierRow.pricing_basis ?? "3년 약정 · VAT 포함",
        equipmentNote: carrierRow.equipment_note ?? "설치비 별도",
        internetPlans,
        tvPlans,
        bundleRules,
      };
      order.push(carrierRow.id);
    }

    if (order.length === 0) {
      return getLocalInternetCatalog();
    }

    return {
      carrierOrder: order,
      internetData: catalogData,
      source: "database",
    };
  } catch {
    return getLocalInternetCatalog();
  }
}
