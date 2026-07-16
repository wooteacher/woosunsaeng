import { BadgeCheck, CircleHelp, ListChecks } from "lucide-react";

import Container from "@/components/ui/Container";

const needs = [
  {
    icon: CircleHelp,
    title: "어디가 좋은지 모르겠어요",
    description: "통신사와 상품별 조건을 한눈에 비교해드립니다.",
  },
  {
    icon: ListChecks,
    title: "조건이 너무 복잡해요",
    description: "필요한 내용만 쉽고 정확하게 정리해드립니다.",
  },
  {
    icon: BadgeCheck,
    title: "믿고 상담하고 싶어요",
    description: "고객에게 맞는 선택을 기준으로 안내합니다.",
  },
];

export default function CustomerNeeds() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/70 py-12 sm:py-14">
      <Container>
        <div className="text-center">
          <p className="text-sm font-bold tracking-[-0.02em] text-green-700">
            이런 고민 있으신가요?
          </p>

          <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.045em] text-slate-950 sm:text-[34px]">
            복잡한 비교는 우선생이 정리합니다.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {needs.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md sm:p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Icon
                  aria-hidden="true"
                  className="h-5 w-5"
                  strokeWidth={2.2}
                />
              </div>

              <h3 className="mt-4 text-[18px] font-extrabold tracking-[-0.035em] text-slate-950">
                {title}
              </h3>

              <p className="mt-2 text-[15px] leading-6 tracking-[-0.02em] text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}