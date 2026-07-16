import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InternetCalculator from "@/components/internet/InternetCalculator";

export default function InternetPage() {
  return (
    <>
      <Header />

      <main className="pb-12">
        <InternetCalculator />
      </main>

      <Footer />
    </>
  );
}