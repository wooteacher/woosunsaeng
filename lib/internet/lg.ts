import type { CarrierData } from "@/lib/internet/types";

export const lgData: CarrierData = {
  id: "LG U+",
  label: "LG U+",
  logo: "/carriers/lg.png",

  // 월 기본요금 - 휴대폰 결합 후 요금 - 카드 혜택가 기준
  maxCardDiscount: 18000,

  internetPlans: [
    {
      id: "lg-internet-100",
      speed: "100M",
      name: "광랜",
      description: "웹서핑과 영상 시청",
      monthlyPrice: 22000,
      mobileDiscount: 5500,
      reward: {
        amount: 200000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "lg-internet-500",
      speed: "500M",
      name: "기가슬림",
      description: "게임과 여러 기기 사용",
      monthlyPrice: 33000,
      mobileDiscount: 9900,
      reward: {
        amount: 230000,
        extraBenefit: "추가 혜택",
      },
      recommended: true,
    },
    {
      id: "lg-internet-1g",
      speed: "1G",
      name: "기가인터넷",
      description: "고용량 작업과 방송",
      monthlyPrice: 38500,
      mobileDiscount: 13200,
      reward: {
        amount: 230000,
        extraBenefit: "추가 혜택",
      },
    },
  ],

  tvPlans: [
    {
      id: "lg-tv-practical",
      name: "실속형",
      channels: 219,
      description: "필수 채널 중심",
      monthlyPrice: 17600,
    },
    {
      id: "lg-tv-basic",
      name: "기본형",
      channels: 225,
      description: "인기 채널 구성",
      monthlyPrice: 18700,
      recommended: true,
    },
    {
      id: "lg-tv-premium",
      name: "프리미엄",
      channels: 253,
      description: "영화와 스포츠 채널",
      monthlyPrice: 20900,
    },
    {
      id: "lg-tv-prime-vod",
      name: "프라임 VOD",
      channels: 258,
      description: "프리미엄 채널과 VOD",
      monthlyPrice: 23100,
    },
  ],

  bundleRules: [
    // 실속형
    {
      id: "lg-100-practical",
      speed: "100M",
      tvPlanId: "lg-tv-practical",
      bundleMonthlyPrice: 39600,
      mobileDiscount: 5500,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "lg-500-practical",
      speed: "500M",
      tvPlanId: "lg-tv-practical",
      bundleMonthlyPrice: 45100,
      mobileDiscount: 9900,
      reward: {
        amount: 470000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "lg-1g-practical",
      speed: "1G",
      tvPlanId: "lg-tv-practical",
      bundleMonthlyPrice: 50600,
      mobileDiscount: 13200,
      reward: {
        amount: 470000,
        extraBenefit: "추가 혜택",
      },
    },

    // 기본형
    {
      id: "lg-100-basic",
      speed: "100M",
      tvPlanId: "lg-tv-basic",
      bundleMonthlyPrice: 40700,
      mobileDiscount: 5500,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "lg-500-basic",
      speed: "500M",
      tvPlanId: "lg-tv-basic",
      bundleMonthlyPrice: 46200,
      mobileDiscount: 9900,
      reward: {
        amount: 470000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "lg-1g-basic",
      speed: "1G",
      tvPlanId: "lg-tv-basic",
      bundleMonthlyPrice: 51700,
      mobileDiscount: 13200,
      reward: {
        amount: 470000,
        extraBenefit: "추가 혜택",
      },
    },

    // 프리미엄
    {
      id: "lg-100-premium",
      speed: "100M",
      tvPlanId: "lg-tv-premium",
      bundleMonthlyPrice: 42900,
      mobileDiscount: 5500,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "lg-500-premium",
      speed: "500M",
      tvPlanId: "lg-tv-premium",
      bundleMonthlyPrice: 48400,
      mobileDiscount: 9900,
      reward: {
        amount: 470000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "lg-1g-premium",
      speed: "1G",
      tvPlanId: "lg-tv-premium",
      bundleMonthlyPrice: 53900,
      mobileDiscount: 13200,
      reward: {
        amount: 470000,
        extraBenefit: "추가 혜택",
      },
    },

    // 프라임 VOD
    {
      id: "lg-100-prime-vod",
      speed: "100M",
      tvPlanId: "lg-tv-prime-vod",
      bundleMonthlyPrice: 45100,
      mobileDiscount: 5500,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "lg-500-prime-vod",
      speed: "500M",
      tvPlanId: "lg-tv-prime-vod",
      bundleMonthlyPrice: 50600,
      mobileDiscount: 9900,
      reward: {
        amount: 470000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "lg-1g-prime-vod",
      speed: "1G",
      tvPlanId: "lg-tv-prime-vod",
      bundleMonthlyPrice: 56100,
      mobileDiscount: 13200,
      reward: {
        amount: 470000,
        extraBenefit: "추가 혜택",
      },
    },
  ],
};