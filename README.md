# 우선생 인터넷 요금표 - 아정당 기준 최종 교정

교체 파일:
- lib/internet/data.ts

검증 핵심:
- KT 500M + 모든G = 51,700원
- KT 500M + 디즈니+ 모든G = 53,400원
- LG U+, SK, SkyLife, LG HelloVision, SKB 알뜰의 조합 총액을 아정당 공개표 기준으로 직접 입력
- 셋톱박스·모뎀·부가세가 포함된 아정당 표시 총액 기준
- 기존 CalculatorContext 및 FinalEstimate 구조와 호환

적용 후:
npm run build

주의:
- 스카이라이프는 사은품형 기준으로 구성했습니다.
- 헬로비전과 SKB 알뜰은 설치 가능 지역 확인이 필요합니다.
- 결합 할인과 카드 할인은 실제 가입 조건에 따라 달라질 수 있습니다.
