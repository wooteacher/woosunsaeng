"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  rentalCategories,
  rentalProducts,
  type RentalProduct,
} from "@/data/rental/products";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const RENTAL_IMAGE_BUCKET = "rental-product-images";
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_CSV_BYTES = 2 * 1024 * 1024;
const categorySet = new Set(
  rentalCategories.filter((category) => category !== "전체"),
);

async function assertRentalAdmin() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";
  const role = cookieStore.get("staff-role")?.value ?? "super_admin";

  if (!isAdmin || !["super_admin", "manager"].includes(role)) {
    throw new Error("렌탈 상품을 수정할 권한이 없습니다.");
  }
}

function optionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (text === "") return null;

  const number = Number(text.replaceAll(",", ""));
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`올바르지 않은 금액입니다: ${text}`);
  }

  return Math.round(number);
}

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text === "" ? null : text;
}

function stringList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/[|,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function assertProductId(id: string) {
  if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(id)) {
    throw new Error("상품 ID는 영문 소문자·숫자·하이픈으로 2~80자 이내로 입력해 주세요.");
  }
}

function assertCategory(category: string): asserts category is RentalProduct["category"] {
  if (!categorySet.has(category as RentalProduct["category"])) {
    throw new Error(`지원하지 않는 카테고리입니다: ${category}`);
  }
}

function imageExtension(file: File) {
  const extensionByMime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return extensionByMime[file.type];
}

async function uploadRentalImage(file: File, productId: string) {
  if (file.size === 0) return null;
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("상품 이미지는 6MB 이하만 업로드할 수 있습니다.");
  }

  const extension = imageExtension(file);
  if (!extension) {
    throw new Error("상품 이미지는 JPG, PNG, WebP 파일만 사용할 수 있습니다.");
  }

  const path = `catalog/${productId}/${Date.now()}.${extension}`;
  const body = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabaseAdmin.storage
    .from(RENTAL_IMAGE_BUCKET)
    .upload(path, body, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error(`이미지 업로드에 실패했습니다: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage
    .from(RENTAL_IMAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

async function getPayload(formData: FormData, id: string) {
  const category = String(formData.get("category") ?? "정수기").trim();
  assertCategory(category);

  const imageFile = formData.get("image_file");
  const uploadedImage =
    imageFile instanceof File && imageFile.size > 0
      ? await uploadRentalImage(imageFile, id)
      : null;

  const brand = String(formData.get("brand") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!brand || !name) {
    throw new Error("브랜드와 상품명은 필수입니다.");
  }

  return {
    category,
    brand,
    name,
    model_name: String(formData.get("model_name") ?? "옵션 상담").trim() || "옵션 상담",
    image_url: uploadedImage ?? optionalText(formData.get("image_url")),
    monthly_price: optionalNumber(formData.get("monthly_price")),
    max_card_discount: optionalNumber(formData.get("max_card_discount")),
    final_price: optionalNumber(formData.get("final_price")),
    contracts: stringList(formData.get("contracts")),
    management: stringList(formData.get("management")),
    features: stringList(formData.get("features")),
    purposes: stringList(formData.get("purposes")),
    recommended: formData.get("recommended") === "on",
    popular: formData.get("popular") === "on",
    source_url: optionalText(formData.get("source_url")),
    verified_at: optionalText(formData.get("verified_at")),
    data_status: String(formData.get("data_status") ?? "catalog") === "verified"
      ? "verified"
      : "catalog",
    active: formData.get("active") === "on",
    display_order: Math.round(Number(formData.get("display_order") ?? 0) || 0),
  };
}

function revalidateRentalPaths() {
  revalidatePath("/rental");
  revalidatePath("/admin/rentals");
}

function redirectWithNotice(message: string) {
  redirect(`/admin/rentals?notice=${encodeURIComponent(message)}`);
}

export async function createRentalProduct(formData: FormData) {
  await assertRentalAdmin();

  const id = String(formData.get("id") ?? "").trim();
  assertProductId(id);

  const { error } = await supabaseAdmin
    .from("rental_products")
    .insert({ id, ...(await getPayload(formData, id)) });

  if (error) throw new Error(error.message);
  revalidateRentalPaths();
  redirectWithNotice("새 렌탈 상품을 등록했습니다.");
}

export async function updateRentalProduct(formData: FormData) {
  await assertRentalAdmin();

  const id = String(formData.get("id") ?? "").trim();
  assertProductId(id);

  const { error } = await supabaseAdmin
    .from("rental_products")
    .update(await getPayload(formData, id))
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateRentalPaths();
  redirectWithNotice("상품 정보를 저장했습니다.");
}

export async function importLocalRentalProducts() {
  await assertRentalAdmin();

  const rows = rentalProducts.map((product, index) => ({
    id: product.id,
    category: product.category,
    brand: product.brand,
    name: product.name,
    model_name: product.modelName,
    image_url: product.image ?? null,
    monthly_price: product.monthlyPrice,
    max_card_discount: product.maxCardDiscount,
    final_price: product.finalPrice,
    contracts: product.contracts,
    management: product.management,
    features: product.features,
    purposes: product.purposes,
    recommended: product.recommended ?? false,
    popular: product.popular ?? false,
    source_url: product.sourceUrl || null,
    verified_at: product.verifiedAt || null,
    data_status: product.dataStatus,
    active: true,
    display_order: index + 1,
  }));

  const { error } = await supabaseAdmin
    .from("rental_products")
    .upsert(rows, { onConflict: "id" });

  if (error) throw new Error(error.message);
  revalidateRentalPaths();
  redirectWithNotice(`기본 상품 ${rows.length}개를 DB와 동기화했습니다.`);
}

type CsvRow = Record<string, string>;

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  const source = text.replace(/^\uFEFF/, "");
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];

    if (character === '"') {
      if (quoted && next === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (character === "," && !quoted) {
      row.push(value.trim());
      value = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(value.trim());
      value = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
      continue;
    }

    value += character;
  }

  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);

  if (rows.length < 2) {
    throw new Error("CSV에 헤더와 상품 데이터가 필요합니다.");
  }

  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const required = ["id", "category", "brand", "name"];
  const missingHeaders = required.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`CSV 필수 열이 없습니다: ${missingHeaders.join(", ")}`);
  }

  return rows.slice(1).map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])),
  ) as CsvRow[];
}

function csvBoolean(value: string, fallback = false) {
  if (!value.trim()) return fallback;
  return ["1", "true", "yes", "y", "on", "공개", "사용"].includes(
    value.trim().toLowerCase(),
  );
}

function csvNumber(value: string) {
  const text = value.trim().replaceAll(",", "");
  if (!text) return null;
  const number = Number(text);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`올바르지 않은 숫자입니다: ${value}`);
  }
  return Math.round(number);
}

function csvList(value: string) {
  return value
    .split(/[|;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapCsvRow(row: CsvRow, index: number) {
  const line = index + 2;
  const id = row.id?.trim().toLowerCase();
  try {
    assertProductId(id);
    assertCategory(row.category?.trim());
  } catch (error) {
    throw new Error(`CSV ${line}행: ${error instanceof Error ? error.message : "형식 오류"}`);
  }

  const brand = row.brand?.trim();
  const name = row.name?.trim();
  if (!brand || !name) {
    throw new Error(`CSV ${line}행: 브랜드와 상품명은 필수입니다.`);
  }

  return {
    id,
    category: row.category.trim(),
    brand,
    name,
    model_name: row.model_name?.trim() || "옵션 상담",
    image_url: row.image_url?.trim() || null,
    monthly_price: csvNumber(row.monthly_price ?? ""),
    max_card_discount: csvNumber(row.max_card_discount ?? ""),
    final_price: csvNumber(row.final_price ?? ""),
    contracts: csvList(row.contracts ?? ""),
    management: csvList(row.management ?? ""),
    features: csvList(row.features ?? ""),
    purposes: csvList(row.purposes ?? ""),
    recommended: csvBoolean(row.recommended ?? ""),
    popular: csvBoolean(row.popular ?? ""),
    source_url: row.source_url?.trim() || null,
    verified_at: row.verified_at?.trim() || null,
    data_status: row.data_status?.trim() === "verified" ? "verified" : "catalog",
    active: csvBoolean(row.active ?? "", true),
    display_order: Math.round(Number(row.display_order || index + 1) || index + 1),
  };
}

export async function importRentalProductsCsv(formData: FormData) {
  await assertRentalAdmin();

  const file = formData.get("csv_file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("등록할 CSV 파일을 선택해 주세요.");
  }
  if (file.size > MAX_CSV_BYTES) {
    throw new Error("CSV 파일은 2MB 이하만 등록할 수 있습니다.");
  }

  const rows = parseCsv(await file.text()).map(mapCsvRow);
  const uniqueRows = Array.from(
    new Map(rows.map((row) => [row.id, row] as const)).values(),
  );

  for (let index = 0; index < uniqueRows.length; index += 200) {
    const batch = uniqueRows.slice(index, index + 200);
    const { error } = await supabaseAdmin
      .from("rental_products")
      .upsert(batch, { onConflict: "id" });

    if (error) throw new Error(error.message);
  }

  revalidateRentalPaths();
  redirectWithNotice(`CSV 상품 ${uniqueRows.length}개를 등록·업데이트했습니다.`);
}
