import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Estimate from "@/components/home/Estimate";
import InternetCalculator from "@/components/internet/InternetCalculator";

export const metadata: Metadata = {
  title: "인터넷 요금 비교 | 우선생",
  description:
    "인터넷과 TV, 휴대폰 결합 및 제휴카드 할인까지 한 번에 비교해 보세요.",
};

export default function InternetPage() {
  return (
    <>
      <Header />

      <main>
        <InternetCalculator />

        <div id="estimate">
          <Estimate />
        </div>
      </main>

      <Footer />
    </>
  );
}