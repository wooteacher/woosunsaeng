# 우선생 Rental V4

## 교체 파일
- app/rental/page.tsx
- components/rental/RentalPlatform.tsx
- data/rental/products.ts

## 핵심 개선
- 카테고리 선택 → 이용 목적 선택 → 추천상품 → 전체상품 흐름
- 검증 상품 13개
- 정수기, 비데, 안마의자, 건조기
- 브랜드/상품명/모델명 검색
- 목적별 추천 필터
- 월 렌탈료/최대 할인/최대혜택가
- 상품별 30초 상담 모달
- Supabase consultations 접수
- 모바일 하단 전화/무료상담 고정 버튼

## Supabase 주의
consultations 테이블에 memo 컬럼이 없다면 추가해야 합니다.

SQL:
alter table consultations add column if not exists memo text;

## 가격 안내
가격 및 카드 혜택 확인일: 2026-07-17
카드 할인은 전월 실적과 신규 발급 프로모션 조건에 따라 달라집니다.
