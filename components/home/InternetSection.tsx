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
    description: "안정적인 품질과 전국 인터넷망",
  },
  {
    id: "SKB",
    name: "SK브로드밴드",
    description: "인터넷과 B tv 결합상품",
  },
  {
    id: "LGU+",
    name: "LG U+",
    description: "다양한 IPTV와 OTT 서비스",
  },
  {
    id: "LG헬로비전",
    name: "LG헬로비전",
    description: "합리적인 인터넷·TV 요금",
  },
];

const speeds = [
  {
    id: "100M",
    name: "100M",
    description: "웹서핑과 영상 시청 중심",
    recommendation: "1~2인 가구",
  },
  {
    id: "500M",
    name: "500M",
    description: "여러 기기를 동시에 사용",
    recommendation: "가장 많이 선택",
    popular: true,
  },
  {
    id: "1G",
    name: "1G",
    description: "게임과 대용량 작업 중심",
    recommendation: "고사양 사용",
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
    <Section
      className="scroll-mt-20 bg-white"
    >
      <div id="internet" className="scroll-mt-24">
        <Container>
          <SectionTitle
            badge="인터넷 간편 선택"
            title="우리 집에 맞는 인터넷을 쉽게 선택해보세요."
            description="통신사와 속도, TV 이용 여부만 선택해 주세요. 결합 할인과 제휴카드는 상담에서 정확하게 확인해드립니다."
          />

          <div className="mt-14 grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-6">
              {/* 통신사 선택 */}
              <SelectionPanel
                step="1"
                title="통신사를 선택해 주세요."
                description="아직 정하지 못하셨다면 기본 선택 상태로 진행해도 괜찮습니다."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {carriers.map((item) => {
                    const selected = carrier === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCarrier(item.id)}
                        aria-pressed={selected}
                        className={`relative min-h-28 rounded-3xl border p-5 text-left transition duration-200 ${
                          selected
                            ? "border-green-600 bg-green-50 shadow-lg shadow-green-100"
                            : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
                        }`}
                      >
                        {selected && <SelectedIcon />}

                        <strong className="block pr-8 text-lg font-black text-gray-950">
                          {item.name}
                        </strong>

                        <span className="mt-2 block text-sm font-semibold leading-6 text-gray-500">
                          {item.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </SelectionPanel>

              {/* 속도 선택 */}
              <SelectionPanel
                step="2"
                title="인터넷 속도를 선택해 주세요."
                description="사용 인원과 이용 환경에 맞는 속도를 선택할 수 있습니다."
              >
                <div className="grid gap-3 md:grid-cols-3">
                  {speeds.map((item) => {
                    const selected = speed === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSpeed(item.id)}
                        aria-pressed={selected}
                        className={`relative min-h-40 rounded-3xl border p-5 text-left transition duration-200 ${
                          selected
                            ? "border-green-600 bg-green-50 shadow-lg shadow-green-100"
                            : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
                        }`}
                      >
                        {item.popular && (
                          <span className="absolute -top-3 left-4 rounded-full bg-green-600 px-3 py-1 text-xs font-black text-white shadow-sm">
                            우선생 추천
                          </span>
                        )}

                        {selected && <SelectedIcon />}

                        <strong className="block text-2xl font-black text-gray-950">
                          {item.name}
                        </strong>

                        <span className="mt-3 block text-sm font-black text-green-700">
                          {item.recommendation}
                        </span>

                        <span className="mt-1 block text-sm font-semibold leading-6 text-gray-500">
                          {item.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </SelectionPanel>

              {/* TV 선택 */}
              <SelectionPanel
                step="3"
                title="TV 이용 여부를 선택해 주세요."
                description="TV는 인터넷 상품 안에서 함께 선택할 수 있습니다."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <ProductButton
                    selected={productType === "internet"}
                    onClick={() => setProductType("internet")}
                    icon={<Router size={27} />}
                    title="인터넷 단독"
                    description="인터넷만 필요한 고객님"
                  />

                  <ProductButton
                    selected={productType === "internet-tv"}
                    onClick={() => setProductType("internet-tv")}
                    icon={<MonitorPlay size={27} />}
                    title="인터넷 + TV"
                    description="IPTV를 함께 이용하는 인기 구성"
                  />
                </div>
              </SelectionPanel>
            </div>

            {/* 선택 결과 */}
            <aside className="xl:sticky xl:top-24 xl:self-start">
              <div className="overflow-hidden rounded-[32px] bg-gray-950 text-white shadow-2xl shadow-gray-300">
                <div className="p-7">
                  <div className="flex items-center gap-2 text-green-400">
                    <Sparkles size={19} />
                    <p className="font-black">우선생 선택 결과</p>
                  </div>

                  <p className="mt-6 text-3xl font-black">
                    {selectedCarrier.name}
                  </p>

                  <p className="mt-2 text-xl font-bold text-gray-300">
                    {selectedSpeed.name}
                    <span className="mx-2 text-gray-600">·</span>
                    {productType === "internet-tv"
                      ? "인터넷 + TV"
                      : "인터넷 단독"}
                  </p>

                  <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.07] p-5">
                    <p className="text-sm font-bold text-gray-400">
                      최대 할인 적용 가능
                    </p>

                    <p className="mt-2 text-2xl font-black text-green-400">
                      결합·제휴카드 상담
                    </p>

                    <p className="mt-3 text-sm font-semibold leading-6 text-gray-300">
                      휴대폰 결합과 사용 중인 카드에 따라 실제 월 납부금이
                      달라집니다.
                    </p>
                  </div>

                  <ul className="mt-7 space-y-3">
                    {[
                      "통신사별 요금과 혜택 비교",
                      "결합 및 카드 할인 확인",
                      "설치 후 혜택 지급 안내",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm font-bold text-gray-200"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check size={14} strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 bg-white/[0.04] p-5">
                  <a
                    href="#estimate"
                    className="inline-flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 text-lg font-black text-white shadow-lg shadow-green-950/30 transition hover:-translate-y-0.5 hover:bg-green-600"
                  >
                    선택한 상품 상담받기
                    <ArrowRight size={20} />
                  </a>

                  <p className="mt-3 text-center text-xs font-semibold leading-5 text-gray-400">
                    정확한 요금과 적용 혜택은 상담에서 안내해드립니다.
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
    <section className="rounded-[32px] border border-gray-100 bg-gray-50/70 p-5 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 font-black text-white shadow-md shadow-green-200">
          {step}
        </span>

        <div>
          <h3 className="text-xl font-black text-gray-950">{title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function SelectedIcon() {
  return (
    <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-white shadow-sm">
      <Check size={16} strokeWidth={3} />
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
      aria-pressed={selected}
      className={`relative flex min-h-28 items-center gap-4 rounded-3xl border p-5 text-left transition duration-200 ${
        selected
          ? "border-green-600 bg-green-50 shadow-lg shadow-green-100"
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
      }`}
    >
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition ${
          selected
            ? "bg-green-600 text-white"
            : "bg-green-50 text-green-700"
        }`}
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