import { SITE } from "@/lib/site";
import { ArrowRight, CheckCircle2, Home, Phone, Wifi } from "lucide-react";

export default function ServiceCards() {
  return (
    <section id="service" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-black text-green-600">SERVICE</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-950 md:text-5xl">
            어떤 상담이 필요하신가요?
          </h2>
          <p className="mt-5 text-lg font-bold leading-8 text-gray-600">
            인터넷 + TV와 렌탈, 딱 두 가지로 쉽게 안내해드립니다.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="group rounded-[2rem] bg-gradient-to-br from-green-50 to-white p-8 shadow-sm ring-1 ring-green-100 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600 text-white">
              <Wifi size={34} />
            </div>

            <h3 className="mt-8 text-3xl font-black text-gray-950">
              인터넷 + TV
            </h3>

            <p className="mt-4 text-lg font-semibold leading-8 text-gray-600">
              통신사 비교부터 가입, 설치까지 복잡하지 않게 상담해드립니다.
            </p>

            <div className="mt-7 space-y-3">
              {["맞춤 상담", "빠른 진행", "설치 후 바로 지급"].map((item) => (
                <div key={item} className="flex items-center gap-3 font-bold text-gray-800">
                  <CheckCircle2 size={20} className="text-green-600" />
                  {item}
                </div>
              ))}
            </div>

            <a
              href={SITE.phoneHref}
              className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-7 py-4 font-black text-white transition hover:bg-green-700"
            >
              <Phone size={20} />
              상담하기
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="group rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-950 text-white">
              <Home size={34} />
            </div>

            <h3 className="mt-8 text-3xl font-black text-gray-950">
              렌탈
            </h3>

            <p className="mt-4 text-lg font-semibold leading-8 text-gray-600">
              생활가전부터 IT기기까지, 필요한 상품을 쉽게 확인하고 상담받으세요.
            </p>

            <div className="mt-7 space-y-3">
              {["인기상품 확인", "다양한 브랜드", "편리한 상담"].map((item) => (
                <div key={item} className="flex items-center gap-3 font-bold text-gray-800">
                  <CheckCircle2 size={20} className="text-green-600" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={SITE.rentalMallUrl}
                target="_blank"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-gray-900 px-7 py-4 font-black text-gray-900 transition hover:bg-gray-50"
              >
                상품 보기
              </a>

              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-7 py-4 font-black text-white transition hover:bg-green-700"
              >
                상담하기
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}