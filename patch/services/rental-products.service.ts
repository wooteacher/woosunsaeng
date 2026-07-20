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

const storefrontReadyIds = new Set([
  "ceragem-master-v7",
  "cesco-ewbd151",
  "cesco-ewbd351",
  "chungho-bidet",
  "coway-ap-1019d",
  "coway-ap-1023f",
  "coway-ap-1125g",
  "coway-ap-1225f",
  "coway-ap-1523d",
  "coway-ap-1526a",
  "coway-ap-1623m",
  "coway-ap-2026b",
  "coway-ap-2425h",
  "coway-ap-3021d",
  "coway-ap-3024h",
  "coway-ap-3519a",
  "coway-ap-3522f",
  "coway-ap-3525i",
  "coway-ap-4025d",
  "coway-apd-1023a",
  "coway-apd-1025e",
  "coway-aph-0525f",
  "coway-apm-1226h",
  "coway-apms-1020a",
  "coway-chp-5730l",
  "coway-chpi-5810l",
  "coway-noble-aircare2",
  "cozyma-newera",
  "cuckoo-cms-g210nw",
  "cuckoo-cms-h410ww",
  "cuckoo-cms-j410bk",
  "cuckoo-cp-aas100ulw",
  "cuckoo-pet-dryroom",
  "cuckoo-restino",
  "hyundai-p-a52s",
  "hyundai-smart-bidet",
  "lg-dishwasher",
  "lg-fq18gv6ek2",
  "lg-g646gbb091",
  "lg-g646svv091",
  "lg-oled55c6kna",
  "lg-oled83c5kna",
  "lg-sq07gs9ees",
  "lg-washtower",
  "lg-y324gb7",
  "lg-y324gq7s",
  "ruhens-whp-2000",
  "sk-bubble-bidet",
  "sk-wpupbc204s",
]);

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
  return Boolean(
    imageUrl?.startsWith("/rental/products/") ||
      imageUrl?.startsWith("/rental/fallback/") ||
      imageUrl?.startsWith("/rental/catalog/") ||
      imageUrl?.startsWith("/rental/official/"),
  );
}

function isSupabaseStorageImage(imageUrl: string | undefined) {
  return Boolean(
    imageUrl &&
      /supabase\.(co|in)\/storage\/v1\/object/i.test(imageUrl),
  );
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
    image: isSupabaseStorageImage(databaseImage)
      ? databaseImage
      : isCuratedLocalImage(local?.image)
        ? local?.image
        : isManagedDatabaseImage(databaseImage)
          ? databaseImage
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

function isStorefrontReady(product: RentalProduct) {
  if (product.monthlyPrice === null || product.monthlyPrice <= 0) return false;
  if (!product.image) return false;

  if (isSupabaseStorageImage(product.image)) {
    return true;
  }

  return (
    storefrontReadyIds.has(product.id) &&
    (product.image.startsWith("/rental/products/") ||
      product.image.startsWith("/rental/official/"))
  );
}

function storefrontProducts(products: RentalProduct[]) {
  const seen = new Set<string>();

  return products.filter((product) => {
    if (seen.has(product.id) || !isStorefrontReady(product)) return false;
    seen.add(product.id);
    return true;
  });
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
      return storefrontProducts(rentalProducts);
    }

    const databaseProducts = (data as RentalProductRow[]).map(mapRentalProduct);
    const databaseIds = new Set(databaseProducts.map((product) => product.id));
    const newLocalProducts = rentalProducts.filter(
      (product) => !databaseIds.has(product.id),
    );

    // 새 상품을 코드 기준 카탈로그에 먼저 추가해도 기존 DB 상품과 함께 즉시 노출합니다.
    // 관리자에서 로컬 상품 동기화 또는 CSV 등록을 실행하면 이후 DB에서 관리됩니다.
    return storefrontProducts([...databaseProducts, ...newLocalProducts]);
  } catch {
    return storefrontProducts(rentalProducts);
  }
}
