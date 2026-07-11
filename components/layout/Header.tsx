"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, Phone, X } from "lucide-react";

import { SITE } from "@/lib/site";

const navigation = [
  { label: "인터넷", href: "#internet" },
  { label: "렌탈", href: "#rental" },
  { label: "왜 우선생인가요?", href: "#why-us" },
  { label: "고객센터", href: "#estimate" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-xl"
            : "border-transparent bg-white"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-6 lg:px-8 ${
            scrolled ? "min-h-16" : "min-h-20"
          }`}
        >
          {/* 로고 */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex shrink-0 flex-col"
            aria-label="우선생 홈으로 이동"
          >
            <span className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
              우<span className="text-green-600">선생</span>
            </span>

            <span
              className={`font-bold text-gray-500 transition-all duration-300 ${
                scrolled
                  ? "max-h-0 overflow-hidden text-[0px] opacity-0"
                  : "mt-0.5 max-h-5 text-xs opacity-100"
              }`}
            >
              우리가 선택한 생활서비스
            </span>
          </Link>

          {/* PC 메뉴 */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm font-black text-gray-700 transition hover:bg-green-50 hover:text-green-700"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* PC 상담 버튼 */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={SITE.phoneHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-black text-green-700 transition hover:border-green-300 hover:bg-green-50"
            >
              <Phone size={18} />
              전화 상담
            </a>

            <a
              href="#estimate"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700"
            >
              30초 무료 상담
              <ArrowRight size={18} />
            </a>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900 transition hover:bg-gray-50 lg:hidden"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-sm lg:hidden">
          <div className="absolute inset-x-0 top-20 mx-4 overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-2xl">
            <nav className="p-3">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex min-h-14 items-center justify-between rounded-2xl px-5 py-4 text-base font-black text-gray-900 transition hover:bg-green-50 hover:text-green-700"
                >
                  {item.label}
                  <ArrowRight size={18} className="text-green-600" />
                </a>
              ))}
            </nav>

            <div className="grid gap-3 border-t border-gray-100 bg-gray-50 p-4 sm:grid-cols-2">
              <a
                href={SITE.phoneHref}
                onClick={closeMenu}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-green-200 bg-white px-5 py-4 font-black text-green-700"
              >
                <Phone size={20} />
                전화 상담
              </a>

              <a
                href="#estimate"
                onClick={closeMenu}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-black text-white shadow-lg shadow-green-200"
              >
                무료 상담
                <ArrowRight size={19} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}