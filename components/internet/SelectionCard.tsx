"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";

type SelectionCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  infoLabel?: string;
  priceLabel?: string;
  badge?: string;
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export default function SelectionCard({
  title,
  subtitle,
  description,
  infoLabel,
  priceLabel,
  badge,
  selected,
  onClick,
  icon,
  disabled = false,
  className = "",
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        "group relative flex h-full w-full flex-col overflow-hidden rounded-xl border p-2.5 text-left sm:rounded-2xl sm:p-4",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        selected
          ? "border-emerald-500 bg-emerald-50/60 shadow-[0_8px_24px_rgba(16,185,129,0.10)]"
          : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/20",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer active:scale-[0.99]",
        className,
      ].join(" ")}
    >
      {badge ? (
        <span className="pointer-events-none absolute right-8 top-2 z-10 inline-flex h-[18px] items-center rounded-full bg-emerald-600 px-2 text-[9px] font-black leading-none text-white shadow-sm sm:right-12 sm:top-3 sm:h-5 sm:px-2.5 sm:text-[10px]">
          {badge}
        </span>
      ) : null}

      <div className="flex items-start justify-between gap-2">
        {icon ? (
          <div
            className={[
              "flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors sm:size-9 sm:rounded-xl",
              selected
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700",
            ].join(" ")}
          >
            {icon}
          </div>
        ) : null}

        <span
          className={[
            "flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-all sm:size-6",
            selected
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-slate-300 bg-white text-transparent group-hover:border-emerald-400",
          ].join(" ")}
          aria-hidden="true"
        >
          <Check size={12} strokeWidth={3} />
        </span>
      </div>

      <div className="mt-1.5 min-w-0 sm:mt-3">
        <p
          className={[
            "line-clamp-2 min-h-[36px] break-keep text-[15px] font-black leading-[1.2] tracking-[-0.035em] sm:min-h-[45px] sm:text-[18px] sm:leading-[1.25]",
            selected ? "text-emerald-950" : "text-slate-950",
          ].join(" ")}
        >
          {title}
        </p>

        {subtitle ? (
          <p className="mt-0.5 break-keep text-[11px] font-bold leading-4 text-slate-500 sm:mt-1 sm:text-[12px] sm:leading-5">
            {subtitle}
          </p>
        ) : null}

        {description ? (
          <p className="mt-1 hidden break-keep text-[11px] font-semibold leading-4 text-slate-700 sm:mt-2 sm:block sm:text-[12px] sm:leading-5">
            {description}
          </p>
        ) : null}

        {infoLabel ? (
          <p className="mt-0.5 hidden break-keep text-[10px] font-bold leading-4 text-emerald-600 sm:mt-1 sm:block sm:text-[11px] sm:leading-[18px]">
            {infoLabel}
          </p>
        ) : null}
      </div>

      {priceLabel ? (
        <div className="mt-auto border-t border-slate-200/80 pt-1.5 sm:pt-3">
          <p
            className={[
              "whitespace-nowrap text-[11px] font-black tracking-[-0.02em] sm:text-[12px]",
              selected ? "text-emerald-800" : "text-slate-900",
            ].join(" ")}
          >
            {priceLabel}
          </p>
        </div>
      ) : null}
    </button>
  );
}
