# 우선생 고객센터 페이지

## 포함 파일

- `app/customer-center/page.tsx`
- `components/customer-center/CustomerCenterPage.tsx`
- `data/customerCenterFaqs.ts`

## 적용 방법

압축을 풀고 프로젝트 동일 경로에 덮어씁니다.

```cmd
npm run build
```

빌드 성공 후:

```cmd
git add -A
git commit -m "Add customer center page"
git push origin main
```

## 추후 교체할 값

`components/customer-center/CustomerCenterPage.tsx`

- `PHONE_NUMBER`
- `PHONE_HREF`
- 카카오 채널 링크
- 실제 상담 운영시간

사업자 및 고객센터 정보 확정 후 수정하면 됩니다.
