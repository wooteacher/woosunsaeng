import Link from "next/link";
import { ArrowRight, Router, Sofa } from "lucide-react";

import Container from "@/components/ui/Container";

const services = [
  {
    title: "인터넷 · TV",
    description: "통신사별 요금과 혜택을 쉽고 정확하게 비교해드립니다.",
    href: "/internet",
    cta: "인터넷 비교하기",
    icon: Router,
  },
  {
    title: "생활가전 렌탈",
    description: "생활에 필요한 제품을 부담 없이 상담하고 선택해보세요.",
    href: "/rental",
    cta: "렌탈 알아보기",
    icon: Sofa,
  },
];

export default function ServiceSection() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold tracking-[-0.02em] text-green-700">
              우선생 서비스
            </p>

            <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.045em] text-slate-950 sm:text-[34px]">
              필요한 서비스를 선택하세요.
            </h2>
          </div>

          <p className="max-w-md text-[15px] leading-6 tracking-[-0.02em] text-slate-500">
            복잡한 조건은 줄이고, 필요한 정보만 쉽고 정확하게 안내합니다.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {services.map(
            ({ title, description, href, cta, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[210px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg sm:p-7"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5"
                      strokeWidth={2.2}
                    />
                  </div>

                  <h3 className="mt-5 text-[22px] font-extrabold tracking-[-0.04em] text-slate-950">
                    {title}
                  </h3>

                  <p className="mt-2 max-w-md text-[15px] leading-6 tracking-[-0.02em] text-slate-600">
                    {description}
                  </p>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold tracking-[-0.025em] text-green-700">
                  {cta}

                  <ArrowRight
                    aria-hidden="true"
                    className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={2.2}
                  />
                </div>
              </Link>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}