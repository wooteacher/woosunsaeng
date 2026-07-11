import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { SITE } from "@/lib/site";

const navigation = [
  {
    label: "인터넷",
    href: "#internet",
  },
  {
    label: "렌탈",
    href: "#rental",
  },
  {
    label: "우선생",
    href: "#why-us",
  },
  {
    label: "상담 신청",
    href: "#estimate",
  },
];


export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">


      <div className="border-b border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">


          <div>

            <p className="text-sm font-black text-green-400">
              🟢 현재 상담 가능
            </p>


            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              인터넷과 렌탈,
              <br className="sm:hidden" />
              우선생에게 맡겨주세요.
            </h2>


            <p className="mt-3 font-semibold text-gray-400">
              비교부터 설치 안내까지 편하게 도와드립니다.
            </p>

          </div>



          <div className="flex flex-col gap-3 sm:flex-row">


            <a
              href={SITE.phoneHref}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 font-black transition hover:bg-green-600"
            >

              <Phone size={20}/>

              전화 상담

            </a>



            <a
              href={SITE.kakaoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-6 py-4 font-black text-gray-950 transition hover:bg-yellow-400"
            >

              <MessageCircle size={20}/>

              카카오 상담

            </a>


          </div>

        </div>

      </div>




      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">


        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr_0.8fr]">


          <div>

            <Link href="/">

              <p className="text-3xl font-black">
                우<span className="text-green-400">
                  선생
                </span>
              </p>


              <p className="mt-1 text-sm font-bold text-gray-500">
                우리가 선택한 생활서비스
              </p>

            </Link>


            <p className="mt-5 max-w-md font-semibold leading-7 text-gray-400">
              인터넷, 인터넷+TV와 생활 렌탈까지
              고객님에게 필요한 서비스를 쉽고 정확하게 안내합니다.
            </p>


            <div className="mt-5 flex flex-wrap gap-3">


              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-300">

                <ShieldCheck
                  size={16}
                  className="text-green-400"
                />

                안전한 상담 관리

              </span>



              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-300">

                <Clock3
                  size={16}
                  className="text-green-400"
                />

                평균 {SITE.averageTime}

              </span>


            </div>

          </div>




          <div>

            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
              Menu
            </h3>


            <nav className="mt-5 space-y-3">

              {navigation.map((item)=>(
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 font-bold text-gray-300 transition hover:text-green-400"
                >

                  {item.label}

                  <ArrowUpRight size={14}/>

                </a>
              ))}

            </nav>


          </div>




          <div>


            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
              Contact
            </h3>


            <a
              href={SITE.phoneHref}
              className="mt-5 block text-2xl font-black hover:text-green-400"
            >
              {SITE.phone}
            </a>


            <p className="mt-3 text-sm font-semibold leading-6 text-gray-400">
              상담 신청 후 빠르게 연락드립니다.
            </p>


            <a
              href="#estimate"
              className="mt-5 inline-flex items-center gap-2 font-black text-green-400 hover:text-green-300"
            >

              무료 상담 신청

              <ArrowUpRight size={16}/>

            </a>


          </div>


        </div>




        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm font-semibold text-gray-500 md:flex-row md:justify-between">


          <p>
            © 2026 우선생. All rights reserved.
          </p>


          <div className="flex gap-5">

            <Link
              href="/privacy"
              className="hover:text-gray-300"
            >
              개인정보처리방침
            </Link>


            <span>
              인터넷 · 렌탈 상담 서비스
            </span>

          </div>


        </div>


      </div>


      <div className="h-20 md:hidden"/>

    </footer>
  );
}