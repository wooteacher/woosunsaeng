import { SITE } from "@/lib/site";
import { CheckCircle2, Phone, MessageCircle, Clock3 } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-2">
        <div>
          <p className="text-base font-black text-green-700">{SITE.slogan}</p>

          <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight text-gray-950 md:text-6xl">
            복잡한 비교는
            <br />
            저희가 하겠습니다.
          </h1>

          <p className="mt-6 text-xl font-bold leading-9 text-blue-700">
            고객님은 상담만 신청하세요.
            <br />
            인터넷 + TV · 렌탈을 쉽고 빠르게 도와드립니다.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {["무료 상담", "설치 후 바로 지급", "빠른 진행"].map((text) => (
              <span
                key={text}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-gray-800 shadow-sm ring-1 ring-gray-100"
              >
                <CheckCircle2 size={18} className="text-green-600" />
                {text}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-8 py-5 text-lg font-black text-white shadow-xl shadow-green-100 hover:bg-green-700"
            >
              <Phone size={22} />
              무료 상담하기
            </a>

            <a
              href="#estimate"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-green-600 bg-white px-8 py-5 text-lg font-black text-green-700 hover:bg-green-50"
            >
              30초 견적 요청
            </a>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-4 shadow-2xl shadow-gray-200 ring-1 ring-gray-100">
          <div className="rounded-[28px] bg-green-600 p-8 text-white">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-lime-300 shadow-[0_0_0_6px_rgba(190,242,100,0.25)]" />
              <p className="text-xl font-black">{SITE.consultationStatus}</p>
            </div>

            <div className="mt-8">
              <p className="text-base font-bold text-green-100">
                평균 상담 연결
              </p>
              <p className="mt-1 text-7xl font-black">{SITE.averageTime}</p>
            </div>

            <div className="mt-8 grid gap-3">
              <a
                href={SITE.phoneHref}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-lg font-black text-green-700"
              >
                <Phone size={21} />
                {SITE.phone}
              </a>

              <a
                href={SITE.kakaoUrl}
                className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-5 py-4 text-lg font-black text-gray-950"
              >
                <MessageCircle size={21} />
                카카오톡 상담
              </a>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-5">
            <Clock3 className="shrink-0 text-green-600" />
            <p className="font-black text-gray-800">
              인터넷 + TV · 렌탈 상담을 한 번에 안내해드립니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}