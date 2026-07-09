import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

function won(value: number) {
  return `${value.toLocaleString()}원`;
}

function manwon(value: number) {
  return `${Math.floor(value / 10000)}만원`;
}

export default async function FeaturedProducts() {
  const { data, error } = await supabaseAdmin
  .from("products")
  .select("*")
  .eq("featured", true)
  .eq("active", true);

const products = data ?? [];

if (error) {
  console.error(error);
}
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="font-black text-green-600">RECOMMEND</p>
          <h2 className="mt-3 text-4xl font-black text-gray-950">
            우선생 추천 상품
          </h2>
          <p className="mt-4 font-bold text-gray-500">
            많이 선택하는 상품을 먼저 안내드립니다.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {products.map((item) => (
            <Card key={item.id} className="p-7">
              <p className="font-black text-green-600">
                {item.badge ?? "🏆 우선생 추천"}
              </p>

              <h3 className="mt-4 text-2xl font-black text-gray-950">
                {item.carrier} {item.internet_speed} + {item.tv_plan}
              </h3>

              <div className="mt-6 space-y-3 font-bold text-gray-600">
                <div className="flex justify-between">
                  <span>기본 요금</span>
                  <span>{won(item.base_price ?? 0)}</span>
                </div>

                <div className="flex justify-between">
                  <span>휴대폰 결합 요금</span>
                  <span>{won(item.mobile_bundle_price ?? 0)}</span>
                </div>

                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-sm font-black text-green-700">
                    휴대폰 결합 + 카드할인 혜택가
                  </p>
                  <p className="mt-1 text-3xl font-black text-green-700">
                    {won(item.card_discount_price ?? 0)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-gray-500">
                    부가세 포함
                  </p>
                </div>
              </div>

              <p className="mt-6 text-xl font-black text-gray-950">
                💵 사은품 {manwon(item.reward_amount ?? 0)} +{" "}
                {item.extra_benefit ?? "추가혜택"}
              </p>

              <Button href="#estimate" className="mt-6 w-full">
                무료 상담
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}