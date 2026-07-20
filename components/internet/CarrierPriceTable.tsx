"use client";

import { BadgeCheck, Info, Smartphone } from "lucide-react";

import MobileHorizontalRail from "@/components/internet/MobileHorizontalRail";
import { useCalculator } from "@/contexts/CalculatorContext";
import type { Speed } from "@/lib/internet/data";

const speeds: Speed[] = ["100M", "500M", "1G"];

function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function formatReward(value: number) {
  if (value <= 0) return "상담 안내";
  if (value % 10000 === 0) return `${value / 10000}만원`;
  return formatPrice(value);
}

export default function CarrierPriceTable() {
  const { carrierData, internetPlan, tvPlan } = useCalculator();
  const displayCarrierLabel =
    carrierData.id === "SKB" ? "SKB" : carrierData.label;

  const rows = [
    {
      id: "internet-only",
      title: "인터넷 단독",
      subtitle: "TV 선택 없음",
      tvPlanId: null as string | null,
    },
    ...carrierData.tvPlans.map((plan) => ({
      id: plan.id,
      title: `인터넷 + ${plan.name} TV`,
      subtitle: `${plan.channels}채널`,
      tvPlanId: plan.id,
    })),
  ];

  return (
    <section className="mt-4 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.05)] sm:mt-6 sm:rounded-[28px]">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7 sm:py-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <BadgeCheck size={18} strokeWidth={2.3} />
            </span>
            <p className="text-[12px] font-black text-emerald-700">
              {displayCarrierLabel} 공식 요금 기준
            </p>
          </div>
          <h2 className="mt-3 text-[21px] font-black tracking-[-0.04em] text-slate-950 sm:text-[26px]">
            인터넷·TV 요금표 한눈에 보기
          </h2>
          <p className="mt-1.5 break-keep text-[12px] leading-5 text-slate-500 sm:text-sm sm:leading-6">
            통신사를 바꾸면 해당 통신사의 요금표가 자동으로 변경됩니다.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-3.5 py-3 text-[11px] font-semibold leading-5 text-slate-600 sm:text-right">
          <p>{carrierData.pricingBasis}</p>
          <p>{carrierData.equipmentNote}</p>
          <p className="text-emerald-700">검증일 {carrierData.priceVerifiedAt}</p>
        </div>
      </div>

      <MobileHorizontalRail
        ariaLabel={`${displayCarrierLabel} 요금표`}
        className="px-1 sm:px-0"
        scrollClassName="overflow-x-auto px-3 pb-4 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 sm:pb-6 sm:pt-5"
      >
        <table className="w-full min-w-[880px] border-separate border-spacing-0 overflow-hidden text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-[210px] border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-[12px] font-black text-slate-700">
                상품 구성
              </th>
              {speeds.map((speed) => (
                <th
                  key={speed}
                  className="min-w-[220px] border-b border-r border-slate-200 bg-slate-50 px-4 py-3 last:border-r-0"
                >
                  <span className="text-[16px] font-black text-slate-950">{speed}</span>
                  <span className="ml-2 text-[10px] font-bold text-slate-500">
                    월 요금 · 결합 · 혜택
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id}>
                <th
                  className={[
                    "sticky left-0 z-10 border-b border-r border-slate-200 px-4 py-4 align-top",
                    rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/80",
                  ].join(" ")}
                >
                  <p className="break-keep text-[13px] font-black leading-5 text-slate-950">
                    {row.title}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-slate-500">
                    {row.subtitle}
                  </p>
                </th>

                {speeds.map((speed) => {
                  const plan = carrierData.internetPlans.find(
                    (item) => item.speed === speed,
                  );
                  const bundle = row.tvPlanId
                    ? carrierData.bundleRules.find(
                        (item) =>
                          item.speed === speed && item.tvPlanId === row.tvPlanId,
                      )
                    : null;

                  if (!plan || (row.tvPlanId && !bundle)) {
                    return (
                      <td
                        key={speed}
                        className="border-b border-r border-slate-200 px-4 py-4 text-center text-[12px] font-bold text-slate-400 last:border-r-0"
                      >
                        상담 필요
                      </td>
                    );
                  }

                  const basePrice = bundle?.bundleMonthlyPrice ?? plan.monthlyPrice;
                  const mobileDiscount = bundle?.mobileDiscount ?? plan.mobileDiscount;
                  const combinedPrice = Math.max(basePrice - mobileDiscount, 0);
                  const rewardAmount = bundle?.reward.amount ?? plan.reward.amount;
                  const isSelected =
                    internetPlan?.speed === speed &&
                    (row.tvPlanId ? tvPlan?.id === row.tvPlanId : !tvPlan);

                  return (
                    <td
                      key={speed}
                      className={[
                        "border-b border-r border-slate-200 px-4 py-4 align-top last:border-r-0",
                        isSelected
                          ? "bg-emerald-50/80 shadow-[inset_0_0_0_2px_rgba(16,185,129,0.55)]"
                          : rowIndex % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50/40",
                      ].join(" ")}
                    >
                      <p className="tabular-nums text-[16px] font-black tracking-[-0.03em] text-slate-950">
                        {formatPrice(basePrice)}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                        <Smartphone size={13} strokeWidth={2.3} />
                        1회선 결합 {formatPrice(combinedPrice)}
                      </div>
                      <p className="mt-1.5 text-[10px] font-bold text-amber-600">
                        예상 혜택 {formatReward(rewardAmount)}
                      </p>
                      {isSelected ? (
                        <span className="mt-2 inline-flex rounded-full bg-emerald-600 px-2 py-1 text-[9px] font-black text-white">
                          현재 선택
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </MobileHorizontalRail>

      <div className="mx-4 mb-5 flex items-start gap-2 rounded-2xl bg-amber-50 px-3.5 py-3 text-[11px] font-semibold leading-5 text-amber-900 sm:mx-7 sm:mb-6">
        <Info size={15} className="mt-0.5 shrink-0" />
        <p>
          휴대폰 결합 할인은 대표 1회선 기준입니다. 실제 할인액과 지급 혜택은
          휴대폰 요금제, 결합 회선, 설치 지역 및 통신사 정책에 따라 달라질 수 있어
          상담 시 최종 확인합니다.
        </p>
      </div>
    </section>
  );
}
