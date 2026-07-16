import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { encryptSensitiveValue, maskAccount, maskCard } from "@/lib/security/encryption";

type ApplicationPayload = {
  receiptCode: string;
  productSummary: string;
  baseMonthlyPrice: number;
  estimatedMonthlyPrice: number;
  mobileDiscount: number;
  cardDiscount: number;
  useMobileDiscount: boolean;
  useCardDiscount: boolean;
  installFee: number;
  giftCard: number;
  cashBenefit: number;
  applicant: {
    name: string;
    birthDate: string;
    phone: string;
    email: string | null;
  };
  installationAddress: {
    postcode: string;
    address: string;
    detail: string;
  };
  payment:
    | {
        method: "account";
        bank: string;
        holder: string;
        accountNumber: string;
      }
    | {
        method: "card";
        company: string;
        holder: string;
        cardNumber: string;
        expiry: string;
      };
  payoutAccount: {
    bank: string;
    holder: string;
    accountNumber: string;
  };
  agreements: {
    privacy: boolean;
    thirdParty: boolean;
    marketing: boolean;
  };
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  }
  return value;
}

function validate(payload: ApplicationPayload) {
  if (!payload.receiptCode || !payload.productSummary) {
    return "상품 정보가 올바르지 않습니다.";
  }

  if (
    !payload.applicant?.name ||
    payload.applicant.birthDate?.length !== 8 ||
    payload.applicant.phone?.length < 10
  ) {
    return "가입자 정보를 정확하게 입력해주세요.";
  }

  if (
    !payload.installationAddress?.address ||
    !payload.installationAddress.detail
  ) {
    return "설치 주소를 정확하게 입력해주세요.";
  }

  if (!payload.agreements?.privacy || !payload.agreements?.thirdParty) {
    return "필수 동의 항목을 확인해주세요.";
  }

  if (
    !payload.payoutAccount?.bank ||
    !payload.payoutAccount.holder ||
    !payload.payoutAccount.accountNumber
  ) {
    return "지원금 지급 계좌를 정확하게 입력해주세요.";
  }

  if (payload.payment.method === "account") {
    if (
      !payload.payment.bank ||
      !payload.payment.holder ||
      !payload.payment.accountNumber
    ) {
      return "요금 납부 계좌를 정확하게 입력해주세요.";
    }
  } else if (
    !payload.payment.company ||
    !payload.payment.holder ||
    payload.payment.cardNumber.length < 15 ||
    payload.payment.expiry.length !== 4
  ) {
    return "카드 자동결제 정보를 정확하게 입력해주세요.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ApplicationPayload;
    const validationError = validate(payload);

    if (validationError) {
      return NextResponse.json(
        { ok: false, message: validationError },
        { status: 400 },
      );
    }

    const supabase = createClient(
      requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const sensitivePayment =
      payload.payment.method === "account"
        ? {
            method: "account",
            bank: payload.payment.bank,
            holder: payload.payment.holder,
            accountNumber: payload.payment.accountNumber,
          }
        : {
            method: "card",
            company: payload.payment.company,
            holder: payload.payment.holder,
            cardNumber: payload.payment.cardNumber,
            expiry: payload.payment.expiry,
          };

    const paymentEncrypted = encryptSensitiveValue(
      JSON.stringify(sensitivePayment),
    );

    const payoutEncrypted = encryptSensitiveValue(
      JSON.stringify(payload.payoutAccount),
    );

    const paymentMasked =
      payload.payment.method === "account"
        ? `${payload.payment.bank} ${maskAccount(payload.payment.accountNumber)}`
        : `${payload.payment.company} ${maskCard(payload.payment.cardNumber)}`;

    const payoutMasked = `${payload.payoutAccount.bank} ${maskAccount(
      payload.payoutAccount.accountNumber,
    )}`;

    const { error } = await supabase.from("self_applications").insert({
      receipt_code: payload.receiptCode,
      source: "self_apply",
      status: "신규접수",

      product_summary: payload.productSummary,
      base_monthly_price: payload.baseMonthlyPrice,
      estimated_monthly_price: payload.estimatedMonthlyPrice,
      mobile_discount: payload.mobileDiscount,
      card_discount: payload.cardDiscount,
      use_mobile_discount: payload.useMobileDiscount,
      use_card_discount: payload.useCardDiscount,

      install_fee: payload.installFee,
      gift_card_amount: payload.giftCard,
      cash_benefit_amount: payload.cashBenefit,

      applicant_name: payload.applicant.name,
      applicant_birth_date: payload.applicant.birthDate,
      applicant_phone: payload.applicant.phone,
      applicant_email: payload.applicant.email,

      postcode: payload.installationAddress.postcode,
      installation_address: payload.installationAddress.address,
      installation_address_detail: payload.installationAddress.detail,

      payment_method: payload.payment.method,
      payment_summary_masked: paymentMasked,
      payment_info_encrypted: paymentEncrypted,

      payout_account_masked: payoutMasked,
      payout_info_encrypted: payoutEncrypted,

      privacy_agreed: payload.agreements.privacy,
      third_party_agreed: payload.agreements.thirdParty,
      marketing_agreed: payload.agreements.marketing,
      agreed_at: new Date().toISOString(),
    });

    if (error) {
      console.error("셀프가입 저장 오류:", error);
      return NextResponse.json(
        {
          ok: false,
          message: "가입 신청 저장 중 오류가 발생했습니다.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      receiptCode: payload.receiptCode,
    });
  } catch (error) {
    console.error("셀프가입 API 오류:", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "가입 신청 처리 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
