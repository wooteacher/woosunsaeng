import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InternetCalculator from "@/components/internet/InternetCalculator";
import { CalculatorProvider } from "@/contexts/CalculatorContext";
import { fetchInternetCatalog } from "@/services/internet-products.service";

export default async function InternetPage() {
  const catalog = await fetchInternetCatalog();

  return (
    <>
      <Header />

      <main className="pb-12">
        <CalculatorProvider initialCatalog={catalog}>
          <InternetCalculator />
        </CalculatorProvider>
      </main>

      <Footer />
    </>
  );
}
