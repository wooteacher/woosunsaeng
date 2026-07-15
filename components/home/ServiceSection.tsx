import Link from "next/link";
import {
  ArrowRight,
  MonitorSmartphone,
  Sofa,
} from "lucide-react";

import Container from "@/components/ui/Container";

const services = [
  {
    title: "인터넷 + TV",
    description:
      "요금과 혜택을 직접 비교해보고 싶다면",
    href: "/internet",
    button: "인터넷 견적 보기",
    icon: MonitorSmartphone,
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "생활가전 렌탈",
    description:
      "정수기, 공기청정기 등 다양한 렌탈 상품",
    href: "/rental",
    button: "렌탈 상품 보기",
    icon: Sofa,
    accent: "bg-slate-100 text-slate-700",
  },
];

export default function ServiceSection() {
  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black text-emerald-600">
            필요한 서비스
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
            원하시는 서비스를 선택하세요
          </h2>

          <p className="mt-3 text-sm font-semibold leading-7 text-slate-500 sm:text-base">
            자세한 비교는 해당 페이지에서
            쉽고 빠르게 확인할 수 있습니다.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group rounded-[28px] border border-slate-200 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl ${service.accent}`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-2xl font-black tracking-[-0.03em] text-slate-950">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-emerald-600"
                >
                  {service.button}

                  <ArrowRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}