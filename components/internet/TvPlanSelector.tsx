"use client";

import { Ban, Clapperboard, Film, MonitorPlay, Tv } from "lucide-react";

import MobileHorizontalRail from "@/components/internet/MobileHorizontalRail";
import SelectionCard from "@/components/internet/SelectionCard";
import { useCalculator } from "@/contexts/CalculatorContext";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

function getChannelCount(plan: unknown) {
  if (!plan || typeof plan !== "object") return null;

  const data = plan as Record<string, unknown>;
  const value = data.channelCount ?? data.channels ?? data.channel;

  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9]/g, ""));
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }

  const name = typeof data.name === "string" ? data.name.replace(/\s/g, "") : "";

  if (name.includes("디즈니+모든G")) return 250;
  if (name.includes("모든G")) return 250;
  if (name.includes("에센스")) return 260;
  if (name.includes("베이직")) return 235;
  if (name.includes("라이트")) return 240;

  return null;
}

function getPlanContent(name: string) {
  const normalizedName = name.replace(/\s/g, "");

  if (normalizedName.includes("디즈니+모든G")) {
    return {
      description: "디즈니+ 포함",
      infoLabel: "영화 · 애니 추천",
      icon: <Film size={17} strokeWidth={2.2} />,
    };
  }

  if (normalizedName.includes("모든G")) {
    return {
      description: "예능 · 드라마",
      infoLabel: "실시간 채널 중심",
      icon: <Clapperboard size={17} strokeWidth={2.2} />,
    };
  }

  if (normalizedName.includes("에센스")) {
    return {
      description: "영화 · 스포츠",
      infoLabel: "프리미엄 구성",
      icon: <MonitorPlay size={17} strokeWidth={2.2} />,
    };
  }

  if (normalizedName.includes("베이직")) {
    return {
      description: "온 가족 채널",
      infoLabel: "가장 많이 선택",
      icon: <Tv size={17} strokeWidth={2.2} />,
    };
  }

  if (normalizedName.includes("라이트")) {
    return {
      description: "인기 채널 중심",
      infoLabel: "가볍게 이용",
      icon: <Tv size={17} strokeWidth={2.2} />,
    };
  }

  return {
    description: "다양한 채널",
    infoLabel: "취향에 맞게 선택",
    icon: <MonitorPlay size={17} strokeWidth={2.2} />,
  };
}

export default function TvPlanSelector() {
  const { carrier, carrierData, tvPlan, selectTvPlan, clearTvPlan } =
    useCalculator();

  return (
    <section className="grid gap-2.5 xl:grid-cols-[180px_minmax(0,1fr)] xl:items-start xl:gap-5">
      <div className="flex items-start gap-2.5 xl:block">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-black text-white xl:hidden">
          3
        </span>
        <div>
          <h2 className="break-keep text-[18px] font-black tracking-[-0.04em] text-slate-950 sm:text-[22px]">
            TV 채널
          </h2>
          <p className="mt-0.5 break-keep text-[12px] leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
            원하는 채널 구성을 선택해주세요.
          </p>
        </div>
      </div>

      <MobileHorizontalRail
        ariaLabel="TV 채널"
        resetKey={carrier}
        scrollClassName="flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:py-0"
      >
        <div
          data-rail-item
          style={{ flexBasis: "calc((100% - 8px) / 2.18)" }}
          className="min-w-0 shrink-0 snap-start sm:w-auto"
        >
          <SelectionCard
            title="선택 안함"
            subtitle="인터넷만"
            description="TV 없이 이용"
            infoLabel="인터넷 단독"
            priceLabel="월 0원"
            selected={!tvPlan}
            onClick={clearTvPlan}
            icon={<Ban size={17} strokeWidth={2.2} />}
            className="!h-[132px] !w-full sm:!h-[196px]"
          />
        </div>

        {carrierData.tvPlans.map((plan) => {
          const channelCount = getChannelCount(plan);
          const content = getPlanContent(plan.name);
          const normalizedName = plan.name.replace(/\s/g, "");
          const active = tvPlan?.id === plan.id;

          return (
            <div
              key={plan.id}
              data-rail-item
              style={{ flexBasis: "calc((100% - 8px) / 2.18)" }}
              className="min-w-0 shrink-0 snap-start sm:w-auto"
            >
              <SelectionCard
                title={plan.name}
                subtitle={channelCount ? `${channelCount}채널` : "채널 상품"}
                description={content.description}
                infoLabel={content.infoLabel}
                priceLabel={`월 ${formatPrice(plan.monthlyPrice)}원`}
                badge={normalizedName.includes("베이직") ? "추천" : undefined}
                selected={active}
                onClick={() => selectTvPlan(plan)}
                icon={content.icon}
                className="!h-[132px] !w-full sm:!h-[196px]"
              />
            </div>
          );
        })}
      </MobileHorizontalRail>
    </section>
  );
}
