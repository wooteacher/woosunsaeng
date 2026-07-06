import { CheckCircle2, Gift, Headphones, Zap } from "lucide-react";

const reasons = [
  {
    icon: Headphones,
    title: "무료 상담",
    desc: "부담 없이 문의하시면 필요한 서비스만 쉽게 안내해드립니다.",
  },
  {
    icon: Gift,
    title: "설치 후 바로 지급",
    desc: "설치 완료 후 약속된 혜택을 빠르게 안내해드립니다.",
  },
  {
    icon: CheckCircle2,
    title: "맞춤 상담",
    desc: "인터넷 + TV, 렌탈 상황에 맞게 비교 상담해드립니다.",
  },
  {
    icon: Zap,
    title: "빠른 진행",
    desc: "상담부터 접수까지 복잡하지 않게 빠르게 도와드립니다.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="font-bold text-green-600">WHY WOOTEACHER</p>
          <h2 className="mt-3 text-4xl font-black text-gray-900">
            왜 우선생인가요?
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Icon className="text-green-600" size={42} />

                <h3 className="mt-5 text-2xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}