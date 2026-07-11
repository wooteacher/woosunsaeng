"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  MonitorPlay,
  Router,
  Sparkles,
  Wifi,
} from "lucide-react";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";

const carriers = [
  {
    id: "KT",
    name: "KT",
    description: "안정적인 전국 인터넷망",
  },
  {
    id: "SKB",
    name: "SK브로드밴드",
    description: "인터넷과 B tv 결합",
  },
  {
    id: "LGU+",
    name: "LG U+",
    description: "IPTV와 OTT 서비스",
  },
];

const speeds = [
  {
    id: "100M",
    name: "100M",
    description: "기본 인터넷 사용",
    recommendation: "1~2인 추천",
  },
  {
    id: "500M",
    name: "500M",
    description: "영상·여러 기기 사용",
    recommendation: "가장 인기",
    popular: true,
  },
  {
    id: "1G",
    name: "1G",
    description: "게임·고용량 작업",
    recommendation: "고사양 추천",
  },
];

type ProductType = "internet" | "internet-tv";

export default function InternetSection() {
  const [carrier, setCarrier] = useState("KT");
  const [speed, setSpeed] = useState("500M");
  const [productType, setProductType] =
    useState<ProductType>("internet-tv");

  const selectedCarrier =
    carriers.find((item) => item.id === carrier) ?? carriers[0];

  const selectedSpeed =
    speeds.find((item) => item.id === speed) ?? speeds[1];

  return (
    <Section className="bg-white">
      <div
        id="internet"
        className="scroll-mt-24"
      >
        <Container>
          <SectionTitle
            badge="인터넷 상담"
            title="우리 집에 맞는 인터넷을 간단하게 선택하세요."
            description="통신사와 속도만 선택하면 필요한 조건을 기준으로 상담을 도와드립니다."
          />

          <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              
              <SelectionPanel
                step="1"
                title="통신사를 선택하세요"
                description="원하는 통신사가 없다면 상담에서 비교해드립니다."
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  {carriers.map((item) => {
                    const selected = carrier === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCarrier(item.id)}
                        className={[
                          "relative rounded-3xl border p-5 text-left transition-all",
                          selected
                            ? "border-green-600 bg-green-50 shadow-lg shadow-green-100"
                            : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md",
                        ].join(" ")}
                      >
                        {selected && <SelectedIcon />}

                        <strong className="block text-lg font-black text-gray-950">
                          {item.name}
                        </strong>

                        <span className="mt-2 block text-sm font-semibold text-gray-500">
                          {item.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </SelectionPanel>


              <SelectionPanel
                step="2"
                title="인터넷 속도를 선택하세요"
                description="사용 환경에 맞는 속도를 선택해 주세요."
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  {speeds.map((item) => {
                    const selected = speed === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSpeed(item.id)}
                        className={[
                          "relative rounded-3xl border p-5 text-left transition-all",
                          selected
                            ? "border-green-600 bg-green-50 shadow-lg shadow-green-100"
                            : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md",
                        ].join(" ")}
                      >
                        {item.popular && (
                          <span className="absolute -top-3 left-4 rounded-full bg-green-600 px-3 py-1 text-xs font-black text-white">
                            추천
                          </span>
                        )}

                        {selected && <SelectedIcon />}

                        <strong className="text-2xl font-black text-gray-950">
                          {item.name}
                        </strong>

                        <p className="mt-3 text-sm font-black text-green-700">
                          {item.recommendation}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-500">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </SelectionPanel>


              <SelectionPanel
                step="3"
                title="TV 이용 여부"
                description="인터넷 단독 또는 인터넷+TV를 선택하세요."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <ProductButton
                    selected={productType === "internet"}
                    onClick={() => setProductType("internet")}
                    icon={<Router size={25} />}
                    title="인터넷 단독"
                    description="인터넷만 필요한 경우"
                  />

                  <ProductButton
                    selected={productType === "internet-tv"}
                    onClick={() => setProductType("internet-tv")}
                    icon={<MonitorPlay size={25} />}
                    title="인터넷 + TV"
                    description="가장 많이 선택하는 구성"
                  />
                </div>
              </SelectionPanel>

            </div>
                        {/* 결과 카드 */}
            <aside className="xl:sticky xl:top-24 xl:self-start">
              <div className="overflow-hidden rounded-[30px] bg-gray-950 text-white shadow-2xl shadow-gray-300">
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-green-400">
                    <Sparkles size={18} />

                    <span className="font-black">
                      우선생 추천 구성
                    </span>
                  </div>

                  <h3 className="mt-6 text-3xl font-black tracking-[-0.04em]">
                    {selectedCarrier.name}
                  </h3>

                  <p className="mt-2 text-xl font-bold text-gray-300">
                    {selectedSpeed.name}
                    <span className="mx-2 text-gray-600">
                      ·
                    </span>
                    {productType === "internet-tv"
                      ? "인터넷 + TV"
                      : "인터넷 단독"}
                  </p>


                  <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                    <div className="flex items-center gap-2 text-green-400">
                      <Wifi size={18} />

                      <span className="text-sm font-black">
                        상담 안내
                      </span>
                    </div>

                    <p className="mt-3 text-lg font-black text-white">
                      맞춤 할인 확인
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-gray-400">
                      결합 할인, 제휴카드, 설치 혜택은
                      상담 후 정확하게 안내해드립니다.
                    </p>
                  </div>


                  <ul className="mt-6 space-y-3">
                    {[
                      "통신사별 조건 비교",
                      "최적 요금 확인",
                      "설치 후 혜택 안내",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm font-bold text-gray-200"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                          <Check
                            size={14}
                            strokeWidth={3}
                          />
                        </span>

                        {item}
                      </li>
                    ))}
                  </ul>
                </div>


                <div className="border-t border-white/10 bg-white/[0.04] p-5">
                  <a
                    href="#estimate"
                    className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 text-base font-black text-white transition hover:bg-green-600"
                  >
                    선택 상담 신청
                    <ArrowRight size={19} />
                  </a>

                  <p className="mt-3 text-center text-xs font-semibold text-gray-400">
                    정확한 요금은 상담 후 안내됩니다.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </Section>
  );
}


function SelectionPanel({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-gray-100 bg-gray-50/70 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-black text-white shadow-md shadow-green-200">
          {step}
        </span>

        <div>
          <h3 className="text-lg font-black text-gray-950">
            {title}
          </h3>

          <p className="mt-1 text-sm font-semibold text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}


function SelectedIcon() {
  return (
    <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-white shadow-sm">
      <Check
        size={15}
        strokeWidth={3}
      />
    </span>
  );
}


function ProductButton({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex min-h-28 items-center gap-4 rounded-3xl border p-5 text-left transition-all",
        selected
          ? "border-green-600 bg-green-50 shadow-lg shadow-green-100"
          : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
          selected
            ? "bg-green-600 text-white"
            : "bg-green-50 text-green-700",
        ].join(" ")}
      >
        {icon}
      </span>

      <span>
        <strong className="block text-lg font-black text-gray-950">
          {title}
        </strong>

        <span className="mt-1 block text-sm font-semibold text-gray-500">
          {description}
        </span>
      </span>

      {selected && <SelectedIcon />}
    </button>
  );
}