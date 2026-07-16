import type { Metadata } from "next";

import RentalPlatform from "@/components/rental/RentalPlatform";

export const metadata: Metadata = {
  title: "렌탈 | 우선생",
  description:
    "정수기, 공기청정기, 비데, 생활가전 렌탈 상품을 이미지 중심으로 비교하고 상담받아보세요.",
};

export default function RentalPage() {
  return <RentalPlatform />;
}
