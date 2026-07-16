# 우선생 렌탈 페이지

## 포함 파일

- `app/rental/page.tsx`
- `components/rental/RentalCatalog.tsx`
- `data/rentalProducts.ts`

## 적용

압축을 풀고 프로젝트 동일 경로에 덮어씁니다.

그 다음:

```cmd
npm run build
```

빌드 성공 후:

```cmd
git add -A
git commit -m "Add rental page"
git push origin main
```

## 참고

`data/rentalProducts.ts`의 상품과 가격은 초기 UI 확인용 예시 데이터입니다.
실제 운영 전 최신 제휴 렌탈료, 약정기간, 카드 할인, 관리방식으로 교체해야 합니다.

상담 접수는 기존 Supabase `consultations` 테이블의
`name`, `phone`, `service` 컬럼을 사용합니다.
