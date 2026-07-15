import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Gift,
  Headphones,
  Scale,
} from "lucide-react";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

const reasons = [
  {
    icon: Scale,
    title: "최적 조건 비교",
    description: "필요한 조건만 골라 안내합니다.",
  },
  {
    icon: Headphones,
    title: "전문 상담",
    description: "복잡한 내용도 쉽게 설명합니다.",
  },
  {
    icon: Gift,
    title: "설치 후 혜택",
    description: "지급 절차까지 정확히 안내합니다.",
  },
];

const promises = [
  "불필요한 상품은 권하지 않습니다.",
  "할인 조건과 실제 납부 기준을 투명하게 안내합니다.",
  "상담 접수부터 설치 완료까지 함께합니다.",
];

export default function WhyUs() {
  return (
    <Section className="relative overflow-hidden bg-slate-950 text-white">
      <div id="why-us" className="scroll-mt-24">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

        <Container>
          <div className="relative grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div className="relative mx-auto w-full max-w-md pb-5">
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] p-2.5 shadow-2xl backdrop-blur">
                <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-emerald-50 to-white">
                  <Image
                    src="/hero/wooteacher-teacher.png"
                    alt="인터넷과 렌탈 상담을 안내하는 우선생 캐릭터"
                    width={640}
                    height={640}
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>

              <div className="absolute inset-x-5 bottom-0 rounded-[20px] border border-white/10 bg-slate-900/95 px-5 py-4 text-center shadow-2xl backdrop-blur">
                <p className="text-xs font-black text-emerald-400">
                  우선생의 약속
                </p>

                <p className="mt-1 break-keep text-sm font-bold leading-6 text-white">
                  복잡한 비교는 우선생이 하고,
                  <br />
                  고객님은 편하게 선택하세요.
                </p>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-black text-emerald-400 ring-1 ring-emerald-400/20">
                <BadgeCheck size={17} />
                WHY WOOTEACHER
              </span>

              <h2 className="mt-5 break-keep text-4xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
                복잡한 인터넷 가입,
                <br />
                우선생이 쉽게 알려드립니다.
              </h2>

              <p className="mt-5 max-w-2xl break-keep text-base font-semibold leading-7 text-slate-300 sm:text-lg sm:leading-8">
                고객님의 이용 환경에 맞는 조건만 비교하고,
                꼭 필요한 선택을 쉽고 정확하게 안내합니다.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {reasons.map((reason) => {
                  const Icon = reason.icon;

                  return (
                    <article
                      key={reason.title}
                      className="rounded-[22px] border border-white/10 bg-white/[0.055] p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.085]"
                    >
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                        <Icon size={22} strokeWidth={2.2} />
                      </div>

                      <h3 className="mt-4 text-lg font-black">
                        {reason.title}
                      </h3>

                      <p className="mt-2 break-keep text-sm font-semibold leading-6 text-slate-400">
                        {reason.description}
                      </p>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-5 sm:p-6">
                <p className="text-sm font-black text-emerald-400">
                  우선생의 약속
                </p>

                <ul className="mt-4 space-y-3">
                  {promises.map((promise) => (
                    <li
                      key={promise}
                      className="flex items-start gap-3 break-keep text-sm font-bold leading-6 text-slate-200 sm:text-base"
                    >
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check size={14} strokeWidth={3} />
                      </span>

                      {promise}
                    </li>
                  ))}
                </ul>

                <a
                  href="#estimate"
                  className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-base font-black text-white transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 sm:w-auto"
                >
                  30초 무료 상담 시작
                  <ArrowRight size={19} strokeWidth={2.5} />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}