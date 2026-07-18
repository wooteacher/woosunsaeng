"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Headphones,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import type { MouseEvent } from "react";

const KAKAO_CHAT_URL =
  process.env.NEXT_PUBLIC_KAKAO_CHAT_URL?.trim() ?? "";

export default function HomeKakaoBanner() {
  function handleKakaoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (KAKAO_CHAT_URL) return;

    event.preventDefault();
    window.alert(
      "카카오톡 상담 링크가 아직 연결되지 않았습니다. .env.local에 NEXT_PUBLIC_KAKAO_CHAT_URL을 등록해주세요.",
    );
  }

  return (
    <section
      aria-label="우선생 카카오톡 상담 안내"
      className="relative mt-5 overflow-hidden rounded-[24px] border border-emerald-100 bg-[linear-gradient(105deg,#f7fffa_0%,#ecfdf5_50%,#dcfce7_100%)] shadow-[0_16px_44px_rgba(15,23,42,0.055)] sm:mt-6"
    >
      <div className="absolute -left-16 -top-20 size-52 rounded-full bg-white/80 blur-2xl" />
      <div className="absolute -bottom-28 right-[24%] size-64 rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="absolute right-0 top-0 h-full w-[42%] bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.62)_100%)]" />

      <div className="relative grid min-h-[226px] items-center gap-4 px-5 py-7 sm:min-h-[238px] sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:px-12 lg:py-0">
        <div className="max-w-[650px]">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[11px] font-extrabold text-emerald-700 shadow-sm backdrop-blur sm:text-[12px]">
            <Headphones size={14} strokeWidth={2.4} />
            365일, 24시간 언제든 열려 있어요
          </div>

          <h2 className="mt-3 break-keep text-[23px] font-black leading-[1.2] tracking-[-0.055em] text-slate-950 sm:text-[28px] lg:whitespace-nowrap lg:text-[29px] xl:text-[31px]">
            우리가 선택한 생활서비스 <span className="text-emerald-600">우선생이 쉽게 알려드립니다.</span>
          </h2>

          <p className="mt-2.5 break-keep text-[13px] font-medium leading-5 text-slate-600 sm:text-[14px] sm:leading-6">
            요금 비교부터 최대 혜택, 설치 진행까지 필요한 내용만 쉽고 정확하게 안내합니다.
          </p>

          <a
            href={KAKAO_CHAT_URL || "#"}
            target="_blank"
            rel="noreferrer"
            onClick={handleKakaoClick}
            className="mt-5 inline-flex h-12 min-w-[208px] items-center justify-center gap-2 rounded-2xl bg-[#FEE500] px-5 text-[14px] font-black tracking-[-0.025em] text-slate-950 shadow-[0_12px_26px_rgba(15,23,42,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f5dc00] hover:shadow-[0_16px_30px_rgba(15,23,42,0.16)]"
            aria-label="카카오톡으로 우선생에게 문의하기"
          >
            <MessageCircle size={19} fill="currentColor" strokeWidth={1.6} />
            문의하기
            <ArrowUpRight size={17} strokeWidth={2.5} />
          </a>
        </div>

        <div className="relative hidden h-[214px] lg:block" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 size-[178px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 bg-white/75 shadow-[0_20px_48px_rgba(5,150,105,0.13)] backdrop-blur">
            <div className="absolute inset-[18px] flex items-center justify-center rounded-full bg-[linear-gradient(145deg,#22c55e_0%,#059669_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
              <MessageCircle size={62} fill="currentColor" strokeWidth={1.45} />
            </div>
          </div>

          <div className="absolute left-0 top-7 w-[166px] rounded-[19px] border border-white bg-white/95 p-4 shadow-[0_16px_38px_rgba(15,23,42,0.1)]">
            <div className="flex items-center gap-2 text-[12px] font-black text-slate-900">
              <Sparkles size={16} className="text-emerald-500" />
              조건 비교 완료
            </div>
            <p className="mt-2 text-[11px] font-semibold leading-4 text-slate-500">
              복잡한 요금과 혜택을 한눈에 정리해드려요.
            </p>
          </div>

          <div className="absolute bottom-5 right-0 w-[174px] rounded-[19px] border border-white bg-white/95 p-4 shadow-[0_16px_38px_rgba(15,23,42,0.1)]">
            <div className="flex items-center gap-2 text-[12px] font-black text-slate-900">
              <CheckCircle2 size={17} className="text-emerald-500" />
              빠른 상담 연결
            </div>
            <p className="mt-2 text-[11px] font-semibold leading-4 text-slate-500">
              문의를 남기면 우선생이 빠르게 확인합니다.
            </p>
          </div>

          <div className="absolute bottom-5 left-[138px] size-3 rounded-full bg-emerald-300" />
          <div className="absolute right-[108px] top-4 size-5 rounded-full border-[5px] border-emerald-200 bg-white" />
        </div>
      </div>
    </section>
  );
}
