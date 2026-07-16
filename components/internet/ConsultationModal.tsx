"use client";

import { Check, Copy, MessageCircle, PhoneCall, X } from "lucide-react";
import { useEffect, useState } from "react";

type ConsultationModalProps = {
  open: boolean;
  onClose: () => void;
  receiptCode: string;
  productSummary: string;
  estimatedMonthlyPrice: number;
};

const PHONE_NUMBER = "0324228010";
const KAKAO_CHAT_URL = "https://pf.kakao.com/";

const formatPrice = (price: number) => price.toLocaleString("ko-KR");

export default function ConsultationModal({
  open,
  onClose,
  receiptCode,
  productSummary,
  estimatedMonthlyPrice,
}: ConsultationModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(receiptCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
    >
      <button
        type="button"
        aria-label="상담창 닫기"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.32)]">
        <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
          <div>
            <p className="text-sm font-bold text-emerald-600">상담 접수</p>
            <h2
              id="consultation-modal-title"
              className="mt-1 text-[23px] font-extrabold tracking-[-0.04em] text-slate-950"
            >
              상담 방법을 선택해주세요.
            </h2>
          </div>

          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-bold text-emerald-700">접수번호</p>

            <div className="mt-2 flex items-center justify-between gap-3">
              <strong className="text-[30px] font-extrabold tracking-[0.08em] text-emerald-950">
                {receiptCode}
              </strong>

              <button
                type="button"
                onClick={copyCode}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 text-xs font-bold text-emerald-700"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "복사됨" : "복사"}
              </button>
            </div>

            <p className="mt-3 text-xs font-medium leading-5 text-emerald-800/75">
              상담원에게 접수번호를 알려주시면 상품을 빠르게 확인할 수 있습니다.
            </p>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 px-4">
            <div className="flex items-start justify-between gap-4 py-3.5">
              <span className="text-sm font-medium text-slate-500">선택 상품</span>
              <span className="text-right text-sm font-bold leading-5 text-slate-950">
                {productSummary}
              </span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex items-center justify-between gap-4 py-3.5">
              <span className="text-sm font-medium text-slate-500">예상 월요금</span>
              <span className="text-base font-extrabold text-slate-950">
                {formatPrice(estimatedMonthlyPrice)}원
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white"
          >
            <PhoneCall size={18} />
            상담원 연결
          </a>

          <button
            type="button"
            onClick={() => window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer")}
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#FEE500] px-4 text-sm font-bold text-slate-950"
          >
            <MessageCircle size={18} />
            카톡 상담
          </button>
        </div>
      </div>
    </div>
  );
}
