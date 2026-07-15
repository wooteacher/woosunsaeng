"use client";

import { Gauge, Rocket, Wifi } from "lucide-react";
import SelectionCard from "@/components/internet/SelectionCard";
import { useCalculator } from "@/contexts/CalculatorContext";

const speedIcons = {
  "100M": <Wifi size={20} strokeWidth={2.2} />,
  "500M": <Gauge size={20} strokeWidth={2.2} />,
  "1G": <Rocket size={20} strokeWidth={2.2} />,
};

const speedDescriptions = {
  "100M": "웹서핑 · 영상 시청",
  "500M": "재택 · 게임 · 스트리밍",
  "1G": "고용량 작업 · 업로드",
};

const speedInfoLabels = {
  "100M": "가볍게 쓰기 좋은 기본형",
  "500M": "여러 기기도 쾌적하게",
  "1G": "빠른 속도가 필요할 때",
};

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

export default function InternetSpeedSelector() {
  const {
    carrierData,
    internetPlan,
    selectInternetPlan,
  } = useCalculator();

  return (
    <section className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-start">
      <div>
        <p className="text-sm font-bold text-emerald-600">
          STEP 2
        </p>

        <h2 className="mt-2 break-keep text-2xl font-black tracking-[-0.035em] text-slate-950">
          인터넷 속도를 선택해 주세요
        </h2>

        <p className="mt-3 break-keep text-sm leading-6 text-slate-500">
          사용 환경에 맞는 속도를 선택하면
          <br className="hidden xl:block" />
          예상 요금을 확인할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {carrierData.internetPlans.map((plan) => {
          const speedKey =
            plan.speed as keyof typeof speedIcons;

          return (
            <SelectionCard
              key={plan.id}
              title={plan.speed}
              subtitle={plan.name}
              description={
                speedDescriptions[speedKey] ??
                "생활 패턴에 맞는 인터넷"
              }
              infoLabel={
                speedInfoLabels[speedKey] ??
                "편리하게 이용할 수 있어요"
              }
              priceLabel={`인터넷 월요금 ${formatPrice(
                plan.monthlyPrice
              )}원`}
              badge={
                plan.speed === "500M"
                  ? "추천"
                  : undefined
              }
              selected={internetPlan?.id === plan.id}
              onClick={() => selectInternetPlan(plan)}
              icon={
                speedIcons[speedKey] ?? (
                  <Wifi
                    size={20}
                    strokeWidth={2.2}
                  />
                )
              }
              className="min-h-[220px]"
            />
          );
        })}
      </div>
    </section>
  );
}