"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const OPEN_CONSULTATION_EVENT = "woosunsaeng:open-consultation";

const slides = [
  {
    id: "internet",
    desktop: "/home/banners/banner-internet-desktop.svg",
    mobile: "/home/banners/banner-internet-mobile-wide-v11.svg",
    alt: "인터넷과 TV 요금 비교 안내",
    href: "/internet",
    action: "link" as const,
  },
  {
    id: "rental",
    desktop: "/home/banners/banner-rental-desktop.svg",
    mobile: "/home/banners/banner-rental-mobile-wide-v11.svg",
    alt: "생활가전 렌탈 상품 안내",
    href: "/rental",
    action: "link" as const,
  },
  {
    id: "consultation",
    desktop: "/home/banners/banner-consultation-desktop.svg",
    mobile: "/home/banners/banner-consultation-mobile-wide-v11.svg",
    alt: "우선생 간편상담 신청 안내",
    href: "#quick-consultation",
    action: "consultation" as const,
  },
] as const;

const AUTO_PLAY_MS = 5200;
const SWIPE_THRESHOLD = 45;

function getMobileOffset(index: number, current: number) {
  if (index === current) return 0;
  if (index === (current + 1) % slides.length) return 1;
  return -1;
}

function getMobileTransform(offset: number) {
  if (offset === 0) return "translate3d(0, 0, 0)";
  if (offset > 0) return "translate3d(100%, 0, 0)";
  return "translate3d(-100%, 0, 0)";
}

export default function HomeBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  function moveTo(index: number) {
    setCurrent((index + slides.length) % slides.length);
  }

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setCurrent((previous) => (previous + 1) % slides.length);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  function openConsultation() {
    window.dispatchEvent(new CustomEvent(OPEN_CONSULTATION_EVENT));
  }

  return (
    <section aria-label="우선생 주요 안내" className="px-4 pt-3 sm:px-6 sm:pt-5 lg:px-8">
      <div
        className="group relative mx-auto w-full max-w-[1280px] sm:overflow-hidden sm:rounded-[24px] sm:border sm:border-slate-200 sm:bg-white sm:shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;

          const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
          const distance = endX - touchStartX.current;
          touchStartX.current = null;

          if (Math.abs(distance) < SWIPE_THRESHOLD) return;
          moveTo(current + (distance < 0 ? 1 : -1));
        }}
      >
        <div className="sm:hidden">
          <div className="relative aspect-[9/4] w-full overflow-hidden rounded-[16px] touch-pan-y">
            {slides.map((slide, index) => {
              const offset = getMobileOffset(index, current);
              const image = (
                <Image
                  src={slide.mobile}
                  alt={slide.alt}
                  width={900}
                  height={400}
                  priority={index === 0}
                  sizes="calc(100vw - 32px)"
                  draggable={false}
                  className="block h-full w-full object-cover object-center"
                  unoptimized
                />
              );

              return (
                <div
                  key={`${slide.id}-mobile`}
                  aria-hidden={current !== index}
                  className="absolute left-0 top-0 h-full overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-transform duration-500 ease-out"
                  style={{
                    width: "100%",
                    transform: getMobileTransform(offset),
                    zIndex: offset === 0 ? 2 : 1,
                    pointerEvents: offset === 0 ? "auto" : "none",
                  }}
                >
                  {slide.action === "consultation" ? (
                    <button
                      type="button"
                      onClick={openConsultation}
                      className="absolute inset-0 block size-full text-left"
                      tabIndex={current === index ? 0 : -1}
                      aria-label="간편상담 신청 열기"
                    >
                      {image}
                    </button>
                  ) : (
                    <Link
                      href={slide.href}
                      className="absolute inset-0 block size-full"
                      tabIndex={current === index ? 0 : -1}
                      aria-label={slide.alt}
                    >
                      {image}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-1.5 flex items-center justify-center gap-1.5" aria-label="광고 슬라이드 선택">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`${index + 1}번째 광고 보기`}
                aria-current={current === index}
                onClick={() => moveTo(index)}
                className={[
                  "h-1.5 rounded-full transition-all",
                  current === index ? "w-5 bg-emerald-600" : "w-1.5 bg-slate-300",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

        <div className="relative hidden aspect-[40/7] w-full sm:block">
          {slides.map((slide, index) => {
            const image = (
              <Image
                src={slide.desktop}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 1343px) 100vw, 1280px"
                draggable={false}
                className="object-contain"
              />
            );

            return (
              <div
                key={`${slide.id}-desktop`}
                aria-hidden={current !== index}
                className={[
                  "absolute inset-0 transition duration-700 ease-out",
                  current === index
                    ? "pointer-events-auto translate-x-0 opacity-100"
                    : index < current
                      ? "pointer-events-none -translate-x-5 opacity-0"
                      : "pointer-events-none translate-x-5 opacity-0",
                ].join(" ")}
              >
                {slide.action === "consultation" ? (
                  <button
                    type="button"
                    onClick={openConsultation}
                    className="absolute inset-0 block size-full text-left"
                    tabIndex={current === index ? 0 : -1}
                    aria-label="간편상담 신청 열기"
                  >
                    {image}
                  </button>
                ) : (
                  <Link
                    href={slide.href}
                    className="absolute inset-0 block size-full"
                    tabIndex={current === index ? 0 : -1}
                    aria-label={slide.alt}
                  >
                    {image}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="이전 광고"
          onClick={() => moveTo(current - 1)}
          className="pointer-events-none absolute left-3 top-1/2 hidden size-9 -translate-x-1 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-800 opacity-0 shadow-lg backdrop-blur transition duration-200 hover:bg-white group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 sm:flex"
        >
          <ChevronLeft size={21} />
        </button>

        <button
          type="button"
          aria-label="다음 광고"
          onClick={() => moveTo(current + 1)}
          className="pointer-events-none absolute right-3 top-1/2 hidden size-9 translate-x-1 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-800 opacity-0 shadow-lg backdrop-blur transition duration-200 hover:bg-white group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 sm:flex"
        >
          <ChevronRight size={21} />
        </button>

        <div className="absolute bottom-2.5 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/60 bg-slate-950/55 px-3 py-2 backdrop-blur-md sm:flex">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`${index + 1}번째 광고 보기`}
              aria-current={current === index}
              onClick={() => moveTo(index)}
              className={[
                "h-1.5 rounded-full transition-all",
                current === index ? "w-5 bg-white" : "w-1.5 bg-white/45",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
