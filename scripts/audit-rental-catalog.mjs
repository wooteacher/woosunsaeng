import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const incrementalMode = process.argv.includes("--incremental");
const dataFile = path.join(root, "data", "rental", "products.ts");
const publicRoot = path.join(root, "public");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`✓ ${message}`);
}

if (!fs.existsSync(dataFile)) {
  fail(`상품 데이터 파일을 찾을 수 없습니다: ${dataFile}`);
  process.exit();
}

const source = fs.readFileSync(dataFile, "utf8");
const ids = [...source.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);
const models = [...source.matchAll(/\bmodelName:\s*"([^"]+)"/g)].map((match) => match[1]);
const images = [...source.matchAll(/\bimage:\s*"([^"]+)"/g)].map((match) => match[1]);
const statuses = [...source.matchAll(/\bdataStatus:\s*"([^"]+)"/g)].map((match) => match[1]);

function duplicates(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()].filter(([, count]) => count > 1);
}

const duplicateIds = duplicates(ids);
const duplicateModels = duplicates(models);

console.log("\n우선생 렌탈 카탈로그 검사");
console.log("────────────────────────");
console.log(`전체 상품: ${ids.length}개`);
console.log(`검증 완료: ${statuses.filter((status) => status === "verified").length}개`);
console.log(`카탈로그: ${statuses.filter((status) => status === "catalog").length}개`);

if (duplicateIds.length === 0) ok("상품 ID 중복 없음");
else fail(`상품 ID 중복: ${duplicateIds.map(([value]) => value).join(", ")}`);

if (duplicateModels.length === 0) ok("모델명 중복 없음");
else fail(`모델명 중복: ${duplicateModels.map(([value]) => value).join(", ")}`);

const localImages = images.filter((image) => image.startsWith("/"));
const remoteImages = images.filter((image) => /^https?:\/\//i.test(image));
const missingImages = localImages.filter(
  (image) => !fs.existsSync(path.join(publicRoot, image.replace(/^\//, ""))),
);

console.log(`로컬 이미지 참조: ${localImages.length}개`);
console.log(`외부 이미지 참조: ${remoteImages.length}개`);

if (missingImages.length === 0) {
  ok("로컬 이미지 누락 없음");
} else {
  const message = `로컬 이미지 누락 ${missingImages.length}개`;
  if (incrementalMode) console.warn(`△ ${message} (기존 프로젝트와 병합 후 다시 검사)`);
  else fail(message);
  missingImages.forEach((image) => console.error(`  - ${image}`));
}

const deliveredImageDir = path.join(publicRoot, "rental", "products");
const deliveredImages = fs.existsSync(deliveredImageDir)
  ? fs.readdirSync(deliveredImageDir).filter((name) => /\.(webp|png|jpe?g)$/i.test(name))
  : [];
console.log(`현재 프로젝트의 렌탈 이미지 파일: ${deliveredImages.length}개`);

if (process.exitCode) {
  console.error("\n검사 실패: 위 항목을 수정한 뒤 다시 실행하세요.");
} else {
  console.log("\n검사 완료: 렌탈 카탈로그 상태가 정상입니다.");
}
