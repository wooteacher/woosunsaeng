"use client";

import {
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileSearch,
  Headphones,
  MessageCircleMore,
  Phone,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  Wifi,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import {
  customerCenterCategories,
  customerCenterFaqs,
  type CustomerCenterCategory,
} from "@/data/customerCenterFaqs";

const PHONE_NUMBER = "032-422-8010";
const PHONE_HREF = "tel:0324228010";

type QuickMenu = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
};

const quickMenus: QuickMenu[] = [
  {
    title: "인터넷 가입",
    description: "통신사와 요금제를 비교해보세요.",
    href: "/internet",
    icon: <Wifi size={22} />,
  },
  {
    title: "렌탈 상담",
    description: "생활가전 렌탈 조건을 확인하세요.",
    href: "/rental",
    icon: <Sparkles size={22} />,
  },
  {
    title: "간편 가입",
    description: "선택한 상품으로 바로 신청하세요.",
    href: "/internet",
    icon: <ReceiptText size={22} />,
  },
  {
    title: "접수 조회",
    description: "진행 상태 조회 기능을 준비 중입니다.",
    href: "#receipt-check",
    icon: <FileSearch size={22} />,
  },
  {
    title: "카카오 상담",
    description: "카카오 채널 연결을 준비 중입니다.",
    href: "#consultation",
    icon: <MessageCircleMore size={22} />,
  },
  {
    title: "전화 상담",
    description: PHONE_NUMBER,
    href: PHONE_HREF,
    icon: <Phone size={22} />,
    external: true,
  },
];

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-white transition">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
      >
        <span className="break-keep text-[15px] font-extrabold tracking-[-0.025em] text-slate-900 sm:text-[16px]">
          {question}
        </span>

        <span
          className={[
            "flex size-8 shrink-0 items-center justify-center rounded-full transition",
            open
              ? "rotate-180 bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-500",
          ].join(" ")}
        >
          <ChevronDown size={17} />
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-5 sm:px-6">
          <p className="break-keep text-[14px] font-medium leading-7 text-slate-600">
            {answer}
          </p>
        </div>
      )}
    </article>
  );
}

export default function CustomerCenterPage() {
  const [category, setCategory] =
    useState<CustomerCenterCategory>("전체");
  const [query, setQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    customerCenterFaqs[0]?.id ?? null,
  );

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return customerCenterFaqs.filter((faq) => {
      const categoryMatched =
        category === "전체" || faq.category === category;

      const queryMatched =
        !normalizedQuery ||
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery) ||
        faq.category.toLowerCase().includes(normalizedQuery);

      return categoryMatched && queryMatched;
    });
  }, [category, query]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
              <Headphones size={15} />
              우선생 고객센터
            </span>

            <h1 className="mt-5 max-w-3xl break-keep text-[40px] font-extrabold leading-[1.12] tracking-[-0.06em] text-slate-950 sm:text-[56px]">
              무엇을 도와드릴까요?
            </h1>

            <p className="mt-5 max-w-2xl break-keep text-[16px] font-medium leading-8 text-slate-500">
              인터넷, 렌탈, 설치와 지원금에 관한 궁금한 내용을 빠르게
              확인하고 전문 상담사와 연결하세요.
            </p>

            <div className="relative mt-7 max-w-2xl">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="궁금한 내용을 검색해보세요"
                className="h-[58px] w-full rounded-[20px] border border-slate-200 bg-slate-50 pl-12 pr-12 text-[15px] font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="검색어 지우기"
                  className="absolute right-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-slate-500"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold text-emerald-400">
                  상담 진행 순서
                </p>
                <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.04em]">
                  쉽고 빠르게 안내드립니다
                </h2>
              </div>

              <BadgeCheck className="text-emerald-400" size={28} />
            </div>

            <div className="mt-7 space-y-3">
              {[
                ["01", "상담접수"],
                ["02", "조건확인"],
                ["03", "혜택안내"],
                ["04", "설치진행"],
              ].map(([number, label]) => (
                <div
                  key={number}
                  className="flex items-center gap-4 rounded-2xl bg-white/[0.06] px-4 py-4"
                >
                  <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500 text-xs font-extrabold text-white">
                    {number}
                  </span>
                  <span className="text-sm font-bold text-slate-200">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-sm font-extrabold text-emerald-300">
                현재 상담 가능
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-emerald-100/70">
                평균 상담 연결 약 3분
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <p className="text-sm font-extrabold text-emerald-600">QUICK MENU</p>
          <h2 className="mt-2 text-[30px] font-extrabold tracking-[-0.05em] text-slate-950 sm:text-[38px]">
            필요한 메뉴로 빠르게 이동하세요
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickMenus.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_18px_45px_rgba(5,150,105,0.08)]"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[16px] font-extrabold tracking-[-0.03em] text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-1 truncate text-[13px] font-medium text-slate-500">
                  {item.description}
                </p>
              </div>

              <ChevronRight
                className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                size={19}
              />
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="text-center">
            <p className="text-sm font-extrabold text-emerald-600">FAQ</p>
            <h2 className="mt-2 text-[30px] font-extrabold tracking-[-0.05em] text-slate-950 sm:text-[38px]">
              자주 묻는 질문
            </h2>
            <p className="mt-3 break-keep text-sm font-medium leading-7 text-slate-500">
              찾는 답변이 없다면 아래 상담 메뉴를 통해 문의해주세요.
            </p>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {customerCenterCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setOpenFaqId(null);
                }}
                className={[
                  "h-10 shrink-0 rounded-full px-4 text-sm font-extrabold transition",
                  category === item
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {filteredFaqs.map((faq) => (
              <FaqItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                open={openFaqId === faq.id}
                onToggle={() =>
                  setOpenFaqId((current) =>
                    current === faq.id ? null : faq.id,
                  )
                }
              />
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
              <CircleHelp className="mx-auto text-slate-400" size={32} />
              <p className="mt-4 text-base font-extrabold text-slate-800">
                검색 결과가 없습니다.
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                다른 검색어를 입력하거나 상담을 이용해주세요.
              </p>
            </div>
          )}
        </div>
      </section>

      <section
        id="receipt-check"
        className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Clock3 size={22} />
            </div>
            <h3 className="mt-5 text-xl font-extrabold tracking-[-0.04em] text-slate-950">
              상담 운영시간
            </h3>
            <div className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
              <div className="flex justify-between gap-4">
                <span>평일</span>
                <span className="font-extrabold text-slate-900">
                  운영시간 추후 확정
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span>주말·공휴일</span>
                <span className="font-extrabold text-slate-900">
                  운영시간 추후 확정
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={22} />
            </div>
            <h3 className="mt-5 text-xl font-extrabold tracking-[-0.04em] text-slate-950">
              안심 상담
            </h3>
            <ul className="mt-5 space-y-3">
              {[
                "조건 확인 후 정확한 혜택 안내",
                "설치 진행까지 전담 관리",
                "설치 후 지원금 당일 지급",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600"
                >
                  <Check
                    className="mt-1 shrink-0 text-emerald-600"
                    size={15}
                    strokeWidth={3}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_22px_60px_rgba(15,23,42,0.2)]">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <FileSearch size={22} />
            </div>
            <h3 className="mt-5 text-xl font-extrabold tracking-[-0.04em]">
              접수 조회
            </h3>
            <p className="mt-3 break-keep text-sm font-medium leading-6 text-slate-400">
              접수번호와 휴대폰번호로 진행 상태를 확인하는 기능을 준비
              중입니다.
            </p>
            <span className="mt-5 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold text-slate-300">
              COMING SOON
            </span>
          </div>
        </div>
      </section>

      <section
        id="consultation"
        className="border-t border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20">
          <div className="rounded-[34px] bg-emerald-600 px-6 py-10 text-white shadow-[0_28px_80px_rgba(5,150,105,0.24)] sm:px-10 sm:py-14 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="text-sm font-extrabold text-emerald-100">
                아직 궁금한 점이 남아 있나요?
              </p>
              <h2 className="mt-2 break-keep text-[30px] font-extrabold tracking-[-0.05em] sm:text-[40px]">
                전문 상담사가 가장 좋은 조건을 안내드립니다.
              </h2>
              <p className="mt-3 break-keep text-sm font-medium leading-7 text-emerald-100/80">
                상담접수 후 조건확인, 혜택안내, 설치진행까지 함께
                관리합니다.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
              <a
                href={PHONE_HREF}
                className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-50"
              >
                <Phone size={18} />
                전화 상담
              </a>

              <a
                href="/internet"
                className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 text-sm font-extrabold text-white transition hover:bg-white/20"
              >
                <MessageCircleMore size={18} />
                상담 접수
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
