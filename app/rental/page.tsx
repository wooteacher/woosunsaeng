import type { Metadata } from "next";

import RentalCatalog from "@/components/rental/RentalCatalog";

export const metadata: Metadata = {
  title: "렌탈 | 우선생",
  description:
    "정수기, 공기청정기, 비데, 안마의자 등 다양한 렌탈 상품을 간편하게 비교하고 상담받아보세요.",
};

export default function RentalPage() {
  return <RentalCatalog />;
}
