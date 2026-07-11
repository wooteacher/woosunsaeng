import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Gift,
  Headphones,
  Scale,
  Zap,
} from "lucide-react";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

const reasons = [
  {
    icon: Scale,
    title: "여러 조건을 한 번에 비교",
    description:
      "KT, SK브로드밴드, LG U+, LG헬로비전의 상품과 혜택을 고객님 조건에 맞춰 비교합니다.",
  },
  {
    icon: Headphones,
    title: "어려운 내용도 쉽게 안내",
    description:
      "복잡한 통신 용어 대신 실제 이용 요금과 필요한 조건을 알기 쉽게 설명해드립니다.",
  },
  {
    icon: Gift,
    title: "설치 후 혜택 안내",
    description:
      "설치가 완료된 뒤 약속된 혜택과 지급 절차를 빠르고 정확하게 안내합니다.",
  },
  {
    icon: Zap,
    title: "상담부터 설치까지 한 번에",
    description:
      "상품 선택, 접수, 설치 일정까지 고객님이 번거롭지 않도록 함께 진행합니다.",
  },
];

const promises = [
  "필요하지 않은 상품은 권하지 않습니다.",
  "할인 조건과 실제 납부 기준을 정확하게 설명합니다.",
  "상담 접수부터 설치 완료까지 끝까지 함께합니다.",
];

export default function WhyUs() {
  return (
    <Section className="relative overflow-hidden bg-gray-950 text-white">
      <div
        id="why-us"
        className="scroll-mt-24"
      >
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-green-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <Container>
          <div className="relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            {/* 캐릭터 */}
            <div className="relative mx-auto w-full max-w-lg pb-8">
              <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur">
                <div className="overflow-hidden rounded-[30px] bg-gradient-to-br from-green-50 to-white">
                  <Image
                    src="/hero/wooteacher-teacher.png"
                    alt="인터넷과 렌탈 상담을 도와주는 우선생 캐릭터"
                    width={720}
                    height={720}
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>

              <div className="absolute inset-x-5 bottom-0 rounded-[26px] border border-white/10 bg-gray-900/95 p-5 text-center shadow-2xl backdrop-blur">
                <p className="text-sm font-black text-green-400">
                  우선생의 약속
                </p>

                <p className="mt-2 font-black leading-7 text-white">
                  복잡한 비교는 우선생이 하고,
                  <br />
                  고객님은 편하게 선택하시면 됩니다.
                </p>
              </div>
            </div>

            {/* 콘텐츠 */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-500/15 px-4 py-2 text-sm font-black text-green-400 ring-1 ring-green-400/20">
                <BadgeCheck size={17} />
                WHY WOOTEACHER
              </span>

              <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                왜 우선생을
                <br />
                선택해야 할까요?
              </h2>

              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-gray-300">
                우선생은 상품을 무조건 권하지 않습니다. 고객님의 생활환경과
                이용 조건을 확인하고 꼭 필요한 선택만 쉽고 정확하게
                안내합니다.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {reasons.map((reason) => {
                  const Icon = reason.icon;

                  return (
                    <article
                      key={reason.title}
                      className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 transition duration-200 hover:-translate-y-1 hover:border-green-400/30 hover:bg-white/[0.09]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/15 text-green-400">
                        <Icon size={25} />
                      </div>

                      <h3 className="mt-5 text-xl font-black">
                        {reason.title}
                      </h3>

                      <p className="mt-3 text-sm font-semibold leading-6 text-gray-400">
                        {reason.description}
                      </p>
                    </article>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[30px] border border-green-400/20 bg-green-500/10 p-6 sm:p-7">
                <p className="font-black text-green-400">
                  우리가 선택한 생활서비스
                </p>

                <ul className="mt-5 space-y-3">
                  {promises.map((promise) => (
                    <li
                      key={promise}
                      className="flex items-start gap-3 font-bold text-gray-200"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                        <Check size={15} strokeWidth={3} />
                      </span>

                      {promise}
                    </li>
                  ))}
                </ul>

                <a
                  href="#estimate"
                  className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-green-950/30 transition hover:-translate-y-0.5 hover:bg-green-600 sm:w-auto"
                >
                  30초 무료 상담받기
                  <ArrowRight size={20} />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}