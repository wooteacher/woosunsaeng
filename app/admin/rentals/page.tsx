import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Card from "@/components/ui/Card";
import {
  rentalCategories,
  rentalProducts,
  type RentalProduct,
} from "@/data/rental/products";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  createRentalProduct,
  importLocalRentalProducts,
  importRentalProductsCsv,
  updateRentalProduct,
} from "./actions";

const categories = rentalCategories.filter((category) => category !== "전체");

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400";
const textareaClass =
  "min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-400";

type RentalAdminRow = {
  id: string;
  category: RentalProduct["category"];
  brand: string;
  name: string;
  model_name: string;
  image_url: string | null;
  monthly_price: number | null;
  max_card_discount: number | null;
  final_price: number | null;
  contracts: string[];
  management: string[];
  features: string[];
  purposes: string[];
  recommended: boolean;
  popular: boolean;
  source_url: string | null;
  verified_at: string | null;
  data_status: RentalProduct["dataStatus"];
  active: boolean;
  display_order: number;
};

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

type ImageState = "ready" | "missing" | "external" | "placeholder";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getImageState(imageUrl: string | null): ImageState {
  if (!imageUrl) return "missing";
  if (imageUrl.startsWith("/rental/placeholders/")) return "placeholder";
  if (
    imageUrl.startsWith("/rental/products/") ||
    imageUrl.includes("/storage/v1/object/public/rental-product-images/")
  ) {
    return "ready";
  }
  return "external";
}

const imageStateLabels: Record<ImageState, string> = {
  ready: "이미지 완료",
  missing: "이미지 없음",
  external: "외부 이미지",
  placeholder: "대체 이미지",
};

const imageStateClasses: Record<ImageState, string> = {
  ready: "bg-emerald-50 text-emerald-700",
  missing: "bg-rose-50 text-rose-700",
  external: "bg-amber-50 text-amber-700",
  placeholder: "bg-slate-100 text-slate-600",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Check({
  name,
  label,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-emerald-600"
      />
      {label}
    </label>
  );
}

function ProductFields({ product }: { product?: RentalAdminRow }) {
  const previewStyle = product?.image_url
    ? { backgroundImage: `url(${JSON.stringify(product.image_url)})` }
    : undefined;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Field label="상품 ID (영문·숫자·하이픈)">
        <input
          name="id"
          required
          readOnly={Boolean(product)}
          defaultValue={product?.id ?? ""}
          placeholder="coway-icon-water-purifier"
          className={`${inputClass} ${product ? "bg-slate-100 text-slate-500" : ""}`}
        />
      </Field>

      <Field label="카테고리">
        <select
          name="category"
          defaultValue={product?.category ?? "정수기"}
          className={inputClass}
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </Field>

      <Field label="브랜드">
        <input name="brand" required defaultValue={product?.brand ?? ""} className={inputClass} />
      </Field>

      <Field label="모델명">
        <input
          name="model_name"
          defaultValue={product?.model_name ?? "옵션 상담"}
          className={inputClass}
        />
      </Field>

      <Field label="상품명">
        <input name="name" required defaultValue={product?.name ?? ""} className={inputClass} />
      </Field>

      <Field label="상품 이미지 경로 또는 URL">
        <input
          name="image_url"
          type="text"
          defaultValue={product?.image_url ?? ""}
          placeholder="/rental/products/product.webp 또는 https://..."
          className={inputClass}
        />
      </Field>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-500">상품 이미지 직접 업로드</p>
        <input
          name="image_file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-3 block w-full text-sm font-medium text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
        />
        <p className="mt-2 text-xs leading-5 text-slate-400">
          JPG·PNG·WebP, 최대 6MB. 파일을 선택하면 위 URL보다 우선 적용됩니다.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div
          className="aspect-[4/3] rounded-xl bg-slate-50 bg-contain bg-center bg-no-repeat"
          style={previewStyle}
        >
          {!product?.image_url && (
            <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-400">
              등록된 이미지 없음
            </div>
          )}
        </div>
      </div>

      <Field label="기본 월 렌탈료">
        <input
          name="monthly_price"
          type="number"
          min="0"
          defaultValue={product?.monthly_price ?? ""}
          placeholder="32900"
          className={inputClass}
        />
      </Field>

      <Field label="카드 최대 할인">
        <input
          name="max_card_discount"
          type="number"
          min="0"
          defaultValue={product?.max_card_discount ?? ""}
          placeholder="25000"
          className={inputClass}
        />
      </Field>

      <Field label="카드 적용 예상가">
        <input
          name="final_price"
          type="number"
          min="0"
          defaultValue={product?.final_price ?? ""}
          placeholder="7900"
          className={inputClass}
        />
      </Field>

      <Field label="정렬 순서">
        <input
          name="display_order"
          type="number"
          defaultValue={product?.display_order ?? 0}
          className={inputClass}
        />
      </Field>

      <Field label="약정 (쉼표·|·줄바꿈)">
        <textarea
          name="contracts"
          defaultValue={product?.contracts?.join(", ") ?? ""}
          className={textareaClass}
        />
      </Field>

      <Field label="관리 방식 (쉼표·|·줄바꿈)">
        <textarea
          name="management"
          defaultValue={product?.management?.join(", ") ?? ""}
          className={textareaClass}
        />
      </Field>

      <Field label="핵심 특징 (쉼표·|·줄바꿈)">
        <textarea
          name="features"
          defaultValue={product?.features?.join(", ") ?? ""}
          className={textareaClass}
        />
      </Field>

      <Field label="추천 대상 (쉼표·|·줄바꿈)">
        <textarea
          name="purposes"
          defaultValue={product?.purposes?.join(", ") ?? ""}
          placeholder="가성비, 신혼부부, 부모님"
          className={textareaClass}
        />
      </Field>

      <Field label="내부 참고 URL">
        <input
          name="source_url"
          type="url"
          defaultValue={product?.source_url ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="정보 확인일">
        <input
          name="verified_at"
          type="date"
          defaultValue={product?.verified_at ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="데이터 상태">
        <select
          name="data_status"
          defaultValue={product?.data_status ?? "catalog"}
          className={inputClass}
        >
          <option value="verified">가격 확인 완료</option>
          <option value="catalog">가격 확인 중</option>
        </select>
      </Field>

      <div className="grid grid-cols-3 gap-2 self-end">
        <Check name="recommended" label="우선생 추천" defaultChecked={product?.recommended} />
        <Check name="popular" label="BEST" defaultChecked={product?.popular} />
        <Check name="active" label="홈페이지 노출" defaultChecked={product ? product.active : true} />
      </div>
    </div>
  );
}

export default async function AdminRentalsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";
  const role = cookieStore.get("staff-role")?.value ?? "super_admin";

  if (!isAdmin) redirect("/admin/login");
  if (!["super_admin", "manager"].includes(role)) redirect("/admin");

  const params = await searchParams;
  const query = firstParam(params.q).trim().toLowerCase();
  const category = firstParam(params.category);
  const image = firstParam(params.image);
  const dataStatus = firstParam(params.data_status);
  const visibility = firstParam(params.visibility);
  const notice = firstParam(params.notice);

  const { data, error } = await supabaseAdmin
    .from("rental_products")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  const products = (data ?? []) as RentalAdminRow[];
  const activeCount = products.filter((product) => product.active).length;
  const missingImageCount = products.filter(
    (product) => getImageState(product.image_url) === "missing",
  ).length;
  const externalImageCount = products.filter(
    (product) => getImageState(product.image_url) === "external",
  ).length;
  const catalogCount = products.filter(
    (product) => product.data_status === "catalog",
  ).length;

  const filteredProducts = products.filter((product) => {
    const haystack = `${product.id} ${product.brand} ${product.name} ${product.model_name}`.toLowerCase();
    if (query && !haystack.includes(query)) return false;
    if (category && product.category !== category) return false;
    if (image && getImageState(product.image_url) !== image) return false;
    if (dataStatus && product.data_status !== dataStatus) return false;
    if (visibility === "active" && !product.active) return false;
    if (visibility === "hidden" && product.active) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Rental Catalog</p>
            <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              렌탈 상품 관리
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              개별 등록, 이미지 업로드, CSV 일괄 등록으로 상품을 계속 확장합니다.
            </p>
          </div>

          <form action={importLocalRentalProducts}>
            <button
              type="submit"
              className="h-12 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              기본 상품 {rentalProducts.length}개 DB 동기화
            </button>
          </form>
        </div>

        {notice && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-900">
            렌탈 상품 테이블이 아직 준비되지 않았습니다. Supabase SQL Editor에서
            <code className="mx-1 rounded bg-white px-1.5 py-0.5">supabase/rental_products.sql</code>
            내용을 실행해 주세요.
            <p className="mt-2 text-xs font-medium text-amber-700">{error.message}</p>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-400">전체 등록</p>
            <p className="mt-2 text-3xl font-bold">{products.length}개</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-400">홈페이지 노출</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{activeCount}개</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-400">이미지 없음</p>
            <p className="mt-2 text-3xl font-bold text-rose-600">{missingImageCount}개</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-400">외부 이미지</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">{externalImageCount}개</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-400">가격 확인 중</p>
            <p className="mt-2 text-3xl font-bold">{catalogCount}개</p>
          </Card>
        </div>

        <div className="mt-7 grid gap-4 xl:grid-cols-2">
          <Card className="p-5 sm:p-7">
            <details>
              <summary className="cursor-pointer list-none text-xl font-bold text-slate-950">
                ＋ 새 렌탈 상품 개별 등록
              </summary>
              <form action={createRentalProduct} className="mt-6">
                <ProductFields />
                <button
                  type="submit"
                  className="mt-6 h-12 w-full rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
                >
                  상품 등록하기
                </button>
              </form>
            </details>
          </Card>

          <Card className="p-5 sm:p-7">
            <h2 className="text-xl font-bold text-slate-950">CSV 상품 일괄 등록</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
              여러 상품을 한 번에 추가하거나 같은 ID의 상품을 업데이트합니다. 약정·관리·특징은
              <strong className="mx-1 text-slate-700">|</strong>기호로 구분합니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/templates/rental-products-template.csv"
                download
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
              >
                CSV 양식 다운로드
              </Link>
            </div>
            <form action={importRentalProductsCsv} className="mt-5">
              <input
                name="csv_file"
                type="file"
                accept=".csv,text/csv"
                required
                className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
              />
              <button
                type="submit"
                className="mt-4 h-12 w-full rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-emerald-600 sm:w-auto"
              >
                CSV 등록·업데이트
              </button>
            </form>
          </Card>
        </div>

        <Card className="mt-7 p-5 sm:p-6">
          <form method="get" className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <input
              name="q"
              defaultValue={firstParam(params.q)}
              placeholder="상품명·모델명·브랜드 검색"
              className={`${inputClass} xl:col-span-2`}
            />
            <select name="category" defaultValue={category} className={inputClass}>
              <option value="">전체 카테고리</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select name="image" defaultValue={image} className={inputClass}>
              <option value="">전체 이미지 상태</option>
              <option value="missing">이미지 없음</option>
              <option value="external">외부 이미지</option>
              <option value="placeholder">대체 이미지</option>
              <option value="ready">이미지 완료</option>
            </select>
            <select name="data_status" defaultValue={dataStatus} className={inputClass}>
              <option value="">전체 데이터 상태</option>
              <option value="catalog">가격 확인 중</option>
              <option value="verified">가격 확인 완료</option>
            </select>
            <select name="visibility" defaultValue={visibility} className={inputClass}>
              <option value="">전체 노출 상태</option>
              <option value="active">홈페이지 노출</option>
              <option value="hidden">숨김</option>
            </select>
            <div className="flex gap-2 md:col-span-2 xl:col-span-6 xl:justify-end">
              <Link
                href="/admin/rentals"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600"
              >
                초기화
              </Link>
              <button
                type="submit"
                className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white"
              >
                필터 적용
              </button>
            </div>
          </form>
        </Card>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            검색 결과 <strong className="text-emerald-600">{filteredProducts.length}개</strong>
          </p>
        </div>

        <div className="mt-3 space-y-3">
          {filteredProducts.map((product) => {
            const imageState = getImageState(product.image_url);
            return (
              <Card key={product.id} className="overflow-hidden">
                <details>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {product.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">{product.brand}</span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${imageStateClasses[imageState]}`}>
                          {imageStateLabels[imageState]}
                        </span>
                        {product.data_status === "catalog" && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            가격 확인 중
                          </span>
                        )}
                        {!product.active && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                            숨김
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 truncate text-lg font-bold text-slate-950">{product.name}</h2>
                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {product.id} · {product.model_name}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-emerald-700">수정하기</span>
                  </summary>

                  <form
                    action={updateRentalProduct}
                    className="border-t border-slate-100 p-5 sm:p-6"
                  >
                    <ProductFields product={product} />
                    <button
                      type="submit"
                      className="mt-6 h-12 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      변경 내용 저장
                    </button>
                  </form>
                </details>
              </Card>
            );
          })}

          {!error && filteredProducts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <p className="font-semibold text-slate-700">조건에 맞는 렌탈 상품이 없습니다.</p>
              <p className="mt-2 text-sm font-medium text-slate-400">
                필터를 초기화하거나 새 상품을 등록해 주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
