import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  auditCarrierPricing,
  buildCarrierDataForAudit,
} from "@/lib/internet/audit";
import { carrierOrder, type Carrier } from "@/lib/internet/data";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { importLocalInternetCatalog } from "./actions";

type CarrierRow = {
  id: string;
  label: string;
  logo: string;
  max_card_discount: number;
  price_verified_at: string | null;
  pricing_basis: string | null;
  equipment_note: string | null;
  active: boolean;
  display_order: number;
};

type InternetPlanRow = {
  id: string;
  carrier_id: string;
  speed: string;
  name: string;
  description: string | null;
  monthly_price: number;
  mobile_discount: number;
  reward_amount: number;
  reward_extra_benefit: string | null;
  recommended: boolean;
  active: boolean;
};

type TvPlanRow = {
  id: string;
  carrier_id: string;
  name: string;
  channels: number;
  description: string | null;
  monthly_price: number;
  recommended: boolean;
  active: boolean;
};

type BundleRuleRow = {
  id: string;
  carrier_id: string;
  speed: string;
  tv_plan_id: string;
  bundle_monthly_price: number;
  mobile_discount: number;
  reward_amount: number;
  reward_extra_benefit: string | null;
  active: boolean;
};

function isCarrier(value: string): value is Carrier {
  return carrierOrder.includes(value as Carrier);
}

export default async function AdminInternetPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/admin/login");
  }

  const [carrierResult, planResult, tvResult, bundleResult] = await Promise.all([
    supabaseAdmin
      .from("internet_carriers")
      .select(
        "id,label,logo,max_card_discount,price_verified_at,pricing_basis,equipment_note,active,display_order",
      )
      .order("display_order", { ascending: true }),
    supabaseAdmin
      .from("internet_plans")
      .select(
        "id,carrier_id,speed,name,description,monthly_price,mobile_discount,reward_amount,reward_extra_benefit,recommended,active",
      ),
    supabaseAdmin
      .from("internet_tv_plans")
      .select(
        "id,carrier_id,name,channels,description,monthly_price,recommended,active",
      ),
    supabaseAdmin
      .from("internet_bundle_rules")
      .select(
        "id,carrier_id,speed,tv_plan_id,bundle_monthly_price,mobile_discount,reward_amount,reward_extra_benefit,active",
      ),
  ]);

  const setupError =
    carrierResult.error ?? planResult.error ?? tvResult.error ?? bundleResult.error;
  const carriers = (carrierResult.data ?? []) as CarrierRow[];
  const internetPlans = (planResult.data ?? []) as InternetPlanRow[];
  const tvPlans = (tvResult.data ?? []) as TvPlanRow[];
  const bundleRules = (bundleResult.data ?? []) as BundleRuleRow[];

  const rows = carriers.length
    ? carriers
    : carrierOrder.map((id, index) => ({
        id,
        label: id,
        logo: "",
        max_card_discount: 0,
        price_verified_at: null,
        pricing_basis: null,
        equipment_note: null,
        active: true,
        display_order: index + 1,
      }));

  const audits = new Map(
    rows
      .filter((carrier): carrier is CarrierRow & { id: Carrier } =>
        isCarrier(carrier.id),
      )
      .map((carrier) => {
        const auditData = buildCarrierDataForAudit({
          carrier: {
            id: carrier.id,
            label: carrier.label,
            logo: carrier.logo,
            maxCardDiscount: carrier.max_card_discount,
            priceVerifiedAt: carrier.price_verified_at,
            pricingBasis: carrier.pricing_basis,
            equipmentNote: carrier.equipment_note,
          },
          internetPlans: internetPlans
            .filter((plan) => plan.carrier_id === carrier.id && plan.active)
            .map((plan) => ({
              id: plan.id,
              speed: plan.speed,
              name: plan.name,
              description: plan.description,
              monthlyPrice: plan.monthly_price,
              mobileDiscount: plan.mobile_discount,
              rewardAmount: plan.reward_amount,
              rewardExtraBenefit: plan.reward_extra_benefit,
              recommended: plan.recommended,
            })),
          tvPlans: tvPlans
            .filter((plan) => plan.carrier_id === carrier.id && plan.active)
            .map((plan) => ({
              id: plan.id,
              name: plan.name,
              channels: plan.channels,
              description: plan.description,
              monthlyPrice: plan.monthly_price,
              recommended: plan.recommended,
            })),
          bundleRules: bundleRules
            .filter((rule) => rule.carrier_id === carrier.id && rule.active)
            .map((rule) => ({
              id: rule.id,
              speed: rule.speed,
              tvPlanId: rule.tv_plan_id,
              bundleMonthlyPrice: rule.bundle_monthly_price,
              mobileDiscount: rule.mobile_discount,
              rewardAmount: rule.reward_amount,
              rewardExtraBenefit: rule.reward_extra_benefit,
            })),
        });

        return [carrier.id, auditCarrierPricing(auditData)] as const;
      }),
  );

  const totalErrors = Array.from(audits.values()).reduce(
    (sum, audit) => sum + audit.errorCount,
    0,
  );
  const totalWarnings = Array.from(audits.values()).reduce(
    (sum, audit) => sum + audit.warningCount,
    0,
  );

  const countFor = (
    items: Array<{ carrier_id: string }>,
    carrier: string,
  ) => items.filter((item) => item.carrier_id === carrier).length;

  return (
    <main className="min-h-screen bg-slate-50 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-600">인터넷 운영</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
              인터넷 상품·요금 관리
            </h1>
            <p className="mt-3 max-w-2xl break-keep text-sm leading-7 text-slate-600 sm:text-base">
              통신사 기본정보, 인터넷·TV 요금, 결합 할인과 사은품을 관리합니다.
              저장한 내용은 인터넷 견적 계산기에 자동 반영됩니다.
            </p>
          </div>

          {!setupError && (
            <form action={importLocalInternetCatalog}>
              <Button type="submit" className="w-full lg:w-auto">
                현재 로컬 요금 DB로 가져오기
              </Button>
            </form>
          )}
        </div>

        {setupError && (
          <Card className="mt-8 border-amber-200 bg-amber-50">
            <p className="font-black text-amber-900">
              인터넷 상품 테이블 준비가 필요합니다.
            </p>
            <p className="mt-2 break-keep text-sm leading-6 text-amber-800">
              Supabase SQL Editor에서 프로젝트의
              <code className="mx-1 rounded bg-white px-1.5 py-0.5 font-bold">
                supabase/internet_products.sql
              </code>
              파일 내용을 전체 실행한 뒤 이 페이지를 새로고침하세요.
            </p>
            <p className="mt-2 text-xs text-amber-700">{setupError.message}</p>
          </Card>
        )}

        {!setupError && carriers.length === 0 && (
          <Card className="mt-8 border-emerald-200 bg-emerald-50">
            <p className="font-black text-emerald-900">
              테이블 생성이 완료되었습니다.
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              상단의 <strong>현재 로컬 요금 DB로 가져오기</strong> 버튼을 한 번
              눌러 기존 요금 데이터를 등록하세요.
            </p>
          </Card>
        )}

        {!setupError && carriers.length > 0 && (
          <Card
            className={[
              "mt-8",
              totalErrors > 0
                ? "border-red-200 bg-red-50"
                : totalWarnings > 0
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-200 bg-emerald-50",
            ].join(" ")}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">자동 요금 검수</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">
                  {totalErrors === 0 && totalWarnings === 0
                    ? "핵심 요금과 조합이 정상입니다."
                    : `${totalErrors + totalWarnings}건의 확인 항목이 있습니다.`}
                </h2>
                <p className="mt-2 break-keep text-sm leading-6 text-slate-600">
                  기준가 불일치, 결합 규칙 누락, 속도별 요금 역전과 비정상적인
                  가격 차이를 자동으로 확인합니다.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-extrabold text-red-700">
                  오류 {totalErrors}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-700">
                  확인 {totalWarnings}
                </span>
              </div>
            </div>
          </Card>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((carrier) => {
            const audit = isCarrier(carrier.id) ? audits.get(carrier.id) : undefined;
            const issueCount =
              (audit?.errorCount ?? 0) + (audit?.warningCount ?? 0);

            return (
              <Card key={carrier.id} className="flex min-h-[280px] flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-emerald-600">통신사</p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">
                      {carrier.label}
                    </h2>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={[
                        "rounded-full px-3 py-1.5 text-xs font-bold",
                        carrier.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500",
                      ].join(" ")}
                    >
                      {carrier.active ? "노출 중" : "숨김"}
                    </span>
                    <span
                      className={[
                        "rounded-full px-3 py-1.5 text-xs font-bold",
                        issueCount === 0
                          ? "bg-slate-100 text-slate-600"
                          : audit?.errorCount
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700",
                      ].join(" ")}
                    >
                      {issueCount === 0 ? "검수 정상" : `검수 ${issueCount}건`}
                    </span>
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl bg-slate-50 px-2 py-3">
                    <dt className="text-xs text-slate-500">인터넷</dt>
                    <dd className="mt-1 font-black text-slate-950">
                      {countFor(internetPlans, carrier.id)}개
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-2 py-3">
                    <dt className="text-xs text-slate-500">TV</dt>
                    <dd className="mt-1 font-black text-slate-950">
                      {countFor(tvPlans, carrier.id)}개
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-2 py-3">
                    <dt className="text-xs text-slate-500">결합</dt>
                    <dd className="mt-1 font-black text-slate-950">
                      {countFor(bundleRules, carrier.id)}개
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-xs text-slate-500">
                  요금 기준일 {carrier.price_verified_at || "미입력"}
                </p>

                <Link
                  href={`/admin/internet/${encodeURIComponent(carrier.id)}`}
                  className="mt-auto flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-600"
                >
                  요금 관리하기
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
