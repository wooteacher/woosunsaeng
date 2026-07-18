"use client";

import CarrierTabs from "@/components/internet/CarrierTabs";
import FinalEstimate from "@/components/internet/FinalEstimate";
import InternetBannerSlider from "@/components/internet/InternetBannerSlider";
import InternetSpeedSelector from "@/components/internet/InternetSpeedSelector";
import TvPlanSelector from "@/components/internet/TvPlanSelector";
import { useCalculator } from "@/contexts/CalculatorContext";

export default function InternetCalculator() {
  const { carrier, selectCarrier } = useCalculator();

  return (
    <section id="internet-calculator" className="bg-slate-50 py-4 sm:py-5 lg:py-6">
      <div className="mx-auto w-full max-w-[1344px] px-4 sm:px-6 lg:px-8">
        <InternetBannerSlider />

        <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
          <div className="flex min-w-0 flex-col gap-6">
            <div
              id="internet-selection"
              className="scroll-mt-24 rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] sm:px-7 lg:px-7 lg:py-7"
            >
              <CarrierTabs selected={carrier} onChange={selectCarrier} />
            </div>

            <div className="flex flex-1 flex-col rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] sm:px-7 lg:px-7 lg:py-7">
              <InternetSpeedSelector />

              <div className="my-7 h-px bg-slate-200" />

              <TvPlanSelector />
            </div>
          </div>

          <div className="min-w-0 xl:sticky xl:top-[84px] xl:h-full xl:self-stretch">
            <FinalEstimate />
          </div>
        </div>
      </div>
    </section>
  );
}
