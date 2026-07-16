"use client";

import Script from "next/script";
import { useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  Banknote,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gift,
  Home,
  Landmark,
  LockKeyhole,
  MapPin,
  Phone,
  ReceiptText,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import {
  FormEvent,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PaymentMethod = "account" | "card";

type FormState = {
  applicantName: string;
  birthDate: string;
  phone: string;
  email: string;
  postcode: string;
  address: string;
  addressDetail: string;
  paymentMethod: PaymentMethod;
  paymentBank: string;
  paymentAccountHolder: string;
  paymentAccountNumber: string;
  paymentCardCompany: string;
  paymentCardNumber: string;
  paymentCardExpiry: string;
  paymentCardHolder: string;
  payoutSameAsPayment: boolean;
  payoutBank: string;
  payoutAccountHolder: string;
  payoutAccountNumber: string;
  privacyAgreed: boolean;
  thirdPartyAgreed: boolean;
  marketingAgreed: boolean;
};

const STORAGE_KEY = "woosunsaeng-self-apply-draft-v1";

const initialForm: FormState = {
  applicantName: "",
  birthDate: "",
  phone: "",
  email: "",
  postcode: "",
  address: "",
  addressDetail: "",
  paymentMethod: "account",
  paymentBank: "",
  paymentAccountHolder: "",
  paymentAccountNumber: "",
  paymentCardCompany: "",
  paymentCardNumber: "",
  paymentCardExpiry: "",
  paymentCardHolder: "",
  payoutSameAsPayment: false,
  payoutBank: "",
  payoutAccountHolder: "",
  payoutAccountNumber: "",
  privacyAgreed: false,
  thirdPartyAgreed: false,
  marketingAgreed: false,
};

const steps = [
  { id: 1, title: "상품 확인" },
  { id: 2, title: "가입자 정보" },
  { id: 3, title: "설치 주소" },
  { id: 4, title: "납부·지급" },
  { id: 5, title: "동의 및 신청" },
];

const banks = [
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "농협은행",
  "기업은행",
  "SC제일은행",
  "카카오뱅크",
  "토스뱅크",
  "케이뱅크",
  "부산은행",
  "대구은행",
  "경남은행",
  "광주은행",
  "전북은행",
  "제주은행",
  "새마을금고",
  "신협",
  "우체국",
];

const cardCompanies = [
  "신한카드",
  "삼성카드",
  "현대카드",
  "KB국민카드",
  "롯데카드",
  "우리카드",
  "하나카드",
  "NH농협카드",
  "BC카드",
];

const inputClass =
  "h-[54px] w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-[15px] font-semibold tracking-[-0.02em] text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100";

function formatPrice(value: number) {
  return value.toLocaleString("ko-KR");
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function formatCardNumber(value: string) {
  return onlyDigits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function Surface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-7 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  icon,
  eyebrow,
  title,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>
      <div>
        <p className="text-[12px] font-extrabold text-emerald-600">{eyebrow}</p>
        <h2 className="mt-0.5 text-xl font-extrabold tracking-[-0.04em] text-slate-950">
          {title}
        </h2>
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-[14px] font-bold tracking-[-0.02em] text-slate-800">
      {children}
      {required && <span className="ml-1 text-emerald-600">*</span>}
    </label>
  );
}

function ApplyPageContent() {
  const searchParams = useSearchParams();

  const receiptCode = searchParams.get("code") || "A0000";
  const product = searchParams.get("product") || "선택한 인터넷 상품";
  const basePrice = Number(searchParams.get("base") || 0);
  const mobileDiscount = Number(searchParams.get("mobileDiscount") || 0);
  const cardDiscount = Number(searchParams.get("cardDiscount") || 0);
  const useMobileDiscount = searchParams.get("mobile") === "1";
  const useCardDiscount = searchParams.get("card") === "1";
  const installFee = Number(searchParams.get("installFee") || 0);
  const giftCard = Number(searchParams.get("giftCard") || 0);
  const cashBenefit = Number(searchParams.get("cash") || 0);

  const estimatedMonthlyPrice = Math.max(
    basePrice -
      (useMobileDiscount ? mobileDiscount : 0) -
      (useCardDiscount ? cardDiscount : 0),
    0,
  );

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completedCode, setCompletedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const progress = useMemo(() => (step / steps.length) * 100, [step]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<FormState>;
        setForm((current) => ({ ...current, ...parsed }));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || completedCode) return;

    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, 250);

    return () => window.clearTimeout(timer);
  }, [form, ready, completedCode]);

  function updateField<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrorMessage("");
  }

  function openAddressSearch() {
    if (!window.daum?.Postcode) {
      setErrorMessage("주소 검색을 불러오는 중입니다. 잠시 후 다시 눌러주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm((current) => ({
          ...current,
          postcode: data.zonecode,
          address: (() => {
            const baseAddress =
              data.roadAddress || data.address || data.jibunAddress || "";

            return data.buildingName
              ? `${baseAddress} (${data.buildingName})`
              : baseAddress;
          })(),
        }));
        setErrorMessage("");
      },
    }).open();
  }

  function validateCurrentStep() {
    if (step === 2) {
      if (!form.applicantName.trim()) return "가입자 이름을 입력해주세요.";
      if (onlyDigits(form.birthDate).length !== 8)
        return "생년월일 8자리를 입력해주세요.";
      if (onlyDigits(form.phone).length < 10)
        return "연락처를 정확하게 입력해주세요.";
    }

    if (step === 3) {
      if (!form.address.trim()) return "설치 주소를 검색해주세요.";
      if (!form.addressDetail.trim()) return "상세주소를 입력해주세요.";
    }

    if (step === 4) {
      if (form.paymentMethod === "account") {
        if (
          !form.paymentBank ||
          !form.paymentAccountHolder.trim() ||
          !form.paymentAccountNumber.trim()
        ) {
          return "요금 납부 계좌 정보를 모두 입력해주세요.";
        }
      } else if (
        !form.paymentCardCompany ||
        onlyDigits(form.paymentCardNumber).length < 15 ||
        onlyDigits(form.paymentCardExpiry).length !== 4 ||
        !form.paymentCardHolder.trim()
      ) {
        return "카드 자동결제 정보를 정확하게 입력해주세요.";
      }

      if (
        form.payoutSameAsPayment &&
        form.paymentMethod !== "account"
      ) {
        return "카드 결제 선택 시 지원금 지급 계좌를 별도로 입력해주세요.";
      }

      if (
        !form.payoutSameAsPayment &&
        (!form.payoutBank ||
          !form.payoutAccountHolder.trim() ||
          !form.payoutAccountNumber.trim())
      ) {
        return "지원금 지급 계좌 정보를 모두 입력해주세요.";
      }
    }

    return "";
  }

  function nextStep() {
    const validationError = validateCurrentStep();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function previousStep() {
    setErrorMessage("");
    setStep((current) => Math.max(current - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changePaymentMethod(method: PaymentMethod) {
    setForm((current) => ({
      ...current,
      paymentMethod: method,
      payoutSameAsPayment:
        method === "account" ? current.payoutSameAsPayment : false,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.privacyAgreed || !form.thirdPartyAgreed) {
      setErrorMessage("필수 동의 항목을 확인해주세요.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const payoutAccount = form.payoutSameAsPayment
      ? {
          bank: form.paymentBank,
          holder: form.paymentAccountHolder,
          number: form.paymentAccountNumber,
        }
      : {
          bank: form.payoutBank,
          holder: form.payoutAccountHolder,
          number: form.payoutAccountNumber,
        };

    try {
      const response = await fetch("/api/internet/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptCode,
          productSummary: product,
          baseMonthlyPrice: basePrice,
          estimatedMonthlyPrice,
          mobileDiscount,
          cardDiscount,
          useMobileDiscount,
          useCardDiscount,
          installFee,
          giftCard,
          cashBenefit,
          applicant: {
            name: form.applicantName.trim(),
            birthDate: onlyDigits(form.birthDate),
            phone: onlyDigits(form.phone),
            email: form.email.trim() || null,
          },
          installationAddress: {
            postcode: form.postcode,
            address: form.address,
            detail: form.addressDetail.trim(),
          },
          payment:
            form.paymentMethod === "account"
              ? {
                  method: "account",
                  bank: form.paymentBank,
                  holder: form.paymentAccountHolder.trim(),
                  accountNumber: onlyDigits(form.paymentAccountNumber),
                }
              : {
                  method: "card",
                  company: form.paymentCardCompany,
                  holder: form.paymentCardHolder.trim(),
                  cardNumber: onlyDigits(form.paymentCardNumber),
                  expiry: onlyDigits(form.paymentCardExpiry),
                },
          payoutAccount: {
            bank: payoutAccount.bank,
            holder: payoutAccount.holder.trim(),
            accountNumber: onlyDigits(payoutAccount.number),
          },
          agreements: {
            privacy: form.privacyAgreed,
            thirdParty: form.thirdPartyAgreed,
            marketing: form.marketingAgreed,
          },
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        receiptCode?: string;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "가입 신청 저장에 실패했습니다.");
      }

      localStorage.removeItem(STORAGE_KEY);
      setCompletedCode(result.receiptCode || receiptCode);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "가입 신청 중 오류가 발생했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="text-center">
          <div className="mx-auto size-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            가입 정보를 준비하고 있습니다.
          </p>
        </div>
      </main>
    );
  }

  if (completedCode) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-[680px]">
          <Surface className="overflow-hidden p-0">
            <div className="bg-slate-950 px-6 py-10 text-center text-white sm:px-10 sm:py-14">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_16px_40px_rgba(16,185,129,0.3)]">
                <Check size={32} strokeWidth={3} />
              </div>
              <p className="mt-6 text-sm font-bold text-emerald-400">
                가입 신청 완료
              </p>
              <h1 className="mt-2 text-[30px] font-extrabold tracking-[-0.05em] sm:text-[38px]">
                정상적으로 접수되었습니다.
              </h1>
              <p className="mt-3 break-keep text-sm font-medium leading-6 text-slate-300">
                담당 상담사가 가입 조건을 확인한 뒤 순차적으로 연락드립니다.
              </p>
            </div>

            <div className="p-6 sm:p-10">
              <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-6 text-center">
                <p className="text-sm font-bold text-emerald-700">접수번호</p>
                <strong className="mt-2 block text-[36px] font-extrabold tracking-[0.1em] text-emerald-950">
                  {completedCode}
                </strong>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                  <BadgeCheck className="text-emerald-600" size={20} />
                  <span className="text-sm font-bold text-slate-800">
                    설치 후 지원금 당일 지급
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                  <Phone className="text-emerald-600" size={20} />
                  <span className="text-sm font-bold text-slate-800">
                    설치 일정은 안내전화로 조율
                  </span>
                </div>
              </div>

              <a
                href="/"
                className="mt-7 flex h-[54px] w-full items-center justify-center rounded-2xl bg-emerald-600 text-sm font-extrabold text-white transition hover:bg-emerald-500"
              >
                홈으로 돌아가기
              </a>
            </div>
          </Surface>
        </div>
      </main>
    );
  }

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-slate-50 pb-28">
        <div className="border-b border-slate-200/80 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-5 sm:px-6">
            <a
              href="/internet"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
            >
              <ChevronLeft size={18} />
              상품 선택으로 돌아가기
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold text-emerald-600">
              우선생 간편 가입
            </p>
            <h1 className="mt-2 text-[32px] font-extrabold tracking-[-0.055em] text-slate-950 sm:text-[44px]">
              복잡하지 않게, 필요한 정보만
            </h1>
            <p className="mt-3 break-keep text-[15px] font-medium leading-7 text-slate-500">
              입력 내용은 자동 저장되며 가입 진행과 지원금 지급을 위해 안전하게 처리됩니다.
            </p>
          </header>

          <div className="sticky top-0 z-20 mx-auto mt-8 max-w-4xl rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur sm:static sm:bg-transparent sm:p-0 sm:shadow-none">
            <div className="flex items-center justify-between gap-2">
              {steps.map((item) => (
                <div
                  key={item.id}
                  className={`flex min-w-0 flex-1 flex-col items-center ${
                    item.id <= step ? "text-emerald-600" : "text-slate-300"
                  }`}
                >
                  <div
                    className={`flex size-8 items-center justify-center rounded-full text-xs font-extrabold transition ${
                      item.id < step
                        ? "bg-emerald-600 text-white"
                        : item.id === step
                          ? "border-2 border-emerald-600 bg-white text-emerald-600"
                          : "border border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {item.id < step ? <Check size={15} strokeWidth={3} /> : item.id}
                  </div>
                  <span className="mt-2 hidden truncate text-xs font-bold sm:block">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-4xl">
            {step === 1 && (
              <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
                <Surface>
                  <SectionHeader
                    icon={<ReceiptText size={21} />}
                    eyebrow="선택 상품"
                    title="가입 내용을 확인해주세요"
                  />

                  <div className="mt-6 rounded-[22px] bg-slate-950 p-5 text-white">
                    <p className="break-keep text-[15px] font-bold leading-6">
                      {product}
                    </p>

                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                      <span className="text-sm font-medium text-slate-400">
                        예상 월요금
                      </span>
                      <span className="text-right">
                        <strong className="tabular-nums text-[30px] font-extrabold tracking-[-0.05em] text-emerald-400">
                          {formatPrice(estimatedMonthlyPrice)}
                        </strong>
                        <span className="ml-1 text-sm font-bold text-emerald-400">
                          원
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold text-slate-500">월 기본요금</p>
                      <p className="mt-1 tabular-nums text-lg font-extrabold text-slate-950">
                        {formatPrice(basePrice)}원
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold text-slate-500">적용 할인</p>
                      <p className="mt-1 text-sm font-extrabold leading-6 text-slate-950">
                        {[
                          useMobileDiscount && "휴대폰 결합",
                          useCardDiscount && "제휴카드",
                        ]
                          .filter(Boolean)
                          .join(" · ") || "선택 없음"}
                      </p>
                    </div>
                  </div>
                </Surface>

                <Surface>
                  <SectionHeader
                    icon={<Gift size={21} />}
                    eyebrow="가입 혜택"
                    title="혜택 안내"
                  />

                  <div className="mt-6 space-y-3">
                    {[
                      ["설치비", installFee > 0 ? `${formatPrice(installFee)}원` : "상담 시 안내"],
                      ["상품권", giftCard > 0 ? `${formatPrice(giftCard)}원` : "상담 시 안내"],
                      ["현금", cashBenefit > 0 ? `${formatPrice(cashBenefit)}원` : "상담 시 안내"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4"
                      >
                        <span className="text-sm font-bold text-slate-500">{label}</span>
                        <span className="text-sm font-extrabold text-slate-950">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-extrabold text-emerald-800">
                      설치 후 지원금 당일 지급
                    </p>
                    <p className="mt-1 break-keep text-xs font-semibold leading-5 text-emerald-700/80">
                      가이드라인 기준 혜택을 안내하며 추가 혜택은 상담전화로 안내드립니다.
                    </p>
                  </div>
                </Surface>
              </div>
            )}

            {step === 2 && (
              <Surface>
                <SectionHeader
                  icon={<UserRound size={21} />}
                  eyebrow="STEP 2"
                  title="가입자 정보"
                />

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel required>가입자 이름</FieldLabel>
                    <input
                      className={inputClass}
                      value={form.applicantName}
                      onChange={(event) =>
                        updateField("applicantName", event.target.value)
                      }
                      placeholder="홍길동"
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <FieldLabel required>생년월일</FieldLabel>
                    <input
                      className={inputClass}
                      value={form.birthDate}
                      onChange={(event) =>
                        updateField(
                          "birthDate",
                          onlyDigits(event.target.value).slice(0, 8),
                        )
                      }
                      placeholder="19900101"
                      inputMode="numeric"
                      maxLength={8}
                    />
                  </div>

                  <div>
                    <FieldLabel required>휴대폰번호</FieldLabel>
                    <input
                      className={inputClass}
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", formatPhone(event.target.value))
                      }
                      placeholder="010-1234-5678"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>

                  <div>
                    <FieldLabel>이메일</FieldLabel>
                    <input
                      className={inputClass}
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="선택 입력"
                      type="email"
                      autoComplete="email"
                    />
                  </div>
                </div>
              </Surface>
            )}

            {step === 3 && (
              <Surface>
                <SectionHeader
                  icon={<MapPin size={21} />}
                  eyebrow="STEP 3"
                  title="설치 주소"
                />

                <div className="mt-7">
                  <FieldLabel required>주소</FieldLabel>
                  <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
                    <input
                      className={inputClass}
                      value={form.address}
                      readOnly
                      placeholder="주소검색 버튼을 눌러주세요"
                    />
                    <button
                      type="button"
                      onClick={openAddressSearch}
                      className="h-[54px] rounded-[18px] bg-slate-950 px-4 text-sm font-extrabold text-white transition hover:bg-slate-800"
                    >
                      주소검색
                    </button>
                  </div>

                  {form.postcode && (
                    <p className="mt-2 text-xs font-bold text-slate-500">
                      우편번호 {form.postcode}
                    </p>
                  )}

                  <div className="mt-5">
                    <FieldLabel required>상세주소</FieldLabel>
                    <input
                      className={inputClass}
                      value={form.addressDetail}
                      onChange={(event) =>
                        updateField("addressDetail", event.target.value)
                      }
                      placeholder="동·호수 또는 상세 위치"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <Home className="mt-0.5 shrink-0 text-emerald-600" size={19} />
                  <p className="break-keep text-sm font-semibold leading-6 text-slate-600">
                    설치 가능 여부와 정확한 설치 일정은 담당 상담사가 안내전화로 확인해드립니다.
                  </p>
                </div>
              </Surface>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <Surface>
                  <SectionHeader
                    icon={<WalletCards size={21} />}
                    eyebrow="STEP 4"
                    title="요금 납부 정보"
                  />

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => changePaymentMethod("account")}
                      className={`flex h-14 items-center justify-center gap-2 rounded-2xl border text-sm font-extrabold transition ${
                        form.paymentMethod === "account"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      <Landmark size={18} />
                      계좌 자동이체
                    </button>

                    <button
                      type="button"
                      onClick={() => changePaymentMethod("card")}
                      className={`flex h-14 items-center justify-center gap-2 rounded-2xl border text-sm font-extrabold transition ${
                        form.paymentMethod === "card"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      <CreditCard size={18} />
                      카드 자동결제
                    </button>
                  </div>

                  {form.paymentMethod === "account" ? (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <FieldLabel required>은행</FieldLabel>
                        <select
                          className={inputClass}
                          value={form.paymentBank}
                          onChange={(event) =>
                            updateField("paymentBank", event.target.value)
                          }
                        >
                          <option value="">은행 선택</option>
                          {banks.map((bank) => (
                            <option key={bank}>{bank}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <FieldLabel required>예금주</FieldLabel>
                        <input
                          className={inputClass}
                          value={form.paymentAccountHolder}
                          onChange={(event) =>
                            updateField("paymentAccountHolder", event.target.value)
                          }
                          placeholder="예금주 이름"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <FieldLabel required>계좌번호</FieldLabel>
                        <input
                          className={inputClass}
                          value={form.paymentAccountNumber}
                          onChange={(event) =>
                            updateField(
                              "paymentAccountNumber",
                              onlyDigits(event.target.value).slice(0, 20),
                            )
                          }
                          placeholder="숫자만 입력"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <FieldLabel required>카드사</FieldLabel>
                        <select
                          className={inputClass}
                          value={form.paymentCardCompany}
                          onChange={(event) =>
                            updateField("paymentCardCompany", event.target.value)
                          }
                        >
                          <option value="">카드사 선택</option>
                          {cardCompanies.map((company) => (
                            <option key={company}>{company}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <FieldLabel required>카드 명의자</FieldLabel>
                        <input
                          className={inputClass}
                          value={form.paymentCardHolder}
                          onChange={(event) =>
                            updateField("paymentCardHolder", event.target.value)
                          }
                          placeholder="카드 명의자"
                        />
                      </div>

                      <div>
                        <FieldLabel required>카드번호</FieldLabel>
                        <input
                          className={inputClass}
                          value={form.paymentCardNumber}
                          onChange={(event) =>
                            updateField(
                              "paymentCardNumber",
                              formatCardNumber(event.target.value),
                            )
                          }
                          placeholder="0000 0000 0000 0000"
                          inputMode="numeric"
                          autoComplete="cc-number"
                        />
                      </div>

                      <div>
                        <FieldLabel required>유효기간</FieldLabel>
                        <input
                          className={inputClass}
                          value={form.paymentCardExpiry}
                          onChange={(event) =>
                            updateField(
                              "paymentCardExpiry",
                              formatExpiry(event.target.value),
                            )
                          }
                          placeholder="MM/YY"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                        />
                      </div>
                    </div>
                  )}
                </Surface>

                <Surface>
                  <SectionHeader
                    icon={<Banknote size={21} />}
                    eyebrow="지원금 지급"
                    title="지급 계좌"
                  />

                  {form.paymentMethod === "account" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "payoutSameAsPayment",
                          !form.payoutSameAsPayment,
                        )
                      }
                      className={`mt-6 flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                        form.payoutSameAsPayment
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex size-6 items-center justify-center rounded-lg border ${
                          form.payoutSameAsPayment
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-300 bg-white text-transparent"
                        }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </span>
                      <span className="text-sm font-extrabold text-slate-800">
                        요금 납부 계좌와 동일
                      </span>
                    </button>
                  )}

                  {!form.payoutSameAsPayment && (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <FieldLabel required>은행</FieldLabel>
                        <select
                          className={inputClass}
                          value={form.payoutBank}
                          onChange={(event) =>
                            updateField("payoutBank", event.target.value)
                          }
                        >
                          <option value="">은행 선택</option>
                          {banks.map((bank) => (
                            <option key={bank}>{bank}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <FieldLabel required>예금주</FieldLabel>
                        <input
                          className={inputClass}
                          value={form.payoutAccountHolder}
                          onChange={(event) =>
                            updateField("payoutAccountHolder", event.target.value)
                          }
                          placeholder="지원금 수령 예금주"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <FieldLabel required>계좌번호</FieldLabel>
                        <input
                          className={inputClass}
                          value={form.payoutAccountNumber}
                          onChange={(event) =>
                            updateField(
                              "payoutAccountNumber",
                              onlyDigits(event.target.value).slice(0, 20),
                            )
                          }
                          placeholder="숫자만 입력"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <ShieldCheck
                      className="mt-0.5 shrink-0 text-emerald-600"
                      size={19}
                    />
                    <div>
                      <p className="text-sm font-extrabold text-emerald-800">
                        설치 후 지원금 당일 지급
                      </p>
                      <p className="mt-1 break-keep text-xs font-semibold leading-5 text-emerald-700/80">
                        설치 완료 확인 후 등록하신 지급 계좌로 입금됩니다.
                      </p>
                    </div>
                  </div>
                </Surface>
              </div>
            )}

            {step === 5 && (
              <Surface>
                <SectionHeader
                  icon={<LockKeyhole size={21} />}
                  eyebrow="STEP 5"
                  title="동의 및 신청"
                />

                <button
                  type="button"
                  onClick={() => {
                    const next = !(
                      form.privacyAgreed &&
                      form.thirdPartyAgreed &&
                      form.marketingAgreed
                    );

                    setForm((current) => ({
                      ...current,
                      privacyAgreed: next,
                      thirdPartyAgreed: next,
                      marketingAgreed: next,
                    }));
                  }}
                  className="mt-7 flex w-full items-center gap-3 rounded-2xl bg-slate-950 p-4 text-left text-white"
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-lg ${
                      form.privacyAgreed &&
                      form.thirdPartyAgreed &&
                      form.marketingAgreed
                        ? "bg-emerald-500"
                        : "bg-white/10"
                    }`}
                  >
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-sm font-extrabold">전체 동의</span>
                </button>

                <div className="mt-3 space-y-2">
                  {[
                    ["privacyAgreed", "[필수] 개인정보 수집 및 이용 동의"],
                    [
                      "thirdPartyAgreed",
                      "[필수] 통신사 가입 진행 및 제3자 제공 동의",
                    ],
                    ["marketingAgreed", "[선택] 혜택 및 이벤트 안내 동의"],
                  ].map(([key, label]) => {
                    const field = key as
                      | "privacyAgreed"
                      | "thirdPartyAgreed"
                      | "marketingAgreed";

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => updateField(field, !form[field])}
                        className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left"
                      >
                        <span
                          className={`flex size-6 items-center justify-center rounded-lg border ${
                            form[field]
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          <Check size={14} strokeWidth={3} />
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <LockKeyhole
                      className="mt-0.5 shrink-0 text-emerald-600"
                      size={18}
                    />
                    <p className="break-keep text-xs font-semibold leading-5 text-slate-600">
                      결제 및 계좌 정보는 서버에서 암호화하여 저장되며, 가입 업무를 담당하는 권한 있는 관리자만 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              </Surface>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700"
              >
                {errorMessage}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={previousStep}
                  className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
                >
                  <ChevronLeft size={18} />
                  이전
                </button>
              )}

              {step < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex h-14 flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(5,150,105,0.2)] transition hover:bg-emerald-500"
                >
                  다음
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-14 flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(5,150,105,0.2)] transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "신청 중..." : "가입 신청 완료"}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-sm font-bold text-slate-500">
            가입 정보를 불러오고 있습니다.
          </p>
        </main>
      }
    >
      <ApplyPageContent />
    </Suspense>
  );
}
