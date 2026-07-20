"use client";

import Image from "next/image";
import { Check } from "lucide-react";

import MobileHorizontalRail from "@/components/internet/MobileHorizontalRail";
import { useCalculator } from "@/contexts/CalculatorContext";
import type { Carrier } from "@/lib/internet/data";

type CarrierTabsProps = {
  selected: Carrier;
  onChange: (carrier: Carrier) => void;
};

export default function CarrierTabs({ selected, onChange }: CarrierTabsProps) {
  const { carrierOrder, internetData } = useCalculator();

  return (
    <section className="grid gap-2.5 xl:grid-cols-[180px_minmax(0,1fr)] xl:items-center xl:gap-5">
      <div className="flex items-start gap-2.5 xl:block">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-black text-white xl:hidden">
          1
        </span>
        <div>
          <h2 className="break-keep text-[18px] font-black tracking-[-0.04em] text-slate-950 sm:text-[22px]">
            통신사 선택
          </h2>
          <p className="mt-0.5 break-keep text-[12px] leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
            통신사를 선택해주세요.
          </p>
        </div>
      </div>

      <MobileHorizontalRail
        ariaLabel="통신사"
        scrollClassName="flex snap-x snap-mandatory gap-2 overflow-x-auto px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:py-0 xl:grid-cols-6"
      >
        {carrierOrder.map((carrierId) => {
          const carrier = internetData[carrierId];
          if (!carrier) return null;

          const active = selected === carrierId;
          const displayLabel = carrierId === "SKB" ? "SKB" : carrier.label;

          return (
            <button
              key={carrierId}
              data-rail-item
              type="button"
              onClick={() => onChange(carrierId)}
              aria-pressed={active}
              style={{ flexBasis: "calc((100% - 16px) / 2.45)" }}
              className={[
                "group relative flex min-h-[80px] min-w-0 shrink-0 snap-start flex-col items-center justify-center rounded-xl border px-1.5 py-1.5",
                "transition-all duration-200 sm:min-h-[116px] sm:w-auto sm:rounded-2xl sm:px-3 sm:py-3",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                active
                  ? "border-emerald-500 bg-emerald-50/80 shadow-[0_8px_24px_rgba(16,185,129,0.10)]"
                  : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "absolute right-1 top-1 z-10 flex size-[17px] items-center justify-center rounded-full border transition-all sm:right-2.5 sm:top-2.5 sm:size-5",
                  active
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 bg-white text-transparent group-hover:border-emerald-400",
                ].join(" ")}
              >
                <Check size={10} strokeWidth={3} />
              </span>

              <div className="flex h-9 w-full items-center justify-center overflow-hidden px-1 sm:h-12 sm:px-2">
                <Image
                  src={carrier.logo}
                  alt={`${displayLabel} 로고`}
                  width={240}
                  height={120}
                  sizes="(max-width: 639px) 82px, 126px"
                  draggable={false}
                  unoptimized
                  className="h-7 w-full max-w-[82px] select-none object-contain object-center sm:h-[46px] sm:max-w-[126px]"
                  priority={carrierId === carrierOrder[0]}
                />
              </div>

              <span
                className={[
                  "mt-0.5 break-keep text-center text-[10px] font-black leading-4 sm:mt-2 sm:text-[13px]",
                  active ? "text-emerald-700" : "text-slate-900",
                ].join(" ")}
              >
                {displayLabel}
              </span>
            </button>
          );
        })}
      </MobileHorizontalRail>
    </section>
  );
}
