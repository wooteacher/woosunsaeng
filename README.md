# Daum postcode type conflict fix

교체 파일:
- components/internet/AddressSearch.tsx
- app/internet/apply/page.tsx

두 파일 중 `window.daum` 전역 타입 선언은 AddressSearch.tsx 한 곳에만 존재합니다.
적용 후 `npm run build`로 확인하세요.
