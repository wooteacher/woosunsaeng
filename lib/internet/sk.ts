import type { CarrierData } from "@/lib/internet/types";

export const skData: CarrierData = {
  id: "SK",
  label: "SK",
  logo: "/carriers/sk.png",

  maxCardDiscount: 18000,

  internetPlans: [
    {
      id: "sk-internet-100",
      speed: "100M",
      name: "광랜",
      description: "웹서핑과 영상 시청",
      monthlyPrice: 22000,
      mobileDiscount: 4400,
      reward: {
        amount: 110000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "sk-internet-500",
      speed: "500M",
      name: "기가라이트",
      description: "게임과 여러 기기 사용",
      monthlyPrice: 33000,
      mobileDiscount: 11000,
      reward: {
        amount: 170000,
        extraBenefit: "추가 혜택",
      },
      recommended: true,
    },
    {
      id: "sk-internet-1g",
      speed: "1G",
      name: "기가인터넷",
      description: "고용량 작업과 방송",
      monthlyPrice: 38500,
      mobileDiscount: 13200,
      reward: {
        amount: 170000,
        extraBenefit: "추가 혜택",
      },
    },
  ],

  tvPlans: [
    {
      id: "sk-tv-economy",
      name: "이코노미",
      channels: 182,
      description: "경제적인 기본 채널",
      monthlyPrice: 14300,
    },
    {
      id: "sk-tv-standard",
      name: "스탠다드",
      channels: 235,
      description: "합리적인 인기 채널",
      monthlyPrice: 17600,
      recommended: true,
    },
    {
      id: "sk-tv-all",
      name: "올",
      channels: 255,
      description: "프리미엄 채널 구성",
      monthlyPrice: 20900,
    },
    {
      id: "sk-tv-all-netflix",
      name: "올 넷플릭스",
      channels: 255,
      description: "모든 채널과 넷플릭스",
      monthlyPrice: 32400,
    },
  ],

  bundleRules: [
    // 이코노미
    {
      id: "sk-100-economy",
      speed: "100M",
      tvPlanId: "sk-tv-economy",
      bundleMonthlyPrice: 34100,
      mobileDiscount: 3300,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "sk-500-economy",
      speed: "500M",
      tvPlanId: "sk-tv-economy",
      bundleMonthlyPrice: 41800,
      mobileDiscount: 6600,
      reward: {
        amount: 430000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "sk-1g-economy",
      speed: "1G",
      tvPlanId: "sk-tv-economy",
      bundleMonthlyPrice: 47300,
      mobileDiscount: 8800,
      reward: {
        amount: 520000,
        extraBenefit: "추가 혜택",
      },
    },

    // 스탠다드
    {
      id: "sk-100-standard",
      speed: "100M",
      tvPlanId: "sk-tv-standard",
      bundleMonthlyPrice: 37400,
      mobileDiscount: 3300,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "sk-500-standard",
      speed: "500M",
      tvPlanId: "sk-tv-standard",
      bundleMonthlyPrice: 45100,
      mobileDiscount: 6600,
      reward: {
        amount: 430000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "sk-1g-standard",
      speed: "1G",
      tvPlanId: "sk-tv-standard",
      bundleMonthlyPrice: 50600,
      mobileDiscount: 8800,
      reward: {
        amount: 520000,
        extraBenefit: "추가 혜택",
      },
    },

    // 올
    {
      id: "sk-100-all",
      speed: "100M",
      tvPlanId: "sk-tv-all",
      bundleMonthlyPrice: 40700,
      mobileDiscount: 3300,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "sk-500-all",
      speed: "500M",
      tvPlanId: "sk-tv-all",
      bundleMonthlyPrice: 48400,
      mobileDiscount: 6600,
      reward: {
        amount: 430000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "sk-1g-all",
      speed: "1G",
      tvPlanId: "sk-tv-all",
      bundleMonthlyPrice: 53900,
      mobileDiscount: 8800,
      reward: {
        amount: 520000,
        extraBenefit: "추가 혜택",
      },
    },

    // 올 넷플릭스
    {
      id: "sk-100-all-netflix",
      speed: "100M",
      tvPlanId: "sk-tv-all-netflix",
      bundleMonthlyPrice: 52200,
      mobileDiscount: 3300,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "sk-500-all-netflix",
      speed: "500M",
      tvPlanId: "sk-tv-all-netflix",
      bundleMonthlyPrice: 59900,
      mobileDiscount: 6600,
      reward: {
        amount: 430000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "sk-1g-all-netflix",
      speed: "1G",
      tvPlanId: "sk-tv-all-netflix",
      bundleMonthlyPrice: 65400,
      mobileDiscount: 8800,
      reward: {
        amount: 520000,
        extraBenefit: "추가 혜택",
      },
    },
  ],
};