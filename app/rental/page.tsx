import type { Metadata } from "next";

import RentalPlatform from "@/components/rental/RentalPlatform";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "렌탈 상품 비교 | 우선생",
  description:
    "정수기, 공기청정기, 비데, 안마의자와 생활가전의 이미지, 월 렌탈료, 제휴카드 할인, 약정과 관리방식을 검색하고 비교해보세요.",
};

export default function RentalPage() {
  return (
    <>
      <Header />
      <RentalPlatform />
      <Footer />
    </>
  );
}
