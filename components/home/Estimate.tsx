"use client";

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
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      alert("이름과 연락처를 입력해주세요.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("consultations").insert({
      name,
      phone,
      service,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("접수 중 오류가 발생했습니다. 전화로 문의해주세요.");
      return;
    }

    setDone(true);
    setName("");
    setPhone("");
    setService("인터넷 + TV");
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
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="이름"
            />

            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              placeholder="연락처"
            />

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none transition focus:border-green-500 focus:bg-white"
            >
              <option>인터넷 + TV</option>
              <option>렌탈</option>
            </select>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-5 text-lg disabled:opacity-60"
            >
              <Send size={20} />
              {loading ? "접수 중..." : "무료 견적 요청하기"}
            </Button>

            {done && (
              <p className="text-center font-black text-green-600">
                견적 요청이 접수되었습니다. 빠르게 연락드리겠습니다.
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl bg-green-50 p-5 text-center md:flex-row">
            <Phone className="text-green-600" size={22} />

            <p className="font-black text-gray-800">
              전화 상담이 편하시면 상단 번호로 바로 문의주세요.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}