# 인터넷 가격 교정 v2

교체:
- lib/internet/data.ts

주요 수정:
- KT TV 요금은 3년 약정 + 인터넷 결합 기준으로 교정
- KT 모든G 19,800원
- KT 디즈니+ 모든G 21,500원
- 두 상품 차이 1,700원(TV 상품 자체 기준)
- 속도별 인터넷+TV 총액도 각각 다시 계산
- KT 휴대폰 1회선 할인 표시값을 100M 3,300원 / 500M 5,500원 / 1G 5,500원으로 분리
- LG/SK는 기존 통신사별 휴대폰 결합 할인 차이를 유지

주의:
FinalEstimate가 bundleMonthlyPrice를 사용해야 정확한 TV 결합 총액이 표시됩니다.
단순히 internet.monthlyPrice + tv.monthlyPrice로 더하지 마세요.

확인:
npm run build
