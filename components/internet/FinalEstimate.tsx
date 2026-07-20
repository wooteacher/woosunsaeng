"use client";

import {
  BadgeCheck,
  Check,
  CreditCard,
  FilePenLine,
  Gift,
  PhoneCall,
  Smartphone,
  Tv,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import ConsultationModal from "@/components/internet/ConsultationModal";
import { useCalculator } from "@/contexts/CalculatorContext";
import { createReceiptCode } from "@/lib/internet/receiptCode";

const formatPrice = (price: number) => price.toLocaleString("ko-KR");

function ProductRow({
  icon: Icon,
  title,
  detail,
  price,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  price: number;
}) {
  return (
    <div className="grid min-h-[50px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-emerald-400/10 text-emerald-400">
          <Icon size={15} strokeWidth={2.1} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-white">{title}</p>
          <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">
            {detail}
          </p>
        </div>
      </div>
      <p className="shrink-0 tabular-nums text-[12px] font-extrabold text-white">
        {formatPrice(price)}원
      </p>
    </div>
  );
}

function DiscountOption({
  title,
  description,
  amount,
  enabled,
  onToggle,
  icon,
}: {
  title: string;
  description: string;
  amount: number;
  enabled: boolean;
  onToggle: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={[
        "grid min-h-[52px] w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[15px] border px-3 py-2 text-left transition",
        enabled
          ? "border-emerald-400/30 bg-emerald-400/[0.09]"
          : "border-white/[0.08] bg-white/[0.035]",
      ].join(" ")}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className={[
            "flex size-8 shrink-0 items-center justify-center rounded-[10px]",
            enabled
              ? "bg-emerald-400/15 text-emerald-400"
              : "bg-white/[0.055] text-slate-400",
          ].join(" ")}
        >
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[12px] font-bold text-white">
            {title}
          </span>
          <span className="mt-0.5 block truncate text-[9px] font-medium text-slate-400">
            {description}
          </span>
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span
          className={[
            "block tabular-nums text-[12px] font-extrabold",
            enabled ? "text-emerald-400" : "text-slate-400",
          ].join(" ")}
        >
          -{formatPrice(amount)}원
        </span>
        <span
          className={[
            "mt-1 inline-flex h-[18px] items-center gap-1 rounded-full px-1.5 text-[8px] font-bold",
            enabled
              ? "bg-emerald-500 text-white"
              : "bg-white/[0.08] text-slate-400",
          ].join(" ")}
        >
          {enabled && <Check size={9} strokeWidth={3} />}
          {enabled ? "적용" : "미적용"}
        </span>
      </span>
    </button>
  );
}

export default function FinalEstimate() {
  const {
    carrier,
    carrierData,
    internetPlan,
    tvPlan,
    monthlyBasePrice,
    mobileDiscount,
    cardDiscount,
    estimatedMonthlyPrice,
    reward,
    useMobileDiscount,
    useCardDiscount,
    toggleMobileDiscount,
    toggleCardDiscount,
  } = useCalculator();

  const [consultationOpen, setConsultationOpen] = useState(false);

  const internetPrice = internetPlan?.monthlyPrice ?? 0;
  const tvPrice = tvPlan?.monthlyPrice ?? 0;
  const rewardAmount = reward?.amount ?? 0;

  const tvPlanIndex = tvPlan
    ? carrierData.tvPlans.findIndex((plan) => plan.id === tvPlan.id) + 1
    : 0;

  const receiptCode = useMemo(
    () =>
      createReceiptCode({
        carrier,
        speed: internetPlan?.speed,
        tvIndex: tvPlanIndex,
        useMobileDiscount,
        useCardDiscount,
      }),
    [
      carrier,
      internetPlan?.speed,
      tvPlanIndex,
      useMobileDiscount,
      useCardDiscount,
    ],
  );

  const productSummary = useMemo(
    () =>
      [
        carrier,
        internetPlan?.speed,
        internetPlan?.name,
        tvPlan ? `${tvPlan.name} TV` : "인터넷 단독",
        useMobileDiscount ? "휴대폰 결합 적용" : "휴대폰 결합 미적용",
        useCardDiscount ? "카드 할인 적용" : "카드 할인 미적용",
      ]
        .filter(Boolean)
        .join(" · "),
    [
      carrier,
      internetPlan?.speed,
      internetPlan?.name,
      tvPlan,
      useMobileDiscount,
      useCardDiscount,
    ],
  );

  const applyUrl = useMemo(() => {
    const params = new URLSearchParams({
      code: receiptCode,
      product: productSummary,
      base: String(monthlyBasePrice),
      mobileDiscount: String(mobileDiscount),
      cardDiscount: String(cardDiscount),
      mobile: useMobileDiscount ? "1" : "0",
      card: useCardDiscount ? "1" : "0",
    });

    return `/internet/apply?${params.toString()}`;
  }, [
    receiptCode,
    productSummary,
    monthlyBasePrice,
    mobileDiscount,
    cardDiscount,
    useMobileDiscount,
    useCardDiscount,
  ]);

  const productName = internetPlan
    ? `${internetPlan.speed} ${internetPlan.name}${
        tvPlan ? ` + ${tvPlan.name} TV` : ""
      }`
    : "인터넷 선택 전";

  return (
    <>
      <aside className="h-full min-h-0">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-800/80 bg-slate-950 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
          <div className="flex min-h-0 flex-1 flex-col p-4">
            <header className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-emerald-400">
                  우선생 예상 견적
                </p>
                <h2 className="mt-1 truncate text-[21px] font-extrabold tracking-[-0.04em]">
                  {carrier}
                </h2>
                <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">
                  {productName}
                </p>
              </div>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-emerald-400/10 text-emerald-400">
                <BadgeCheck size={18} strokeWidth={2.2} />
              </div>
            </header>

            <section className="mt-3 rounded-[20px] border border-emerald-400/20 bg-emerald-400/[0.09] px-3.5 py-3">
              <p className="text-[10px] font-bold text-emerald-300">
                현재 예상 월요금
              </p>
              <div className="mt-1.5 flex items-end gap-1">
                <strong className="truncate tabular-nums text-[34px] font-extrabold leading-none tracking-[-0.06em] text-emerald-400">
                  {formatPrice(estimatedMonthlyPrice)}
                </strong>
                <span className="pb-0.5 text-[13px] font-bold text-emerald-400">
                  원
                </span>
              </div>
            </section>

            <section className="mt-3 overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.04]">
              <ProductRow
                icon={Wifi}
                title="인터넷"
                detail={
                  internetPlan
                    ? `${internetPlan.speed} · ${internetPlan.name}`
                    : "선택 전"
                }
                price={internetPrice}
              />
              <div className="mx-3 h-px bg-white/[0.07]" />
              <ProductRow
                icon={Tv}
                title="TV"
                detail={
                  tvPlan
                    ? `${tvPlan.name} · ${tvPlan.channels}채널`
                    : "선택하지 않음"
                }
                price={tvPrice}
              />
              <div className="mx-3 h-px bg-white/[0.07]" />
              <div className="flex min-h-[38px] items-center justify-between gap-3 px-3 py-2">
                <span className="text-[10px] font-semibold text-slate-400">
                  월 기본요금
                </span>
                <span className="tabular-nums text-[12px] font-extrabold">
                  {formatPrice(monthlyBasePrice)}원
                </span>
              </div>
            </section>

            <section className="mt-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[11px] font-extrabold">할인 적용</h3>
                <p className="text-[9px] font-medium text-slate-400">
                  선택하여 적용
                </p>
              </div>
              <div className="mt-2 space-y-2">
                <DiscountOption
                  title="휴대폰 결합 할인"
                  description="휴대폰 1회선 결합 기준"
                  amount={mobileDiscount}
                  enabled={useMobileDiscount}
                  onToggle={toggleMobileDiscount}
                  icon={<Smartphone size={15} strokeWidth={2.1} />}
                />
                <DiscountOption
                  title="카드 할인"
                  description="제휴카드 최대 할인 기준"
                  amount={cardDiscount}
                  enabled={useCardDiscount}
                  onToggle={toggleCardDiscount}
                  icon={<CreditCard size={15} strokeWidth={2.1} />}
                />
              </div>
            </section>

            <section className="mt-3 flex items-center gap-2.5 rounded-[17px] border border-amber-300/15 bg-amber-300/[0.06] px-3 py-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-amber-300/10 text-amber-300">
                <Gift size={16} strokeWidth={2.1} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold text-amber-300">예상 사은품</p>
                <p className="mt-0.5 truncate tabular-nums text-[16px] font-extrabold">
                  {rewardAmount > 0
                    ? `${formatPrice(rewardAmount)}원 + 추가 혜택`
                    : "상담 시 최대 혜택"}
                </p>
              </div>
            </section>

            <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
              <a
                href={applyUrl}
                className="flex h-10 items-center justify-center gap-1.5 rounded-[13px] border border-white/[0.11] bg-white/[0.055] px-3 font-sans text-[12px] font-bold leading-none tracking-[-0.01em] text-white transition hover:bg-white/[0.09]"
              >
                <FilePenLine size={15} strokeWidth={2.2} />
                가입 신청
              </a>
              <button
                type="button"
                onClick={() => setConsultationOpen(true)}
                className="flex h-10 items-center justify-center gap-1.5 rounded-[13px] bg-emerald-500 px-3 font-sans text-[12px] font-bold leading-none tracking-[-0.01em] text-white transition hover:bg-emerald-400"
              >
                <PhoneCall size={15} strokeWidth={2.2} />
                상담 연결
              </button>
            </div>
          </div>

          <footer className="border-t border-white/[0.07] bg-white/[0.025] px-3 py-2">
            <p className="text-center text-[9px] font-medium text-slate-400">
              최종 조건은 상담 시 정확하게 확인됩니다.
            </p>
          </footer>
        </div>
      </aside>

      <ConsultationModal
        open={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        receiptCode={receiptCode}
        productSummary={productSummary}
        estimatedMonthlyPrice={estimatedMonthlyPrice}
      />
    </>
  );
}
