import { rentalProducts, type RentalProduct } from "@/data/rental/products";
import { supabase } from "@/lib/supabase";

type RentalProductRow = {
  id: string;
  category: RentalProduct["category"];
  brand: string;
  name: string;
  model_name: string | null;
  image_url: string | null;
  monthly_price: number | null;
  max_card_discount: number | null;
  final_price: number | null;
  contracts: string[] | null;
  management: string[] | null;
  features: string[] | null;
  purposes: RentalProduct["purposes"] | null;
  recommended: boolean | null;
  popular: boolean | null;
  source_url: string | null;
  verified_at: string | null;
  data_status: RentalProduct["dataStatus"] | null;
};

const localProductMap = new Map(
  rentalProducts.map((product) => [product.id, product] as const),
);

function isUsableProductImage(imageUrl: string | null | undefined) {
  if (!imageUrl) return false;

  // 제휴몰의 AP-* 파일은 실제 제품 이미지가 아니라 브랜드 로고인 경우가 많아
  // 카드 이미지로 사용하지 않습니다. 로컬 제품 이미지 또는 카테고리 일러스트로 대체합니다.
  return !/clvrental777\.com\/img\/supply\/AP-/i.test(imageUrl);
}

function isManagedDatabaseImage(imageUrl: string | undefined) {
  if (!imageUrl || imageUrl.startsWith("/rental/placeholders/")) return false;

  // 관리자가 직접 올린 제품 이미지 또는 Supabase Storage 이미지는 DB 값을 우선합니다.
  // 기존 DB의 카테고리 대체 이미지는 새로 정리한 로컬 제품 사진으로 자동 교체합니다.
  return (
    imageUrl.startsWith("/") ||
    /supabase\.(co|in)\/storage\/v1\/object/i.test(imageUrl)
  );
}

function isCuratedLocalImage(imageUrl: string | undefined) {
  return Boolean(imageUrl?.startsWith("/rental/products/"));
}


function preferModelName(databaseValue: string | null, localValue: string | undefined) {
  if (!databaseValue || /^(옵션 상담|상담 확인|확인 중)$/i.test(databaseValue.trim())) {
    return localValue ?? "옵션 상담";
  }

  return databaseValue;
}

function preferArray<T>(value: T[] | null, fallback: T[] | undefined) {
  return value && value.length > 0 ? value : (fallback ?? []);
}

function mapRentalProduct(row: RentalProductRow): RentalProduct {
  const local = localProductMap.get(row.id);
  const useCuratedLocalUpgrade =
    local?.dataStatus === "verified" && row.data_status !== "verified";
  const databaseImage = isUsableProductImage(row.image_url)
    ? row.image_url ?? undefined
    : undefined;

  return {
    id: row.id,
    category: useCuratedLocalUpgrade ? local.category : row.category,
    brand: useCuratedLocalUpgrade ? local.brand : row.brand,
    name: useCuratedLocalUpgrade ? local.name : row.name,
    modelName: useCuratedLocalUpgrade
      ? local.modelName
      : preferModelName(row.model_name, local?.modelName),
    image: isManagedDatabaseImage(databaseImage)
      ? databaseImage
      : isCuratedLocalImage(local?.image)
        ? local?.image
        : (databaseImage ?? local?.image),
    imageMode: local?.imageMode,
    imagePosition: local?.imagePosition,
    gallery: local?.gallery,
    summary: local?.summary,
    specs: local?.specs,
    installNotes: local?.installNotes,
    monthlyPrice: useCuratedLocalUpgrade
      ? local.monthlyPrice
      : (row.monthly_price ?? local?.monthlyPrice ?? null),
    maxCardDiscount: useCuratedLocalUpgrade
      ? local.maxCardDiscount
      : (row.max_card_discount ?? local?.maxCardDiscount ?? null),
    finalPrice: useCuratedLocalUpgrade
      ? local.finalPrice
      : (row.final_price ?? local?.finalPrice ?? null),
    contracts: useCuratedLocalUpgrade
      ? local.contracts
      : preferArray(row.contracts, local?.contracts),
    management: useCuratedLocalUpgrade
      ? local.management
      : preferArray(row.management, local?.management),
    features: useCuratedLocalUpgrade
      ? local.features
      : preferArray(row.features, local?.features),
    purposes: useCuratedLocalUpgrade
      ? local.purposes
      : preferArray(row.purposes, local?.purposes),
    recommended: useCuratedLocalUpgrade
      ? (local.recommended ?? false)
      : (row.recommended ?? local?.recommended ?? false),
    popular: useCuratedLocalUpgrade
      ? (local.popular ?? false)
      : (row.popular ?? local?.popular ?? false),
    sourceUrl: useCuratedLocalUpgrade
      ? local.sourceUrl
      : (row.source_url ?? local?.sourceUrl ?? ""),
    verifiedAt: useCuratedLocalUpgrade
      ? local.verifiedAt
      : (row.verified_at ?? local?.verifiedAt ?? ""),
    dataStatus: useCuratedLocalUpgrade
      ? local.dataStatus
      : (row.data_status ?? local?.dataStatus ?? "catalog"),
  };
}

export async function fetchRentalProducts(): Promise<RentalProduct[]> {
  try {
    const { data, error } = await supabase
      .from("rental_products")
      .select(
        "id, category, brand, name, model_name, image_url, monthly_price, max_card_discount, final_price, contracts, management, features, purposes, recommended, popular, source_url, verified_at, data_status",
      )
      .eq("active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return rentalProducts;
    }

    const databaseProducts = (data as RentalProductRow[]).map(mapRentalProduct);
    const databaseIds = new Set(databaseProducts.map((product) => product.id));
    const newLocalProducts = rentalProducts.filter(
      (product) => !databaseIds.has(product.id),
    );

    // 새 상품을 코드 기준 카탈로그에 먼저 추가해도 기존 DB 상품과 함께 즉시 노출합니다.
    // 관리자에서 로컬 상품 동기화 또는 CSV 등록을 실행하면 이후 DB에서 관리됩니다.
    return [...databaseProducts, ...newLocalProducts];
  } catch {
    return rentalProducts;
  }
}
