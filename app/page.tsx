import Header from "@/components/layout/Header";

import Hero from "@/components/home/Hero";
import InternetSection from "@/components/home/InternetSection";
import RentalSection from "@/components/home/RentalSection";
import WhyUs from "@/components/home/WhyUs";
import Estimate from "@/components/home/Estimate";

import Footer from "@/components/layout/Footer";

import MobileBottomBar from "@/components/common/MobileBottomBar";
import FloatingContact from "@/components/common/FloatingContact";


export default function Home() {
  return (
    <>
      <Header />

      <main className="overflow-hidden">

        <Hero />

        <InternetSection />

        <RentalSection />

        <WhyUs />

        <Estimate />

      </main>


      <Footer />


      {/* Desktop 상담 버튼 */}
      <FloatingContact />


      {/* Mobile 상담 버튼 */}
      <MobileBottomBar />

    </>
  );
}