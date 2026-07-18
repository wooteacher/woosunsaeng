import type { Metadata } from "next";

import CustomerCenter from "@/components/customer-center/CustomerCenter";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "고객센터 | 우선생",
  description:
    "인터넷, TV, 생활가전 렌탈, 혜택 지급, 설치와 A/S 관련 자주 묻는 질문을 확인하고 빠르게 상담받아보세요.",
};

export default function CustomerCenterPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f8fa]">
        <CustomerCenter />
      </main>
      <Footer />
    </>
  );
}
