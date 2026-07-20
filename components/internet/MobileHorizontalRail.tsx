"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type MobileHorizontalRailProps = {
  children: ReactNode;
  className?: string;
  scrollClassName?: string;
  ariaLabel: string;
  resetKey?: string;
};

export default function MobileHorizontalRail({
  children,
  className = "",
  scrollClassName = "",
  ariaLabel,
  resetKey = ariaLabel,
}: MobileHorizontalRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const railId = useId();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const getItems = useCallback(() => {
    const viewport = scrollRef.current;
    if (!viewport) return [];

    return Array.from(
      viewport.querySelectorAll<HTMLElement>(":scope > [data-rail-item]"),
    );
  }, []);

  const syncFromScroll = useCallback(() => {
    const viewport = scrollRef.current;
    const items = getItems();
    if (!viewport || items.length === 0) return;

    const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    const threshold = 4;

    setCanScrollPrev(viewport.scrollLeft > threshold);
    setCanScrollNext(viewport.scrollLeft < maxScrollLeft - threshold);

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - viewport.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setCurrentIndex(closestIndex);
  }, [getItems]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const viewport = scrollRef.current;
      const items = getItems();
      if (!viewport || items.length === 0) return;

      const nextIndex = Math.min(Math.max(index, 0), items.length - 1);
      const target = items[nextIndex];

      viewport.scrollTo({
        left: target.offsetLeft,
        behavior,
      });
      setCurrentIndex(nextIndex);

      window.setTimeout(syncFromScroll, behavior === "smooth" ? 260 : 0);
    },
    [getItems, syncFromScroll],
  );

  useLayoutEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;

    const resetFrame = window.requestAnimationFrame(() => {
      viewport.scrollTo({ left: 0, behavior: "auto" });
      setCurrentIndex(0);
      syncFromScroll();
    });

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(syncFromScroll);
    });

    resizeObserver.observe(viewport);
    getItems().forEach((item) => resizeObserver.observe(item));
    viewport.addEventListener("scroll", syncFromScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll);

    return () => {
      window.cancelAnimationFrame(resetFrame);
      resizeObserver.disconnect();
      viewport.removeEventListener("scroll", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
    };
  }, [getItems, resetKey, syncFromScroll]);

  const buttonBase =
    "absolute top-1/2 z-30 flex size-8 -translate-y-1/2 touch-manipulation select-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.18)] transition hover:border-slate-300 active:scale-90 sm:hidden";

  return (
    <div className={`relative min-w-0 ${className}`}>
      {canScrollPrev ? (
        <button
          type="button"
          aria-controls={railId}
          aria-label={`${ariaLabel} 이전 항목`}
          onClick={() => scrollToIndex(currentIndex - 1)}
          className={`${buttonBase} -left-1`}
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
      ) : null}

      <div
        id={railId}
        ref={scrollRef}
        className={[
          "relative scroll-smooth overscroll-x-contain [touch-action:pan-x]",
          scrollClassName,
        ].join(" ")}
      >
        {children}
      </div>

      {canScrollNext ? (
        <button
          type="button"
          aria-controls={railId}
          aria-label={`${ariaLabel} 다음 항목`}
          onClick={() => scrollToIndex(currentIndex + 1)}
          className={`${buttonBase} -right-1`}
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      ) : null}
    </div>
  );
}
