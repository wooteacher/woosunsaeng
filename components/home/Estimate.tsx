"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

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
      window.alert("이름과 연락처를 입력해주세요.");
      return;
    }

    if (!agreed) {
      window.alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setLoading(true);
    setDone(false);

    const { data: existingList, error: duplicateError } = await supabase
      .from("consultations")
      .select("id, name, phone, status, created_at");

    if (duplicateError) {
      console.error("중복 확인 오류:", duplicateError);
      window.alert("중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    const duplicate = existingList?.find((item) => {
      const savedPhone = String(item.phone ?? "").replace(/[^0-9]/g, "");
      return savedPhone === normalizedPhone;
    });

    if (duplicate) {
      const shouldContinue = window.confirm(
        `이미 등록된 고객입니다.\n\n이름: ${duplicate.name}\n연락처: ${
          duplicate.phone
        }\n상태: ${
          duplicate.status ?? "신규접수"
        }\n\n그래도 신규 접수하시겠습니까?`
      );

      if (!shouldContinue) {
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.from("consultations").insert({
      name: cleanName,
      phone: cleanPhone,
      service,
      status: "신규접수",
    });

    setLoading(false);

    if (error) {
      console.error("상담 접수 오류:", error);
      window.alert(
        "접수 중 오류가 발생했습니다. 전화로 문의해주세요."
      );
      return;
    }

    setDone(true);
    setName("");
    setPhone("");
    setService("인터넷 + TV");
    setAgreed(false);
  };

  return (
    <section id="estimate" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Card className="p-8 shadow-2xl shadow-gray-200 md:p-12">
          <div className="text-center">
            <p className="font-black text-green-600">30초 견적 요청</p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-950 md:text-5xl">
              상담은 짧고 쉽게
            </h2>

            <p className="mt-5 text-lg font-bold leading-8 text-gray-600">
              이름과 연락처만 남겨주시면 빠르게 연락드리겠습니다.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              placeholder="이름"
              autoComplete="name"
            />

            <Input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              type="tel"
              placeholder="연락처"
              autoComplete="tel"
            />

            <select
              value={service}
              onChange={(event) => setService(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none transition focus:border-green-500 focus:bg-white"
            >
              <option value="인터넷 + TV">인터넷 + TV</option>
              <option value="렌탈">렌탈</option>
            </select>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="mt-1 h-5 w-5 accent-green-600"
                />

                <span className="font-bold leading-6 text-gray-800">
                  개인정보 수집 및 이용에 동의합니다.{" "}
                  <span className="text-red-500">(필수)</span>
                </span>
              </label>

              <div className="mt-4 space-y-1 text-sm font-medium leading-6 text-gray-600">
                <p>수집 목적: 상담 접수 및 상품 안내</p>
                <p>수집 항목: 이름, 연락처, 상담 서비스</p>
                <p>보유 기간: 상담 종료 후 3개월</p>
                <p>
                  동의를 거부할 수 있으나, 거부 시 온라인 상담 접수가
                  제한됩니다.
                </p>
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

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-5 text-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={20} />
              {loading ? "접수 중..." : "무료 견적 요청하기"}
            </Button>

            {done && (
              <p
                role="status"
                className="text-center font-black text-green-600"
              >
                견적 요청이 접수되었습니다. 빠르게 연락드리겠습니다.
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl bg-green-50 p-5 text-center md:flex-row">
            <Phone className="text-green-600" size={22} />

            <p className="font-black text-gray-800">
              전화 상담이 편하시면 상단 번호로 바로 문의해주세요.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}