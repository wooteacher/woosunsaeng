import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  auditCarrierPricing,
  buildCarrierDataForAudit,
  getReferenceBundlePrice,
  getReferenceTvPlan,
} from "@/lib/internet/audit";
import { carrierOrder, type Carrier, type Speed } from "@/lib/internet/data";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  createBundleRule,
  createInternetPlan,
  createTvPlan,
  deleteBundleRule,
  deleteInternetPlan,
  deleteTvPlan,
  updateBundleRule,
  updateInternetCarrier,
  updateInternetPlan,
  updateTvPlan,
} from "../actions";

const inputClass =
  "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10";
const labelClass = "space-y-1.5 text-xs font-bold text-slate-600";
const checkboxClass =
  "flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700";

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
  display_order: number;
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
  display_order: number;
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
  display_order: number;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className={labelClass}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export default async function InternetCarrierAdminPage({
  params,
}: {
  params: Promise<{ carrier: string }>;
}) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/admin/login");
  }

  const { carrier } = await params;
  const carrierId = decodeURIComponent(carrier) as Carrier;
  if (!carrierOrder.includes(carrierId)) notFound();

  const [carrierResult, internetResult, tvResult, bundleResult] = await Promise.all([
    supabaseAdmin.from("internet_carriers").select("*").eq("id", carrierId).maybeSingle(),
    supabaseAdmin
      .from("internet_plans")
      .select("*")
      .eq("carrier_id", carrierId)
      .order("display_order", { ascending: true }),
    supabaseAdmin
      .from("internet_tv_plans")
      .select("*")
      .eq("carrier_id", carrierId)
      .order("display_order", { ascending: true }),
    supabaseAdmin
      .from("internet_bundle_rules")
      .select("*")
      .eq("carrier_id", carrierId)
      .order("display_order", { ascending: true }),
  ]);

  const queryError =
    carrierResult.error ?? internetResult.error ?? tvResult.error ?? bundleResult.error;
  if (queryError) {
    return (
      <main className="min-h-screen bg-slate-50 p-5 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <Link href="/admin/internet" className="font-bold text-emerald-600">
            ← 인터넷 상품관리
          </Link>
          <Card className="mt-6 border-amber-200 bg-amber-50">
            <p className="font-black text-amber-900">상품 테이블을 확인해주세요.</p>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Supabase SQL Editor에서 <code>supabase/internet_products.sql</code>을
              실행한 뒤 다시 접속하세요.
            </p>
            <p className="mt-2 text-xs text-amber-700">{queryError.message}</p>
          </Card>
        </div>
      </main>
    );
  }

  const carrierData = carrierResult.data as CarrierRow | null;
  if (!carrierData) {
    redirect("/admin/internet");
  }

  const internetPlans = (internetResult.data ?? []) as InternetPlanRow[];
  const tvPlans = (tvResult.data ?? []) as TvPlanRow[];
  const bundleRules = (bundleResult.data ?? []) as BundleRuleRow[];

  const auditData = buildCarrierDataForAudit({
    carrier: {
      id: carrierId,
      label: carrierData.label,
      logo: carrierData.logo,
      maxCardDiscount: carrierData.max_card_discount,
      priceVerifiedAt: carrierData.price_verified_at,
      pricingBasis: carrierData.pricing_basis,
      equipmentNote: carrierData.equipment_note,
    },
    internetPlans: internetPlans
      .filter((plan) => plan.active)
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
      .filter((plan) => plan.active)
      .map((plan) => ({
        id: plan.id,
        name: plan.name,
        channels: plan.channels,
        description: plan.description,
        monthlyPrice: plan.monthly_price,
        recommended: plan.recommended,
      })),
    bundleRules: bundleRules
      .filter((rule) => rule.active)
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
  const audit = auditCarrierPricing(auditData);

  return (
    <main className="min-h-screen bg-slate-50 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin/internet" className="text-sm font-bold text-emerald-600">
          ← 인터넷 상품·요금 관리
        </Link>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-600">통신사 설정</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
              {carrierData.label}
            </h1>
          </div>
          <a
            href="/internet"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-slate-600 underline underline-offset-4"
          >
            인터넷 계산기 확인
          </a>
        </div>

        <Card
          className={[
            "mt-7",
            audit.errorCount > 0
              ? "border-red-200 bg-red-50"
              : audit.warningCount > 0
                ? "border-amber-200 bg-amber-50"
                : "border-emerald-200 bg-emerald-50",
          ].join(" ")}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">자동 요금 검수</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                {audit.issues.length === 0
                  ? "현재 등록 요금이 기준과 일치합니다."
                  : `${audit.issues.length}건을 확인해주세요.`}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {audit.referenceSourceLabel
                  ? `${audit.referenceSourceLabel} · 기준일 ${audit.referenceVerifiedAt}`
                  : "지역형 상품은 내부 요금 구조와 결합 규칙을 중심으로 검수합니다."}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-extrabold text-red-700">
                오류 {audit.errorCount}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-700">
                확인 {audit.warningCount}
              </span>
            </div>
          </div>

          {audit.issues.length > 0 && (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {audit.issues.slice(0, 12).map((item) => (
                <div
                  key={item.id}
                  className={[
                    "rounded-2xl border bg-white px-4 py-3",
                    item.severity === "error"
                      ? "border-red-200"
                      : "border-amber-200",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={[
                        "mt-0.5 rounded-full px-2 py-1 text-[10px] font-black",
                        item.severity === "error"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700",
                      ].join(" ")}
                    >
                      {item.severity === "error" ? "오류" : "확인"}
                    </span>
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-1 break-keep text-xs leading-5 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="mt-7">
          <h2 className="text-xl font-black text-slate-950">통신사 기본정보</h2>
          <form action={updateInternetCarrier} className="mt-5 space-y-4">
            <input type="hidden" name="id" value={carrierData.id} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="표시 이름">
                <input name="label" defaultValue={carrierData.label} className={inputClass} required />
              </Field>
              <Field label="로고 경로">
                <input name="logo" defaultValue={carrierData.logo} className={inputClass} required />
              </Field>
              <Field label="제휴카드 최대 할인">
                <input name="max_card_discount" type="number" min="0" defaultValue={carrierData.max_card_discount} className={inputClass} />
              </Field>
              <Field label="통신사 순서">
                <input name="display_order" type="number" defaultValue={carrierData.display_order} className={inputClass} />
              </Field>
              <Field label="요금 확인 기준일">
                <input name="price_verified_at" defaultValue={carrierData.price_verified_at ?? ""} className={inputClass} placeholder="2026.07.18" />
              </Field>
              <Field label="요금 기준">
                <input name="pricing_basis" defaultValue={carrierData.pricing_basis ?? ""} className={inputClass} placeholder="3년 약정 · VAT 포함" />
              </Field>
              <Field label="장비·설치 안내">
                <input name="equipment_note" defaultValue={carrierData.equipment_note ?? ""} className={inputClass} placeholder="셋톱박스 기준 · 설치비 별도" />
              </Field>
              <label className={`${checkboxClass} self-end`}>
                <input type="checkbox" name="active" defaultChecked={carrierData.active} />
                홈페이지 노출
              </label>
            </div>
            <Button type="submit">통신사 정보 저장</Button>
          </form>
        </Card>

        <section className="mt-10">
          <div>
            <p className="text-sm font-bold text-emerald-600">STEP 1</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">인터넷 속도 상품</h2>
          </div>

          <Card className="mt-5 border-emerald-200 bg-emerald-50/50">
            <h3 className="font-black text-slate-950">인터넷 상품 추가</h3>
            <form action={createInternetPlan} className="mt-4 space-y-4">
              <input type="hidden" name="carrier_id" value={carrierId} />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Field label="상품 ID"><input name="id" className={inputClass} placeholder={`${carrierId.toLowerCase()}-internet-500`} required /></Field>
                <Field label="속도"><select name="speed" defaultValue="500M" className={inputClass}><option>100M</option><option>500M</option><option>1G</option></select></Field>
                <Field label="상품명"><input name="name" className={inputClass} placeholder="베이직" required /></Field>
                <Field label="설명"><input name="description" className={inputClass} placeholder="가족과 여러 기기 사용" /></Field>
                <Field label="월 기본료"><input name="monthly_price" type="number" min="0" className={inputClass} /></Field>
                <Field label="모바일 결합 할인"><input name="mobile_discount" type="number" min="0" className={inputClass} /></Field>
                <Field label="사은품"><input name="reward_amount" type="number" min="0" className={inputClass} /></Field>
                <Field label="추가 혜택"><input name="reward_extra_benefit" className={inputClass} defaultValue="추가 혜택은 상담 시 안내" /></Field>
                <Field label="노출 순서"><input name="display_order" type="number" defaultValue={internetPlans.length + 1} className={inputClass} /></Field>
                <label className={checkboxClass}><input type="checkbox" name="recommended" /> 추천 상품</label>
                <label className={checkboxClass}><input type="checkbox" name="active" defaultChecked /> 홈페이지 노출</label>
              </div>
              <Button type="submit">인터넷 상품 추가</Button>
            </form>
          </Card>

          <div className="mt-5 space-y-4">
            {internetPlans.map((plan) => (
              <details key={plan.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm" open>
                <summary className="cursor-pointer list-none font-black text-slate-950">
                  {plan.speed} · {plan.name} · 월 {plan.monthly_price.toLocaleString("ko-KR")}원
                </summary>
                <form action={updateInternetPlan} className="mt-5 space-y-4">
                  <input type="hidden" name="id" value={plan.id} />
                  <input type="hidden" name="carrier_id" value={carrierId} />
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <Field label="상품 ID"><input value={plan.id} className={`${inputClass} bg-slate-100`} disabled /></Field>
                    <Field label="속도"><select name="speed" defaultValue={plan.speed} className={inputClass}><option>100M</option><option>500M</option><option>1G</option></select></Field>
                    <Field label="상품명"><input name="name" defaultValue={plan.name} className={inputClass} required /></Field>
                    <Field label="설명"><input name="description" defaultValue={plan.description ?? ""} className={inputClass} /></Field>
                    <Field label="월 기본료"><input name="monthly_price" type="number" min="0" defaultValue={plan.monthly_price} className={inputClass} /></Field>
                    <Field label="모바일 결합 할인"><input name="mobile_discount" type="number" min="0" defaultValue={plan.mobile_discount} className={inputClass} /></Field>
                    <Field label="사은품"><input name="reward_amount" type="number" min="0" defaultValue={plan.reward_amount} className={inputClass} /></Field>
                    <Field label="추가 혜택"><input name="reward_extra_benefit" defaultValue={plan.reward_extra_benefit ?? ""} className={inputClass} /></Field>
                    <Field label="노출 순서"><input name="display_order" type="number" defaultValue={plan.display_order} className={inputClass} /></Field>
                    <label className={checkboxClass}><input type="checkbox" name="recommended" defaultChecked={plan.recommended} /> 추천 상품</label>
                    <label className={checkboxClass}><input type="checkbox" name="active" defaultChecked={plan.active} /> 홈페이지 노출</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit">저장</Button>
                  </div>
                </form>
                <form action={deleteInternetPlan} className="mt-2">
                  <input type="hidden" name="id" value={plan.id} />
                  <input type="hidden" name="carrier_id" value={carrierId} />
                  <button type="submit" className="text-sm font-bold text-red-600 underline underline-offset-4">상품 삭제</button>
                </form>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div>
            <p className="text-sm font-bold text-emerald-600">STEP 2</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">TV 채널 상품</h2>
          </div>

          <Card className="mt-5 border-emerald-200 bg-emerald-50/50">
            <h3 className="font-black text-slate-950">TV 상품 추가</h3>
            <form action={createTvPlan} className="mt-4 space-y-4">
              <input type="hidden" name="carrier_id" value={carrierId} />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Field label="TV 상품 ID"><input name="id" className={inputClass} placeholder={`${carrierId.toLowerCase()}-tv-basic`} required /></Field>
                <Field label="상품명"><input name="name" className={inputClass} placeholder="베이직" required /></Field>
                <Field label="채널 수"><input name="channels" type="number" min="0" className={inputClass} /></Field>
                <Field label="월 기본료"><input name="monthly_price" type="number" min="0" className={inputClass} /></Field>
                <Field label="설명"><input name="description" className={inputClass} placeholder="경제적인 기본 채널" /></Field>
                <Field label="노출 순서"><input name="display_order" type="number" defaultValue={tvPlans.length + 1} className={inputClass} /></Field>
                <label className={checkboxClass}><input type="checkbox" name="recommended" /> 추천 상품</label>
                <label className={checkboxClass}><input type="checkbox" name="active" defaultChecked /> 홈페이지 노출</label>
              </div>
              <Button type="submit">TV 상품 추가</Button>
            </form>
          </Card>

          <div className="mt-5 space-y-4">
            {tvPlans.map((plan) => {
              const reference = getReferenceTvPlan(carrierId, plan.id);
              const matchesReference =
                !reference ||
                (reference.monthlyPrice === plan.monthly_price &&
                  (reference.channels === undefined ||
                    reference.channels === plan.channels));

              return (
              <details key={plan.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-black text-slate-950">
                  <span>{plan.name} · {plan.channels}채널 · 월 {plan.monthly_price.toLocaleString("ko-KR")}원</span>
                  {reference && (
                    <span
                      className={[
                        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold",
                        matchesReference
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700",
                      ].join(" ")}
                    >
                      {matchesReference ? "기준 일치" : "기준 확인"}
                    </span>
                  )}
                </summary>
                <form action={updateTvPlan} className="mt-5 space-y-4">
                  <input type="hidden" name="id" value={plan.id} />
                  <input type="hidden" name="carrier_id" value={carrierId} />
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <Field label="TV 상품 ID"><input value={plan.id} className={`${inputClass} bg-slate-100`} disabled /></Field>
                    <Field label="상품명"><input name="name" defaultValue={plan.name} className={inputClass} required /></Field>
                    <Field label="채널 수"><input name="channels" type="number" min="0" defaultValue={plan.channels} className={inputClass} /></Field>
                    <Field label="월 기본료"><input name="monthly_price" type="number" min="0" defaultValue={plan.monthly_price} className={inputClass} /></Field>
                    <Field label="설명"><input name="description" defaultValue={plan.description ?? ""} className={inputClass} /></Field>
                    <Field label="노출 순서"><input name="display_order" type="number" defaultValue={plan.display_order} className={inputClass} /></Field>
                    <label className={checkboxClass}><input type="checkbox" name="recommended" defaultChecked={plan.recommended} /> 추천 상품</label>
                    <label className={checkboxClass}><input type="checkbox" name="active" defaultChecked={plan.active} /> 홈페이지 노출</label>
                  </div>
                  <Button type="submit">저장</Button>
                </form>
                <form action={deleteTvPlan} className="mt-2">
                  <input type="hidden" name="id" value={plan.id} />
                  <input type="hidden" name="carrier_id" value={carrierId} />
                  <button type="submit" className="text-sm font-bold text-red-600 underline underline-offset-4">TV 상품 삭제</button>
                </form>
              </details>
              );
            })}
          </div>
        </section>

        <section className="mt-12 pb-12">
          <div>
            <p className="text-sm font-bold text-emerald-600">STEP 3</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">인터넷 + TV 결합 요금</h2>
            <p className="mt-2 text-sm text-slate-600">인터넷 속도와 TV 상품의 조합별 최종 기본료·결합할인·사은품을 설정합니다.</p>
          </div>

          <Card className="mt-5 border-emerald-200 bg-emerald-50/50">
            <h3 className="font-black text-slate-950">결합 요금 추가</h3>
            <form action={createBundleRule} className="mt-4 space-y-4">
              <input type="hidden" name="carrier_id" value={carrierId} />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Field label="결합 규칙 ID"><input name="id" className={inputClass} placeholder={`${carrierId.toLowerCase()}-500m-basic`} required /></Field>
                <Field label="인터넷 속도"><select name="speed" defaultValue="500M" className={inputClass}><option>100M</option><option>500M</option><option>1G</option></select></Field>
                <Field label="TV 상품"><select name="tv_plan_id" className={inputClass} required><option value="">선택</option>{tvPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</select></Field>
                <Field label="결합 월 기본료"><input name="bundle_monthly_price" type="number" min="0" className={inputClass} /></Field>
                <Field label="모바일 결합 할인"><input name="mobile_discount" type="number" min="0" className={inputClass} /></Field>
                <Field label="사은품"><input name="reward_amount" type="number" min="0" className={inputClass} /></Field>
                <Field label="추가 혜택"><input name="reward_extra_benefit" defaultValue="추가 혜택은 상담 시 안내" className={inputClass} /></Field>
                <Field label="노출 순서"><input name="display_order" type="number" defaultValue={bundleRules.length + 1} className={inputClass} /></Field>
                <label className={checkboxClass}><input type="checkbox" name="active" defaultChecked /> 홈페이지 노출</label>
              </div>
              <Button type="submit" disabled={tvPlans.length === 0}>결합 요금 추가</Button>
            </form>
          </Card>

          <div className="mt-5 space-y-4">
            {bundleRules.map((rule) => {
              const tvName = tvPlans.find((plan) => plan.id === rule.tv_plan_id)?.name ?? rule.tv_plan_id;
              const referencePrice = getReferenceBundlePrice(
                carrierId,
                rule.speed as Speed,
                rule.tv_plan_id,
              );
              const matchesReference =
                referencePrice === undefined ||
                referencePrice === rule.bundle_monthly_price;

              return (
                <details key={rule.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-black text-slate-950">
                    <span>{rule.speed} + {tvName} · 월 {rule.bundle_monthly_price.toLocaleString("ko-KR")}원</span>
                    {referencePrice !== undefined && (
                      <span
                        className={[
                          "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold",
                          matchesReference
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700",
                        ].join(" ")}
                      >
                        {matchesReference
                          ? "기준 일치"
                          : `기준 ${referencePrice.toLocaleString("ko-KR")}원`}
                      </span>
                    )}
                  </summary>
                  <form action={updateBundleRule} className="mt-5 space-y-4">
                    <input type="hidden" name="id" value={rule.id} />
                    <input type="hidden" name="carrier_id" value={carrierId} />
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <Field label="결합 규칙 ID"><input value={rule.id} className={`${inputClass} bg-slate-100`} disabled /></Field>
                      <Field label="인터넷 속도"><select name="speed" defaultValue={rule.speed} className={inputClass}><option>100M</option><option>500M</option><option>1G</option></select></Field>
                      <Field label="TV 상품"><select name="tv_plan_id" defaultValue={rule.tv_plan_id} className={inputClass}>{tvPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</select></Field>
                      <Field label="결합 월 기본료"><input name="bundle_monthly_price" type="number" min="0" defaultValue={rule.bundle_monthly_price} className={inputClass} /></Field>
                      <Field label="모바일 결합 할인"><input name="mobile_discount" type="number" min="0" defaultValue={rule.mobile_discount} className={inputClass} /></Field>
                      <Field label="사은품"><input name="reward_amount" type="number" min="0" defaultValue={rule.reward_amount} className={inputClass} /></Field>
                      <Field label="추가 혜택"><input name="reward_extra_benefit" defaultValue={rule.reward_extra_benefit ?? ""} className={inputClass} /></Field>
                      <Field label="노출 순서"><input name="display_order" type="number" defaultValue={rule.display_order} className={inputClass} /></Field>
                      <label className={checkboxClass}><input type="checkbox" name="active" defaultChecked={rule.active} /> 홈페이지 노출</label>
                    </div>
                    <Button type="submit">저장</Button>
                  </form>
                  <form action={deleteBundleRule} className="mt-2">
                    <input type="hidden" name="id" value={rule.id} />
                    <input type="hidden" name="carrier_id" value={carrierId} />
                    <button type="submit" className="text-sm font-bold text-red-600 underline underline-offset-4">결합 요금 삭제</button>
                  </form>
                </details>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
