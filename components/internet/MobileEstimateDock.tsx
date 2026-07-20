"use client";

import {
  ChevronUp,
  FilePenLine,
  Gift,
  Headphones,
  ReceiptText,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ConsultationModal from "@/components/internet/ConsultationModal";
import FinalEstimate from "@/components/internet/FinalEstimate";
import { useCalculator } from "@/contexts/CalculatorContext";
import { createReceiptCode } from "@/lib/internet/receiptCode";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

export default function MobileEstimateDock() {
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
  } = useCalculator();
  const [open, setOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
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

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <div className="fixed inset-x-2 z-[70] rounded-[24px] border border-slate-200 bg-white/97 p-3 shadow-[0_-6px_36px_rgba(15,23,42,0.16)] backdrop-blur-xl xl:hidden [bottom:max(8px,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-slate-500">현재 예상 월요금</p>
              <div className="mt-1 flex min-w-0 items-end gap-1.5">
                <strong className="truncate tabular-nums text-[23px] font-black leading-none tracking-[-0.05em] text-slate-950">
                  {formatPrice(estimatedMonthlyPrice)}원
                </strong>
                {rewardAmount > 0 ? (
                  <span className="mb-0.5 flex shrink-0 items-center gap-1 text-[9px] font-bold text-amber-600">
                    <Gift size={11} />
                    혜택 {formatPrice(rewardAmount)}원
                  </span>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-slate-100 px-4 text-[12px] font-black text-slate-800 active:scale-[0.98]"
            >
              <ReceiptText size={15} strokeWidth={2.3} />
              최종견적
              <ChevronUp size={15} strokeWidth={2.5} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-slate-200 pt-3">
            <a
              href={applyUrl}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 font-sans text-[13px] font-bold leading-none tracking-[-0.01em] text-slate-900 transition active:scale-[0.98]"
            >
              <FilePenLine size={17} strokeWidth={2.3} />
              가입 신청
            </a>
            <button
              type="button"
              onClick={() => setConsultationOpen(true)}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 font-sans text-[13px] font-bold leading-none tracking-[-0.01em] text-white shadow-[0_8px_20px_rgba(5,150,105,0.22)] transition active:scale-[0.98]"
            >
              <Headphones size={17} strokeWidth={2.3} />
              상담 연결
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[90] xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="최종 견적"
        >
          <button
            type="button"
            aria-label="최종 견적 닫기"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          <section className="absolute inset-x-2 bottom-2 max-h-[91dvh] overflow-hidden rounded-[28px] bg-slate-950 shadow-[0_-24px_70px_rgba(15,23,42,0.35)] [padding-bottom:env(safe-area-inset-bottom)]">
            <header className="flex h-14 items-center justify-between border-b border-white/[0.08] px-4 text-white">
              <div>
                <p className="text-[10px] font-bold text-emerald-400">선택한 상품</p>
                <h2 className="mt-0.5 text-[16px] font-black">최종견적 확인</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-9 items-center justify-center rounded-full bg-white/[0.08] text-white"
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </header>

            <div className="max-h-[calc(91dvh-56px)] overflow-y-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <FinalEstimate />
            </div>
          </section>
        </div>
      ) : null}

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
