"use client";

import Image from "next/image";
import { Check } from "lucide-react";

import { useCalculator } from "@/contexts/CalculatorContext";
import type { Carrier } from "@/lib/internet/data";

type CarrierTabsProps = {
  selected: Carrier;
  onChange: (carrier: Carrier) => void;
};

export default function CarrierTabs({ selected, onChange }: CarrierTabsProps) {
  const { carrierOrder, internetData } = useCalculator();

  return (
    <section className="grid gap-5 xl:grid-cols-[180px_minmax(0,1fr)] xl:items-center">
      <div>
        <h2 className="break-keep text-[22px] font-black tracking-[-0.04em] text-slate-950">
          통신사 선택
        </h2>

        <p className="mt-2 break-keep text-sm leading-6 text-slate-500">
          원하는 통신사를 선택해주세요.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
        {carrierOrder.map((carrierId) => {
          const carrier = internetData[carrierId];
          if (!carrier) return null;

          const active = selected === carrierId;

          return (
            <button
              key={carrierId}
              type="button"
              onClick={() => onChange(carrierId)}
              aria-pressed={active}
              className={[
                "group relative flex min-h-[116px] flex-col items-center justify-center rounded-2xl border px-3 py-3",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                active
                  ? "border-emerald-500 bg-emerald-50/70 shadow-[0_8px_24px_rgba(16,185,129,0.10)]"
                  : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full border transition-all",
                  active
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 bg-white text-transparent group-hover:border-emerald-400",
                ].join(" ")}
              >
                <Check size={12} strokeWidth={3} />
              </span>

              <div className="flex h-12 w-full items-center justify-center">
                <Image
                  src={carrier.logo}
                  alt={`${carrier.label} 로고`}
                  width={240}
                  height={120}
                  className="h-[46px] w-[126px] object-contain"
                  priority={carrierId === carrierOrder[0]}
                />
              </div>

              <span
                className={[
                  "mt-2 break-keep text-center text-[13px] font-black",
                  active ? "text-emerald-700" : "text-slate-900",
                ].join(" ")}
              >
                {carrier.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
