import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Phone,
  Sparkles,
} from "lucide-react";

import Container from "@/components/ui/Container";
import { SITE } from "@/lib/site";

const benefits = [
  "무료 상담",
  "설치 후 바로 지급",
  "조건 비교 안내",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50/40">
      <div className="pointer-events-none absolute -left-28 top-10 h-64 w-64 rounded-full bg-green-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

      <Container>
        <div className="grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[1fr_0.75fr] lg:gap-10 lg:py-14">

          <div className="text-center lg:text-left">

            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-black text-green-700 shadow-sm sm:text-sm">
              <Sparkles size={16} />
              우리가 선택한 생활서비스
            </span>


            <h1 className="mt-5 text-[36px] font-black leading-[1.15] tracking-[-0.055em] text-gray-950 sm:text-5xl lg:text-[56px]">
              인터넷과 렌탈,
              <br />
              <span className="text-green-600">
                우선생이 쉽게
              </span>
              <br />
              안내합니다.
            </h1>


            <p className="mx-auto mt-4 max-w-lg text-base font-semibold leading-7 text-gray-600 sm:text-lg lg:mx-0">
              복잡한 비교는 줄이고,
              고객님에게 맞는 조건만 빠르게 안내해드립니다.
            </p>


            <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
              {benefits.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-3 py-2 text-xs font-black text-gray-800 shadow-sm sm:text-sm"
                >
                  <CheckCircle2
                    size={15}
                    className="text-green-600"
                  />
                  {item}
                </span>
              ))}
            </div>


            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:justify-start">

              <a
                href="#estimate"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-600 px-7 py-4 font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700"
              >
                30초 무료 상담
                <ArrowRight size={19} />
              </a>


              <a
                href={SITE.phoneHref}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-7 py-4 font-black text-gray-950 transition hover:border-green-300 hover:bg-green-50"
              >
                <Phone size={19} />
                전화 상담
              </a>

            </div>


            <div className="mt-5 flex flex-col items-center gap-2 text-sm font-bold text-gray-600 sm:flex-row lg:justify-start">

              <span className="flex items-center gap-2 text-green-700">
                <span className="relative flex h-3 w-3">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                  <span className="relative h-3 w-3 rounded-full bg-green-600" />
                </span>

                {SITE.consultationStatus}
              </span>


              <span className="flex items-center gap-2">
                <Clock3
                  size={16}
                  className="text-green-600"
                />
                평균 상담 연결 {SITE.averageTime}
              </span>

            </div>

          </div>


          <div className="mx-auto w-full max-w-[430px]">

            <div className="overflow-hidden rounded-[30px] border border-green-100 bg-white p-2 shadow-xl shadow-green-100/60">

              <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-green-50 to-white">

                <Image
                  src="/hero/wooteacher-teacher.png"
                  alt="우선생 상담 안내"
                  width={640}
                  height={640}
                  priority
                  sizes="(max-width:1024px) 100vw,430px"
                  className="w-full object-contain"
                />

              </div>


              <div className="grid grid-cols-2 gap-2 p-2">

                <div className="rounded-2xl bg-gray-50 px-3 py-3 text-center">
                  <p className="text-xs font-bold text-gray-500">
                    상담
                  </p>

                  <p className="mt-1 text-sm font-black text-gray-950">
                    무료
                  </p>
                </div>


                <div className="rounded-2xl bg-green-50 px-3 py-3 text-center">
                  <p className="text-xs font-bold text-green-700">
                    연결 시간
                  </p>

                  <p className="mt-1 text-sm font-black text-green-800">
                    {SITE.averageTime}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}