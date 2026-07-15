"use client";

import Image from "next/image";
import { Check } from "lucide-react";

import {
  carrierOrder,
  internetData,
  type Carrier,
} from "@/lib/internet/data";

type CarrierTabsProps = {
  selected: Carrier;
  onChange: (carrier: Carrier) => void;
};

export default function CarrierTabs({
  selected,
  onChange,
}: CarrierTabsProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-center">
      <div>
        <p className="text-sm font-bold text-emerald-600">
          STEP 1
        </p>

        <h2 className="mt-2 break-keep text-2xl font-black tracking-[-0.035em] text-slate-950">
          통신사를 선택해 주세요
        </h2>

        <p className="mt-3 break-keep text-sm leading-6 text-slate-500">
          가입을 원하는 통신사를 선택해주세요.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {carrierOrder.map((carrierId) => {
          const carrier = internetData[carrierId];
          const active = selected === carrierId;

          return (
            <button
              key={carrierId}
              type="button"
              onClick={() => onChange(carrierId)}
              aria-pressed={active}
              className={[
                "group relative flex min-h-[138px] flex-col items-center justify-center rounded-2xl border px-3 py-4",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                active
                  ? "border-emerald-500 bg-emerald-50/60 shadow-[0_8px_24px_rgba(16,185,129,0.10)]"
                  : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/20",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute right-2.5 top-2.5 flex size-6 items-center justify-center rounded-full border transition-all",
                  active
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 bg-white text-transparent group-hover:border-emerald-400",
                ].join(" ")}
                aria-hidden="true"
              >
                <Check size={14} strokeWidth={3} />
              </span>

              <div className="flex h-14 w-full items-center justify-center">
                <Image
                  src={carrier.logo}
                  alt={`${carrier.label} 로고`}
                  width={240}
                  height={120}
                  className="h-[52px] w-[132px] object-contain"
                  priority={carrierId === "KT"}
                />
              </div>

              <span
                className={[
                  "mt-3 break-keep text-center text-sm font-black",
                  active
                    ? "text-emerald-700"
                    : "text-slate-950",
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