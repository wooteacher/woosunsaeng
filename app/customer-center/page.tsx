import type { Metadata } from "next";

import CustomerCenterPage from "@/components/customer-center/CustomerCenterPage";

export const metadata: Metadata = {
  title: "고객센터 | 우선생",
  description:
    "인터넷, 렌탈, 설치, 지원금, 결제 관련 자주 묻는 질문과 상담 안내를 확인하세요.",
};

export default function Page() {
  return <CustomerCenterPage />;
}
