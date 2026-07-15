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
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border p-4 text-left",
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
        <span className="absolute left-3 top-0 rounded-b-lg bg-emerald-600 px-2.5 py-1.5 text-[10px] font-black leading-none text-white">
          {badge}
        </span>
      ) : null}

      <div
        className={[
          "flex items-start justify-between gap-2",
          badge ? "pt-3" : "",
        ].join(" ")}
      >
        {icon ? (
          <div
            className={[
              "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
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
            "flex size-6 shrink-0 items-center justify-center rounded-full border transition-all",
            selected
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-slate-300 bg-white text-transparent group-hover:border-emerald-400",
          ].join(" ")}
          aria-hidden="true"
        >
          <Check size={13} strokeWidth={3} />
        </span>
      </div>

      <div className="mt-3 min-w-0">
        <p
          className={[
            "break-keep text-[18px] font-black leading-[1.25] tracking-[-0.035em]",
            selected
              ? "text-emerald-950"
              : "text-slate-950",
          ].join(" ")}
        >
          {title}
        </p>

        {subtitle ? (
          <p className="mt-1 break-keep text-[12px] font-bold leading-5 text-slate-500">
            {subtitle}
          </p>
        ) : null}

        {description ? (
          <p className="mt-2 break-keep text-[12px] font-semibold leading-5 text-slate-700">
            {description}
          </p>
        ) : null}

        {infoLabel ? (
          <p className="mt-1 break-keep text-[11px] font-bold leading-[18px] text-emerald-600">
            {infoLabel}
          </p>
        ) : null}
      </div>

      {priceLabel ? (
        <div className="mt-auto border-t border-slate-200/80 pt-3">
          <p
            className={[
              "whitespace-nowrap text-[12px] font-black tracking-[-0.02em]",
              selected
                ? "text-emerald-800"
                : "text-slate-900",
            ].join(" ")}
          >
            {priceLabel}
          </p>
        </div>
      ) : null}
    </button>
  );
}