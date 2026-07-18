"use client";

import Link from "next/link";
import { Check, ChevronRight, Menu, MessageCircle, NotebookPen, X } from "lucide-react";
import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";

import BrandLogo from "@/components/common/BrandLogo";
import { supabase } from "@/lib/supabase";

const OPEN_CONSULTATION_EVENT = "woosunsaeng:open-consultation";
const KAKAO_CHAT_URL =
  process.env.NEXT_PUBLIC_KAKAO_CHAT_URL?.trim() ?? "";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function KakaoConsultationButton({
  className,
  onBeforeOpen,
}: {
  className: string;
  onBeforeOpen?: () => void;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onBeforeOpen?.();

    if (!KAKAO_CHAT_URL) {
      event.preventDefault();
      window.alert(
        "카카오톡 상담 링크가 아직 연결되지 않았습니다. .env.local에 NEXT_PUBLIC_KAKAO_CHAT_URL을 등록해주세요.",
      );
    }
  }

  return (
    <a
      href={KAKAO_CHAT_URL || "#"}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      className={className}
      aria-label="카카오톡 상담 열기"
    >
      <MessageCircle size={17} strokeWidth={2.4} />
      카톡상담
    </a>
  );
}

function QuickConsultationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const nameId = useId();
  const phoneId = useId();
  const privacyId = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  function resetAndClose() {
    onClose();
    window.setTimeout(() => {
      setDone(false);
      setError("");
    }, 250);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("이름과 정확한 연락처를 입력해주세요.");
      return;
    }

    if (!privacyAgreed) {
      setError("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: insertError } = await supabase.from("consultations").insert({
      name: name.trim(),
      phone: phone.trim(),
      service: "메인 간편상담",
    });

    setLoading(false);

    if (insertError) {
      console.error(insertError);
      setError("상담 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setDone(true);
    setName("");
    setPhone("");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120]"
      role="dialog"
      aria-modal="true"
      aria-label="간편상담 신청"
    >
      <button
        type="button"
        aria-label="간편상담 닫기"
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
        onClick={resetAndClose}
      />

      <section className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[28px] bg-white shadow-[0_-24px_70px_rgba(15,23,42,0.18)] sm:bottom-auto sm:left-auto sm:right-5 sm:top-[82px] sm:w-[370px] sm:rounded-[24px] sm:border sm:border-slate-200 sm:shadow-[0_24px_70px_rgba(15,23,42,0.16)] lg:right-8">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
          <div>
            <p className="text-[12px] font-extrabold text-emerald-600">
              EASY CONSULTATION
            </p>
            <h2 className="mt-1 text-[22px] font-black tracking-[-0.04em] text-slate-950">
              간편상담 신청
            </h2>
            <p className="mt-2 break-keep text-[13px] font-medium leading-5 text-slate-500">
              이름과 연락처를 남겨주시면 상담사가 빠르게 연락드립니다.
            </p>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check size={28} strokeWidth={3} />
            </span>
            <h3 className="mt-5 text-[22px] font-black tracking-[-0.04em] text-slate-950">
              상담 접수가 완료되었습니다.
            </h3>
            <p className="mt-3 text-[14px] font-medium leading-6 text-slate-500">
              접수 내용을 확인한 뒤 순차적으로 연락드리겠습니다.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="mt-7 h-12 w-full rounded-xl bg-emerald-600 text-[14px] font-extrabold text-white transition hover:bg-emerald-700"
            >
              확인
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-5 pb-6 pt-5 sm:px-6">
            <label htmlFor={nameId} className="block">
              <span className="text-[13px] font-extrabold text-slate-800">
                이름
              </span>
              <input
                id={nameId}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="이름을 입력해주세요"
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[14px] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </label>

            <label htmlFor={phoneId} className="mt-4 block">
              <span className="text-[13px] font-extrabold text-slate-800">
                연락처
              </span>
              <input
                id={phoneId}
                value={phone}
                onChange={(event) => setPhone(formatPhone(event.target.value))}
                inputMode="tel"
                autoComplete="tel"
                placeholder="010-1234-5678"
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[14px] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </label>

            <label
              htmlFor={privacyId}
              className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3"
            >
              <input
                id={privacyId}
                type="checkbox"
                checked={privacyAgreed}
                onChange={(event) => setPrivacyAgreed(event.target.checked)}
                className="mt-0.5 size-4 accent-emerald-600"
              />
              <span className="text-[12px] font-bold leading-5 text-slate-600">
                개인정보 수집 및 이용에 동의합니다.
                <Link
                  href="/privacy"
                  className="ml-1 text-slate-900 underline underline-offset-2"
                >
                  자세히 보기
                </Link>
              </span>
            </label>

            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-[12px] font-bold leading-5 text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-[14px] font-extrabold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "접수 중..." : "상담 신청하기"}
              {!loading && <ChevronRight size={17} strokeWidth={2.6} />}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);

  useEffect(() => {
    const openConsultation = () => {
      setMenuOpen(false);
      setConsultationOpen(true);
    };

    window.addEventListener(OPEN_CONSULTATION_EVENT, openConsultation);
    return () =>
      window.removeEventListener(OPEN_CONSULTATION_EVENT, openConsultation);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || consultationOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, consultationOpen]);

  function openConsultation() {
    setMenuOpen(false);
    setConsultationOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-[90] border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] max-w-[1344px] items-center justify-between px-4 sm:h-[68px] sm:px-6 lg:px-8">
          <div className="flex h-9 shrink-0 items-center">
            <BrandLogo priority />
          </div>

          <nav
            className="hidden items-center gap-9 lg:flex"
            aria-label="주요 메뉴"
          >
            <Link
              href="/internet"
              className="text-[15px] font-extrabold tracking-[-0.02em] text-slate-800 transition hover:text-emerald-600"
            >
              인터넷
            </Link>
            <Link
              href="/rental"
              className="text-[15px] font-extrabold tracking-[-0.02em] text-slate-800 transition hover:text-emerald-600"
            >
              렌탈
            </Link>
            <Link
              href="/customer-center"
              className="text-[15px] font-extrabold tracking-[-0.02em] text-slate-800 transition hover:text-emerald-600"
            >
              고객센터
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <KakaoConsultationButton
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FEE500] px-3.5 text-[12px] font-extrabold text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition hover:bg-[#f5dc00]"
              />

              <button
                type="button"
                onClick={openConsultation}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-[12px] font-extrabold text-white shadow-[0_8px_22px_rgba(5,150,105,0.18)] transition hover:bg-emerald-700"
              >
                <NotebookPen size={17} strokeWidth={2.4} />
                간편상담
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 lg:hidden"
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[85] bg-slate-950/30 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setMenuOpen(false)}
            aria-label="메뉴 닫기"
          />

          <div className="absolute inset-x-4 top-[76px] overflow-hidden rounded-[22px] border border-slate-200 bg-white p-2.5 shadow-2xl">
            <Link
              href="/internet"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center justify-between rounded-xl px-4 text-[15px] font-extrabold text-slate-900 hover:bg-emerald-50"
            >
              인터넷
              <ChevronRight size={18} className="text-emerald-600" />
            </Link>
            <Link
              href="/rental"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center justify-between rounded-xl px-4 text-[15px] font-extrabold text-slate-900 hover:bg-emerald-50"
            >
              렌탈
              <ChevronRight size={18} className="text-emerald-600" />
            </Link>
            <Link
              href="/customer-center"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 w-full items-center justify-between rounded-xl px-4 text-left text-[15px] font-extrabold text-slate-900 hover:bg-emerald-50"
            >
              고객센터
              <ChevronRight size={18} className="text-emerald-600" />
            </Link>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <KakaoConsultationButton
                onBeforeOpen={() => setMenuOpen(false)}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-3 text-[13px] font-extrabold text-slate-950"
              />

              <button
                type="button"
                onClick={openConsultation}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-[13px] font-extrabold text-white"
              >
                <NotebookPen size={17} />
                간편상담
              </button>
            </div>
          </div>
        </div>
      )}

      <QuickConsultationPanel
        open={consultationOpen}
        onClose={() => setConsultationOpen(false)}
      />
    </>
  );
}
