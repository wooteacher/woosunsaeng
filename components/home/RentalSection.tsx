import {
  ArrowRight,
  Armchair,
  Droplets,
  Refrigerator,
  Sparkles,
  Tv,
  Wind,
} from "lucide-react";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { SITE } from "@/lib/site";

const rentalCategories = [
  {
    name: "정수기",
    description: "사용 인원과 관리 방식에 맞춰 비교해드립니다.",
    icon: Droplets,
  },
  {
    name: "공기청정기",
    description: "공간 크기와 생활 환경에 맞는 제품을 안내합니다.",
    icon: Wind,
  },
  {
    name: "안마의자",
    description: "체형과 필요한 기능을 기준으로 추천합니다.",
    icon: Armchair,
  },
  {
    name: "TV",
    description: "화면 크기와 시청 환경에 맞춰 찾아드립니다.",
    icon: Tv,
  },
  {
    name: "냉장고",
    description: "가족 구성과 사용 방식에 맞는 용량을 안내합니다.",
    icon: Refrigerator,
  },
];

export default function RentalSection() {
  return (
    <Section className="relative overflow-hidden bg-green-50/50">
      <div
        id="rental"
        className="scroll-mt-24"
      >
        <div className="pointer-events-none absolute -right-28 top-20 h-80 w-80 rounded-full bg-green-200/40 blur-3xl" />

        <Container>
          <div className="relative">
            <SectionTitle
              badge="생활가전 렌탈"
              title="필요한 생활가전도 우선생이 쉽게 찾아드릴게요."
              description="여러 브랜드와 상품을 직접 비교하지 않아도 괜찮습니다. 사용 환경과 예산에 맞는 조건만 간단하게 안내해드립니다."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rentalCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <a
                    key={category.name}
                    href="#estimate"
                    className="group flex min-h-52 flex-col rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-100/70 sm:p-6"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition duration-200 group-hover:bg-green-600 group-hover:text-white">
                      <Icon
                        size={25}
                        strokeWidth={2.2}
                      />
                    </div>

                    <h3 className="mt-5 text-xl font-black text-gray-950">
                      {category.name}
                    </h3>

                    <p className="mt-2 flex-1 text-sm font-semibold leading-6 text-gray-500">
                      {category.description}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-green-700">
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
                className="group flex min-h-52 flex-col rounded-[28px] bg-green-600 p-5 text-white shadow-xl shadow-green-200 transition duration-200 hover:-translate-y-1 hover:bg-green-700 sm:p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <Sparkles size={25} />
                </div>

                <h3 className="mt-5 text-xl font-black">
                  전체 렌탈 상품
                </h3>

                <p className="mt-2 flex-1 text-sm font-semibold leading-6 text-green-50">
                  더 다양한 브랜드와 제품은 렌탈몰에서 확인해보세요.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black">
                  상품 보러가기

                  <ArrowRight
                    size={17}
                    className="transition duration-200 group-hover:translate-x-1"
                  />
                </span>
              </a>
            </div>

            <div className="mt-8 overflow-hidden rounded-[30px] bg-gray-950 text-white shadow-2xl shadow-gray-300/70">
              <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-black text-green-400">
                    우선생 렌탈 상담
                  </p>

                  <h3 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
                    브랜드와 조건이 많아도
                    <br className="sm:hidden" /> 걱정하지 마세요.
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-gray-300 sm:text-base sm:leading-7">
                    월 렌탈료, 사용기간, 관리 방식과 혜택을 비교해
                    필요한 조건만 간단하게 안내해드립니다.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a
                    href={SITE.rentalMallUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white px-6 py-4 font-black text-gray-950 transition hover:-translate-y-0.5 hover:bg-green-50"
                  >
                    렌탈 상품 보기
                    <ArrowRight size={19} />
                  </a>

                  <a
                    href="#estimate"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-green-600"
                  >
                    무료 상담
                    <ArrowRight size={19} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}