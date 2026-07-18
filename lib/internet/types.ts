export type Carrier =
  | "KT"
  | "LG U+"
  | "SK"
  | "SkyLife"
  | "HelloVision"
  | "SKB";

export type Speed =
  | "100M"
  | "500M"
  | "1G";

export type RewardInfo = {
  amount: number;
  extraBenefit: string;
};

export type InternetPlan = {
  id: string;
  speed: Speed;
  name: string;
  description: string;

  // 인터넷 단독 월 기본료
  monthlyPrice: number;

  // 인터넷 단독 기준 휴대폰 1회선 결합 할인
  mobileDiscount: number;

  // 인터넷 단독 가입 사은품
  reward: RewardInfo;

  recommended?: boolean;
};

export type TvPlan = {
  id: string;
  name: string;
  channels: number;
  description: string;

  // TV 단독 안내 월 기본료
  monthlyPrice: number;

  recommended?: boolean;
};

export type BundleRule = {
  id: string;
  speed: Speed;
  tvPlanId: string;

  // 인터넷 + TV 조합 월 기본요금
  bundleMonthlyPrice: number;

  // 조합 기준 휴대폰 1회선 결합 할인
  mobileDiscount: number;

  // 조합 기준 사은품
  reward: RewardInfo;
};

export type CarrierData = {
  id: Carrier;
  label: string;
  logo: string;

  // 통신사별 최대 제휴카드 할인
  maxCardDiscount: number;

  // 요금 검증 및 표시 기준
  priceVerifiedAt?: string;
  pricingBasis?: string;
  equipmentNote?: string;

  internetPlans: InternetPlan[];
  tvPlans: TvPlan[];
  bundleRules: BundleRule[];
};