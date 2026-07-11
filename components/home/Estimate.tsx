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

const services = ["인터넷 + TV", "인터넷 단독", "렌탈"];

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
      const { data: existingList, error: duplicateError } = await supabase
        .from("consultations")
        .select("id, name, phone, status, created_at");

      if (duplicateError) {
        console.error("중복 확인 오류:", duplicateError);
        window.alert(
          "접수 정보를 확인하는 중 오류가 발생했습니다. 다시 시도해 주세요."
        );
        return;
      }

      const duplicate = existingList?.find((item) => {
        const savedPhone = String(item.phone ?? "").replace(/[^0-9]/g, "");
        return savedPhone === normalizedPhone;
      });

      if (duplicate) {
        const shouldContinue = window.confirm(
          `이미 등록된 연락처입니다.\n\n` +
            `이름: ${duplicate.name}\n` +
            `연락처: ${duplicate.phone}\n` +
            `상태: ${duplicate.status ?? "신규접수"}\n\n` +
            `그래도 새 상담으로 접수하시겠습니까?`
        );

        if (!shouldContinue) {
          return;
        }
      }

      const { error } = await supabase.from("consultations").insert({
        name: cleanName,
        phone: cleanPhone,
        service,
        status: "신규접수",
      });

      if (error) {
        console.error("상담 접수 오류:", error);
        window.alert(
          "접수 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요."
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
      className="relative overflow-hidden bg-gradient-to-b from-green-50/60 to-white py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[36px] border border-green-100 bg-white shadow-2xl shadow-green-100/70">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* 안내 영역 */}
            <div className="relative overflow-hidden bg-gray-950 p-7 text-white sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-green-500/20 blur-3xl" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-500/15 px-4 py-2 text-sm font-black text-green-400 ring-1 ring-green-400/20">
                  <Sparkles size={17} />
                  30초 무료 상담
                </span>

                <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  몇 가지만
                  <br />
                  알려주세요.
                </h2>

                <p className="mt-5 max-w-lg text-lg font-semibold leading-8 text-gray-300">
                  인터넷과 렌탈을 어렵게 비교하지 않으셔도 됩니다.
                  우선생이 고객님께 맞는 조건을 쉽고 친절하게
                  안내해드립니다.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "통신사와 상품 조건을 한 번에 비교",
                    "결합·제휴카드 할인 여부 확인",
                    "상담부터 설치 완료까지 안내",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 font-bold text-gray-200"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                        <Check size={16} strokeWidth={3} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-9 overflow-hidden rounded-[28px] bg-white">
                  <Image
                    src="/hero/wooteacher-teacher.png"
                    alt="상담을 도와주는 우선생 캐릭터"
                    width={720}
                    height={500}
                    className="h-56 w-full object-contain object-bottom sm:h-64"
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-gray-300">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={17} className="text-green-400" />
                    평균 상담 연결 {SITE.averageTime}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <LockKeyhole size={17} className="text-green-400" />
                    상담 정보 안전 관리
                  </span>
                </div>
              </div>
            </div>

            {/* 입력 영역 */}
            <div className="p-6 sm:p-10 lg:p-12">
              <div>
                <p className="font-black text-green-600">
                  우리가 선택한 생활서비스
                </p>

                <h3 className="mt-3 text-3xl font-black text-gray-950 sm:text-4xl">
                  무료 상담 신청
                </h3>

                <p className="mt-3 font-semibold leading-7 text-gray-600">
                  이름과 연락처만 남겨주시면 빠르게 연락드리겠습니다.
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-gray-800">
                    이름
                  </span>

                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    type="text"
                    placeholder="이름을 입력해 주세요"
                    autoComplete="name"
                    className="min-h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold text-gray-950 outline-none transition placeholder:font-semibold placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-gray-800">
                    연락처
                  </span>

                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    type="tel"
                    inputMode="tel"
                    placeholder="010-0000-0000"
                    autoComplete="tel"
                    className="min-h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold text-gray-950 outline-none transition placeholder:font-semibold placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </label>

                <fieldset>
                  <legend className="mb-3 text-sm font-black text-gray-800">
                    관심 서비스
                  </legend>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {services.map((item) => {
                      const selected = service === item;

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setService(item)}
                          className={`relative min-h-14 rounded-2xl border px-4 py-3 text-sm font-black transition ${
                            selected
                              ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                              : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                          }`}
                        >
                          {selected && (
                            <CheckCircle2
                              size={17}
                              className="absolute right-3 top-3 text-green-600"
                            />
                          )}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="rounded-[24px] border border-gray-200 bg-gray-50 p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(event) => setAgreed(event.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 accent-green-600"
                    />

                    <span className="font-bold leading-6 text-gray-800">
                      개인정보 수집 및 이용에 동의합니다.{" "}
                      <span className="text-red-500">(필수)</span>
                    </span>
                  </label>

                  <div className="mt-4 space-y-1 text-sm font-medium leading-6 text-gray-500">
                    <p>수집 목적: 상담 접수 및 상품 안내</p>
                    <p>수집 항목: 이름, 연락처, 관심 서비스</p>
                    <p>보유 기간: 상담 종료 후 3개월</p>
                  </div>

                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-black text-green-700 underline underline-offset-4"
                  >
                    개인정보처리방침 전체 보기
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 text-lg font-black text-white shadow-xl shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={21} />
                  {loading ? "접수 중..." : "30초 무료 상담 신청"}
                </button>

                {done && (
                  <div
                    role="status"
                    className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center"
                  >
                    <CheckCircle2
                      size={30}
                      className="mx-auto text-green-600"
                    />

                    <p className="mt-3 font-black text-green-800">
                      상담 신청이 정상적으로 접수되었습니다.
                    </p>

                    <p className="mt-1 text-sm font-semibold text-green-700">
                      확인 후 빠르게 연락드리겠습니다.
                    </p>
                  </div>
                )}
              </div>

              <a
                href={SITE.phoneHref}
                className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 font-black text-green-800 transition hover:border-green-300 hover:bg-green-100"
              >
                <Phone size={20} />
                전화 상담 {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}