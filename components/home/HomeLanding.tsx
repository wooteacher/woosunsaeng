import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Gift,
  Router,
  ShieldCheck,
  Sparkles,
  WashingMachine,
} from "lucide-react";

import HomeBannerSlider from "@/components/home/HomeBannerSlider";
import HomeKakaoBanner from "@/components/home/HomeKakaoBanner";

const services = [
  {
    title: "인터넷",
    description: "인터넷·TV 요금과 할인 혜택을 한 번에 비교하세요.",
    eyebrow: "인터넷 + TV",
    href: "/internet",
    icon: Router,
    iconClassName: "bg-emerald-100 text-emerald-700",
    visualClassName: "bg-[linear-gradient(145deg,#ecfdf5_0%,#ffffff_76%)]",
  },
  {
    title: "렌탈",
    description: "정수기부터 생활가전까지 원하는 상품을 바로 확인하세요.",
    eyebrow: "생활가전 렌탈",
    href: "/rental",
    icon: WashingMachine,
    iconClassName: "bg-teal-100 text-teal-700",
    visualClassName: "bg-[linear-gradient(145deg,#f0fdfa_0%,#ffffff_76%)]",
  },
];

const benefits = [
  {
    title: "숨은 지원금 찾아가기",
    description: "설치비·상품권·현금 혜택까지 빠짐없이 확인해드려요.",
    icon: Gift,
  },
  {
    title: "우선생이 알아서 정리해주는 서비스",
    description: "복잡한 조건은 비교하고 필요한 내용만 쉽게 안내합니다.",
    icon: ClipboardCheck,
  },
  {
    title: "믿을 수 있는 설치 당일 지급",
    description: "설치 확인 후 약속된 혜택을 빠르고 정확하게 지급합니다.",
    icon: ShieldCheck,
  },
];

export default function HomeLanding() {
  return (
    <>
      <HomeBannerSlider />

      <section className="px-4 pb-14 pt-7 sm:px-6 sm:pb-20 sm:pt-9 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-extrabold text-emerald-700 ring-1 ring-inset ring-emerald-100 sm:text-[13px]">
                <Sparkles size={14} strokeWidth={2.3} />
                우선생이 알려주는
              </div>

              <h1 className="mt-3 break-keep text-[26px] font-black leading-[1.2] tracking-[-0.05em] text-slate-950 sm:text-[34px]">
                저렴한 요금,
                <span className="ml-2 text-emerald-600">최대 혜택</span>
              </h1>

              <p className="mt-2 break-keep text-[13px] font-medium leading-5 text-slate-500 sm:text-[14px]">
                인터넷과 렌탈, 필요한 서비스만 선택하면 우선생이 쉽게 비교해드려요.
              </p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[12px] font-bold text-slate-500 shadow-sm sm:text-[13px]">
              필요한 서비스를 선택하세요
            </div>
          </div>

          <div className="mt-4 grid gap-3.5 md:grid-cols-2">
            {services.map(({ icon: Icon, ...service }) => (
              <Link
                key={service.title}
                href={service.href}
                className={[
                  "group relative min-h-[156px] overflow-hidden rounded-[22px] border border-slate-200 px-5 py-5 shadow-[0_9px_30px_rgba(15,23,42,0.045)] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-[0_15px_38px_rgba(15,23,42,0.075)] sm:min-h-[166px] sm:px-6 sm:py-[22px]",
                  service.visualClassName,
                ].join(" ")}
              >
                <div className="absolute -right-14 -top-16 size-40 rounded-full bg-white/75" />
                <div className="absolute -bottom-16 right-12 size-36 rounded-full bg-emerald-100/45 blur-2xl" />

                <div className="relative flex h-full min-h-[116px] items-center gap-4 sm:min-h-[124px] sm:gap-5">
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-2xl sm:size-14 ${service.iconClassName}`}
                  >
                    <Icon size={25} strokeWidth={2.05} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-extrabold text-emerald-600 sm:text-[12px]">
                      {service.eyebrow}
                    </p>
                    <h2 className="mt-1 text-[25px] font-black tracking-[-0.045em] text-slate-950 sm:text-[28px]">
                      {service.title}
                    </h2>
                    <p className="mt-1.5 max-w-[430px] break-keep text-[13px] font-medium leading-5 text-slate-600 sm:text-[14px]">
                      {service.description}
                    </p>
                  </div>

                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200 transition group-hover:translate-x-1 group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600 sm:size-10">
                    <ArrowRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_34px_rgba(15,23,42,0.04)]">
            <div className="grid md:grid-cols-3">
              {benefits.map(({ icon: Icon, ...benefit }, index) => (
                <article
                  key={benefit.title}
                  className={[
                    "relative flex min-h-[138px] items-start gap-4 px-5 py-5 sm:px-6 sm:py-6 md:min-h-[150px] md:items-center",
                    index > 0
                      ? "border-t border-slate-100 md:border-l md:border-t-0"
                      : "",
                  ].join(" ")}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 sm:size-12">
                    <Icon size={23} strokeWidth={2.15} />
                  </span>

                  <div className="min-w-0">
                    <h3 className="break-keep text-[16px] font-black tracking-[-0.035em] text-slate-950 sm:text-[17px]">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 break-keep text-[12px] font-medium leading-5 text-slate-500 sm:text-[13px]">
                      {benefit.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <HomeKakaoBanner />
        </div>
      </section>
    </>
  );
}
