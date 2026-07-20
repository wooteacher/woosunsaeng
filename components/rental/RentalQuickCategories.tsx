"use client";

import {
  AirVent,
  Armchair,
  CookingPot,
  Droplets,
  Grid2X2,
  PackageOpen,
  Refrigerator,
  Snowflake,
  Sparkles,
  Tv,
  WashingMachine,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useState, type SyntheticEvent } from "react";

import type { RentalCategory } from "@/data/rental/products";

type QuickCategory = {
  category: RentalCategory;
  label: string;
  image: string;
  icon: LucideIcon;
};

const quickCategories: QuickCategory[] = [
  {
    category: "정수기",
    label: "정수기",
    image: "/rental/quick/water-purifier.webp",
    icon: Droplets,
  },
  {
    category: "공기청정기",
    label: "공기청정기",
    image: "/rental/quick/air-purifier.webp",
    icon: AirVent,
  },
  {
    category: "비데",
    label: "비데",
    image: "/rental/quick/bidet.webp",
    icon: Sparkles,
  },
  {
    category: "안마의자",
    label: "안마의자",
    image: "/rental/quick/massage-chair.webp",
    icon: Armchair,
  },
  {
    category: "세탁·건조",
    label: "세탁·건조",
    image: "/rental/quick/laundry.webp",
    icon: WashingMachine,
  },
  {
    category: "주방가전",
    label: "식기세척기",
    image: "/rental/quick/kitchen.webp",
    icon: CookingPot,
  },
  {
    category: "생활가전",
    label: "펫제품",
    image: "/rental/quick/living.webp",
    icon: PackageOpen,
  },
  {
    category: "TV",
    label: "TV",
    image: "/rental/quick/tv.webp",
    icon: Tv,
  },
  {
    category: "냉장고",
    label: "냉장고",
    image: "/rental/quick/refrigerator.webp",
    icon: Refrigerator,
  },
  {
    category: "에어컨",
    label: "에어컨",
    image: "/rental/quick/air-conditioner.webp",
    icon: Wind,
  },
  {
    category: "냉동고",
    label: "냉동고",
    image: "/rental/quick/freezer.webp",
    icon: Snowflake,
  },
  {
    category: "전체",
    label: "전체보기",
    image: "/rental/quick/all.webp",
    icon: Grid2X2,
  },
];

function CategoryImage({ item }: { item: QuickCategory }) {
  const [failed, setFailed] = useState(false);
  const Icon = item.icon;

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.style.display = "none";
    setFailed(true);
  }

  if (failed) {
    return (
      <span className="flex size-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm sm:size-14">
        <Icon size={29} strokeWidth={1.8} />
      </span>
    );
  }

  return (
    <img
      src={item.image}
      alt={`${item.label} 제품`}
      loading="eager"
      decoding="async"
      onError={handleError}
      className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.025]"
    />
  );
}

export default function RentalQuickCategories({
  selected,
  onSelect,
}: {
  selected: RentalCategory;
  onSelect: (category: RentalCategory) => void;
}) {
  return (
    <section className="mt-4 rounded-[24px] border border-slate-200 bg-white px-4 py-5 shadow-[0_14px_42px_rgba(15,23,42,0.045)] sm:px-5 sm:py-6">
      <p className="break-keep text-[17px] font-extrabold tracking-[-0.035em] text-slate-950 sm:text-[20px]">
        원하는 제품을 선택하면 상품을 알려드립니다.
      </p>

      <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-5 md:grid-cols-6 xl:grid-cols-12">
        {quickCategories.map((item) => {
          const active = selected === item.category;

          return (
            <button
              key={item.category}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(item.category)}
              className="group min-w-0 text-center focus-visible:outline-none"
            >
              <span
                className={[
                  "relative mx-auto flex aspect-square w-full max-w-[88px] items-center justify-center overflow-hidden rounded-[14px] border transition sm:max-w-[104px] sm:rounded-[16px]",
                  active
                    ? "border-emerald-500 bg-emerald-50 shadow-[0_8px_24px_rgba(16,185,129,0.14)] ring-2 ring-emerald-100"
                    : "border-slate-200 bg-slate-50 group-hover:border-emerald-300 group-hover:bg-emerald-50/50",
                ].join(" ")}
              >
                <CategoryImage item={item} />
              </span>

              <span
                className={[
                  "mt-2 block truncate text-[12px] font-extrabold tracking-[-0.02em] sm:text-[13px]",
                  active ? "text-emerald-700" : "text-slate-800",
                ].join(" ")}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
