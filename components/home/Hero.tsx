import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
} from "lucide-react";

import Container from "@/components/ui/Container";
import { SITE } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-white">
      <div className="pointer-events-none absolute -left-40 top-12 size-[360px] rounded-full bg-emerald-100/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 top-10 size-[420px] rounded-full bg-emerald-100/55 blur-3xl" />

      <Container>
        <div className="grid min-h-[540px] items-center gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:py-14">
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-4 py-2 shadow-sm">
              <Image
                src="/logo/wooteacher-mark.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />

              <span className="text-sm font-black text-emerald-700">
                우리가 선택한 생활서비스
              </span>
            </div>

            <h1 className="mt-6 break-keep text-[40px] font-black leading-[1.1] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-[60px]">
              복잡한 비교는
              <br />

              <span className="text-emerald-600">
                우선생이 대신합니다
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl break-keep text-base font-semibold leading-8 text-slate-600 sm:text-lg lg:mx-0">
              인터넷도, 렌탈도 어려운 상품은 외우실 필요 없습니다.
              <br className="hidden sm:block" />
              고객님께 맞는 조건부터 쉽고 편하게 안내해드립니다.
            </p>

            <a
              href={SITE.phoneHref}
              className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-black text-white shadow-[0_14px_34px_rgba(5,150,105,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 sm:w-auto"
            >
              <Phone
                size={20}
                strokeWidth={2.5}
              />

              전화로 물어보기
            </a>

            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/internet"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-900 transition duration-200 hover:border-emerald-300 hover:bg-emerald-50"
              >
                인터넷 요금 비교

                <ArrowRight
                  size={17}
                  strokeWidth={2.4}
                />
              </Link>

              <Link
                href="/rental"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-900 transition duration-200 hover:border-emerald-300 hover:bg-emerald-50"
              >
                렌탈 상품 보기

                <ArrowRight
                  size={17}
                  strokeWidth={2.4}
                />
              </Link>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-emerald-700 lg:justify-start">
              <span className="relative flex size-2.5">
                <span className="absolute size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative size-2.5 rounded-full bg-emerald-600" />
              </span>

              {SITE.consultationStatus}
              <span className="text-slate-300">·</span>
              평균 연결 {SITE.averageTime}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="pointer-events-none absolute inset-x-10 bottom-4 h-24 rounded-full bg-emerald-200/45 blur-3xl" />

            <div className="relative flex min-h-[440px] items-end justify-center overflow-hidden rounded-[38px] bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 sm:min-h-[500px]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-[42%] bg-emerald-100/55 sm:size-[440px]" />

              <Image
                src="/hero/hero-person.png"
                alt="인터넷과 렌탈 상품을 안내하는 우선생"
                width={720}
                height={760}
                priority
                sizes="(max-width: 1024px) 100vw, 540px"
                className="relative z-10 h-auto max-h-[520px] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}