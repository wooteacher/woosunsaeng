"use client";

import { Gauge, Rocket, Wifi } from "lucide-react";

import MobileHorizontalRail from "@/components/internet/MobileHorizontalRail";
import SelectionCard from "@/components/internet/SelectionCard";
import { useCalculator } from "@/contexts/CalculatorContext";

const speedIcons = {
  "100M": <Wifi size={18} strokeWidth={2.2} />,
  "500M": <Gauge size={18} strokeWidth={2.2} />,
  "1G": <Rocket size={18} strokeWidth={2.2} />,
};

const speedDescriptions = {
  "100M": "웹서핑 · 영상 시청",
  "500M": "게임 · 스트리밍 · 재택",
  "1G": "고용량 작업 · 빠른 업로드",
};

const speedInfoLabels = {
  "100M": "가볍게 사용하는 기본형",
  "500M": "여러 기기도 쾌적하게",
  "1G": "빠른 속도가 필요할 때",
};

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

export default function InternetSpeedSelector() {
  const { carrier, carrierData, internetPlan, selectInternetPlan } =
    useCalculator();

  return (
    <section className="grid gap-2.5 xl:grid-cols-[180px_minmax(0,1fr)] xl:items-start xl:gap-5">
      <div className="flex items-start gap-2.5 xl:block">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-black text-white xl:hidden">
          2
        </span>
        <div>
          <h2 className="break-keep text-[18px] font-black tracking-[-0.04em] text-slate-950 sm:text-[22px]">
            인터넷 속도
          </h2>
          <p className="mt-0.5 break-keep text-[12px] leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
            사용 환경에 맞는 속도를 선택해주세요.
          </p>
        </div>
      </div>

      <MobileHorizontalRail
        ariaLabel="인터넷 속도"
        resetKey={carrier}
        scrollClassName="flex snap-x snap-mandatory gap-2 overflow-x-auto px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:py-0"
      >
        {carrierData.internetPlans.map((plan) => {
          const speedKey = plan.speed as keyof typeof speedIcons;
          const active = internetPlan?.id === plan.id;

          return (
            <div
              key={plan.id}
              data-rail-item
              style={{ flexBasis: "calc((100% - 8px) / 2.18)" }}
              className="min-w-0 shrink-0 snap-start sm:w-auto"
            >
              <SelectionCard
                title={plan.speed}
                subtitle={plan.name}
                description={
                  speedDescriptions[speedKey] ?? "생활 패턴에 맞는 인터넷"
                }
                infoLabel={
                  speedInfoLabels[speedKey] ?? "편리하게 이용할 수 있어요"
                }
                priceLabel={`월 ${formatPrice(plan.monthlyPrice)}원`}
                badge={plan.speed === "500M" ? "추천" : undefined}
                selected={active}
                onClick={() => selectInternetPlan(plan)}
                icon={
                  speedIcons[speedKey] ?? <Wifi size={18} strokeWidth={2.2} />
                }
                className="!h-[132px] !w-full sm:!h-[196px]"
              />
            </div>
          );
        })}
      </MobileHorizontalRail>
    </section>
  );
}
