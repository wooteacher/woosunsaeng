"use client";

import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Check,
  Handshake,
  MonitorSmartphone,
  Phone,
  Sparkles,
  Tv,
  WalletCards,
  WashingMachine,
} from "lucide-react";

import Container from "@/components/ui/Container";
import { SITE } from "@/lib/site";

type ServiceType =
  | "인터넷"
  | "인터넷 + TV"
  | "생활가전 렌탈";

type PriorityType =
  | "사은품"
  | "월요금"
  | "인기 상품 추천"
  | "잘 모르겠어요";

const services = [
  {
    value: "인터넷" as const,
    title: "인터넷",
    description: "인터넷만 필요해요",
    icon: MonitorSmartphone,
  },
  {
    value: "인터넷 + TV" as const,
    title: "인터넷 + TV",
    description: "인터넷과 TV를 함께",
    icon: Tv,
  },
  {
    value: "생활가전 렌탈" as const,
    title: "생활가전 렌탈",
    description: "정수기·공기청정기 등",
    icon: WashingMachine,
  },
];

const internetPriorities = [
  {
    value: "사은품" as const,
    title: "사은품",
    description: "가능한 혜택을 비교해주세요",
    icon: BadgeDollarSign,
  },
  {
    value: "월요금" as const,
    title: "월요금",
    description: "매달 내는 비용을 줄이고 싶어요",
    icon: WalletCards,
  },
  {
    value: "잘 모르겠어요" as const,
    title: "잘 모르겠어요",
    description: "우선생이 알아서 추천해주세요",
    icon: Handshake,
  },
];

const rentalPriorities = [
  {
    value: "사은품" as const,
    title: "사은품",
    description: "가입 혜택이 중요해요",
    icon: BadgeDollarSign,
  },
  {
    value: "월요금" as const,
    title: "월 렌탈료",
    description: "매달 부담을 줄이고 싶어요",
    icon: WalletCards,
  },
  {
    value: "인기 상품 추천" as const,
    title: "인기 상품 추천",
    description: "많이 찾는 제품을 보고 싶어요",
    icon: Sparkles,
  },
  {
    value: "잘 모르겠어요" as const,
    title: "잘 모르겠어요",
    description: "우선생이 알아서 추천해주세요",
    icon: Handshake,
  },
];

export default function CustomerNeeds() {
  const [service, setService] =
    useState<ServiceType>("인터넷 + TV");

  const [priority, setPriority] =
    useState<PriorityType>("잘 모르겠어요");

  const priorities = useMemo(
    () =>
      service === "생활가전 렌탈"
        ? rentalPriorities
        : internetPriorities,
    [service]
  );

  const handleServiceChange = (
    nextService: ServiceType
  ) => {
    setService(nextService);

    if (
      nextService !== "생활가전 렌탈" &&
      priority === "인기 상품 추천"
    ) {
      setPriority("잘 모르겠어요");
    }
  };

  return (
    <section className="bg-white py-14 sm:py-16">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-black text-emerald-600">
              두 가지만 선택하세요
            </p>

            <h2 className="mt-3 break-keep text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
              나머지는 우선생이 알아서 비교합니다
            </h2>

            <p className="mt-3 break-keep text-sm font-semibold leading-7 text-slate-500 sm:text-base">
              상품을 잘 모르셔도 괜찮습니다.
            </p>
          </div>

          <div className="mt-9 rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 sm:p-7">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">
                  1
                </span>

                <h3 className="text-xl font-black text-slate-950">
                  어떤 서비스를 찾고 계신가요?
                </h3>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {services.map((item) => {
                  const Icon = item.icon;
                  const selected =
                    service === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        handleServiceChange(item.value)
                      }
                      aria-pressed={selected}
                      className={[
                        "relative flex min-h-[120px] items-center gap-4 rounded-2xl border p-5 text-left transition duration-200",
                        selected
                          ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                          : "border-slate-200 bg-white hover:border-emerald-300",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex size-11 shrink-0 items-center justify-center rounded-xl",
                          selected
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600",
                        ].join(" ")}
                      >
                        <Icon size={22} />
                      </span>

                      <span className="min-w-0">
                        <span className="block text-lg font-black text-slate-950">
                          {item.title}
                        </span>

                        <span className="mt-1 block break-keep text-sm font-semibold text-slate-500">
                          {item.description}
                        </span>
                      </span>

                      {selected ? (
                        <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check
                            size={14}
                            strokeWidth={3}
                          />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="my-7 h-px bg-slate-200" />

            <div>
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">
                  2
                </span>

                <h3 className="text-xl font-black text-slate-950">
                  무엇이 가장 중요하신가요?
                </h3>
              </div>

              <div
                className={[
                  "mt-5 grid gap-3",
                  priorities.length === 4
                    ? "sm:grid-cols-2 lg:grid-cols-4"
                    : "md:grid-cols-3",
                ].join(" ")}
              >
                {priorities.map((item) => {
                  const Icon = item.icon;
                  const selected =
                    priority === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setPriority(item.value)
                      }
                      aria-pressed={selected}
                      className={[
                        "relative min-h-[132px] rounded-2xl border p-5 text-left transition duration-200",
                        selected
                          ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                          : "border-slate-200 bg-white hover:border-emerald-300",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex size-10 items-center justify-center rounded-xl",
                          selected
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600",
                        ].join(" ")}
                      >
                        <Icon size={20} />
                      </span>

                      <span className="mt-4 block font-black text-slate-950">
                        {item.title}
                      </span>

                      <span className="mt-1 block break-keep text-sm font-semibold leading-6 text-slate-500">
                        {item.description}
                      </span>

                      {selected ? (
                        <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check
                            size={14}
                            strokeWidth={3}
                          />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7 rounded-2xl bg-slate-950 p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-xs font-black text-emerald-400">
                  선택한 내용
                </p>

                <p className="mt-2 break-keep text-lg font-black">
                  {service}
                  <span className="mx-2 text-slate-600">
                    ·
                  </span>
                  {priority}
                </p>

                <p className="mt-1 break-keep text-xs font-semibold leading-5 text-slate-400">
                  선택하신 기준을 말씀해주시면 필요한
                  조건부터 빠르게 안내해드립니다.
                </p>
              </div>

              <a
                href={SITE.phoneHref}
                className="mt-5 inline-flex min-h-13 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-black text-white transition hover:bg-emerald-400 sm:mt-0 sm:w-auto"
              >
                <Phone size={18} />
                우선생에게 물어보기
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}