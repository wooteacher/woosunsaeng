"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PhoneCall, X } from "lucide-react";
import { useEffect, useState } from "react";

import Container from "@/components/ui/Container";
import Logo from "@/components/layout/Logo";

const PHONE_NUMBER = "0324228010";

const navigation = [
  { label: "인터넷", href: "/internet" },
  { label: "렌탈", href: "/rental" },
  { label: "고객센터", href: "/support" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <Container>
        <div className="flex h-[72px] items-center justify-between lg:h-20">
          {/* 왼쪽: 로고 + 메뉴 */}
          <div className="flex min-w-0 items-center">
            <Logo />

            <nav
              aria-label="주요 메뉴"
              className="ml-10 hidden items-center gap-7 lg:flex xl:ml-14 xl:gap-8"
            >
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "relative flex h-20 items-center whitespace-nowrap text-[15px] font-semibold tracking-[-0.025em] transition-colors",
                      active
                        ? "text-green-700"
                        : "text-slate-700 hover:text-green-700",
                    ].join(" ")}
                  >
                    {item.label}

                    {active && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-green-600" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 오른쪽: 전화 CTA */}
          <div className="hidden items-center lg:flex">
            <a
              href={`tel:${PHONE_NUMBER}`}
              aria-label="우선생 전화 상담"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-green-600 px-5 text-[15px] font-bold tracking-[-0.025em] text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-600/20"
            >
              <PhoneCall
                aria-hidden="true"
                className="h-[18px] w-[18px]"
                strokeWidth={2.3}
              />
              우선생 물어보기
            </a>
          </div>

          {/* 모바일 우측 */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${PHONE_NUMBER}`}
              aria-label="우선생 전화 상담"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-green-600 px-3.5 text-sm font-bold tracking-[-0.025em] text-white transition-colors hover:bg-green-700"
            >
              <PhoneCall
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2.3}
              />

              <span className="hidden sm:inline">우선생 물어보기</span>
              <span className="sm:hidden">물어보기</span>
            </a>

            <button
              type="button"
              aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/10"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* 모바일 배경 */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 top-[72px] z-40 bg-slate-950/20 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* 모바일 메뉴 */}
      <div
        id="mobile-navigation"
        className={[
          "absolute inset-x-0 top-full z-50 overflow-hidden border-b border-slate-200 bg-white shadow-lg transition-all duration-200 lg:hidden",
          mobileOpen
            ? "visible max-h-80 opacity-100"
            : "invisible max-h-0 opacity-0",
        ].join(" ")}
      >
        <Container>
          <nav aria-label="모바일 주요 메뉴" className="space-y-1 py-4">
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex min-h-12 items-center rounded-xl px-4 text-[15px] font-semibold tracking-[-0.025em] transition-colors",
                    active
                      ? "bg-green-50 text-green-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-green-700",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Container>
      </div>
    </header>
  );
}