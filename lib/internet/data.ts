import { lgData } from "@/lib/internet/lg";
import { skData } from "@/lib/internet/sk";
import { skyLifeData } from "@/lib/internet/skylife";
import { helloVisionData } from "@/lib/internet/hellovision";
import { skbData } from "@/lib/internet/skb";
export { carrierOrder } from "@/lib/internet/carriers";

import type {
  BundleRule,
  Carrier,
  CarrierData,
  InternetPlan,
  RewardInfo,
  Speed,
  TvPlan,
} from "@/lib/internet/types";


const emptyCarrier = (
  id: Carrier,
  label: string,
  logo: string
): CarrierData => ({
  id,
  label,
  logo,
  maxCardDiscount: 0,
  internetPlans: [],
  tvPlans: [],
  bundleRules: [],
});

export const internetData: Record<Carrier, CarrierData> = {
  KT: {
    id: "KT",
    label: "KT",
    logo: "/carriers/kt.png",

    maxCardDiscount: 22000,

    internetPlans: [
      {
        id: "kt-internet-100",
        speed: "100M",
        name: "슬림",
        description: "1~2인 가구 추천",
        monthlyPrice: 22000,
        mobileDiscount: 3300,
        reward: {
          amount: 90000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-internet-500",
        speed: "500M",
        name: "베이직",
        description: "3~4인 가구 추천",
        monthlyPrice: 33000,
        mobileDiscount: 11000,
        reward: {
          amount: 140000,
          extraBenefit: "추가 혜택",
        },
        recommended: true,
      },
      {
        id: "kt-internet-1g",
        speed: "1G",
        name: "에센스",
        description: "고용량 작업·방송 추천",
        monthlyPrice: 38500,
        mobileDiscount: 11000,
        reward: {
          amount: 140000,
          extraBenefit: "추가 혜택",
        },
      },
    ],

    tvPlans: [
      {
        id: "kt-tv-basic",
        name: "베이직",
        channels: 238,
        description: "경제적인 기본 채널",
        monthlyPrice: 16500,
        recommended: true,
      },
      {
        id: "kt-tv-light",
        name: "라이트",
        channels: 240,
        description: "합리적인 인기 채널",
        monthlyPrice: 17600,
      },
      {
        id: "kt-tv-essence",
        name: "에센스",
        channels: 263,
        description: "프리미엄 최다 채널",
        monthlyPrice: 20900,
      },
      {
        id: "kt-tv-allg",
        name: "모든G",
        channels: 250,
        description: "무료 VOD와 다양한 콘텐츠",
        monthlyPrice: 24200,
      },
      {
        id: "kt-tv-disney-allg",
        name: "디즈니+ 모든G",
        channels: 250,
        description: "모든G와 디즈니+ 함께",
        monthlyPrice: 25900,
      },
    ],

    bundleRules: [
      // 베이직
      {
        id: "kt-100-basic",
        speed: "100M",
        tvPlanId: "kt-tv-basic",
        bundleMonthlyPrice: 38500,
        mobileDiscount: 3300,
        reward: {
          amount: 370000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-500-basic",
        speed: "500M",
        tvPlanId: "kt-tv-basic",
        bundleMonthlyPrice: 44000,
        mobileDiscount: 5500,
        reward: {
          amount: 450000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-1g-basic",
        speed: "1G",
        tvPlanId: "kt-tv-basic",
        bundleMonthlyPrice: 49500,
        mobileDiscount: 5500,
        reward: {
          amount: 450000,
          extraBenefit: "추가 혜택",
        },
      },

      // 라이트
      {
        id: "kt-100-light",
        speed: "100M",
        tvPlanId: "kt-tv-light",
        bundleMonthlyPrice: 39600,
        mobileDiscount: 3300,
        reward: {
          amount: 370000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-500-light",
        speed: "500M",
        tvPlanId: "kt-tv-light",
        bundleMonthlyPrice: 45100,
        mobileDiscount: 5500,
        reward: {
          amount: 450000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-1g-light",
        speed: "1G",
        tvPlanId: "kt-tv-light",
        bundleMonthlyPrice: 50600,
        mobileDiscount: 5500,
        reward: {
          amount: 450000,
          extraBenefit: "추가 혜택",
        },
      },

      // 에센스
      {
        id: "kt-100-essence",
        speed: "100M",
        tvPlanId: "kt-tv-essence",
        bundleMonthlyPrice: 42900,
        mobileDiscount: 3300,
        reward: {
          amount: 370000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-500-essence",
        speed: "500M",
        tvPlanId: "kt-tv-essence",
        bundleMonthlyPrice: 48400,
        mobileDiscount: 5500,
        reward: {
          amount: 450000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-1g-essence",
        speed: "1G",
        tvPlanId: "kt-tv-essence",
        bundleMonthlyPrice: 53900,
        mobileDiscount: 5500,
        reward: {
          amount: 450000,
          extraBenefit: "추가 혜택",
        },
      },

      // 모든G
      {
        id: "kt-100-allg",
        speed: "100M",
        tvPlanId: "kt-tv-allg",
        bundleMonthlyPrice: 46200,
        mobileDiscount: 3300,
        reward: {
          amount: 370000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-500-allg",
        speed: "500M",
        tvPlanId: "kt-tv-allg",
        bundleMonthlyPrice: 51700,
        mobileDiscount: 5500,
        reward: {
          amount: 450000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-1g-allg",
        speed: "1G",
        tvPlanId: "kt-tv-allg",
        bundleMonthlyPrice: 57200,
        mobileDiscount: 5500,
        reward: {
          amount: 450000,
          extraBenefit: "추가 혜택",
        },
      },

      // 디즈니+ 모든G
      {
        id: "kt-100-disney-allg",
        speed: "100M",
        tvPlanId: "kt-tv-disney-allg",
        bundleMonthlyPrice: 46300,
        mobileDiscount: 3300,
        reward: {
          amount: 370000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-500-disney-allg",
        speed: "500M",
        tvPlanId: "kt-tv-disney-allg",
        bundleMonthlyPrice: 51800,
        mobileDiscount: 5500,
        reward: {
          amount: 450000,
          extraBenefit: "추가 혜택",
        },
      },
      {
        id: "kt-1g-disney-allg",
        speed: "1G",
        tvPlanId: "kt-tv-disney-allg",
        bundleMonthlyPrice: 57300,
        mobileDiscount: 5500,
        reward: {
          amount: 450000,
          extraBenefit: "추가 혜택",
        },
      },
    ],
  },

  "LG U+": lgData,

  SK: skData,

  SkyLife: skyLifeData,

  HelloVision: helloVisionData,

  SKB: skbData,
};
export type {
  BundleRule,
  Carrier,
  CarrierData,
  InternetPlan,
  RewardInfo,
  Speed,
  TvPlan,
} from "@/lib/internet/types";

export function getBundleRule(
  carrier: Carrier,
  speed: Speed,
  tvPlanId: string
) {
  return internetData[carrier].bundleRules.find(
    (rule) =>
      rule.speed === speed &&
      rule.tvPlanId === tvPlanId
  );
}