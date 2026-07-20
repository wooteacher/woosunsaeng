"use client";

import CarrierPriceTable from "@/components/internet/CarrierPriceTable";
import CarrierTabs from "@/components/internet/CarrierTabs";
import FinalEstimate from "@/components/internet/FinalEstimate";
import InternetBannerSlider from "@/components/internet/InternetBannerSlider";
import InternetSpeedSelector from "@/components/internet/InternetSpeedSelector";
import MobileEstimateDock from "@/components/internet/MobileEstimateDock";
import TvPlanSelector from "@/components/internet/TvPlanSelector";
import { useCalculator } from "@/contexts/CalculatorContext";

export default function InternetCalculator() {
  const { carrier, selectCarrier } = useCalculator();

  return (
    <section
      id="internet-calculator"
      className="bg-slate-50 py-3 pb-[190px] sm:py-5 sm:pb-[190px] lg:py-6 xl:pb-6"
    >
      <div className="mx-auto w-full max-w-[1344px] px-3 sm:px-6 lg:px-8">
        <InternetBannerSlider />

        <div className="mt-2.5 grid items-stretch gap-2.5 sm:mt-4 sm:gap-4 xl:grid-cols-[minmax(0,1fr)_350px]">
          <div className="flex min-w-0 flex-col gap-2.5 sm:gap-5 lg:gap-6">
            <div
              id="internet-selection"
              className="scroll-mt-24 overflow-hidden rounded-[20px] border border-slate-200 bg-white px-3.5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:rounded-[28px] sm:px-7 sm:py-6 lg:px-7 lg:py-7"
            >
              <CarrierTabs selected={carrier} onChange={selectCarrier} />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white px-3.5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:rounded-[28px] sm:px-7 sm:py-6 lg:px-7 lg:py-7">
              <InternetSpeedSelector />

              <div className="my-4 h-px bg-slate-200 sm:my-7" />

              <TvPlanSelector />
            </div>
          </div>

          <div className="hidden min-w-0 xl:sticky xl:top-[84px] xl:block xl:h-full xl:self-stretch">
            <FinalEstimate />
          </div>
        </div>

        <CarrierPriceTable />
      </div>

      <MobileEstimateDock />
    </section>
  );
}
