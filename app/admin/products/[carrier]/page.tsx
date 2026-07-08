import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createProduct, updateProduct } from "../actions";

export default async function CarrierProductsPage({
  params,
}: {
  params: Promise<{ carrier: string }>;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const { carrier } = await params;
  const decodedCarrier = decodeURIComponent(carrier);

  const { data: products } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("carrier", decodedCarrier)
    .order("display_order", { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin/products" className="font-black text-green-600">
          ← 상품관리로 돌아가기
        </Link>

        <h1 className="mt-6 text-4xl font-black text-gray-950">
          {decodedCarrier} 상품관리
        </h1>

        <p className="mt-2 font-bold text-gray-600">
          {decodedCarrier} 상품을 추가하고 수정합니다.
        </p>

        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-black">상품 추가</h2>

          <form action={createProduct} className="mt-5 space-y-4">
            <input type="hidden" name="carrier" value={decodedCarrier} />

            <div className="grid gap-4 md:grid-cols-3">
              <input name="internet_speed" placeholder="500M" className="rounded-2xl border p-4 font-bold" />
              <input name="tv_plan" placeholder="베이직 TV" className="rounded-2xl border p-4 font-bold" />
              <input name="service_type" defaultValue="인터넷 + TV" className="rounded-2xl border p-4 font-bold" />
              <input name="base_price" type="number" placeholder="39600" className="rounded-2xl border p-4 font-bold" />
              <input name="reward_amount" type="number" placeholder="450000" className="rounded-2xl border p-4 font-bold" />
              <input name="extra_benefit" defaultValue="추가혜택" className="rounded-2xl border p-4 font-bold" />
              <input name="badge" defaultValue="🏆 우선생 추천" className="rounded-2xl border p-4 font-bold" />
              <input name="display_order" type="number" defaultValue={0} className="rounded-2xl border p-4 font-bold" />
            </div>

            <div className="flex gap-5 font-black">
              <label><input type="checkbox" name="featured" /> 메인 추천</label>
              <label><input type="checkbox" name="active" defaultChecked /> 노출</label>
            </div>

            <Button type="submit">상품 추가</Button>
          </form>
        </Card>

        <div className="mt-8 space-y-5">
          {products?.map((item) => (
            <Card key={item.id} className="p-6">
              <form action={updateProduct} className="space-y-4">
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="carrier" value={decodedCarrier} />

                <div className="grid gap-4 md:grid-cols-3">
                  <input name="internet_speed" defaultValue={item.internet_speed} className="rounded-2xl border p-4 font-bold" />
                  <input name="tv_plan" defaultValue={item.tv_plan ?? ""} className="rounded-2xl border p-4 font-bold" />
                  <input name="service_type" defaultValue={item.service_type} className="rounded-2xl border p-4 font-bold" />
                  <input name="base_price" type="number" defaultValue={item.base_price ?? 0} className="rounded-2xl border p-4 font-bold" />
                  <input name="reward_amount" type="number" defaultValue={item.reward_amount ?? 0} className="rounded-2xl border p-4 font-bold" />
                  <input name="extra_benefit" defaultValue={item.extra_benefit ?? ""} className="rounded-2xl border p-4 font-bold" />
                  <input name="badge" defaultValue={item.badge ?? "🏆 우선생 추천"} className="rounded-2xl border p-4 font-bold" />
                  <input name="display_order" type="number" defaultValue={item.display_order ?? 0} className="rounded-2xl border p-4 font-bold" />
                </div>

                <div className="flex gap-5 font-black">
                  <label><input type="checkbox" name="featured" defaultChecked={item.featured} /> 메인 추천</label>
                  <label><input type="checkbox" name="active" defaultChecked={item.active} /> 노출</label>
                </div>

                <Button type="submit">저장</Button>
              </form>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}