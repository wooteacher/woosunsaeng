"use client";

import CarrierTabs from "@/components/internet/CarrierTabs";
import FinalEstimate from "@/components/internet/FinalEstimate";
import InternetSpeedSelector from "@/components/internet/InternetSpeedSelector";
import TvPlanSelector from "@/components/internet/TvPlanSelector";
import { useCalculator } from "@/contexts/CalculatorContext";

export default function InternetCalculator() {
  const { carrier, selectCarrier } = useCalculator();

  return (
    <section
      id="internet-calculator"
      className="bg-slate-50 py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold text-emerald-600">
            인터넷 간편 견적
          </p>

          <h1 className="mt-3 break-keep text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[42px] lg:leading-[1.2]">
            내 조건에 맞는 요금 3초만에 확인하세요.
          </h1>

          <p className="mt-4 break-keep text-sm leading-7 text-slate-500 sm:text-base">
            통신사와 인터넷 속도, TV 상품을 순서대로 선택해주세요.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* 왼쪽: STEP 1 ~ STEP 3 */}
          <div className="flex min-w-0 flex-col gap-6">
            {/* STEP 1 */}
            <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] sm:px-7 lg:px-8 lg:py-7">
              <CarrierTabs
                selected={carrier}
                onChange={selectCarrier}
              />
            </div>

            {/* STEP 2 + STEP 3 */}
            <div className="flex flex-1 flex-col rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] sm:px-7 lg:px-8 lg:py-7">
              <InternetSpeedSelector />

              <div className="my-7 h-px bg-slate-200" />

              <TvPlanSelector />
            </div>
          </div>

          {/* 오른쪽: STEP 1 ~ STEP 3 전체 높이 */}
          <div className="h-full min-w-0">
            <FinalEstimate />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <p className="break-keep text-center text-xs leading-6 text-slate-500 sm:text-sm">
            표시된 금액은 선택 조건에 따른 예상 견적이며, 설치 지역과
            결합 조건에 따라 실제 금액이 달라질 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}