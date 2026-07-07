import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Card from "@/components/ui/Card";

export default async function AdminProductsPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const { data: products } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black text-gray-950">상품 관리</h1>
        <p className="mt-2 font-bold text-gray-600">
          메인 추천 상품과 인터넷 상품 정보를 관리합니다.
        </p>

        <div className="mt-8 space-y-5">
          {products?.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-black text-green-600">
                    {item.badge ?? "추천상품"}
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">
                    {item.carrier} {item.internet_speed} + {item.tv_plan}
                  </h2>
                  <p className="mt-2 font-bold text-gray-600">
                    {item.service_type}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-4 py-2 font-black text-green-700">
                  {item.featured ? "메인 노출" : "숨김"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div>
                  <p className="font-bold text-gray-500">기본 요금</p>
                  <p className="text-2xl font-black">
                    {item.base_price?.toLocaleString()}원
                  </p>
                </div>

                <div>
                  <p className="font-bold text-gray-500">사은품</p>
                  <p className="text-2xl font-black">
                    {item.reward_amount?.toLocaleString()}원
                  </p>
                </div>

                <div>
                  <p className="font-bold text-gray-500">추가혜택</p>
                  <p className="text-2xl font-black">
                    {item.extra_benefit ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-gray-500">노출순서</p>
                  <p className="text-2xl font-black">
                    {item.display_order ?? 0}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {products?.length === 0 && (
            <Card className="p-10 text-center">
              <p className="font-bold text-gray-500">
                등록된 상품이 없습니다.
              </p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}