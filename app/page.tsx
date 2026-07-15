import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import CustomerNeeds from "@/components/home/CustomerNeeds";
import ServiceSection from "@/components/home/ServiceSection";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/layout/Footer";

import FloatingContact from "@/components/common/FloatingContact";
import MobileBottomBar from "@/components/common/MobileBottomBar";

export default function Home() {
  return (
    <>
      <Header />

      <main className="overflow-hidden">
        <Hero />

        <CustomerNeeds />

        <ServiceSection />

        <CallToAction />
      </main>

      <Footer />

      <FloatingContact />

      <MobileBottomBar />
    </>
  );
}