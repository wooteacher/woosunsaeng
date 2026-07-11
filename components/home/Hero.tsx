import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

import { SITE } from "@/lib/site";

const benefits = ["무료 상담", "설치 후 바로 지급", "빠르고 친절한 안내"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50/50">
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-green-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        {/* 왼쪽 문구 */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/90 px-4 py-2 text-sm font-extrabold text-green-700 shadow-sm">
            <Sparkles size={17} />
            우리가 선택한 생활서비스
          </div>

          <h1 className="mt-6 text-4xl font-black leading-[1.18] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            어려운 인터넷과 렌탈,
            <br />
            <span className="text-green-600">우선생이 쉽게</span>
            <br className="sm:hidden" /> 알려드릴게요.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg font-semibold leading-8 text-gray-600 sm:text-xl lg:mx-0">
            인터넷부터 인터넷 + TV, 생활가전 렌탈까지
            <br className="hidden sm:block" />
            고객님께 꼭 맞는 선택을 쉽고 친절하게 안내해드립니다.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            {benefits.map((text) => (
              <span
                key={text}
                className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2.5 text-sm font-extrabold text-gray-800 shadow-sm"
              >
                <CheckCircle2 size={18} className="text-green-600" />
                {text}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#estimate"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-600 px-7 py-4 text-base font-black text-white shadow-xl shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700"
            >
              30초 무료 상담받기
              <ArrowRight size={20} />
            </a>

            <a
              href={SITE.phoneHref}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-green-600 bg-white px-7 py-4 text-base font-black text-green-700 transition hover:bg-green-50"
            >
              <Phone size={20} />
              전화 상담
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold text-gray-600 lg:justify-start">
            <span className="inline-flex items-center gap-2 text-green-700">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-70" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </span>
              {SITE.consultationStatus}
            </span>

            <span className="inline-flex items-center gap-2">
              <Clock3 size={17} className="text-green-600" />
              평균 상담 연결 {SITE.averageTime}
            </span>
          </div>
        </div>

        {/* 오른쪽 캐릭터 카드 */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="overflow-hidden rounded-[36px] border border-green-100 bg-white p-3 shadow-2xl shadow-green-100/80">
            <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-green-50 to-white">
              <Image
                src="/hero/wooteacher-teacher.png"
                alt="인터넷과 렌탈 상담을 도와주는 우선생 캐릭터"
                width={720}
                height={720}
                priority
                className="h-auto w-full object-contain"
              />
            </div>

            <div className="grid gap-3 p-2 pt-4 sm:grid-cols-2">
              <a
                href={SITE.kakaoUrl}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-5 py-4 font-black text-gray-950 transition hover:bg-yellow-400"
              >
                <MessageCircle size={21} />
                카카오톡 상담
              </a>

              <a
                href={SITE.phoneHref}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-black text-white transition hover:bg-green-700"
              >
                <Phone size={21} />
                {SITE.phone}
              </a>
            </div>
          </div>

          <div className="absolute -bottom-5 left-1/2 w-[90%] -translate-x-1/2 rounded-2xl border border-gray-100 bg-white/95 px-5 py-4 text-center shadow-xl backdrop-blur sm:w-auto sm:min-w-[400px]">
            <p className="font-black text-gray-900">
              인터넷 · 인터넷 + TV · 렌탈 상담을 한 번에 안내해드립니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}