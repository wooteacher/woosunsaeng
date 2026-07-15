"use client";

import {
  Ban,
  Clapperboard,
  Film,
  MonitorPlay,
  Tv,
} from "lucide-react";

import SelectionCard from "@/components/internet/SelectionCard";
import { useCalculator } from "@/contexts/CalculatorContext";

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

function getChannelCount(plan: unknown) {
  if (!plan || typeof plan !== "object") {
    return null;
  }

  const data = plan as Record<string, unknown>;

  const value =
    data.channelCount ??
    data.channels ??
    data.channel;

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9]/g, ""));

    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  const name =
    typeof data.name === "string"
      ? data.name.replace(/\s/g, "")
      : "";

  if (name.includes("디즈니+모든G")) {
    return 250;
  }

  if (name.includes("모든G")) {
    return 250;
  }

  if (name.includes("에센스")) {
    return 260;
  }

  if (name.includes("베이직")) {
    return 235;
  }

  if (name.includes("라이트")) {
    return 240;
  }

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
  const {
    carrierData,
    tvPlan,
    selectTvPlan,
    clearTvPlan,
  } = useCalculator();

  return (
    <section className="grid gap-5 xl:grid-cols-[165px_minmax(0,1fr)] xl:items-start">
      <div>
        <p className="text-sm font-bold text-emerald-600">
          STEP 3
        </p>

        <h2 className="mt-2 break-keep text-2xl font-black tracking-[-0.035em] text-slate-950">
          TV 채널 선택
        </h2>

        <p className="mt-3 break-keep text-sm leading-6 text-slate-500">
          원하는 채널 구성을 선택해주세요.
        </p>
      </div>

      <div
        className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-flow-col xl:grid-rows-1 xl:auto-cols-fr"
      >
        <SelectionCard
          title="선택 안함"
          subtitle="인터넷만"
          description="TV 없이 가입"
          infoLabel="단독 가입"
          priceLabel="TV 월요금 0원"
          selected={!tvPlan}
          onClick={clearTvPlan}
          icon={<Ban size={17} strokeWidth={2.2} />}
          className="min-h-[190px] min-w-0 p-3"
        />

        {carrierData.tvPlans.map((plan) => {
          const channelCount = getChannelCount(plan);
          const content = getPlanContent(plan.name);
          const normalizedName = plan.name.replace(/\s/g, "");

          return (
            <SelectionCard
              key={plan.id}
              title={plan.name}
              subtitle={
                channelCount
                  ? `${channelCount}채널`
                  : "채널 상품"
              }
              description={content.description}
              infoLabel={content.infoLabel}
              priceLabel={`TV 월요금 ${formatPrice(
                plan.monthlyPrice
              )}원`}
              badge={
                normalizedName.includes("베이직")
                  ? "추천"
                  : undefined
              }
              selected={tvPlan?.id === plan.id}
              onClick={() => selectTvPlan(plan)}
              icon={content.icon}
              className="min-h-[190px] min-w-0 p-3"
            />
          );
        })}
      </div>
    </section>
  );
}