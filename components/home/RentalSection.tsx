import {
  ArrowRight,
  Armchair,
  Droplets,
  Home,
  Refrigerator,
  Sparkles,
  Tv,
  WashingMachine,
  Wind,
} from "lucide-react";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { SITE } from "@/lib/site";

const rentalCategories = [
  {
    name: "정수기",
    description: "사용 인원과 관리 방식에 맞는 제품을 비교해드립니다.",
    icon: Droplets,
  },
  {
    name: "공기청정기",
    description: "공간 크기와 생활 환경에 알맞은 제품을 안내합니다.",
    icon: Wind,
  },
  {
    name: "비데",
    description: "관리 유형과 월 렌탈료를 쉽고 정확하게 비교합니다.",
    icon: Home,
  },
  {
    name: "안마의자",
    description: "체형과 필요한 기능을 기준으로 제품을 추천합니다.",
    icon: Armchair,
  },
  {
    name: "TV",
    description: "화면 크기와 시청 환경에 맞는 제품을 찾아드립니다.",
    icon: Tv,
  },
  {
    name: "냉장고",
    description: "가족 구성과 사용 방식에 맞는 용량을 안내합니다.",
    icon: Refrigerator,
  },
  {
    name: "세탁기·건조기",
    description: "설치 공간과 세탁량에 맞는 제품을 비교해드립니다.",
    icon: WashingMachine,
  },
];

export default function RentalSection() {
  return (
    <Section className="relative scroll-mt-20 overflow-hidden bg-green-50/50">
      <div
        id="rental"
        className="pointer-events-none absolute -right-28 top-20 h-80 w-80 rounded-full bg-green-200/40 blur-3xl"
      />

      <Container>
        <div className="relative">
          <SectionTitle
            badge="생활가전 렌탈"
            title="필요한 생활가전도 우선생이 쉽게 찾아드릴게요."
            description="수많은 브랜드와 상품을 직접 비교하지 않아도 됩니다. 사용 환경과 예산에 맞는 렌탈 조건을 친절하게 안내합니다."
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rentalCategories.map((category) => {
              const Icon = category.icon;

              return (
                <a
                  key={category.name}
                  href="#estimate"
                  className="group flex min-h-64 flex-col rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-100/70"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition duration-200 group-hover:bg-green-600 group-hover:text-white">
                    <Icon size={28} strokeWidth={2.2} />
                  </div>

                  <h3 className="mt-6 text-xl font-black text-gray-950">
                    {category.name}
                  </h3>

                  <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-gray-500">
                    {category.description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-green-700">
                    상담받기
                    <ArrowRight
                      size={17}
                      className="transition duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </a>
              );
            })}

            <a
              href={SITE.rentalMallUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-64 flex-col justify-between rounded-[32px] bg-green-600 p-6 text-white shadow-xl shadow-green-200 transition duration-200 hover:-translate-y-1 hover:bg-green-700"
            >
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <Sparkles size={28} />
                </div>

                <h3 className="mt-6 text-xl font-black">
                  전체 렌탈 상품
                </h3>

                <p className="mt-3 text-sm font-semibold leading-6 text-green-50">
                  더 다양한 브랜드와 제품을 렌탈몰에서 확인해보세요.
                </p>
              </div>

              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black">
                상품 둘러보기
                <ArrowRight
                  size={17}
                  className="transition duration-200 group-hover:translate-x-1"
                />
              </span>
            </a>
          </div>

          <div className="mt-10 overflow-hidden rounded-[36px] bg-gray-950 text-white shadow-2xl shadow-gray-300/70">
            <div className="grid items-center gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="font-black text-green-400">
                  우선생 렌탈 상담
                </p>

                <h3 className="mt-3 text-3xl font-black leading-tight">
                  브랜드와 조건이 많아도
                  <br className="sm:hidden" /> 걱정하지 마세요.
                </h3>

                <p className="mt-4 max-w-2xl font-semibold leading-7 text-gray-300">
                  월 렌탈료, 의무 사용기간, 관리 방식과 혜택을 비교해
                  고객님께 필요한 조건만 알기 쉽게 안내해드립니다.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a
                  href={SITE.rentalMallUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-green-200 bg-white px-6 py-4 font-black text-gray-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-green-50"
                >
                  렌탈 상품 둘러보기
                  <ArrowRight size={19} />
                </a>

                <a
                  href="#estimate"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 font-black text-white shadow-lg shadow-green-950/30 transition hover:-translate-y-0.5 hover:bg-green-600"
                >
                  렌탈 무료 상담
                  <ArrowRight size={19} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}