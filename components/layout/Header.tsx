"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Menu,
  Phone,
  X,
} from "lucide-react";

import Container from "@/components/ui/Container";
import { SITE } from "@/lib/site";

const navigation = [
  {
    label: "인터넷",
    href: "#internet",
  },
  {
    label: "렌탈",
    href: "#rental",
  },
  {
    label: "우선생",
    href: "#why-us",
  },
  {
    label: "상담신청",
    href: "#estimate",
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  useEffect(() => {
    document.body.style.overflow =
      menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);


  const closeMenu = () => {
    setMenuOpen(false);
  };


  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-gray-200 bg-white/90 shadow-sm backdrop-blur-xl"
            : "border-transparent bg-white/80 backdrop-blur-md",
        ].join(" ")}
      >
        <Container>

          <div
            className={[
              "flex items-center justify-between",
              scrolled
                ? "min-h-16"
                : "min-h-[72px]",
            ].join(" ")}
          >

            <Link
              href="/"
              onClick={closeMenu}
              className="flex flex-col"
            >

              <span className="text-2xl font-black tracking-[-0.06em] text-gray-950 sm:text-3xl">
                우<span className="text-green-600">선생</span>
              </span>


              <span
                className={[
                  "text-xs font-bold text-gray-500 transition-all",
                  scrolled
                    ? "hidden"
                    : "block",
                ].join(" ")}
              >
                우리가 선택한 생활서비스
              </span>

            </Link>



            <nav className="hidden items-center gap-1 lg:flex">

              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                >
                  {item.label}
                </a>
              ))}

            </nav>



            <div className="hidden items-center gap-3 lg:flex">

              <a
                href={SITE.phoneHref}
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-900 transition hover:border-green-300 hover:bg-green-50"
              >

                <Phone size={17}/>

                전화 상담

              </a>


              <a
                href="#estimate"
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700"
              >

                무료 상담

                <ArrowRight size={17}/>

              </a>

            </div>



            <button
              type="button"
              onClick={() =>
                setMenuOpen((prev) => !prev)
              }
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm lg:hidden"
              aria-label="메뉴 열기"
            >

              {menuOpen
                ? <X size={23}/>
                : <Menu size={23}/>
              }

            </button>


          </div>

        </Container>
      </header>



      {menuOpen && (

        <div
          className="fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-sm lg:hidden"
          onClick={closeMenu}
        >

          <div
            className="absolute left-4 right-4 top-20 overflow-hidden rounded-[28px] bg-white shadow-2xl"
            onClick={(e)=>e.stopPropagation()}
          >

            <nav className="p-3">

              {navigation.map((item)=>(
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex min-h-14 items-center justify-between rounded-2xl px-5 py-4 text-base font-black text-gray-900 hover:bg-green-50 hover:text-green-700"
                >

                  {item.label}

                  <ArrowRight
                    size={18}
                    className="text-green-600"
                  />

                </a>
              ))}

            </nav>



            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 bg-gray-50 p-4">

              <a
                href={SITE.phoneHref}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white font-black text-gray-900"
              >

                <Phone size={18}/>

                전화

              </a>


              <a
                href="#estimate"
                onClick={closeMenu}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-600 font-black text-white"
              >

                상담 신청

                <ArrowRight size={18}/>

              </a>

            </div>


          </div>

        </div>

      )}

    </>
  );
}