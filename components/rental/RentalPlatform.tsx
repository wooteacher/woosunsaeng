"use client";

import {
  AirVent,
  Armchair,
  ArrowDownUp,
  BedDouble,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Droplets,
  Gift,
  ImageIcon,
  Loader2,
  MessageCircleMore,
  Refrigerator,
  Search,
  Send,
  Shirt,
  Sparkles,
  Tv,
  WashingMachine,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";

import { supabase } from "@/lib/supabase";
import {
  getBrands,
  rentalCategories,
  rentalProducts,
  type RentalCategory,
  type RentalProduct,
  type RentalSort,
} from "@/data/rental/products";

const categoryIcons: Record<RentalCategory, ReactNode> = {
  정수기: <Droplets size={21} />,
  공기청정기: <AirVent size={21} />,
  비데: <Sparkles size={21} />,
  안마의자: <Armchair size={21} />,
  매트리스: <BedDouble size={21} />,
  TV: <Tv size={21} />,
  냉장고: <Refrigerator size={21} />,
  세탁기: <WashingMachine size={21} />,
  건조기: <Shirt size={21} />,
};

const sortOptions: RentalSort[] = [
  "추천순",
  "낮은가격순",
  "높은가격순",
  "최신순",
];

const formatPrice = (price: number) => price.toLocaleString("ko-KR");

function ProductImage({
  product,
  className = "",
}: {
  product: RentalProduct;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.style.display = "none";
    setFailed(true);
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 ${className}`}
    >
      {!failed && (
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          onError={handleError}
          className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-[1.04]"
        />
      )}

      {failed && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
            {categoryIcons[product.category]}
          </div>
          <p className="mt-3 text-xs font-extrabold text-slate-700">
            {product.modelName}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-slate-400">
            제휴사 이미지 추가 예정
          </p>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  selected,
  onSelect,
}: {
  product: RentalProduct;
  selected: boolean;
  onSelect: () => void;
}) {
  const cardPrice = Math.max(product.monthlyPrice - product.cardDiscount, 0);

  return (
    <article
      className={[
        "group overflow-hidden rounded-[26px] border bg-white transition duration-200",
        selected
          ? "border-emerald-500 shadow-[0_20px_55px_rgba(5,150,105,0.13)] ring-4 ring-emerald-50"
          : "border-slate-200/90 shadow-[0_12px_35px_rgba(15,23,42,0.05)] hover:-translate-y-1 hover:border-slate-300",
      ].join(" ")}
    >
      <div className="relative">
        <ProductImage product={product} className="h-[250px] w-full" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          {product.recommended && (
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-extrabold text-white">
              추천
            </span>
          )}
          {product.popular && (
            <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-extrabold text-white">
              BEST
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-extrabold text-white">
              NEW
            </span>
          )}
        </div>

        <span
          className={[
            "absolute right-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-extrabold",
            product.stockStatus === "재고있음"
              ? "bg-white/90 text-emerald-700 shadow-sm"
              : "bg-amber-50 text-amber-700",
          ].join(" ")}
        >
          {product.stockStatus}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs font-extrabold text-emerald-600">
          {product.brand}
        </p>
        <h3 className="mt-1 min-h-[50px] break-keep text-[18px] font-extrabold leading-6 tracking-[-0.035em] text-slate-950">
          {product.name}
        </h3>
        <p className="mt-1 text-[12px] font-bold text-slate-400">
          {product.modelName}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">월 렌탈료</span>
            <strong className="tabular-nums text-[15px] font-extrabold text-slate-950">
              {formatPrice(product.monthlyPrice)}원
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              제휴카드 최대 할인
            </span>
            <strong className="tabular-nums text-[15px] font-extrabold text-emerald-600">
              -{formatPrice(product.cardDiscount)}원
            </strong>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <span className="text-[11px] font-bold text-slate-400">
              카드 할인 적용 시
            </span>
            <p>
              <strong className="tabular-nums text-[25px] font-extrabold tracking-[-0.045em] text-emerald-400">
                {formatPrice(cardPrice)}
              </strong>
              <span className="ml-1 text-xs font-bold text-emerald-400">
                원/월
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[12px] font-bold text-slate-500">
          <span>{product.contractMonths}개월</span>
          <span>{product.managementType}</span>
        </div>

        <button
          type="button"
          onClick={onSelect}
          className={[
            "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-extrabold transition",
            selected
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-950 hover:text-white",
          ].join(" ")}
        >
          {selected && <Check size={16} strokeWidth={3} />}
          {selected ? "선택 완료" : "이 제품 선택"}
        </button>
      </div>
    </article>
  );
}

function ConsultationSheet({
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
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setError("이름과 연락처를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    const service = [
      "렌탈",
      product.category,
      product.brand,
      product.name,
      product.modelName,
      memo.trim() ? `요청: ${memo.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    const { error: insertError } = await supabase
      .from("consultations")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        service,
      });

    setLoading(false);

    if (insertError) {
      console.error(insertError);
      setError("상담 접수 중 오류가 발생했습니다.");
      return;
    }

    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-[30px] bg-white p-5 shadow-2xl sm:rounded-[30px] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold text-emerald-600">
              우선생 렌탈 상담
            </p>
            <h2 className="mt-1 text-[25px] font-extrabold tracking-[-0.045em] text-slate-950">
              선택 상품 상담
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check size={28} strokeWidth={3} />
            </div>
            <h3 className="mt-5 text-[24px] font-extrabold tracking-[-0.04em] text-slate-950">
              상담 접수가 완료되었습니다.
            </h3>
            <p className="mt-3 break-keep text-sm font-medium leading-6 text-slate-500">
              제품 옵션과 최신 렌탈 조건을 담당 상담사가 확인 후
              안내드립니다.
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
            <div className="mt-5 grid grid-cols-[96px_1fr] gap-4 rounded-[22px] bg-slate-50 p-4">
              <ProductImage
                product={product}
                className="h-24 w-24 rounded-2xl"
              />
              <div className="min-w-0 self-center">
                <p className="text-xs font-extrabold text-emerald-600">
                  {product.brand}
                </p>
                <p className="mt-1 break-keep text-sm font-extrabold leading-5 text-slate-950">
                  {product.name}
                </p>
                <p className="mt-1 text-[11px] font-bold text-slate-400">
                  {product.modelName}
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-800">이름</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 h-[54px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  placeholder="이름을 입력해주세요"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-800">연락처</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 h-[54px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  placeholder="010-0000-0000"
                  inputMode="tel"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-800">
                  요청사항
                </span>
                <textarea
                  value={memo}
                  onChange={(event) => setMemo(event.target.value)}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  placeholder="원하는 색상, 관리방식 등을 남겨주세요"
                />
              </label>

              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-extrabold text-white disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
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

export default function RentalPlatform() {
  const [category, setCategory] = useState<RentalCategory>("정수기");
  const [brand, setBrand] = useState("전체");
  const [sort, setSort] = useState<RentalSort>("추천순");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const brands = useMemo(
    () => ["전체", ...getBrands(category)],
    [category],
  );

  const products = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = rentalProducts.filter((product) => {
      const categoryMatched = product.category === category;
      const brandMatched = brand === "전체" || product.brand === brand;
      const queryMatched =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.modelName.toLowerCase().includes(normalized) ||
        product.brand.toLowerCase().includes(normalized);

      return categoryMatched && brandMatched && queryMatched;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "낮은가격순") return a.monthlyPrice - b.monthlyPrice;
      if (sort === "높은가격순") return b.monthlyPrice - a.monthlyPrice;
      if (sort === "최신순") return b.createdOrder - a.createdOrder;

      const aScore =
        Number(a.recommended) * 4 +
        Number(a.popular) * 2 +
        Number(a.isNew);
      const bScore =
        Number(b.recommended) * 4 +
        Number(b.popular) * 2 +
        Number(b.isNew);
      return bScore - aScore;
    });
  }, [brand, category, query, sort]);

  const selectedProduct =
    rentalProducts.find((product) => product.id === selectedId) ?? null;

  function selectCategory(next: RentalCategory) {
    setCategory(next);
    setBrand("전체");
    setSelectedId(null);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.78fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
              <Gift size={15} />
              생활가전 렌탈 비교
            </span>
            <h1 className="mt-5 max-w-3xl break-keep text-[40px] font-extrabold leading-[1.12] tracking-[-0.06em] text-slate-950 sm:text-[56px]">
              원하는 제품을
              <br />
              가장 좋은 조건으로.
            </h1>
            <p className="mt-5 max-w-xl break-keep text-[16px] font-medium leading-8 text-slate-500">
              이미지로 제품을 확인하고 월 렌탈료, 카드 할인, 약정과
              관리방식까지 한 번에 비교하세요.
            </p>

            <div className="relative mt-7 max-w-2xl">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="제품명, 모델명 또는 브랜드 검색"
                className="h-[58px] w-full rounded-[20px] border border-slate-200 bg-slate-50 pl-12 pr-12 text-[15px] font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-slate-500"
                  aria-label="검색어 지우기"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:p-8">
            <p className="text-xs font-extrabold text-emerald-400">
              우선생 렌탈 시스템
            </p>
            <h2 className="mt-1 text-[25px] font-extrabold tracking-[-0.045em]">
              쉽고 빠르게 제품 선택
            </h2>
            <div className="mt-6 space-y-3">
              {[
                ["01", "카테고리 선택"],
                ["02", "브랜드·제품 비교"],
                ["03", "월 렌탈 조건 확인"],
                ["04", "상담 접수 및 설치"],
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
                "flex min-h-[94px] flex-col items-center justify-center gap-2 rounded-[22px] border px-2 py-4 text-center transition",
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

        <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-extrabold text-emerald-600">
                {category}
              </p>
              <h3 className="mt-1 text-[25px] font-extrabold tracking-[-0.045em] text-slate-950">
                브랜드를 선택하세요
              </h3>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {brands.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setBrand(item);
                    setSelectedId(null);
                  }}
                  className={[
                    "h-10 shrink-0 rounded-full px-4 text-sm font-extrabold transition",
                    brand === item
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-600",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-slate-500">
            총 <strong className="text-slate-950">{products.length}</strong>개
            상품
          </p>

          <div className="relative">
            <ArrowDownUp
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as RentalSort)}
              className="h-11 min-w-[170px] appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-extrabold text-slate-700 outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selected={selectedId === product.id}
              onSelect={() => setSelectedId(product.id)}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <CircleHelp className="mx-auto text-slate-400" size={32} />
            <p className="mt-4 text-base font-extrabold text-slate-800">
              조건에 맞는 상품이 없습니다.
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500">
              다른 브랜드나 검색어를 선택해주세요.
            </p>
          </div>
        )}

        {selectedProduct && (
          <aside className="sticky bottom-4 z-30 mx-auto mt-8 max-w-5xl overflow-hidden rounded-[26px] border border-white/10 bg-slate-950 text-white shadow-[0_24px_70px_rgba(15,23,42,0.3)]">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
              <ProductImage
                product={selectedProduct}
                className="hidden h-20 w-20 shrink-0 rounded-2xl sm:flex"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-emerald-400">
                  선택한 상품
                </p>
                <p className="mt-1 truncate text-base font-extrabold">
                  {selectedProduct.brand} · {selectedProduct.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-400">
                  <span>{selectedProduct.contractMonths}개월</span>
                  <span>{selectedProduct.managementType}</span>
                  <span>
                    월 {formatPrice(selectedProduct.monthlyPrice)}원
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 text-sm font-extrabold text-white"
              >
                <MessageCircleMore size={18} />
                상담 신청
              </button>
            </div>
          </aside>
        )}
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: <CreditCard size={22} />,
              title: "제휴카드 할인",
              description:
                "카드사별 전월 실적에 따른 최대 할인 조건을 안내합니다.",
            },
            {
              icon: <Gift size={22} />,
              title: "최신 프로모션",
              description:
                "제품과 시점에 따라 적용 가능한 추가 혜택을 확인합니다.",
            },
            {
              icon: <ImageIcon size={22} />,
              title: "제휴사 공식 상품",
              description:
                "제휴사 상품 정보와 이미지 기준으로 상담을 진행합니다.",
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

      {sheetOpen && selectedProduct && (
        <ConsultationSheet
          product={selectedProduct}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </main>
  );
}
