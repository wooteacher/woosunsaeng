"use client";

import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  Gift,
  Phone,
  Smartphone,
  Tv,
  Wifi,
} from "lucide-react";

import { useCalculator } from "@/contexts/CalculatorContext";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

export default function FinalEstimate() {
  const {
    carrier,
    internetPlan,
    tvPlan,
    monthlyBasePrice,
    mobileDiscount,
    cardDiscount,
    estimatedMonthlyPrice,
    reward,
  } = useCalculator();

  const internetPrice = internetPlan?.monthlyPrice ?? 0;
  const tvPrice = tvPlan?.monthlyPrice ?? 0;
  const rewardAmount = reward?.amount ?? 0;

  return (
    <aside className="h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-emerald-400">
                우선생 예상 견적
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">
                {carrier}
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                {internetPlan
                  ? `${internetPlan.speed} ${internetPlan.name}`
                  : "인터넷 선택 전"}

                {tvPlan ? ` + ${tvPlan.name} TV` : ""}
              </p>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <BadgeCheck size={22} strokeWidth={2.3} />
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-emerald-500/10 p-4 ring-1 ring-inset ring-emerald-400/20">
            <p className="text-xs font-bold text-emerald-300">
              최대 혜택 적용 예상 월요금
            </p>

            <div className="mt-2 flex items-end gap-1">
              <strong className="text-[42px] font-black leading-none tracking-[-0.055em] text-emerald-400">
                {formatPrice(estimatedMonthlyPrice)}
              </strong>

              <span className="pb-1 text-lg font-bold text-emerald-400">
                원
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-emerald-100/60">
              휴대폰 결합 및 제휴카드 최대 할인 기준
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4">
            <div className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <Wifi
                  size={18}
                  className="shrink-0 text-emerald-400"
                />

                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    인터넷
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {internetPlan
                      ? `${internetPlan.speed} · ${internetPlan.name}`
                      : "선택 전"}
                  </p>
                </div>
              </div>

              <p className="shrink-0 text-sm font-black text-white">
                {formatPrice(internetPrice)}원
              </p>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <Tv
                  size={18}
                  className="shrink-0 text-emerald-400"
                />

                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    TV
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {tvPlan
                      ? `${tvPlan.name} · ${tvPlan.channels}채널`
                      : "선택하지 않음"}
                  </p>
                </div>
              </div>

              <p className="shrink-0 text-sm font-black text-white">
                {formatPrice(tvPrice)}원
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-slate-300">
                월 기본요금
              </span>

              <span className="text-sm font-black text-white">
                {formatPrice(monthlyBasePrice)}원
              </span>
            </div>

            <div className="my-3 h-px bg-white/10" />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                  <Smartphone
                    size={16}
                    className="text-emerald-400"
                  />
                  휴대폰 1회선 결합
                </span>

                <span className="text-sm font-black text-emerald-400">
                  - {formatPrice(mobileDiscount)}원
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                  <CreditCard
                    size={16}
                    className="text-emerald-400"
                  />
                  카드 최대 할인
                </span>

                <span className="text-sm font-black text-emerald-400">
                  - {formatPrice(cardDiscount)}원
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300">
                <Gift size={20} strokeWidth={2.2} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-amber-300">
                  예상 사은품
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-xl font-black text-white">
                    {rewardAmount > 0
                      ? `${formatPrice(rewardAmount)}원`
                      : "상담 시 최대 혜택"}
                  </p>

                  <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-black text-white">
                    + 추가 혜택
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-3.5">
            <p className="text-xs font-bold text-emerald-400">
              우선생 추천
            </p>

            <p className="mt-1 break-keep text-xs leading-5 text-slate-300">
              복잡한 결합 조건은 상담 시 가장 유리한 기준으로
              비교해드립니다.
            </p>
          </div>

          <div className="mt-auto space-y-3 pt-5">
            <Link
              href="#estimate"
              className="flex h-[52px] w-full items-center justify-center rounded-xl bg-emerald-500 px-4 text-sm font-black text-white transition duration-200 hover:bg-emerald-400 active:scale-[0.99]"
            >
              30초 상담 신청
            </Link>

            <a
  href="tel:0324228010"
  className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-emerald-400 bg-slate-900 px-4 text-sm font-black text-white shadow-[inset_0_0_0_1px_rgba(52,211,153,0.15)] transition duration-200 hover:bg-slate-800 hover:text-emerald-300 active:scale-[0.99]"
>
  <Phone
    size={18}
    strokeWidth={2.4}
    className="shrink-0 text-emerald-400"
  />

  <span className="text-white">
    전화 상담하기
  </span>
</a>

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-semibold text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400" />
              현재 상담 가능 · 평균 연결 3분
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.03] px-5 py-3.5 sm:px-6">
          <p className="break-keep text-center text-[11px] leading-5 text-slate-500">
            결합 할인과 설치 가능 여부는 상담 시 최종 확인됩니다.
          </p>
        </div>
      </div>
    </aside>
  );
}