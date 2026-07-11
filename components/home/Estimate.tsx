"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { SITE } from "@/lib/site";

const services = [
  "인터넷 + TV",
  "인터넷 단독",
  "렌탈",
];

export default function Estimate() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("인터넷 + TV");
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);


  const handleSubmit = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const normalizedPhone = cleanPhone.replace(/[^0-9]/g, "");


    if (!cleanName || !cleanPhone) {
      window.alert("이름과 연락처를 입력해 주세요.");
      return;
    }


    if (normalizedPhone.length < 9) {
      window.alert("연락처를 정확하게 입력해 주세요.");
      return;
    }


    if (!agreed) {
      window.alert("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }


    setLoading(true);
    setDone(false);


    try {
      const { error } =
        await supabase
          .from("consultations")
          .insert({
            name: cleanName,
            phone: cleanPhone,
            service,
            status: "신규접수",
          });


      if (error) {
        console.error(error);

        window.alert(
          "접수 중 오류가 발생했습니다. 다시 시도해주세요."
        );

        return;
      }


      setDone(true);

      setName("");
      setPhone("");
      setService("인터넷 + TV");
      setAgreed(false);

    } finally {
      setLoading(false);
    }
  };


  return (
    <section
      id="estimate"
      className="relative overflow-hidden bg-gradient-to-b from-green-50/70 to-white py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 h-72 rounded-full bg-emerald-100/60 blur-3xl" />


      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-[34px] border border-green-100 bg-white shadow-xl shadow-green-100/60">

          <div className="grid lg:grid-cols-2">


            {/* 왼쪽 안내 */}
            <div className="bg-gray-950 p-7 text-white sm:p-10">

              <span className="inline-flex items-center gap-2 rounded-full bg-green-500/15 px-4 py-2 text-sm font-black text-green-400">
                <Sparkles size={17}/>
                30초 무료 상담
              </span>


              <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">
                간단하게 남기면
                <br/>
                우선생이 안내합니다.
              </h2>


              <p className="mt-5 text-base font-semibold leading-7 text-gray-300">
                인터넷과 렌탈 조건을 직접 비교하지 않아도 됩니다.
                고객님 상황에 맞는 조건을 빠르게 확인해드립니다.
              </p>


              <div className="mt-7 space-y-3">

                {[
                  "통신사별 조건 비교",
                  "맞춤 할인 확인",
                  "설치 후 혜택 안내",
                ].map((item)=>(
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-bold text-gray-200"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500">
                      <Check size={15}/>
                    </span>

                    {item}

                  </div>
                ))}

              </div>


              <div className="mt-8 overflow-hidden rounded-[26px] bg-white">
                <Image
                  src="/hero/wooteacher-teacher.png"
                  alt="우선생 상담 안내"
                  width={700}
                  height={500}
                  className="h-52 w-full object-contain"
                />
              </div>


              <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-gray-300">

                <span className="flex items-center gap-2">
                  <Clock3
                    size={16}
                    className="text-green-400"
                  />
                  평균 상담 연결 {SITE.averageTime}
                </span>


                <span className="flex items-center gap-2">
                  <LockKeyhole
                    size={16}
                    className="text-green-400"
                  />
                  안전한 상담 관리
                </span>

              </div>

            </div>


            {/* 오른쪽 입력 */}
            <div className="p-6 sm:p-10">

              <p className="font-black text-green-600">
                우리가 선택한 생활서비스
              </p>


              <h3 className="mt-3 text-3xl font-black text-gray-950">
                상담 신청
              </h3>


              <p className="mt-3 font-semibold text-gray-600">
                이름과 연락처만 남겨주세요.
              </p>


              <div className="mt-7 space-y-5">


                <label>
                  <span className="mb-2 block text-sm font-black">
                    이름
                  </span>

                  <input
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="이름 입력"
                    className="min-h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 font-bold outline-none focus:border-green-500"
                  />

                </label>


                <label>
                  <span className="mb-2 block text-sm font-black">
                    연락처
                  </span>

                  <input
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    type="tel"
                    className="min-h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 font-bold outline-none focus:border-green-500"
                  />

                </label>


                <fieldset>

                  <legend className="mb-3 text-sm font-black">
                    관심 서비스
                  </legend>


                  <div className="grid grid-cols-3 gap-2">

                    {services.map((item)=>(
                      <button
                        key={item}
                        type="button"
                        onClick={()=>setService(item)}
                        className={`rounded-2xl border px-3 py-3 text-sm font-black ${
                          service === item
                            ? "border-green-600 bg-green-50 text-green-700"
                            : "border-gray-200"
                        }`}
                      >
                        {item}
                      </button>
                    ))}

                  </div>

                </fieldset>
                                <div className="rounded-[22px] border border-gray-200 bg-gray-50 p-4">

                  <label className="flex cursor-pointer items-start gap-3">

                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e)=>setAgreed(e.target.checked)}
                      className="mt-1 h-5 w-5 accent-green-600"
                    />

                    <span className="text-sm font-bold leading-6 text-gray-800">
                      개인정보 수집 및 이용에 동의합니다.
                      <span className="ml-1 text-red-500">
                        (필수)
                      </span>
                    </span>

                  </label>


                  <Link
                    href="/privacy"
                    target="_blank"
                    className="mt-3 inline-block text-sm font-black text-green-700 underline underline-offset-4"
                  >
                    개인정보처리방침 확인
                  </Link>

                </div>


                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700 disabled:opacity-60"
                >
                  <Send size={20}/>

                  {loading
                    ? "접수 중..."
                    : "30초 무료 상담 신청"
                  }

                </button>


                {done && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">

                    <CheckCircle2
                      size={32}
                      className="mx-auto text-green-600"
                    />

                    <p className="mt-3 font-black text-green-800">
                      상담 신청이 완료되었습니다.
                    </p>

                    <p className="mt-1 text-sm font-semibold text-green-700">
                      확인 후 빠르게 연락드리겠습니다.
                    </p>

                  </div>
                )}


              </div>


              <a
                href={SITE.phoneHref}
                className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 font-black text-green-800 transition hover:bg-green-100"
              >

                <Phone size={20}/>

                전화 상담 {SITE.phone}

              </a>


            </div>

          </div>

        </div>

      </div>

    </section>
  );
}