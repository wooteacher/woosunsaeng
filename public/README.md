# 우선생 헤더·로고 고정 수정본

## 교체 파일
- components/common/BrandLogo.tsx
- components/common/HomeLogoLink.tsx
- components/layout/Header.tsx
- public/images/logo/woosunsaeng-logo.svg

## 수정 내용
- 업로드한 SVG 내부의 흰색 전체 배경 경로 제거
- 로고 주변 불필요한 여백 자동 크롭
- 헤더 높이를 항상 72px로 고정
- 스크롤해도 로고 높이 고정
- 스크롤 시 배경/테두리/그림자만 변경
- 인터넷 페이지의 집 아이콘 교체용 HomeLogoLink 컴포넌트 추가

## 인터넷 페이지 집 아이콘 교체
인터넷 페이지에서 아래와 같은 코드가 있다면:

<Home ... />

또는

<Link href="/"><Home /></Link>

다음으로 교체하세요:

import HomeLogoLink from "@/components/common/HomeLogoLink";

<HomeLogoLink />

집 아이콘이 들어 있는 인터넷 페이지 파일을 보내주시면 해당 파일까지 전체 교체본으로 정확히 수정할 수 있습니다.
