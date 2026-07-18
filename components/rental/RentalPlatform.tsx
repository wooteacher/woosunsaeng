"use client";

import {
  AirVent,
  Armchair,
  ArrowDownUp,
  BadgeCheck,
  Check,
  ChevronDown,
  CircleHelp,
  CookingPot,
  CreditCard,
  Droplets,
  GitCompareArrows,
  Grid2X2,
  ImageOff,
  Loader2,
  MessageCircleMore,
  PackageOpen,
  Search,
  Send,
  Sparkles,
  WashingMachine,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type SyntheticEvent,
  type ReactNode,
} from "react";

import {
  rentalCategories,
  type RentalCategory,
  type RentalProduct,
  type RentalPurpose,
  type RentalSort,
} from "@/data/rental/products";
import { supabase } from "@/lib/supabase";
import RentalBannerSlider from "@/components/rental/RentalBannerSlider";
import { fetchRentalProducts } from "@/services/rental-products.service";

type ManagementFilter =
  | "전체"
  | "자가관리"
  | "방문관리"
  | "구독 케어"
  | "설치·A/S";
type PriceFilter =
  | "전체"
  | "2만원 이하"
  | "2~4만원"
  | "4만원 이상"
  | "상담 확인";

type CategoryMeta = {
  icon: LucideIcon;
  short: string;
};

const categoryMeta: Record<RentalCategory, CategoryMeta> = {
  전체: { icon: Grid2X2, short: "전체" },
  정수기: { icon: Droplets, short: "정수기" },
  공기청정기: { icon: AirVent, short: "공기청정" },
  비데: { icon: Sparkles, short: "비데" },
  안마의자: { icon: Armchair, short: "안마의자" },
  "세탁·건조": { icon: WashingMachine, short: "세탁·건조" },
  주방가전: { icon: CookingPot, short: "주방가전" },
  생활가전: { icon: PackageOpen, short: "생활가전" },
};

const sortOptions: RentalSort[] = ["추천순", "낮은가격순", "높은가격순"];
const purposeOptions: RentalPurpose[] = [
  "전체",
  "가성비",
  "신혼부부",
  "부모님",
  "아이 있는 집",
  "업소용",
];
const managementOptions: ManagementFilter[] = [
  "전체",
  "자가관리",
  "방문관리",
  "구독 케어",
  "설치·A/S",
];
const priceOptions: PriceFilter[] = [
  "전체",
  "2만원 이하",
  "2~4만원",
  "4만원 이상",
  "상담 확인",
];

const formatPrice = (price: number | null) =>
  price === null ? "상담 확인" : `${price.toLocaleString("ko-KR")}원`;

function effectiveCardDiscount(product: RentalProduct) {
  if (product.monthlyPrice === null || product.maxCardDiscount === null) {
    return product.maxCardDiscount;
  }

  return Math.min(product.monthlyPrice, product.maxCardDiscount);
}

function calculatedFinalPrice(product: RentalProduct) {
  if (product.finalPrice !== null) return product.finalPrice;
  if (product.monthlyPrice === null) return null;

  const discount = effectiveCardDiscount(product);
  if (discount === null) return null;
  return Math.max(product.monthlyPrice - discount, 0);
}

function managementMatches(
  product: RentalProduct,
  filter: ManagementFilter,
) {
  if (filter === "전체") return true;
  const text = product.management.join(" ");

  if (filter === "자가관리") return /자가|셀프/i.test(text);
  if (filter === "방문관리") return /방문|정기 케어|정기관리/i.test(text);
  if (filter === "구독 케어") return /구독|필터 케어|케어솔루션/i.test(text);
  return /설치|A\/S|AS|옵션 확인/i.test(text);
}

function priceMatches(product: RentalProduct, filter: PriceFilter) {
  const price = product.monthlyPrice;
  if (filter === "전체") return true;
  if (filter === "상담 확인") return price === null;
  if (price === null) return false;
  if (filter === "2만원 이하") return price < 20000;
  if (filter === "2~4만원") return price >= 20000 && price < 40000;
  return price >= 40000;
}

function ProductImage({
  product,
  className = "",
  compact = false,
}: {
  product: RentalProduct;
  className?: string;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const Icon = categoryMeta[product.category].icon;

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.style.display = "none";
    setFailed(true);
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-white ${className}`}
    >
      {!failed && product.image ? (
        <img
          src={product.image}
          alt={`${product.brand} ${product.name} ${product.modelName}`}
          loading={compact ? "eager" : "lazy"}
          decoding="async"
          onError={handleError}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.025]"
          style={{
            objectPosition: product.imagePosition ?? "center",
            padding: compact ? "6px" : "14px",
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center px-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            {failed ? <ImageOff size={24} /> : <Icon size={25} />}
          </div>
          <p className="mt-3 text-xs font-extrabold text-slate-700">
            {product.modelName}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-slate-400">
            이미지 확인 중
          </p>
        </div>
      )}
    </div>
  );
}

function PriceSummary({ product }: { product: RentalProduct }) {
  const discount = effectiveCardDiscount(product);
  const finalPrice = calculatedFinalPrice(product);

  return (
    <div className="mt-5 border-t border-slate-100 pt-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500">월 렌탈료</span>
        <strong className="tabular-nums text-[15px] font-extrabold text-slate-950">
          {formatPrice(product.monthlyPrice)}
        </strong>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500">
          제휴카드 최대 할인
        </span>
        <strong className="tabular-nums text-[14px] font-extrabold text-emerald-600">
          {discount === null ? "조건 확인" : `-${discount.toLocaleString("ko-KR")}원`}
        </strong>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-3.5 text-white">
        <div className="flex items-end justify-between gap-3">
          <span className="pb-0.5 text-[11px] font-bold text-slate-400">
            카드 할인 적용 시
          </span>
          {finalPrice === null ? (
            <strong className="text-sm font-extrabold text-emerald-300">
              상담 확인
            </strong>
          ) : (
            <p className="whitespace-nowrap">
              <strong className="tabular-nums text-[24px] font-extrabold tracking-[-0.05em] text-emerald-400">
                {finalPrice.toLocaleString("ko-KR")}
              </strong>
              <span className="ml-1 text-xs font-bold text-emerald-400">
                원/월
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  compared,
  compareDisabled,
  onToggleCompare,
  onConsult,
}: {
  product: RentalProduct;
  compared: boolean;
  compareDisabled: boolean;
  onToggleCompare: () => void;
  onConsult: () => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.045)] transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.08)]">
      <div className="relative border-b border-slate-100">
        <ProductImage product={product} className="aspect-[4/3] w-full" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.recommended && (
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
              추천
            </span>
          )}
          {product.popular && (
            <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
              BEST
            </span>
          )}
          {product.dataStatus === "verified" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-slate-700 shadow-sm">
              <BadgeCheck size={12} className="text-emerald-600" />
              조건 확인
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCompare}
          disabled={compareDisabled && !compared}
          className={[
            "absolute bottom-3 right-3 inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-extrabold shadow-sm transition",
            compared
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-slate-200 bg-white/95 text-slate-700 hover:border-emerald-300 hover:text-emerald-700",
            compareDisabled && !compared ? "cursor-not-allowed opacity-45" : "",
          ].join(" ")}
          aria-pressed={compared}
        >
          {compared ? <Check size={14} strokeWidth={3} /> : <GitCompareArrows size={14} />}
          {compared ? "비교 담김" : "비교"}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-extrabold text-emerald-600">
          {product.brand}
        </p>
        <h3 className="mt-1 min-h-[48px] break-keep text-[18px] font-extrabold leading-6 tracking-[-0.035em] text-slate-950">
          {product.name}
        </h3>
        <p className="mt-1 text-[12px] font-bold text-slate-400">
          {product.modelName}
        </p>

        <div className="mt-4 flex min-h-[54px] flex-wrap content-start gap-1.5">
          {product.features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600"
            >
              {feature}
            </span>
          ))}
        </div>

        <PriceSummary product={product} />

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-slate-500">
          <span>{product.contracts.slice(0, 3).join(" · ")}</span>
          <span className="text-slate-300">|</span>
          <span>{product.management.slice(0, 2).join(" · ")}</span>
        </div>

        <button
          type="button"
          onClick={onConsult}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 text-sm font-extrabold text-white transition hover:bg-emerald-600"
        >
          <MessageCircleMore size={17} />
          이 상품 상담받기
        </button>
      </div>
    </article>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-extrabold text-slate-500">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm font-extrabold text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </label>
  );
}

function CompareModal({
  products,
  onRemove,
  onConsult,
  onClose,
}: {
  products: RentalProduct[];
  onRemove: (id: string) => void;
  onConsult: (product: RentalProduct) => void;
  onClose: () => void;
}) {
  const rows: Array<{
    label: string;
    render: (product: RentalProduct) => ReactNode;
  }> = [
    {
      label: "월 렌탈료",
      render: (product) => (
        <strong className="text-base text-slate-950">
          {formatPrice(product.monthlyPrice)}
        </strong>
      ),
    },
    {
      label: "카드 할인 적용",
      render: (product) => {
        const price = calculatedFinalPrice(product);
        return price === null ? "조건 확인" : `${price.toLocaleString("ko-KR")}원/월`;
      },
    },
    {
      label: "약정 선택",
      render: (product) => product.contracts.join(" · ") || "상담 확인",
    },
    {
      label: "관리 방식",
      render: (product) => product.management.join(" · ") || "상담 확인",
    },
    {
      label: "주요 기능",
      render: (product) => product.features.join(" · ") || "상담 확인",
    },
    {
      label: "추천 대상",
      render: (product) => product.purposes.join(" · ") || "전체",
    },
    {
      label: "데이터 상태",
      render: (product) =>
        product.dataStatus === "verified" ? "조건 확인 완료" : "상담 시 최종 확인",
    },
  ];

  return (
    <div className="fixed inset-0 z-[140] bg-slate-950/65 p-0 backdrop-blur-sm sm:p-5">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[94vh] sm:rounded-[30px] sm:shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-extrabold text-emerald-600">
              제품 비교
            </p>
            <h2 className="mt-1 text-[25px] font-extrabold tracking-[-0.045em] text-slate-950">
              선택한 상품을 한눈에 비교하세요
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              최대 3개 상품의 요금, 약정, 관리방식과 기능을 비교합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            aria-label="비교창 닫기"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-auto">
          <div
            className="min-w-[760px]"
            style={{
              display: "grid",
              gridTemplateColumns: `150px repeat(${products.length}, minmax(200px, 1fr))`,
            }}
          >
            <div className="border-b border-r border-slate-200 bg-slate-50" />
            {products.map((product) => (
              <div
                key={product.id}
                className="relative border-b border-r border-slate-200 bg-white p-5 text-center last:border-r-0"
              >
                <button
                  type="button"
                  onClick={() => onRemove(product.id)}
                  className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                  aria-label={`${product.name} 비교에서 제거`}
                >
                  <X size={14} />
                </button>
                <ProductImage
                  product={product}
                  compact
                  className="mx-auto h-36 w-full max-w-[190px] rounded-2xl border border-slate-100"
                />
                <p className="mt-4 text-xs font-extrabold text-emerald-600">
                  {product.brand}
                </p>
                <h3 className="mt-1 break-keep text-sm font-extrabold leading-5 text-slate-950">
                  {product.name}
                </h3>
                <p className="mt-1 text-[11px] font-bold text-slate-400">
                  {product.modelName}
                </p>
              </div>
            ))}

            {rows.map((row, rowIndex) => (
              <div key={row.label} className="contents">
                <div
                  className={[
                    "border-b border-r border-slate-200 px-4 py-4 text-xs font-extrabold text-slate-600",
                    rowIndex % 2 === 0 ? "bg-slate-50" : "bg-white",
                  ].join(" ")}
                >
                  {row.label}
                </div>
                {products.map((product) => (
                  <div
                    key={`${row.label}-${product.id}`}
                    className={[
                      "border-b border-r border-slate-200 px-4 py-4 text-center text-xs font-bold leading-5 text-slate-600 last:border-r-0",
                      rowIndex % 2 === 0 ? "bg-slate-50/70" : "bg-white",
                    ].join(" ")}
                  >
                    {row.render(product)}
                  </div>
                ))}
              </div>
            ))}

            <div className="border-r border-slate-200 bg-slate-950 px-4 py-5 text-xs font-extrabold text-white">
              상담 신청
            </div>
            {products.map((product) => (
              <div
                key={`consult-${product.id}`}
                className="border-r border-slate-200 bg-slate-950 px-4 py-4 text-center last:border-r-0"
              >
                <button
                  type="button"
                  onClick={() => onConsult(product)}
                  className="h-11 w-full rounded-xl bg-emerald-500 text-xs font-extrabold text-white transition hover:bg-emerald-400"
                >
                  이 상품 상담
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setError("이름과 연락처를 입력해주세요.");
      return;
    }

    if (!privacyAgreed) {
      setError("개인정보 수집·이용에 동의해주세요.");
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
      setError("상담 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-slate-950/65 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="max-h-[96vh] w-full max-w-xl overflow-y-auto rounded-t-[30px] bg-white p-5 shadow-2xl sm:rounded-[30px] sm:p-7">
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
            aria-label="상담창 닫기"
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
              제품 옵션과 최신 렌탈 조건을 확인한 후 담당 상담사가
              연락드립니다.
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
                compact
                className="h-24 w-24 rounded-2xl border border-slate-100"
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
                <p className="mt-2 text-xs font-extrabold text-slate-700">
                  월 {formatPrice(product.monthlyPrice)}
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-slate-800">이름</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  placeholder="이름을 입력해주세요"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-800">연락처</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
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
                  placeholder="원하는 색상, 관리방식, 설치 공간 등을 남겨주세요"
                />
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(event) => setPrivacyAgreed(event.target.checked)}
                  className="mt-0.5 size-5 accent-emerald-600"
                />
                <span className="text-xs font-semibold leading-5 text-slate-600">
                  렌탈 상담을 위한 개인정보 수집·이용에 동의합니다.
                </span>
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
  const [allProducts, setAllProducts] = useState<RentalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<RentalCategory>("전체");
  const [brand, setBrand] = useState("전체");
  const [sort, setSort] = useState<RentalSort>("추천순");
  const [purpose, setPurpose] = useState<RentalPurpose>("전체");
  const [management, setManagement] =
    useState<ManagementFilter>("전체");
  const [price, setPrice] = useState<PriceFilter>("전체");
  const [query, setQuery] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [consultProduct, setConsultProduct] =
    useState<RentalProduct | null>(null);

  useEffect(() => {
    let active = true;

    fetchRentalProducts()
      .then((products) => {
        if (active) setAllProducts(products);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      compareOpen || consultProduct ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [compareOpen, consultProduct]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<RentalCategory, number>();
    counts.set("전체", allProducts.length);
    rentalCategories.forEach((item) => {
      if (item === "전체") return;
      counts.set(
        item,
        allProducts.filter((product) => product.category === item).length,
      );
    });
    return counts;
  }, [allProducts]);

  const brands = useMemo(() => {
    const scoped =
      category === "전체"
        ? allProducts
        : allProducts.filter((product) => product.category === category);

    return [
      "전체",
      ...Array.from(new Set(scoped.map((product) => product.brand))).sort(
        (a, b) => a.localeCompare(b, "ko"),
      ),
    ];
  }, [allProducts, category]);

  const products = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = allProducts.filter((product) => {
      const categoryMatched =
        category === "전체" || product.category === category;
      const brandMatched = brand === "전체" || product.brand === brand;
      const purposeMatched =
        purpose === "전체" || product.purposes.includes(purpose);
      const managementMatched = managementMatches(product, management);
      const priceMatched = priceMatches(product, price);
      const searchTarget = [
        product.name,
        product.modelName,
        product.brand,
        product.category,
        product.summary ?? "",
        ...product.features,
      ]
        .join(" ")
        .toLowerCase();
      const queryMatched = !normalized || searchTarget.includes(normalized);

      return (
        categoryMatched &&
        brandMatched &&
        purposeMatched &&
        managementMatched &&
        priceMatched &&
        queryMatched
      );
    });

    return [...filtered].sort((a, b) => {
      const aPrice = a.monthlyPrice ?? Number.POSITIVE_INFINITY;
      const bPrice = b.monthlyPrice ?? Number.POSITIVE_INFINITY;

      if (sort === "낮은가격순") return aPrice - bPrice;
      if (sort === "높은가격순") {
        const highA = a.monthlyPrice ?? -1;
        const highB = b.monthlyPrice ?? -1;
        return highB - highA;
      }

      const score = (product: RentalProduct) =>
        Number(product.recommended) * 8 +
        Number(product.popular) * 4 +
        Number(product.dataStatus === "verified") * 2 +
        Number(product.monthlyPrice !== null);

      return score(b) - score(a);
    });
  }, [allProducts, brand, category, management, price, purpose, query, sort]);

  const compareProducts = useMemo(
    () =>
      compareIds
        .map((id) => allProducts.find((product) => product.id === id))
        .filter((product): product is RentalProduct => Boolean(product)),
    [allProducts, compareIds],
  );

  function resetFilters() {
    setCategory("전체");
    setBrand("전체");
    setPurpose("전체");
    setManagement("전체");
    setPrice("전체");
    setQuery("");
    setSort("추천순");
  }

  function changeCategory(next: RentalCategory) {
    setCategory(next);
    setBrand("전체");
  }

  function toggleCompare(product: RentalProduct) {
    setCompareIds((current) => {
      if (current.includes(product.id)) {
        return current.filter((id) => id !== product.id);
      }

      if (current.length >= 3) return current;
      return [...current, product.id];
    });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-50 py-4 sm:py-5 lg:py-6">
        <div className="mx-auto w-full max-w-[1344px] px-4 sm:px-6 lg:px-8">
          <RentalBannerSlider />

          <div
            id="rental-search"
            className="scroll-mt-24 mt-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_14px_42px_rgba(15,23,42,0.05)] sm:p-5"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="제품명, 모델명, 브랜드 또는 기능을 검색하세요"
                  className="h-[54px] w-full rounded-[16px] border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-slate-300"
                    aria-label="검색어 지우기"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 rounded-[16px] bg-emerald-50 px-4 py-3 lg:min-w-[250px]">
                <div>
                  <p className="text-[11px] font-extrabold text-emerald-700">
                    렌탈 상품 검색
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-slate-950">
                    검색 결과 {products.length}개
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-slate-600 shadow-sm">
                  전체 {allProducts.length || 80}개
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="rental-products" className="mx-auto max-w-[1344px] px-4 pb-10 pt-2 sm:px-6 sm:pb-12 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {rentalCategories.map((item) => {
            const Icon = categoryMeta[item].icon;
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => changeCategory(item)}
                className={[
                  "flex h-12 shrink-0 items-center gap-2 rounded-2xl border px-4 text-sm font-extrabold transition",
                  active
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.18)]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                ].join(" ")}
              >
                <Icon size={17} />
                {categoryMeta[item].short}
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[10px]",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {categoryCounts.get(item) ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.035)] sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-end">
            <FilterSelect
              label="브랜드"
              value={brand}
              options={brands}
              onChange={setBrand}
            />
            <FilterSelect
              label="사용 목적"
              value={purpose}
              options={purposeOptions}
              onChange={(value) => setPurpose(value as RentalPurpose)}
            />
            <FilterSelect
              label="관리 방식"
              value={management}
              options={managementOptions}
              onChange={(value) => setManagement(value as ManagementFilter)}
            />
            <FilterSelect
              label="월 렌탈료"
              value={price}
              options={priceOptions}
              onChange={(value) => setPrice(value as PriceFilter)}
            />
            <button
              type="button"
              onClick={resetFilters}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50"
            >
              초기화
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">
              조건에 맞는 상품
              <strong className="ml-1 text-slate-950">{products.length}개</strong>
            </p>
            <p className="mt-1 text-xs font-medium text-slate-400">
              실제 요금과 프로모션은 상담 시점과 선택 옵션에 따라 달라질 수 있습니다.
            </p>
          </div>

          <div className="relative w-full sm:w-[180px]">
            <ArrowDownUp
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as RentalSort)}
              className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-extrabold text-slate-700 outline-none"
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

        {loading ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-slate-100" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-slate-100" />
                  <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compared={compareIds.includes(product.id)}
                compareDisabled={compareIds.length >= 3}
                onToggleCompare={() => toggleCompare(product)}
                onConsult={() => setConsultProduct(product)}
              />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <CircleHelp className="mx-auto text-slate-400" size={32} />
            <p className="mt-4 text-base font-extrabold text-slate-800">
              조건에 맞는 상품이 없습니다.
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500">
              필터를 초기화하거나 다른 검색어를 입력해주세요.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 h-11 rounded-xl bg-slate-950 px-5 text-sm font-extrabold text-white"
            >
              전체 상품 보기
            </button>
          </div>
        )}
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1344px] gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            {
              icon: GitCompareArrows,
              title: "최대 3개 직접 비교",
              description:
                "월 렌탈료, 제휴카드 할인, 약정과 관리방식을 같은 표에서 확인합니다.",
            },
            {
              icon: BadgeCheck,
              title: "모델명과 상태 구분",
              description:
                "확인된 조건과 상담 확인이 필요한 정보를 섞지 않고 표시합니다.",
            },
            {
              icon: CreditCard,
              title: "최종 조건 재안내",
              description:
                "제휴카드 실적과 프로모션에 따른 실제 납부 조건은 상담사가 다시 안내합니다.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[22px] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Icon size={21} />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {compareProducts.length > 0 && (
        <aside className="fixed bottom-4 left-1/2 z-[90] w-[calc(100%-24px)] max-w-4xl -translate-x-1/2 overflow-hidden rounded-[22px] border border-white/10 bg-slate-950 text-white shadow-[0_24px_70px_rgba(15,23,42,0.35)]">
          <div className="flex items-center gap-3 p-3 sm:p-4">
            <div className="hidden size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 sm:flex">
              <GitCompareArrows size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-emerald-400">
                비교함 {compareProducts.length}/3
              </p>
              <p className="mt-0.5 truncate text-xs font-bold text-slate-300 sm:text-sm">
                {compareProducts.map((product) => product.modelName).join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="hidden h-10 shrink-0 rounded-xl px-3 text-xs font-extrabold text-slate-400 sm:block"
            >
              모두 비우기
            </button>
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              disabled={compareProducts.length < 2}
              className="h-11 shrink-0 rounded-xl bg-emerald-500 px-4 text-xs font-extrabold text-white disabled:bg-slate-700 disabled:text-slate-400 sm:px-5 sm:text-sm"
            >
              {compareProducts.length < 2 ? "1개 더 선택" : "비교하기"}
            </button>
          </div>
        </aside>
      )}

      {compareOpen && compareProducts.length > 0 && (
        <CompareModal
          products={compareProducts}
          onRemove={(id) =>
            setCompareIds((current) => current.filter((item) => item !== id))
          }
          onConsult={(product) => {
            setCompareOpen(false);
            setConsultProduct(product);
          }}
          onClose={() => setCompareOpen(false)}
        />
      )}

      {consultProduct && (
        <ConsultationSheet
          product={consultProduct}
          onClose={() => setConsultProduct(null)}
        />
      )}
    </main>
  );
}
