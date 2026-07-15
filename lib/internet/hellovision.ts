import type { CarrierData } from "@/lib/internet/types";

export const helloVisionData: CarrierData = {
  id: "HelloVision",
  label: "LG 헬로비전",
  logo: "/carriers/hellovision.png",

  maxCardDiscount: 12000,

  internetPlans: [
    {
      id: "hellovision-internet-100",
      speed: "100M",
      name: "광랜라이트",
      description: "웹서핑과 영상 시청",
      monthlyPrice: 21890,
      mobileDiscount: 5090,
      reward: {
        amount: 130000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "hellovision-internet-500",
      speed: "500M",
      name: "기가라이트",
      description: "게임과 여러 기기 사용",
      monthlyPrice: 31460,
      mobileDiscount: 5860,
      reward: {
        amount: 180000,
        extraBenefit: "추가 혜택",
      },
      recommended: true,
    },
    {
      id: "hellovision-internet-1g",
      speed: "1G",
      name: "플래티넘기가",
      description: "고용량 작업과 방송",
      monthlyPrice: 33000,
      mobileDiscount: 6160,
      reward: {
        amount: 200000,
        extraBenefit: "추가 혜택",
      },
    },
  ],

  tvPlans: [
    {
      id: "hellovision-tv-plus",
      name: "헬로tv 플러스",
      channels: 102,
      description: "알뜰한 기본 채널",
      monthlyPrice: 7700,
    },
    {
      id: "hellovision-tv-economy",
      name: "UHD 이코노미",
      channels: 109,
      description: "필수 채널 중심",
      monthlyPrice: 13200,
    },
    {
      id: "hellovision-tv-new-basic",
      name: "UHD 뉴베이직",
      channels: 245,
      description: "기본과 스포츠 채널",
      monthlyPrice: 15400,
      recommended: true,
    },
    {
      id: "hellovision-tv-new-premium",
      name: "UHD 뉴프리미엄",
      channels: 245,
      description: "프리미엄 채널 구성",
      monthlyPrice: 17600,
    },
  ],

  bundleRules: [
    // 헬로tv 플러스
    {
      id: "hellovision-100-plus",
      speed: "100M",
      tvPlanId: "hellovision-tv-plus",
      bundleMonthlyPrice: 25130,
      mobileDiscount: 2537,
      reward: {
        amount: 230000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "hellovision-500-plus",
      speed: "500M",
      tvPlanId: "hellovision-tv-plus",
      bundleMonthlyPrice: 32890,
      mobileDiscount: 2922,
      reward: {
        amount: 310000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "hellovision-1g-plus",
      speed: "1G",
      tvPlanId: "hellovision-tv-plus",
      bundleMonthlyPrice: 34100,
      mobileDiscount: 6160,
      reward: {
        amount: 340000,
        extraBenefit: "추가 혜택",
      },
    },

    // UHD 이코노미
    {
      id: "hellovision-100-economy",
      speed: "100M",
      tvPlanId: "hellovision-tv-economy",
      bundleMonthlyPrice: 32830,
      mobileDiscount: 2537,
      reward: {
        amount: 300000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "hellovision-500-economy",
      speed: "500M",
      tvPlanId: "hellovision-tv-economy",
      bundleMonthlyPrice: 40590,
      mobileDiscount: 2922,
      reward: {
        amount: 350000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "hellovision-1g-economy",
      speed: "1G",
      tvPlanId: "hellovision-tv-economy",
      bundleMonthlyPrice: 41800,
      mobileDiscount: 6160,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },

    // UHD 뉴베이직
    {
      id: "hellovision-100-new-basic",
      speed: "100M",
      tvPlanId: "hellovision-tv-new-basic",
      bundleMonthlyPrice: 35030,
      mobileDiscount: 2537,
      reward: {
        amount: 300000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "hellovision-500-new-basic",
      speed: "500M",
      tvPlanId: "hellovision-tv-new-basic",
      bundleMonthlyPrice: 42790,
      mobileDiscount: 2922,
      reward: {
        amount: 350000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "hellovision-1g-new-basic",
      speed: "1G",
      tvPlanId: "hellovision-tv-new-basic",
      bundleMonthlyPrice: 44000,
      mobileDiscount: 6160,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },

    // UHD 뉴프리미엄
    {
      id: "hellovision-100-new-premium",
      speed: "100M",
      tvPlanId: "hellovision-tv-new-premium",
      bundleMonthlyPrice: 37230,
      mobileDiscount: 2537,
      reward: {
        amount: 300000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "hellovision-500-new-premium",
      speed: "500M",
      tvPlanId: "hellovision-tv-new-premium",
      bundleMonthlyPrice: 44990,
      mobileDiscount: 2922,
      reward: {
        amount: 350000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "hellovision-1g-new-premium",
      speed: "1G",
      tvPlanId: "hellovision-tv-new-premium",
      bundleMonthlyPrice: 46200,
      mobileDiscount: 6160,
      reward: {
        amount: 400000,
        extraBenefit: "추가 혜택",
      },
    },
  ],
};