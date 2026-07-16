"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Phone,
  UserRound,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import Container from "@/components/ui/Container";
import AddressSearch from "@/components/internet/AddressSearch";

type Props = {
  receiptCode: string;
  productSummary: string;
  basePrice: number;
  mobileDiscount: number;
  cardDiscount: number;
  initialMobileApplied: boolean;
  initialCardApplied: boolean;
};

type FormState = {
  name: string;
  phone: string;
  zonecode: string;
  address: string;
  detailAddress: string;
  existingCarrier: string;
  memo: string;
  benefitConfirmed: boolean;
  paymentMethod: "account" | "card";
  payerName: string;
  payerBirth: string;
  privacyAgreed: boolean;
};

const steps = [
  "상품 확인",
  "고객 정보",
  "상담 조건",
  "혜택 안내",
  "결제 방법",
];

const initialForm: FormState = {
  name: "",
  phone: "",
  zonecode: "",
  address: "",
  detailAddress: "",
  existingCarrier: "",
  memo: "",
  benefitConfirmed: false,
  paymentMethod: "account",
  payerName: "",
  payerBirth: "",
  privacyAgreed: false,
};

const formatPrice = (price: number) =>
  Math.max(price, 0).toLocaleString("ko-KR");

export default function SelfApplyForm({
  receiptCode,
  productSummary,
  basePrice,
  mobileDiscount,
  cardDiscount,
  initialMobileApplied,
  initialCardApplied,
}: Props) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [mobileApplied, setMobileApplied] = useState(initialMobileApplied);
  const [cardApplied, setCardApplied] = useState(initialCardApplied);
  const [form, setForm] = useState<FormState>(initialForm);

  const estimatedPrice = useMemo(
    () =>
      Math.max(
        basePrice -
          (mobileApplied ? mobileDiscount : 0) -
          (cardApplied ? cardDiscount : 0),
        0,
      ),
    [
      basePrice,
      mobileApplied,
      mobileDiscount,
      cardApplied,
      cardDiscount,
    ],
  );

  function update<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const canNext = useMemo(() => {
    if (step === 1) {
      return Boolean(
        form.name.trim() &&
          form.phone.trim() &&
          form.address.trim() &&
          form.detailAddress.trim(),
      );
    }

    if (step === 3) return form.benefitConfirmed;

    if (step === 4) {
      return Boolean(
        form.payerName.trim() &&
          form.payerBirth.trim() &&
          form.privacyAgreed,
      );
    }

    return true;
  }, [step, form]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < steps.length - 1) {
      if (canNext) setStep((current) => current + 1);
      return;
    }

    if (!canNext) return;

    // Supabase 컬럼 확장 후 이 위치에 저장 로직을 연결합니다.
    setCompleted(true);
  }

  if (completed) {
    return (
      <Container>
        <div className="mx-auto max-w-xl rounded-[28px] border border-emerald-200 bg-white px-6 py-12 text-center shadow-sm">
          <CheckCircle2 className="mx-auto size-12 text-emerald-600" />

          <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.045em] text-slate-950">
            가입 신청이 완료되었습니다.
          </h1>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            신청 내용을 확인한 뒤 상담원이 순차적으로 연락드립니다.
          </p>

          <div className="mx-auto mt-6 max-w-xs rounded-2xl bg-emerald-50 px-5 py-4">
            <p className="text-xs font-bold text-emerald-700">접수번호</p>
            <p className="mt-1 text-[30px] font-extrabold tracking-[0.08em] text-emerald-950">
              {receiptCode || "확인 중"}
            </p>
          </div>

          <a
            href="/"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white"
          >
            홈으로 돌아가기
          </a>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-bold text-emerald-600">간편 가입 신청</p>
          <h1 className="mt-2 text-[32px] font-extrabold tracking-[-0.05em] text-slate-950 sm:text-[40px]">
            필요한 정보만 순서대로 입력해주세요.
          </h1>
        </div>

        <div className="mt-7 grid grid-cols-5 gap-2">
          {steps.map((label, index) => (
            <div key={label} className="text-center">
              <div
                className={[
                  "mx-auto flex size-8 items-center justify-center rounded-full text-xs font-bold",
                  index <= step
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-500",
                ].join(" ")}
              >
                {index + 1}
              </div>

              <p className="mt-2 hidden text-xs font-bold text-slate-600 sm:block">
                {label}
              </p>
            </div>
          ))}
        </div>

        <form
          onSubmit={submit}
          className="mt-7 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {step === 0 && (
            <section>
              <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-slate-950">
                상품 확인
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                  <p className="text-xs font-bold text-emerald-400">접수번호</p>
                  <p className="mt-1 text-[28px] font-extrabold tracking-[0.08em]">
                    {receiptCode || "확인 중"}
                  </p>
                  <p className="mt-4 text-sm font-bold leading-6">
                    {productSummary || "선택 상품 정보 없음"}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="text-sm font-bold text-emerald-700">
                    현재 예상 월요금
                  </p>
                  <p className="mt-2 text-[32px] font-extrabold text-emerald-950">
                    {formatPrice(estimatedPrice)}원
                  </p>
                  <p className="mt-2 text-xs leading-5 text-emerald-800/70">
                    적용 조건에 따라 최종 금액이 달라질 수 있습니다.
                  </p>
                </div>
              </div>
            </section>
          )}

          {step === 1 && (
            <section>
              <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-slate-950">
                고객 정보
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <UserRound size={16} />
                    이름
                  </span>

                  <input
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
                    placeholder="이름을 입력해주세요"
                  />
                </label>

                <label>
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Phone size={16} />
                    연락처
                  </span>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
                    placeholder="010-0000-0000"
                  />
                </label>
              </div>

              <div className="mt-5">
                <AddressSearch
                  postcode={form.zonecode}
                  address={form.address}
                  detailAddress={form.detailAddress}
                  onPostcodeChange={(value) => update("zonecode", value)}
                  onAddressChange={(value) => update("address", value)}
                  onDetailAddressChange={(value) =>
                    update("detailAddress", value)
                  }
                />
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-slate-950">
                상담 조건
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMobileApplied((value) => !value)}
                  className={[
                    "rounded-2xl border p-4 text-left",
                    mobileApplied
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <p className="font-extrabold text-slate-950">
                    휴대폰 결합 할인
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {mobileApplied ? "적용" : "미적용"}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCardApplied((value) => !value)}
                  className={[
                    "rounded-2xl border p-4 text-left",
                    cardApplied
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <p className="font-extrabold text-slate-950">
                    제휴카드 할인
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {cardApplied ? "적용" : "미적용"}
                  </p>
                </button>
              </div>

              <label className="mt-5 block">
                <span className="text-sm font-bold text-slate-800">
                  현재 이용 중인 인터넷 통신사
                </span>

                <select
                  value={form.existingCarrier}
                  onChange={(event) =>
                    update("existingCarrier", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
                >
                  <option value="">선택해주세요</option>
                  <option>KT</option>
                  <option>LG U+</option>
                  <option>SK</option>
                  <option>지역 케이블</option>
                  <option>이용하지 않음</option>
                </select>
              </label>

              <label className="mt-5 block">
                <span className="text-sm font-bold text-slate-800">
                  추가 요청사항
                </span>

                <textarea
                  rows={4}
                  value={form.memo}
                  onChange={(event) => update("memo", event.target.value)}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  placeholder="상담 시 참고할 내용을 입력해주세요"
                />
              </label>

              <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">
                    변경된 예상 월요금
                  </span>
                  <strong className="text-lg font-extrabold text-emerald-700">
                    {formatPrice(estimatedPrice)}원
                  </strong>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-slate-950">
                설치 후 지급 안내
              </h2>

              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="font-extrabold text-emerald-950">
                  혜택은 설치 완료 및 정상 개통 확인 후 지급됩니다.
                </p>
                <p className="mt-3 text-sm font-medium leading-6 text-emerald-900/70">
                  정확한 지급 방식과 조건은 상담 과정에서 안내드리며,
                  신청 내용이나 개통 상태에 따라 지급 일정이 달라질 수 있습니다.
                </p>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={form.benefitConfirmed}
                  onChange={(event) =>
                    update("benefitConfirmed", event.target.checked)
                  }
                  className="mt-0.5 size-5 accent-emerald-600"
                />
                <span className="text-sm font-bold text-slate-800">
                  설치 후 지급 안내와 유의사항을 확인했습니다.
                </span>
              </label>
            </section>
          )}

          {step === 4 && (
            <section>
              <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-slate-950">
                결제 방법
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["account", "계좌 자동이체"],
                  ["card", "신용카드 자동결제"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      update(
                        "paymentMethod",
                        value as FormState["paymentMethod"],
                      )
                    }
                    className={[
                      "flex items-center gap-3 rounded-2xl border p-4 text-left",
                      form.paymentMethod === value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200",
                    ].join(" ")}
                  >
                    <CreditCard size={20} />
                    <span className="font-extrabold">{label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-800">
                    납부자 이름
                  </span>
                  <input
                    value={form.payerName}
                    onChange={(event) =>
                      update("payerName", event.target.value)
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm"
                    placeholder="납부자 이름"
                  />
                </label>

                <label>
                  <span className="text-sm font-bold text-slate-800">
                    생년월일 또는 사업자번호
                  </span>
                  <input
                    value={form.payerBirth}
                    onChange={(event) =>
                      update("payerBirth", event.target.value)
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm"
                    placeholder="숫자만 입력"
                  />
                </label>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={form.privacyAgreed}
                  onChange={(event) =>
                    update("privacyAgreed", event.target.checked)
                  }
                  className="mt-0.5 size-5 accent-emerald-600"
                />
                <span>
                  <span className="block text-sm font-bold text-slate-800">
                    개인정보 수집·이용에 동의합니다.
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    상담 및 가입 진행을 위해 고객 정보와 신청 조건을 수집합니다.
                  </span>
                </span>
              </label>
            </section>
          )}

          <div className="mt-7 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                setStep((current) => Math.max(0, current - 1))
              }
              disabled={step === 0}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-700 disabled:opacity-30"
            >
              <ArrowLeft size={17} />
              이전
            </button>

            <button
              type="submit"
              disabled={!canNext}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white disabled:bg-slate-300"
            >
              {step === steps.length - 1 ? "가입 신청 접수" : "다음"}
              {step < steps.length - 1 && <ArrowRight size={17} />}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
