"use client";

import {
  AirVent,
  Armchair,
  BadgeCheck,
  BedDouble,
  Check,
  ChevronDown,
  CircleDollarSign,
  Droplets,
  Gift,
  Loader2,
  MessageCircleMore,
  Refrigerator,
  Send,
  ShieldCheck,
  Shirt,
  Sparkles,
  Tv,
  WashingMachine,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { supabase } from "@/lib/supabase";
import {
  getRentalBrands,
  rentalCategories,
  rentalProducts,
  type RentalCategory,
  type RentalProduct,
} from "@/data/rentalProducts";

const categoryIcons: Record<RentalCategory, ReactNode> = {
  정수기: <Droplets size={20} />,
  공기청정기: <AirVent size={20} />,
  비데: <Sparkles size={20} />,
  안마의자: <Armchair size={20} />,
  매트리스: <BedDouble size={20} />,
  TV: <Tv size={20} />,
  냉장고: <Refrigerator size={20} />,
  세탁기: <WashingMachine size={20} />,
  건조기: <Shirt size={20} />,
};

const formatPrice = (price: number) => price.toLocaleString("ko-KR");

function ProductCard({
  product,
  selected,
  onSelect,
}: {
  product: RentalProduct;
  selected: boolean;
  onSelect: () => void;
}) {
  const finalPrice = Math.max(product.monthlyPrice - product.cardDiscount, 0);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "group relative flex h-full flex-col rounded-[26px] border bg-white p-5 text-left transition duration-200",
        selected
          ? "border-emerald-500 shadow-[0_18px_50px_rgba(5,150,105,0.12)] ring-4 ring-emerald-50"
          : "border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.05)] hover:-translate-y-1 hover:border-slate-300",
      ].join(" ")}
    >
      {product.badge && (
        <span className="absolute right-4 top-4 rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-extrabold text-white">
          {product.badge}
        </span>
      )}

      <div
        className={[
          "flex size-11 items-center justify-center rounded-2xl transition",
          selected
            ? "bg-emerald-600 text-white"
            : "bg-emerald-50 text-emerald-600",
        ].join(" ")}
      >
        {categoryIcons[product.category]}
      </div>

      <p className="mt-5 text-xs font-extrabold text-emerald-600">
        {product.brand}
      </p>

      <h3 className="mt-1 pr-14 text-[18px] font-extrabold tracking-[-0.035em] text-slate-950">
        {product.name}
      </h3>

      <p className="mt-2 break-keep text-[13px] font-medium leading-5 text-slate-500">
        {product.description}
      </p>

      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">월 렌탈료</span>
          <span className="tabular-nums text-sm font-extrabold text-slate-950">
            {formatPrice(product.monthlyPrice)}원
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">제휴카드 할인</span>
          <span className="tabular-nums text-sm font-extrabold text-emerald-600">
            -{formatPrice(product.cardDiscount)}원
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-4 text-white">
        <p className="text-[11px] font-bold text-slate-400">할인 적용 시</p>
        <p className="mt-1">
          <strong className="tabular-nums text-[24px] font-extrabold tracking-[-0.04em] text-emerald-400">
            {formatPrice(finalPrice)}
          </strong>
          <span className="ml-1 text-xs font-bold text-emerald-400">원/월</span>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px] font-bold text-slate-500">
        <span>{product.contractMonths}개월 약정</span>
        <span>{product.maintenance}</span>
      </div>

      <div
        className={[
          "mt-5 flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition",
          selected
            ? "bg-emerald-600 text-white"
            : "bg-slate-100 text-slate-700 group-hover:bg-slate-950 group-hover:text-white",
        ].join(" ")}
      >
        {selected && <Check size={16} strokeWidth={3} />}
        {selected ? "선택됨" : "이 제품 선택"}
      </div>
    </button>
  );
}

function ConsultationModal({
  product,
  onClose,
}: {
  product: RentalProduct;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setErrorMessage("이름과 연락처를 입력해주세요.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const service = [
      "렌탈",
      product.category,
      product.brand,
      product.name,
      memo.trim() ? `요청: ${memo.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    const { error } = await supabase.from("consultations").insert({
      name: name.trim(),
      phone: phone.trim(),
      service,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setErrorMessage(
        "상담 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
      return;
    }

    setCompleted(true);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[30px] bg-white p-5 shadow-2xl sm:rounded-[30px] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold text-emerald-600">
              우선생 렌탈 상담
            </p>
            <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.045em] text-slate-950">
              상담 신청
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="닫기"
          >
            <X size={19} />
          </button>
        </div>

        {completed ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check size={28} strokeWidth={3} />
            </div>

            <h3 className="mt-5 text-[24px] font-extrabold tracking-[-0.04em] text-slate-950">
              상담 접수가 완료되었습니다.
            </h3>

            <p className="mt-3 break-keep text-sm font-medium leading-6 text-slate-500">
              선택하신 제품의 최신 조건과 추가 혜택을 담당 상담사가 안내드립니다.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 h-12 w-full rounded-2xl bg-emerald-600 text-sm font-extrabold text-white"
            >
              확인
            </button>
          </div>
        ) : (
          <>
            <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
              <p className="text-xs font-bold text-emerald-400">
                {product.category} · {product.brand}
              </p>
              <p className="mt-1 text-base font-extrabold">{product.name}</p>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-800">이름</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  placeholder="이름을 입력해주세요"
                  autoComplete="name"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-800">연락처</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  placeholder="010-0000-0000"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-800">
                  추가 요청사항
                </span>
                <textarea
                  value={memo}
                  onChange={(event) => setMemo(event.target.value)}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  placeholder="설치 장소, 원하는 기능 등을 남겨주세요"
                />
              </label>

              {errorMessage && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-extrabold text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    접수 중...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    상담 신청
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function RentalCatalog() {
  const [category, setCategory] = useState<RentalCategory>("정수기");
  const [brand, setBrand] = useState("전체");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const brands = useMemo(
    () => ["전체", ...getRentalBrands(category)],
    [category],
  );

  const products = useMemo(
    () =>
      rentalProducts.filter(
        (product) =>
          product.category === category &&
          (brand === "전체" || product.brand === brand),
      ),
    [category, brand],
  );

  const selectedProduct =
    rentalProducts.find((product) => product.id === selectedProductId) ?? null;

  function selectCategory(nextCategory: RentalCategory) {
    setCategory(nextCategory);
    setBrand("전체");
    setSelectedProductId(null);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
              <BadgeCheck size={15} />
              우선생 렌탈 비교
            </span>

            <h1 className="mt-5 max-w-2xl break-keep text-[40px] font-extrabold leading-[1.12] tracking-[-0.06em] text-slate-950 sm:text-[56px]">
              원하는 생활가전,
              <br />
              복잡한 조건 없이 비교하세요.
            </h1>

            <p className="mt-5 max-w-xl break-keep text-[16px] font-medium leading-8 text-slate-500">
              제품과 브랜드만 선택하면 월 렌탈료, 제휴카드 할인과 관리
              조건까지 한눈에 확인할 수 있습니다.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {[
                "다양한 브랜드 비교",
                "최신 혜택 상담 안내",
                "설치까지 전담 관리",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700"
                >
                  <Check size={14} className="text-emerald-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-emerald-400">
                  렌탈 상담 진행
                </p>
                <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.04em]">
                  선택은 간단하게
                </h2>
              </div>
              <MessageCircleMore className="text-emerald-400" size={28} />
            </div>

            <div className="mt-7 space-y-3">
              {[
                ["01", "카테고리 선택"],
                ["02", "브랜드·제품 비교"],
                ["03", "전문 상담사 조건 확인"],
                ["04", "설치까지 전담 진행"],
              ].map(([number, label]) => (
                <div
                  key={number}
                  className="flex items-center gap-4 rounded-2xl bg-white/[0.06] px-4 py-4"
                >
                  <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500 text-xs font-extrabold">
                    {number}
                  </span>
                  <span className="text-sm font-bold text-slate-200">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <p className="text-sm font-extrabold text-emerald-600">CATEGORY</p>
          <h2 className="mt-2 text-[30px] font-extrabold tracking-[-0.05em] text-slate-950 sm:text-[38px]">
            어떤 제품을 찾고 계신가요?
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {rentalCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectCategory(item)}
              className={[
                "flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[22px] border px-2 py-4 text-center transition",
                category === item
                  ? "border-emerald-500 bg-emerald-600 text-white shadow-[0_14px_35px_rgba(5,150,105,0.18)]"
                  : "border-slate-200 bg-white text-slate-600 hover:-translate-y-1 hover:border-slate-300",
              ].join(" ")}
            >
              {categoryIcons[item]}
              <span className="text-xs font-extrabold">{item}</span>
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold text-emerald-600">
              {category}
            </p>
            <h3 className="mt-1 text-[26px] font-extrabold tracking-[-0.045em] text-slate-950">
              브랜드와 제품을 비교해보세요
            </h3>
          </div>

          <div className="relative">
            <select
              value={brand}
              onChange={(event) => {
                setBrand(event.target.value);
                setSelectedProductId(null);
              }}
              className="h-12 min-w-[190px] appearance-none rounded-2xl border border-slate-200 bg-white pl-4 pr-11 text-sm font-extrabold text-slate-800 outline-none focus:border-emerald-500"
            >
              {brands.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selected={selectedProductId === product.id}
              onSelect={() => setSelectedProductId(product.id)}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-base font-extrabold text-slate-800">
              해당 브랜드의 상품을 준비 중입니다.
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500">
              상담을 남겨주시면 가능한 제품을 빠르게 안내해드립니다.
            </p>
          </div>
        )}

        {selectedProduct && (
          <div className="sticky bottom-4 z-30 mx-auto mt-8 max-w-4xl rounded-[26px] border border-white/10 bg-slate-950 p-4 text-white shadow-[0_24px_70px_rgba(15,23,42,0.3)] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-emerald-400">
                  선택한 제품
                </p>
                <p className="mt-1 truncate text-base font-extrabold">
                  {selectedProduct.brand} · {selectedProduct.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 text-sm font-extrabold text-white transition hover:bg-emerald-400"
              >
                <MessageCircleMore size={18} />
                이 제품 상담받기
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: <CircleDollarSign size={22} />,
              title: "조건 비교",
              description:
                "월 렌탈료와 카드 할인 조건을 한눈에 비교할 수 있습니다.",
            },
            {
              icon: <Gift size={22} />,
              title: "추가 혜택 안내",
              description:
                "제품별 프로모션과 추가 혜택은 상담 시 정확하게 안내합니다.",
            },
            {
              icon: <ShieldCheck size={22} />,
              title: "설치까지 관리",
              description:
                "접수부터 설치와 사후 안내까지 우선생이 함께 관리합니다.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {modalOpen && selectedProduct && (
        <ConsultationModal
          product={selectedProduct}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
}
