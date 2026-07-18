import type { Metadata } from "next";

import HomeLanding from "@/components/home/HomeLanding";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "우선생 | 우리가 선택한 생활서비스",
  description:
    "인터넷, TV, 생활가전 렌탈을 쉽고 정확하게 비교하고 빠르게 상담받아보세요.",
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f8fa]">
        <HomeLanding />
      </main>
      <Footer />
    </>
  );
}
