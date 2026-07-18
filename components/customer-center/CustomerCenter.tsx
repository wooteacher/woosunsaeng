"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Gift,
  Headphones,
  HelpCircle,
  MessageCircle,
  NotebookPen,
  Router,
  Search,
  ShieldCheck,
  WashingMachine,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type MouseEvent } from "react";

const OPEN_CONSULTATION_EVENT = "woosunsaeng:open-consultation";
const KAKAO_CHAT_URL =
  process.env.NEXT_PUBLIC_KAKAO_CHAT_URL?.trim() ?? "";

type CategoryId =
  | "all"
  | "internet"
  | "rental"
  | "benefit"
  | "installation"
  | "consultation";

type Category = {
  id: CategoryId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

type FaqItem = {
  id: string;
  category: Exclude<CategoryId, "all">;
  question: string;
  answer: string;
};

const categories: Category[] = [
  { id: "all", label: "전체 질문", shortLabel: "전체", icon: HelpCircle },
  {
    id: "internet",
    label: "인터넷 · TV",
    shortLabel: "인터넷",
    icon: Router,
  },
  { id: "rental", label: "생활가전 렌탈", shortLabel: "렌탈", icon: WashingMachine },
  { id: "benefit", label: "혜택 · 지급", shortLabel: "혜택", icon: Gift },
  { id: "installation", label: "설치 · A/S", shortLabel: "설치", icon: Wrench },
  { id: "consultation", label: "상담 · 접수", shortLabel: "상담", icon: Headphones },
];

const faqItems: FaqItem[] = [
  {
    id: "internet-process",
    category: "internet",
    question: "인터넷 가입은 어떤 순서로 진행되나요?",
    answer:
      "상담접수 → 조건확인 → 혜택안내 → 설치진행 순서로 진행됩니다. 주소지 설치 가능 여부와 이용 중인 통신사, 휴대폰 결합, TV 필요 여부를 확인한 뒤 알맞은 조건을 안내해드립니다.",
  },
  {
    id: "internet-carrier",
    category: "internet",
    question: "어떤 통신사가 가장 저렴한가요?",
    answer:
      "설치 주소, 인터넷 속도, TV 이용 여부, 휴대폰 결합과 제휴카드 사용 여부에 따라 달라집니다. 우선생 인터넷 페이지에서 먼저 비교한 뒤 상담을 통해 실제 적용 가능한 조건을 최종 확인할 수 있습니다.",
  },
  {
    id: "internet-only",
    category: "internet",
    question: "TV 없이 인터넷만 가입할 수 있나요?",
    answer:
      "가능합니다. 인터넷 페이지에서 TV를 ‘선택 안함’으로 설정하면 인터넷 단독 요금과 예상 혜택을 확인할 수 있습니다.",
  },
  {
    id: "internet-discount",
    category: "internet",
    question: "휴대폰 결합과 제휴카드 할인도 확인할 수 있나요?",
    answer:
      "원하는 할인 항목만 선택해 비교할 수 있습니다. 다만 결합 가능 회선, 사용 중인 요금제, 카드 실적 조건에 따라 실제 할인 금액이 달라질 수 있어 상담사가 최종 적용 여부를 다시 확인합니다.",
  },
  {
    id: "rental-apply",
    category: "rental",
    question: "렌탈 상품은 어떻게 신청하나요?",
    answer:
      "렌탈 페이지에서 원하는 상품을 확인한 뒤 상담을 신청하면 됩니다. 제품, 색상, 약정 기간, 관리 방식과 설치 환경을 확인한 후 최종 렌탈 조건을 안내해드립니다.",
  },
  {
    id: "rental-price",
    category: "rental",
    question: "표시된 월 렌탈료가 최종 금액인가요?",
    answer:
      "상품의 약정 기간, 의무사용 기간, 방문관리 또는 셀프관리, 프로모션 적용 여부에 따라 달라질 수 있습니다. 신청 전 상담을 통해 최종 월 렌탈료와 계약 조건을 다시 안내합니다.",
  },
  {
    id: "rental-install",
    category: "rental",
    question: "렌탈 제품 설치일은 어떻게 정해지나요?",
    answer:
      "접수 완료 후 해당 렌탈사에서 고객님께 연락해 배송과 설치 가능한 날짜를 조율합니다. 재고와 지역별 설치 일정에 따라 날짜가 달라질 수 있습니다.",
  },
  {
    id: "rental-as",
    category: "rental",
    question: "렌탈 제품 사용 중 A/S가 필요하면 어떻게 하나요?",
    answer:
      "제품 고장과 정기 관리 접수는 계약한 렌탈사 또는 제조사 고객센터에서 처리됩니다. 계약 정보를 찾기 어렵다면 우선생 상담으로 남겨주시면 확인해야 할 접수처를 안내해드립니다.",
  },
  {
    id: "benefit-types",
    category: "benefit",
    question: "가입 혜택은 어떻게 안내되나요?",
    answer:
      "혜택은 설치비, 상품권, 현금 항목으로 구분해 안내합니다. 상품과 신청 조건에 따라 금액이 달라지며 추가 혜택과 최종 지급 조건은 상담사가 다시 안내합니다.",
  },
  {
    id: "benefit-payment",
    category: "benefit",
    question: "혜택은 언제 지급되나요?",
    answer:
      "설치 완료가 확인되고 상담 시 안내한 지급 조건이 충족되면 설치 당일 지급을 원칙으로 진행합니다. 상품권 등 외부 발송 항목은 발송 주체의 일정에 따라 도착 시점이 달라질 수 있습니다.",
  },
  {
    id: "benefit-change",
    category: "benefit",
    question: "상담 후 상품을 변경하면 혜택도 달라지나요?",
    answer:
      "통신사, 인터넷 속도, TV 상품, 결합 조건 또는 렌탈 모델이 변경되면 월 요금과 혜택이 함께 바뀔 수 있습니다. 변경 전 최종 조건을 다시 안내받은 뒤 진행해주세요.",
  },
  {
    id: "installation-ready",
    category: "installation",
    question: "인터넷 설치 전에 무엇을 준비해야 하나요?",
    answer:
      "설치 주소, 신청자 본인 확인 정보, 희망 설치일과 기존 통신사 이용 여부를 준비하면 상담이 빨라집니다. 건물 또는 지역 상황에 따라 설치 가능 여부를 먼저 확인할 수 있습니다.",
  },
  {
    id: "installation-change",
    category: "installation",
    question: "설치 일정 변경이나 취소는 어떻게 하나요?",
    answer:
      "설치 전에는 가능한 한 빠르게 우선생 상담 또는 설치 기사 안내 연락처로 요청해주세요. 설치 완료 후 변경과 해지는 통신사 또는 렌탈사의 계약 조건과 위약금 기준이 적용될 수 있습니다.",
  },
  {
    id: "installation-trouble",
    category: "installation",
    question: "설치 후 인터넷이나 TV에 문제가 생겼어요.",
    answer:
      "모뎀, 공유기, 셋톱박스 전원과 케이블 연결을 먼저 확인해주세요. 문제가 계속되면 가입한 통신사 장애 접수 고객센터에서 원격 점검 또는 기사 방문을 신청할 수 있습니다.",
  },
  {
    id: "consultation-time",
    category: "consultation",
    question: "상담을 신청하면 언제 연락이 오나요?",
    answer:
      "접수 순서대로 연락드리며 현재 평균 상담 연결 시간은 약 3분입니다. 문의가 몰리는 시간에는 다소 늦어질 수 있습니다.",
  },
  {
    id: "consultation-data",
    category: "consultation",
    question: "간편상담에 입력한 정보는 어디에 사용되나요?",
    answer:
      "입력한 이름과 연락처는 상담 접수와 상품 안내를 위해 사용됩니다. 자세한 내용은 개인정보처리방침에서 확인할 수 있습니다.",
  },
];

const notices = [
  {
    label: "상담 안내",
    title: "정확한 연락처를 남겨주시면 접수 순서대로 안내드립니다.",
  },
  {
    label: "혜택 안내",
    title: "최종 혜택과 지급 조건은 설치 전 상담 내용으로 다시 확인해주세요.",
  },
  {
    label: "설치 안내",
    title: "설치와 A/S 일정은 통신사·렌탈사 및 지역 상황에 따라 달라질 수 있습니다.",
  },
];

function scrollToFaq() {
  document.getElementById("faq")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function CustomerCenter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");
  const [openFaq, setOpenFaq] = useState<string | null>(faqItems[0]?.id ?? null);

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");

    return faqItems.filter((item) => {
      const categoryMatches = category === "all" || item.category === category;
      const queryMatches =
        !normalizedQuery ||
        `${item.question} ${item.answer}`
          .toLocaleLowerCase("ko-KR")
          .includes(normalizedQuery);

      return categoryMatches && queryMatches;
    });
  }, [category, query]);

  function selectCategory(nextCategory: CategoryId) {
    setCategory(nextCategory);
    setOpenFaq(null);
    scrollToFaq();
  }

  function openConsultation() {
    window.dispatchEvent(new Event(OPEN_CONSULTATION_EVENT));
  }

  function handleKakaoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (KAKAO_CHAT_URL) return;

    event.preventDefault();
    window.alert(
      "카카오톡 상담 링크가 아직 연결되지 않았습니다. .env.local에 NEXT_PUBLIC_KAKAO_CHAT_URL을 등록해주세요.",
    );
  }

  return (
    <>
      <section className="px-4 pb-7 pt-4 sm:px-6 sm:pb-8 sm:pt-5 lg:px-8">
        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[24px] border border-emerald-800/10 bg-[linear-gradient(135deg,#064e3b_0%,#059669_60%,#34d399_125%)] shadow-[0_16px_50px_rgba(15,23,42,0.07)] lg:aspect-[40/7]">
          <div className="absolute -right-12 -top-24 size-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 right-[27%] size-72 rounded-full bg-emerald-300/15 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col justify-center gap-6 px-5 py-8 sm:px-8 sm:py-9 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(440px,1.1fr)] lg:items-center lg:gap-10 lg:px-12 lg:py-0">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-2 text-[12px] font-extrabold text-emerald-50 ring-1 ring-inset ring-white/15 sm:text-[13px]">
                <Headphones size={16} strokeWidth={2.3} />
                우선생 고객센터
              </div>

              <h1 className="mt-4 break-keep text-[29px] font-black leading-[1.16] tracking-[-0.055em] text-white sm:text-[34px] lg:text-[38px]">
                궁금한 내용을
                <span className="block text-emerald-100">빠르게 찾아보세요</span>
              </h1>
              <p className="mt-2.5 max-w-[520px] break-keep text-[13px] font-medium leading-5 text-emerald-50/85 sm:text-[14px]">
                인터넷·TV, 렌탈, 혜택 지급, 설치와 A/S 안내를 한곳에 정리했습니다.
              </p>
            </div>

            <div className="w-full">
              <label className="flex h-[56px] w-full items-center gap-3 rounded-2xl bg-white px-4 text-left shadow-[0_18px_45px_rgba(4,47,46,0.20)] sm:h-[60px] sm:px-5">
                <Search className="shrink-0 text-emerald-600" size={21} strokeWidth={2.35} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onFocus={scrollToFaq}
                  placeholder="궁금한 내용을 검색해보세요"
                  className="min-w-0 flex-1 bg-transparent text-[14px] font-bold text-slate-950 outline-none placeholder:font-medium placeholder:text-slate-400 sm:text-[15px]"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-extrabold text-slate-500 transition hover:bg-slate-200"
                  >
                    지우기
                  </button>
                )}
              </label>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-emerald-50/85 sm:text-[12px]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} strokeWidth={2.4} />
                  자주 묻는 질문 바로 확인
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} strokeWidth={2.4} />
                  평균 상담 연결 약 3분
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-3 sm:grid-cols-2">
          <a
            href={KAKAO_CHAT_URL || "#"}
            target="_blank"
            rel="noreferrer"
            onClick={handleKakaoClick}
            className="group flex min-h-[126px] items-center gap-4 rounded-[22px] border border-[#f3dc00] bg-[#FEE500] px-5 py-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_38px_rgba(15,23,42,0.08)] sm:px-6"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-[#FEE500] sm:size-14">
              <MessageCircle size={26} strokeWidth={2.3} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-extrabold text-slate-700">
                실시간 문의
              </span>
              <strong className="mt-1 block text-[21px] font-black tracking-[-0.045em] text-slate-950 sm:text-[23px]">
                카톡상담
              </strong>
              <span className="mt-1 block break-keep text-[12px] font-bold text-slate-700 sm:text-[13px]">
                카카오톡으로 궁금한 내용을 바로 물어보세요.
              </span>
            </span>
            <ArrowRight className="shrink-0 transition group-hover:translate-x-1" size={21} />
          </a>

          <button
            type="button"
            onClick={openConsultation}
            className="group flex min-h-[126px] items-center gap-4 rounded-[22px] border border-emerald-200 bg-white px-5 py-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-[0_15px_38px_rgba(15,23,42,0.07)] sm:px-6"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white sm:size-14">
              <NotebookPen size={25} strokeWidth={2.3} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-extrabold text-emerald-600">
                연락처만 남기면
              </span>
              <strong className="mt-1 block text-[21px] font-black tracking-[-0.045em] text-slate-950 sm:text-[23px]">
                간편상담
              </strong>
              <span className="mt-1 block break-keep text-[12px] font-bold text-slate-500 sm:text-[13px]">
                상담사가 접수 내용을 확인하고 빠르게 연락드립니다.
              </span>
            </span>
            <ArrowRight className="shrink-0 text-emerald-600 transition group-hover:translate-x-1" size={21} />
          </button>
        </div>
      </section>

      <section className="px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8">
        <div className="mx-auto max-w-[1280px] rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
            {categories.map(({ icon: Icon, ...item }) => {
              const selected = category === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCategory(item.id)}
                  className={[
                    "flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-center transition",
                    selected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-slate-100 bg-slate-50 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/60 hover:text-emerald-700",
                  ].join(" ")}
                >
                  <Icon size={22} strokeWidth={2.15} />
                  <span className="text-[12px] font-extrabold sm:text-[13px]">
                    <span className="sm:hidden">{item.shortLabel}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 px-4 pb-9 sm:px-6 sm:pb-12 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[12px] font-extrabold text-emerald-600">
                FREQUENTLY ASKED QUESTIONS
              </p>
              <h2 className="mt-1 text-[25px] font-black tracking-[-0.045em] text-slate-950 sm:text-[30px]">
                자주 묻는 질문
              </h2>
            </div>
            <p className="text-[13px] font-bold text-slate-500">
              총 {filteredFaqs.length}개의 안내를 찾았습니다.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
            <aside className="hidden h-fit rounded-[22px] border border-slate-200 bg-white p-2.5 shadow-[0_8px_28px_rgba(15,23,42,0.035)] lg:block">
              {categories.map(({ icon: Icon, ...item }) => {
                const selected = category === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCategory(item.id);
                      setOpenFaq(null);
                    }}
                    className={[
                      "flex h-12 w-full items-center gap-3 rounded-xl px-3.5 text-left text-[14px] font-extrabold transition",
                      selected
                        ? "bg-emerald-600 text-white"
                        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
                    ].join(" ")}
                  >
                    <Icon size={18} strokeWidth={2.2} />
                    {item.label}
                  </button>
                );
              })}
            </aside>

            <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_34px_rgba(15,23,42,0.04)]">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((item, index) => {
                  const opened = openFaq === item.id;
                  const categoryLabel =
                    categories.find((candidate) => candidate.id === item.category)
                      ?.label ?? "안내";

                  return (
                    <article
                      key={item.id}
                      className={index > 0 ? "border-t border-slate-100" : ""}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(opened ? null : item.id)}
                        className="flex w-full items-start gap-3 px-4 py-5 text-left sm:items-center sm:px-6"
                        aria-expanded={opened}
                      >
                        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[12px] font-black text-emerald-700 sm:mt-0">
                          Q
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[11px] font-extrabold text-emerald-600">
                            {categoryLabel}
                          </span>
                          <span className="mt-1 block break-keep text-[15px] font-black leading-6 tracking-[-0.025em] text-slate-900 sm:text-[16px]">
                            {item.question}
                          </span>
                        </span>
                        <ChevronDown
                          size={20}
                          className={[
                            "mt-1 shrink-0 text-slate-400 transition duration-200 sm:mt-0",
                            opened ? "rotate-180 text-emerald-600" : "",
                          ].join(" ")}
                        />
                      </button>

                      {opened && (
                        <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                          <div className="ml-10 rounded-2xl bg-slate-50 px-4 py-4 text-[13px] font-medium leading-6 text-slate-600 sm:px-5 sm:text-[14px]">
                            {item.answer}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="px-6 py-16 text-center">
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Search size={25} />
                  </span>
                  <h3 className="mt-4 text-[19px] font-black tracking-[-0.035em] text-slate-900">
                    검색 결과가 없습니다.
                  </h3>
                  <p className="mt-2 text-[13px] font-medium leading-5 text-slate-500">
                    다른 검색어를 입력하거나 전체 질문을 확인해주세요.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCategory("all");
                    }}
                    className="mt-5 h-10 rounded-xl bg-emerald-600 px-5 text-[13px] font-extrabold text-white"
                  >
                    전체 질문 보기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-9 sm:px-6 sm:pb-12 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_34px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <p className="text-[12px] font-extrabold text-emerald-600">NOTICE</p>
                <h2 className="mt-1 text-[21px] font-black tracking-[-0.04em] text-slate-950">
                  이용 안내
                </h2>
              </div>
              <ClipboardCheck className="text-emerald-600" size={24} />
            </div>

            <div>
              {notices.map((notice, index) => (
                <div
                  key={notice.title}
                  className={[
                    "flex items-start gap-3 px-5 py-4 sm:items-center sm:px-6",
                    index > 0 ? "border-t border-slate-100" : "",
                  ].join(" ")}
                >
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
                    {notice.label}
                  </span>
                  <p className="break-keep text-[13px] font-bold leading-5 text-slate-700 sm:text-[14px]">
                    {notice.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] bg-slate-950 px-5 py-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.14)] sm:px-6">
            <div className="flex items-center gap-2 text-[12px] font-extrabold text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.12)]" />
              현재 상담 가능
            </div>
            <h2 className="mt-4 break-keep text-[23px] font-black leading-[1.3] tracking-[-0.045em]">
              답을 찾지 못하셨나요?
              <br />
              우선생이 직접 확인해드릴게요.
            </h2>
            <div className="mt-4 flex items-center gap-2 text-[13px] font-bold text-slate-300">
              <Clock3 size={17} className="text-emerald-400" />
              평균 상담 연결 약 3분
            </div>
            <button
              type="button"
              onClick={openConsultation}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-[14px] font-extrabold text-white transition hover:bg-emerald-400"
            >
              간편상담 신청하기
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] gap-3 sm:grid-cols-2">
          <Link
            href="/internet"
            className="group flex items-center gap-4 rounded-[22px] border border-slate-200 bg-white px-5 py-5 transition hover:border-emerald-300 hover:shadow-[0_12px_34px_rgba(15,23,42,0.05)] sm:px-6"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Router size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[16px] font-black text-slate-950">
                인터넷 요금 비교하기
              </strong>
              <span className="mt-1 block text-[12px] font-bold text-slate-500">
                통신사별 요금과 혜택을 바로 확인하세요.
              </span>
            </span>
            <ArrowRight className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" size={19} />
          </Link>

          <Link
            href="/rental"
            className="group flex items-center gap-4 rounded-[22px] border border-slate-200 bg-white px-5 py-5 transition hover:border-emerald-300 hover:shadow-[0_12px_34px_rgba(15,23,42,0.05)] sm:px-6"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <WashingMachine size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[16px] font-black text-slate-950">
                렌탈 상품 찾아보기
              </strong>
              <span className="mt-1 block text-[12px] font-bold text-slate-500">
                정수기부터 생활가전까지 한 번에 확인하세요.
              </span>
            </span>
            <ArrowRight className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" size={19} />
          </Link>
        </div>

        <div className="mx-auto mt-4 flex max-w-[1280px] items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-4 text-emerald-900 ring-1 ring-inset ring-emerald-100 sm:items-center sm:px-5">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-emerald-600 sm:mt-0" />
          <p className="break-keep text-[12px] font-bold leading-5 sm:text-[13px]">
            우선생은 상담 과정에서 월 요금, 할인, 설치비, 상품권, 현금 혜택과 최종 지급 조건을 구분해 안내합니다.
          </p>
          <CheckCircle2 size={18} className="ml-auto hidden shrink-0 text-emerald-600 sm:block" />
        </div>
      </section>
    </>
  );
}
