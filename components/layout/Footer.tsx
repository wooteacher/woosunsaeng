import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { SITE } from "@/lib/site";

const navigation = [
  { label: "인터넷", href: "#internet" },
  { label: "렌탈", href: "#rental" },
  { label: "왜 우선생인가요?", href: "#why-us" },
  { label: "무료 상담", href: "#estimate" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* 상단 상담 배너 */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-9 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-black text-green-400">
              지금 상담 가능합니다
            </p>

            <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
              인터넷과 렌탈,
              <br className="sm:hidden" /> 우선생에게 편하게 물어보세요.
            </h2>

            <p className="mt-3 font-semibold leading-7 text-gray-400">
              복잡한 비교부터 설치와 혜택 안내까지 한 번에 도와드립니다.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={SITE.phoneHref}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-green-600"
            >
              <Phone size={20} />
              전화 상담
            </a>

            <a
              href={SITE.kakaoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-6 py-4 font-black text-gray-950 transition hover:-translate-y-0.5 hover:bg-yellow-400"
            >
              <MessageCircle size={20} />
              카카오톡 상담
            </a>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.8fr]">
          {/* 브랜드 */}
          <div>
            <Link href="/" className="inline-block">
              <p className="text-3xl font-black tracking-tight">
                우<span className="text-green-400">선생</span>
              </p>

              <p className="mt-1 text-sm font-bold text-gray-400">
                우리가 선택한 생활서비스
              </p>
            </Link>

            <p className="mt-6 max-w-md font-semibold leading-7 text-gray-400">
              인터넷, 인터넷 + TV와 생활가전 렌탈까지 고객님의 생활에
              꼭 맞는 서비스를 쉽고 친절하게 안내합니다.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-300">
                <ShieldCheck size={17} className="text-green-400" />
                상담 정보 안전 관리
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-300">
                <Clock3 size={17} className="text-green-400" />
                평균 연결 {SITE.averageTime}
              </span>
            </div>
          </div>

          {/* 메뉴 */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-gray-500">
              Menu
            </h3>

            <nav className="mt-5 space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex w-fit items-center gap-2 font-bold text-gray-300 transition hover:text-green-400"
                >
                  {item.label}
                  <ArrowUpRight size={15} />
                </a>
              ))}
            </nav>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-gray-500">
              Contact
            </h3>

            <a
              href={SITE.phoneHref}
              className="mt-5 block text-2xl font-black text-white transition hover:text-green-400"
            >
              {SITE.phone}
            </a>

            <p className="mt-3 text-sm font-semibold leading-6 text-gray-400">
              상담 가능 여부와 운영시간은
              <br />
              실시간 안내를 확인해 주세요.
            </p>

            <a
              href="#estimate"
              className="mt-5 inline-flex items-center gap-2 font-black text-green-400 transition hover:text-green-300"
            >
              무료 상담 신청
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-7 text-sm font-semibold text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 우선생. All rights reserved.</p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="transition hover:text-gray-300"
            >
              개인정보처리방침
            </Link>

            <span>인터넷 · 렌탈 상담 서비스</span>
          </div>
        </div>
      </div>

      {/* 모바일 하단 바 여백 */}
      <div className="h-20 md:hidden" />
    </footer>
  );
}