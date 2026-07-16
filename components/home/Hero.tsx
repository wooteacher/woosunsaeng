import { PhoneCall } from "lucide-react";

import Container from "@/components/ui/Container";

const PHONE_NUMBER = "0324228010";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-green-100/70 blur-3xl"
      />

      <Container>
        <div className="relative flex min-h-[440px] flex-col items-center justify-center py-12 text-center sm:min-h-[470px] sm:py-14 lg:min-h-[490px]">
          <p className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold tracking-[-0.02em] text-green-700">
            우리가 선택한 생활서비스
          </p>

          <h1 className="mt-5 text-[38px] font-extrabold leading-[1.14] tracking-[-0.055em] text-slate-950 sm:text-[48px] lg:text-[58px]">
            <span className="block text-green-600">인터넷 · 렌탈</span>
            <span className="mt-1 block">어렵게 비교하지 마세요.</span>
          </h1>

          <p className="mt-5 text-[17px] font-medium leading-7 tracking-[-0.025em] text-slate-600 sm:text-lg">
            가장 좋은 조건을 쉽고 정확하게 안내합니다.
          </p>

          <a
            href={`tel:${PHONE_NUMBER}`}
            className="mt-7 inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-green-600 px-7 text-[15px] font-bold tracking-[-0.025em] text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20"
          >
            <PhoneCall
              aria-hidden="true"
              className="h-[18px] w-[18px]"
              strokeWidth={2.3}
            />

            우선생 물어보기
          </a>
        </div>
      </Container>
    </section>
  );
}