"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Gift,
  LockKeyhole,
  Phone,
  Send,
  Sparkles,
  Tv,
  UserRound,
  Wifi,
} from "lucide-react";

import { useCalculator } from "@/contexts/CalculatorContext";
import { SITE } from "@/lib/site";
import { supabase } from "@/lib/supabase";

const services = [
  "인터넷 + TV",
  "인터넷 단독",
  "렌탈",
];

const consultationSteps = [
  "상담 접수",
  "조건 확인",
  "설치 진행",
  "혜택 안내",
];

function won(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export default function Estimate() {
  const pathname = usePathname();

  const {
    carrier,
    internetPlan,
    tvPlan,
    bundleRule,
    monthlyBasePrice,
    mobileDiscount,
    cardDiscount,
    estimatedMonthlyPrice,
    reward,
  } = useCalculator();

  const isInternetPage =
    pathname === "/internet" ||
    pathname.startsWith("/internet/");

  const calculatedService = tvPlan
    ? "인터넷 + TV"
    : "인터넷 단독";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] =
    useState("인터넷 + TV");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const normalizedPhone = cleanPhone.replace(
      /[^0-9]/g,
      ""
    );

    if (!cleanName || !cleanPhone) {
      window.alert(
        "이름과 연락처를 입력해 주세요."
      );
      return;
    }

    if (normalizedPhone.length < 9) {
      window.alert(
        "연락처를 정확하게 입력해 주세요."
      );
      return;
    }

    if (!agreed) {
      window.alert(
        "개인정보 수집 및 이용에 동의해 주세요."
      );
      return;
    }

    setLoading(true);
    setDone(false);

    try {
      const shouldSaveEstimate =
        isInternetPage && Boolean(internetPlan);

      const consultationData = {
        name: cleanName,
        phone: cleanPhone,
        service: shouldSaveEstimate
          ? calculatedService
          : service,
        status: "신규접수",

        carrier: shouldSaveEstimate
          ? carrier
          : null,

        internet_plan_id: shouldSaveEstimate
          ? internetPlan?.id ?? null
          : null,

        desired_speed: shouldSaveEstimate
          ? internetPlan?.speed ?? null
          : null,

        internet_plan_name: shouldSaveEstimate
          ? internetPlan?.name ?? null
          : null,

        tv_plan_id: shouldSaveEstimate
          ? tvPlan?.id ?? null
          : null,

        desired_tv_plan: shouldSaveEstimate
          ? tvPlan?.name ?? null
          : null,

        tv_channels: shouldSaveEstimate
          ? tvPlan?.channels ?? null
          : null,

        base_monthly_price: shouldSaveEstimate
          ? monthlyBasePrice
          : null,

        mobile_discount: shouldSaveEstimate
          ? mobileDiscount
          : null,

        card_discount: shouldSaveEstimate
          ? cardDiscount
          : null,

        estimated_monthly_price:
          shouldSaveEstimate
            ? estimatedMonthlyPrice
            : null,

        estimated_reward: shouldSaveEstimate
          ? reward?.amount ?? null
          : null,

        extra_benefit: shouldSaveEstimate
          ? reward?.extraBenefit ?? null
          : null,
      };

      const { error } = await supabase
        .from("consultations")
        .insert(consultationData);

      if (error) {
        console.error(
          "상담 신청 저장 오류:",
          error
        );

        window.alert(
          "접수 중 오류가 발생했습니다. 다시 시도해 주세요."
        );
        return;
      }

      setDone(true);
      setName("");
      setPhone("");
      setService("인터넷 + TV");
      setAgreed(false);
    } catch (error) {
      console.error(
        "상담 신청 처리 오류:",
        error
      );

      window.alert(
        "접수 중 오류가 발생했습니다. 다시 시도해 주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="estimate"
      className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-green-100/70 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm">
            <Sparkles size={17} />
            30초 무료 상담
          </span>

          <h2 className="mt-5 break-keep text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl">
            선택한 견적을 확인하고
            <br className="hidden sm:block" />
            상담을 신청해보세요
          </h2>

          <p className="mt-4 break-keep text-sm font-semibold leading-7 text-slate-600 sm:text-base">
            이름과 연락처만 남겨주시면 선택하신 조건을
            확인한 뒤 빠르게 안내해드립니다.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
              <div>
                <p className="text-sm font-black text-emerald-400">
                  선택한 견적
                </p>

                <h3 className="mt-3 break-keep text-3xl font-black tracking-[-0.04em] text-white">
                  상담 전 마지막으로
                  <br />
                  조건을 확인해주세요
                </h3>

                <p className="mt-4 break-keep text-sm font-semibold leading-6 text-slate-400">
                  선택하신 상품과 예상 혜택이 상담 내용에
                  함께 저장됩니다.
                </p>
              </div>

              {isInternetPage && internetPlan ? (
                <div className="mt-7">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400">
                          통신사
                        </p>

                        <p className="mt-1 text-2xl font-black text-white">
                          {carrier}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-black text-emerald-400 ring-1 ring-inset ring-emerald-400/25">
                        견적 적용
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.05] px-4 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <Wifi
                            size={18}
                            className="shrink-0 text-emerald-400"
                          />

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-500">
                              인터넷
                            </p>

                            <p className="mt-0.5 truncate text-sm font-black text-white">
                              {internetPlan.speed} ·{" "}
                              {internetPlan.name}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 text-sm font-black text-white">
                          {won(internetPlan.monthlyPrice)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.05] px-4 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <Tv
                            size={18}
                            className="shrink-0 text-emerald-400"
                          />

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-500">
                              TV
                            </p>

                            <p className="mt-0.5 truncate text-sm font-black text-white">
                              {tvPlan
                                ? `${tvPlan.name} · ${tvPlan.channels}채널`
                                : "선택하지 않음"}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 text-sm font-black text-white">
                          {won(tvPlan?.monthlyPrice ?? 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[24px] bg-emerald-500/10 p-5 ring-1 ring-inset ring-emerald-400/20">
                    <p className="text-xs font-bold text-emerald-300">
                      최대 혜택 적용 예상 월요금
                    </p>

                    <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-emerald-400">
                      {won(estimatedMonthlyPrice)}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-emerald-400/15 pt-4">
                      <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Gift
                          size={15}
                          className="text-amber-300"
                        />
                        예상 사은품
                      </span>

                      <p className="text-right text-sm font-black text-white">
                        {reward
                          ? `${won(reward.amount)} + ${reward.extraBenefit}`
                          : "상담 시 안내"}
                      </p>
                    </div>
                  </div>

                  {tvPlan && !bundleRule ? (
                    <p className="mt-3 break-keep text-xs font-bold leading-5 text-amber-300">
                      선택 조합의 정확한 결합 요금은 상담 시
                      최종 확인됩니다.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="mt-7 rounded-[24px] border border-white/10 bg-white/[0.05] p-5">
                  <p className="text-sm font-black text-white">
                    상담 서비스
                  </p>

                  <p className="mt-2 break-keep text-sm leading-6 text-slate-400">
                    관심 서비스를 선택하면 상담 내용에 함께
                    저장됩니다.
                  </p>
                </div>
              )}

              <div className="mt-auto pt-7">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "조건 비교",
                    "결합 확인",
                    "설치 안내",
                    "혜택 확인",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-bold text-slate-300"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check
                          size={12}
                          strokeWidth={3}
                        />
                      </span>

                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-black text-emerald-600">
                상담 신청
              </p>

              <h3 className="mt-2 text-3xl font-black tracking-[-0.035em] text-slate-950">
                연락받으실 정보를
                <br />
                입력해주세요
              </h3>

              <p className="mt-3 break-keep text-sm font-semibold leading-6 text-slate-600">
                상담 신청 후 담당자가 빠르게 연락드립니다.
              </p>

              <div className="mt-7 space-y-5">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-900">
                    <UserRound
                      size={16}
                      className="text-emerald-600"
                    />
                    이름
                  </span>

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="이름 입력"
                    autoComplete="name"
                    className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-black text-slate-900">
                    <Phone
                      size={16}
                      className="text-emerald-600"
                    />
                    연락처
                  </span>

                  <input
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="010-0000-0000"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </label>

                {!isInternetPage ? (
                  <fieldset>
                    <legend className="mb-3 text-sm font-black text-slate-900">
                      관심 서비스
                    </legend>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {services.map((item) => {
                        const selected = service === item;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              setService(item)
                            }
                            aria-pressed={selected}
                            className={[
                              "min-h-12 rounded-xl border px-3 py-3 text-sm font-black transition",
                              selected
                                ? "border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600"
                                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40",
                            ].join(" ")}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : null}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(event) =>
                        setAgreed(event.target.checked)
                      }
                      className="mt-0.5 size-5 shrink-0 accent-emerald-600"
                    />

                    <span className="text-sm font-bold leading-6 text-slate-800">
                      개인정보 수집 및 이용에 동의합니다.
                      <span className="ml-1 text-red-500">
                        (필수)
                      </span>
                    </span>
                  </label>

                  <div className="mt-2 flex items-center justify-between gap-3 pl-8">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <LockKeyhole size={13} />
                      안전하게 관리됩니다
                    </span>

                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-xs font-black text-emerald-700 underline underline-offset-4"
                    >
                      자세히 보기
                    </Link>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-emerald-200 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <Send size={20} />

                  {loading
                    ? "접수 중..."
                    : "30초 무료 상담 신청"}
                </button>

                {done ? (
                  <div
                    role="status"
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center"
                  >
                    <CheckCircle2
                      size={32}
                      className="mx-auto text-emerald-600"
                    />

                    <p className="mt-3 font-black text-emerald-900">
                      상담 신청이 완료되었습니다.
                    </p>

                    <p className="mt-1 break-keep text-sm font-semibold leading-6 text-emerald-700">
                      선택하신 조건을 확인한 후 빠르게
                      연락드리겠습니다.
                    </p>
                  </div>
                ) : null}

                <a
                  href={SITE.phoneHref}
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 font-black text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-100"
                >
                  <Phone size={19} />
                  전화 상담 {SITE.phone}
                </a>

                <div className="flex flex-col items-center justify-center gap-2 text-xs font-bold text-slate-500 sm:flex-row">
                  <span className="flex items-center gap-2 text-emerald-700">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    {SITE.consultationStatus}
                  </span>

                  <span className="hidden text-slate-300 sm:inline">
                    ·
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={14} />
                    평균 상담 연결 {SITE.averageTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {consultationSteps.map(
                (step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                      {index + 1}
                    </span>

                    <span className="text-sm font-black text-slate-800">
                      {step}
                    </span>

                    {index <
                    consultationSteps.length - 1 ? (
                      <ArrowRight className="ml-auto hidden size-4 text-slate-300 sm:block" />
                    ) : null}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}