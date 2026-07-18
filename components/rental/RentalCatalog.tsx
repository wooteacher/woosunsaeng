"use client";

import RentalPlatform from "@/components/rental/RentalPlatform";

/**
 * 기존 RentalCatalog import 경로와의 호환을 위한 래퍼입니다.
 * 실제 렌탈 화면은 RentalPlatform 하나로 통합됩니다.
 */
export default function RentalCatalog() {
  return <RentalPlatform />;
}
