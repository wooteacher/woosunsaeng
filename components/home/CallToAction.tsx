import {
  ArrowRight,
  Clock3,
  Phone,
} from "lucide-react";

import Container from "@/components/ui/Container";
import { SITE } from "@/lib/site";

export default function CallToAction() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-10 text-center text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -left-20 top-0 size-64 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 size-64 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-sm font-black text-emerald-400">
              아직 결정하지 않으셔도 괜찮습니다
            </p>

            <h2 className="mt-3 break-keep text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">
              전화 한 통이면
              <br />
              우선생이 대신 비교해드립니다
            </h2>

            <p className="mt-4 break-keep text-sm font-semibold leading-7 text-slate-300 sm:text-base">
              어려운 상품명은 몰라도 괜찮습니다.
              필요한 조건만 쉽고 간단하게 안내해드립니다.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={SITE.phoneHref}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-7 py-4 text-base font-black text-white transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                <Phone size={19} strokeWidth={2.5} />
                우선생에게 물어보기
              </a>

              <a
                href="/internet"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 text-base font-black text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.1]"
              >
                인터넷 요금 비교
                <ArrowRight size={19} strokeWidth={2.5} />
              </a>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-2 text-xs font-bold text-slate-400 sm:flex-row">
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-400" />
                {SITE.consultationStatus}
              </span>

              <span className="hidden text-slate-600 sm:inline">
                ·
              </span>

              <span className="flex items-center gap-1.5">
                <Clock3 size={14} />
                평균 연결 {SITE.averageTime}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}