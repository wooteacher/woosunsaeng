# 우선생 렌탈 페이지 v2

## 교체 파일

- `app/rental/page.tsx`
- `components/rental/RentalPlatform.tsx`
- `data/rental/products.ts`

## 이미지 경로

- `public/images/rental/products/README.txt`

이미지가 아직 없어도 모델명 기반 fallback 카드가 표시되므로 빌드 오류나 깨진 이미지가 발생하지 않습니다.
제휴사 이미지를 안내된 파일명으로 넣으면 자동으로 실제 이미지로 바뀝니다.

## 적용 후

```cmd
npm run build
```

성공하면:

```cmd
git add -A
git commit -m "Renew rental page v2"
git push origin main
```

## 구현 기능

- 이미지 중심 렌탈 상품 카드
- 카테고리 선택
- 버튼형 브랜드 필터
- 상품 검색
- 추천순/가격순/최신순
- BEST/추천/NEW 배지
- 모델명·재고·특징
- 월 렌탈료·제휴카드 할인
- 선택 상품 하단 고정 요약
- 모바일 바텀시트 상담
- Supabase `consultations` 저장
