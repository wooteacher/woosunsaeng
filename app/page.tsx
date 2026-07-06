import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import ServiceCards from "@/components/home/ServiceCards";
import WhyUs from "@/components/home/WhyUs";
import Estimate from "@/components/home/Estimate";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import FloatingContact from "@/components/common/FloatingContact";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <ServiceCards />
        <WhyUs />
        <Estimate />
      </main>

      <Footer />
      <MobileBottomBar />
      <FloatingContact />
    </>
  );
}