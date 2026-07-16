import Link from "next/link";

import Container from "@/components/ui/Container";

const PHONE_DISPLAY = "032-422-8010";
const PHONE_NUMBER = "0324228010";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container>
        <div className="grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="우선생 홈페이지"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-lg font-black tracking-[-0.08em] text-white"
              >
                W
              </span>

              <span className="text-xl font-extrabold tracking-[-0.05em] text-slate-950">
                우선생
              </span>
            </Link>

            <p className="mt-3 text-[15px] font-semibold tracking-[-0.025em] text-slate-700">
              우리가 선택한 생활서비스
            </p>

            <p className="mt-1 text-sm tracking-[-0.02em] text-slate-500">
              가장 좋은 조건을 쉽고 정확하게 안내합니다.
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-sm font-semibold text-slate-500">
              상담 대표번호
            </p>

            <a
              href={`tel:${PHONE_NUMBER}`}
              className="mt-1 inline-block text-lg font-extrabold tracking-[-0.03em] text-slate-950 transition hover:text-green-700"
            >
              {PHONE_DISPLAY}
            </a>

            <nav className="mt-4 flex gap-4 text-sm font-medium text-slate-500 md:justify-end">
              <Link href="/privacy" className="hover:text-slate-950">
                개인정보처리방침
              </Link>

              <Link href="/terms" className="hover:text-slate-950">
                이용약관
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-slate-200 py-5 text-sm text-slate-400">
          © {new Date().getFullYear()} 우선생. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}