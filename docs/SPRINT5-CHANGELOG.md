# 우선생 렌탈 카탈로그 Sprint 5

## 목표

경쟁 렌탈 비교 서비스의 탐색 방식에 맞춰 상품 수, 필터, 비교 경험과 이미지 품질 기준을 동시에 보강했습니다.

## 결과

- 전체 상품: **59 → 80개**
- 검증 완료 상품: **50개**
- 공기청정기: **29개**
- 코웨이 공기청정기 라인업: **22개 모델 기준 보강**
- 신규·교체 이미지: **50개 WebP**
- 이미지 표준: **1200 × 900 / 흰색 캔버스 / 제품 중앙 정렬 / 비율 유지**
- 비교 가능 상품: **최대 3개**

## 화면 개선

- 전체 카테고리 및 카테고리별 상품 수 표시
- 브랜드 필터
- 사용 목적 필터
- 관리 방식 필터
- 월 렌탈료 필터
- 제품명·모델명·브랜드 통합 검색
- 추천순·낮은 가격순·높은 가격순 정렬
- 상품별 비교 담기
- 비교표에서 요금, 할인, 약정, 관리, 기능, 추천 용도 확인
- 이미지 오류 발생 시 깨진 이미지 아이콘을 노출하지 않는 대체 화면
- 가격 미확정 상품을 `상담 확인`으로 안전하게 표시

## 데이터 및 CRM

- Supabase `rental_products` 데이터를 우선 사용
- 로컬 검증 상품이 DB의 오래된 카탈로그 정보보다 최신이면 자동 보완
- DB에 아직 없는 신규 로컬 상품도 즉시 노출
- 상담 접수는 기존 `consultations` 테이블 구조 유지

## 포함 파일

- `app/rental/page.tsx`
- `components/rental/RentalPlatform.tsx`
- `data/rental/products.ts`
- `services/rental-products.service.ts`
- `public/rental/products/*.webp`
- `public/templates/rental-products-expansion-20260719-sprint5.csv`
- `scripts/audit-rental-catalog.mjs`
- `docs/rental-image-audit-sprint5.csv`
- `docs/rental-image-contact-sheet.webp`
