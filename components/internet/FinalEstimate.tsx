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

const typographyClassName =
  "[font-family:Pretendard,'Noto_Sans_KR','Apple_SD_Gothic_Neo','Malgun_Gothic',sans-serif] antialiased";

const surfaceClassName =
  "rounded-[22px] border border-white/[0.08] bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]";

type EstimateHeaderProps = {
  carrier: string;
  productName: string;
};

function EstimateHeader({ carrier, productName }: EstimateHeaderProps) {
  return (
    <header className="flex min-h-[74px] items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-bold leading-5 tracking-[-0.01em] text-emerald-400">
          우선생 예상 견적
        </p>

        <h2 className="mt-1 truncate text-[26px] font-extrabold leading-tight tracking-[-0.045em] text-white">
          {carrier}
        </h2>

        <p className="mt-1 truncate text-[13px] font-medium leading-5 tracking-[-0.01em] text-slate-300">
          {productName}
        </p>
      </div>

      <div className="flex size-11 shrink-0 items-center justify-center rounded-[15px] border border-emerald-400/15 bg-emerald-400/10 text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <BadgeCheck size={21} strokeWidth={2.15} />
      </div>
    </header>
  );
}

type MonthlyPriceCardProps = {
  monthlyPrice: number;
};

function MonthlyPriceCard({ monthlyPrice }: MonthlyPriceCardProps) {
  return (
    <section className="mt-4 rounded-[24px] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.15] via-emerald-400/[0.09] to-emerald-400/[0.05] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_14px_34px_rgba(16,185,129,0.08)] sm:px-[18px]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-bold leading-5 text-emerald-200">
          현재 예상 월요금
        </p>
        <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-2.5 py-1 text-[11px] font-bold text-emerald-200">
          실시간 계산
        </span>
      </div>

      <div className="mt-2.5 flex min-w-0 items-end gap-1.5">
        <strong className="min-w-0 truncate tabular-nums text-[40px] font-extrabold leading-none tracking-[-0.065em] text-emerald-400 sm:text-[42px]">
          {formatPrice(monthlyPrice)}
        </strong>
        <span className="pb-1 text-base font-extrabold text-emerald-400">원</span>
      </div>

      <p className="mt-2.5 text-xs font-medium leading-[1.65] tracking-[-0.01em] text-emerald-50/75">
        선택한 상품과 할인 조건을 기준으로 계산된 예상 금액입니다.
      </p>
    </section>
  );
}

type ProductRowProps = {
  icon: LucideIcon;
  title: string;
  detail: string;
  price: number;
};

function ProductRow({ icon: Icon, title, detail, price }: ProductRowProps) {
  return (
    <div className="grid min-h-[64px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3.5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-emerald-400/[0.09] text-emerald-400">
          <Icon size={17} strokeWidth={2.1} />
        </span>

        <div className="min-w-0">
          <p className="text-[14px] font-bold leading-5 text-white">{title}</p>
          <p className="mt-0.5 truncate text-xs font-medium leading-5 tracking-[-0.01em] text-slate-400">
            {detail}
          </p>
        </div>
      </div>

      <p className="shrink-0 tabular-nums text-[14px] font-extrabold tracking-[-0.025em] text-white">
        {formatPrice(price)}원
      </p>
    </div>
  );
}

type ProductSummaryCardProps = {
  internetDetail: string;
  internetPrice: number;
  tvDetail: string;
  tvPrice: number;
  monthlyBasePrice: number;
};

function ProductSummaryCard({
  internetDetail,
  internetPrice,
  tvDetail,
  tvPrice,
  monthlyBasePrice,
}: ProductSummaryCardProps) {
  return (
    <section className={`mt-3.5 ${surfaceClassName}`}>
      <ProductRow
        icon={Wifi}
        title="인터넷"
        detail={internetDetail}
        price={internetPrice}
      />

      <div className="mx-3.5 h-px bg-white/[0.07]" />

      <ProductRow icon={Tv} title="TV" detail={tvDetail} price={tvPrice} />

      <div className="mx-3.5 h-px bg-white/[0.07]" />

      <div className="flex min-h-[48px] items-center justify-between gap-4 px-3.5 py-3">
        <span className="text-[13px] font-semibold leading-5 text-slate-300">
          월 기본요금
        </span>
        <span className="tabular-nums text-[14px] font-extrabold tracking-[-0.025em] text-white">
          {formatPrice(monthlyBasePrice)}원
        </span>
      </div>
    </section>
  );
}

type DiscountOptionProps = {
  title: string;
  description: string;
  amount: number;
  enabled: boolean;
  onToggle: () => void;
  icon: ReactNode;
};

function DiscountOption({
  title,
  description,
  amount,
  enabled,
  onToggle,
  icon,
}: DiscountOptionProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${title} ${enabled ? "적용 해제" : "적용"}`}
      onClick={onToggle}
      className={[
        "group grid min-h-[64px] w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] border px-3.5 py-3 text-left outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        enabled
          ? "border-emerald-400/30 bg-emerald-400/[0.09]"
          : "border-white/[0.08] bg-white/[0.035] hover:border-white/[0.13] hover:bg-white/[0.055]",
      ].join(" ")}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={[
            "flex size-9 shrink-0 items-center justify-center rounded-[12px] transition",
            enabled
              ? "bg-emerald-400/15 text-emerald-400"
              : "bg-white/[0.055] text-slate-400 group-hover:text-slate-300",
          ].join(" ")}
        >
          {icon}
        </span>

        <span className="min-w-0">
          <span
            className={[
              "block truncate text-[14px] font-bold leading-5",
              enabled ? "text-white" : "text-slate-300",
            ].join(" ")}
          >
            {title}
          </span>
          <span className="mt-0.5 block truncate text-xs font-medium leading-5 tracking-[-0.01em] text-slate-400">
            {description}
          </span>
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span
          className={[
            "block tabular-nums text-[14px] font-extrabold tracking-[-0.025em]",
            enabled ? "text-emerald-400" : "text-slate-400",
          ].join(" ")}
        >
          -{formatPrice(amount)}원
        </span>

        <span
          className={[
            "mt-1.5 inline-flex h-6 min-w-[54px] items-center justify-center gap-1 rounded-full px-2.5 text-[11px] font-bold transition",
            enabled
              ? "bg-emerald-500 text-white"
              : "bg-white/[0.07] text-slate-400",
          ].join(" ")}
        >
          {enabled && <Check size={11} strokeWidth={3} />}
          {enabled ? "적용" : "미적용"}
        </span>
      </span>
    </button>
  );
}

type DiscountSectionProps = {
  mobileDiscount: number;
  cardDiscount: number;
  useMobileDiscount: boolean;
  useCardDiscount: boolean;
  toggleMobileDiscount: () => void;
  toggleCardDiscount: () => void;
};

function DiscountSection({
  mobileDiscount,
  cardDiscount,
  useMobileDiscount,
  useCardDiscount,
  toggleMobileDiscount,
  toggleCardDiscount,
}: DiscountSectionProps) {
  return (
    <section className="mt-3.5">
      <div className="flex min-h-5 items-center justify-between gap-3">
        <h3 className="text-[14px] font-extrabold leading-5 text-white">
          할인 적용
        </h3>
        <p className="text-xs font-medium leading-5 text-slate-400">
          원하는 할인만 선택
        </p>
      </div>

      <div className="mt-2.5 space-y-2.5">
        <DiscountOption
          title="휴대폰 결합 할인"
          description="휴대폰 1회선 결합 기준"
          amount={mobileDiscount}
          enabled={useMobileDiscount}
          onToggle={toggleMobileDiscount}
          icon={<Smartphone size={17} strokeWidth={2.1} />}
        />

        <DiscountOption
          title="카드 할인"
          description="제휴카드 최대 할인 기준"
          amount={cardDiscount}
          enabled={useCardDiscount}
          onToggle={toggleCardDiscount}
          icon={<CreditCard size={17} strokeWidth={2.1} />}
        />
      </div>
    </section>
  );
}

type RewardCardProps = {
  rewardAmount: number;
};

function RewardCard({ rewardAmount }: RewardCardProps) {
  return (
    <section className="mt-3.5 rounded-[20px] border border-amber-300/15 bg-amber-300/[0.065] px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[13px] bg-amber-300/10 text-amber-300">
          <Gift size={18} strokeWidth={2.1} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold leading-5 text-amber-300">
            예상 사은품
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="truncate tabular-nums text-[19px] font-extrabold leading-6 tracking-[-0.04em] text-white">
              {rewardAmount > 0
                ? `${formatPrice(rewardAmount)}원`
                : "상담 시 최대 혜택"}
            </p>

            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white">
              + 추가 혜택
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

type EstimateActionsProps = {
  applyUrl: string;
  onConsultationOpen: () => void;
};

function EstimateActions({
  applyUrl,
  onConsultationOpen,
}: EstimateActionsProps) {
  return (
    <div className="mt-auto space-y-2.5 pt-4">
      <button
        type="button"
        onClick={onConsultationOpen}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-emerald-500 px-4 text-[14px] font-extrabold text-white shadow-[0_12px_30px_rgba(16,185,129,0.23)] outline-none transition duration-200 hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99]"
      >
        <PhoneCall size={17} strokeWidth={2.2} />
        상담원 연결
      </button>

      <a
        href={applyUrl}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border border-white/[0.11] bg-white/[0.055] px-4 text-[14px] font-extrabold text-white outline-none transition duration-200 hover:border-emerald-400/30 hover:bg-emerald-400/[0.08] hover:text-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99]"
      >
        <FilePenLine size={17} strokeWidth={2.2} />
        간편 가입 신청
      </a>
    </div>
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
    const applyParams = new URLSearchParams({
      code: receiptCode,
      product: productSummary,
      base: String(monthlyBasePrice),
      mobileDiscount: String(mobileDiscount),
      cardDiscount: String(cardDiscount),
      mobile: useMobileDiscount ? "1" : "0",
      card: useCardDiscount ? "1" : "0",
    });

    return `/internet/apply?${applyParams.toString()}`;
  }, [
    receiptCode,
    productSummary,
    monthlyBasePrice,
    mobileDiscount,
    cardDiscount,
    useMobileDiscount,
    useCardDiscount,
  ]);

  const headerProductName = internetPlan
    ? `${internetPlan.speed} ${internetPlan.name}${
        tvPlan ? ` + ${tvPlan.name} TV` : ""
      }`
    : "인터넷 선택 전";

  const internetDetail = internetPlan
    ? `${internetPlan.speed} · ${internetPlan.name}`
    : "선택 전";

  const tvDetail = tvPlan
    ? `${tvPlan.name} · ${tvPlan.channels}채널`
    : "선택하지 않음";

  return (
    <>
      <aside className={`h-full min-h-0 ${typographyClassName}`}>
        <div className="flex h-full min-h-[760px] flex-col overflow-hidden rounded-[30px] border border-white/[0.06] bg-slate-950 text-white shadow-[0_28px_80px_rgba(15,23,42,0.24)] xl:min-h-0">
          <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
            <EstimateHeader carrier={carrier} productName={headerProductName} />

            <MonthlyPriceCard monthlyPrice={estimatedMonthlyPrice} />

            <ProductSummaryCard
              internetDetail={internetDetail}
              internetPrice={internetPrice}
              tvDetail={tvDetail}
              tvPrice={tvPrice}
              monthlyBasePrice={monthlyBasePrice}
            />

            <DiscountSection
              mobileDiscount={mobileDiscount}
              cardDiscount={cardDiscount}
              useMobileDiscount={useMobileDiscount}
              useCardDiscount={useCardDiscount}
              toggleMobileDiscount={toggleMobileDiscount}
              toggleCardDiscount={toggleCardDiscount}
            />

            <RewardCard rewardAmount={rewardAmount} />

            <EstimateActions
              applyUrl={applyUrl}
              onConsultationOpen={() => setConsultationOpen(true)}
            />
          </div>

          <footer className="border-t border-white/[0.07] bg-white/[0.025] px-4 py-3">
            <p className="text-center text-xs font-medium leading-5 tracking-[-0.01em] text-slate-400">
              결합 할인과 최종 조건은 상담 시 정확하게 확인됩니다.
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
