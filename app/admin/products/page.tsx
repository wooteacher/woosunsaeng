import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Card from "@/components/ui/Card";

const carriers = [
  "KT",
  "LG",
  "SK",
  "SKB",
  "SkyLife",
  "LG HelloVision",
];

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const { data: products } = await supabaseAdmin
    .from("products")
    .select("carrier");

  const getCount = (carrier: string) =>
    products?.filter((item) => item.carrier === carrier).length ?? 0;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-4xl font-black text-gray-950">상품관리</h1>
          <p className="mt-2 font-bold text-gray-600">
            통신사별 상품과 추천 노출을 관리합니다.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {carriers.map((carrier) => (
            <Card key={carrier} className="p-6">
              <p className="text-sm font-black text-green-600">통신사</p>

              <h2 className="mt-2 text-3xl font-black text-gray-950">
                {carrier}
              </h2>

              <p className="mt-3 font-bold text-gray-500">
                등록 상품 {getCount(carrier)}개
              </p>

              <Link
                href={`/admin/products/${encodeURIComponent(carrier)}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-green-600 px-5 py-4 font-black text-white transition hover:bg-green-700"
              >
                관리하기
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}