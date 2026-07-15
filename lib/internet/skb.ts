import type { CarrierData } from "@/lib/internet/types";

export const skbData: CarrierData = {
  id: "SKB",
  label: "SKB 알뜰",
  logo: "/carriers/skb.png",

  maxCardDiscount: 10000,

  internetPlans: [
    {
      id: "skb-internet-100",
      speed: "100M",
      name: "광랜",
      description: "웹서핑과 영상 시청",
      monthlyPrice: 19800,
      mobileDiscount: 2200,
      reward: {
        amount: 0,
        extraBenefit: "상담 시 확인",
      },
    },
    {
      id: "skb-internet-500",
      speed: "500M",
      name: "기가라이트",
      description: "게임과 여러 기기 사용",
      monthlyPrice: 27500,
      mobileDiscount: 5500,
      reward: {
        amount: 0,
        extraBenefit: "상담 시 확인",
      },
      recommended: true,
    },
    {
      id: "skb-internet-1g",
      speed: "1G",
      name: "기가인터넷",
      description: "고용량 작업과 방송",
      monthlyPrice: 33000,
      mobileDiscount: 5500,
      reward: {
        amount: 0,
        extraBenefit: "상담 시 확인",
      },
    },
  ],

  tvPlans: [
    {
      id: "skb-tv-pop180",
      name: "Btv pop180",
      channels: 186,
      description: "인기 채널 중심",
      monthlyPrice: 12100,
    },
    {
      id: "skb-tv-pop230",
      name: "Btv pop230",
      channels: 231,
      description: "다양한 전 채널",
      monthlyPrice: 9900,
      recommended: true,
    },
  ],

  bundleRules: [
    // Btv pop180
    {
      id: "skb-100-pop180",
      speed: "100M",
      tvPlanId: "skb-tv-pop180",
      bundleMonthlyPrice: 35200,
      mobileDiscount: 2200,
      reward: {
        amount: 310000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "skb-500-pop180",
      speed: "500M",
      tvPlanId: "skb-tv-pop180",
      bundleMonthlyPrice: 45100,
      mobileDiscount: 5500,
      reward: {
        amount: 350000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "skb-1g-pop180",
      speed: "1G",
      tvPlanId: "skb-tv-pop180",
      bundleMonthlyPrice: 50600,
      mobileDiscount: 5500,
      reward: {
        amount: 350000,
        extraBenefit: "추가 혜택",
      },
    },

    // Btv pop230
    {
      id: "skb-100-pop230",
      speed: "100M",
      tvPlanId: "skb-tv-pop230",
      bundleMonthlyPrice: 36300,
      mobileDiscount: 2200,
      reward: {
        amount: 310000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "skb-500-pop230",
      speed: "500M",
      tvPlanId: "skb-tv-pop230",
      bundleMonthlyPrice: 46200,
      mobileDiscount: 5500,
      reward: {
        amount: 350000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "skb-1g-pop230",
      speed: "1G",
      tvPlanId: "skb-tv-pop230",
      bundleMonthlyPrice: 51700,
      mobileDiscount: 5500,
      reward: {
        amount: 350000,
        extraBenefit: "추가 혜택",
      },
    },
  ],
};