import type { CarrierData } from "@/lib/internet/types";

export const skyLifeData: CarrierData = {
  id: "SkyLife",
  label: "스카이라이프",
  logo: "/carriers/skylife.png",

  maxCardDiscount: 13000,

  internetPlans: [
    {
      id: "skylife-internet-100",
      speed: "100M",
      name: "100M 인터넷",
      description: "웹서핑과 영상 시청",
      monthlyPrice: 23100,
      mobileDiscount: 0,
      reward: {
        amount: 100000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "skylife-internet-500",
      speed: "500M",
      name: "기가 500M",
      description: "게임과 여러 기기 사용",
      monthlyPrice: 29700,
      mobileDiscount: 0,
      reward: {
        amount: 140000,
        extraBenefit: "추가 혜택",
      },
      recommended: true,
    },
    {
      id: "skylife-internet-1g",
      speed: "1G",
      name: "기가 1G",
      description: "고용량 작업과 방송",
      monthlyPrice: 35200,
      mobileDiscount: 0,
      reward: {
        amount: 150000,
        extraBenefit: "추가 혜택",
      },
    },
  ],

  tvPlans: [
    {
      id: "skylife-tv-basic",
      name: "ipit TV Basic",
      channels: 194,
      description: "경제적인 기본 채널",
      monthlyPrice: 12650,
      recommended: true,
    },
    {
      id: "skylife-tv-plus",
      name: "ipit TV Plus",
      channels: 206,
      description: "고화질 인기 채널",
      monthlyPrice: 13750,
    },
  ],

  bundleRules: [
    // ipit TV Basic
    {
      id: "skylife-100-basic",
      speed: "100M",
      tvPlanId: "skylife-tv-basic",
      bundleMonthlyPrice: 31900,
      mobileDiscount: 0,
      reward: {
        amount: 350000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "skylife-500-basic",
      speed: "500M",
      tvPlanId: "skylife-tv-basic",
      bundleMonthlyPrice: 37400,
      mobileDiscount: 0,
      reward: {
        amount: 420000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "skylife-1g-basic",
      speed: "1G",
      tvPlanId: "skylife-tv-basic",
      bundleMonthlyPrice: 42900,
      mobileDiscount: 0,
      reward: {
        amount: 480000,
        extraBenefit: "추가 혜택",
      },
    },

    // ipit TV Plus
    {
      id: "skylife-100-plus",
      speed: "100M",
      tvPlanId: "skylife-tv-plus",
      bundleMonthlyPrice: 33000,
      mobileDiscount: 0,
      reward: {
        amount: 350000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "skylife-500-plus",
      speed: "500M",
      tvPlanId: "skylife-tv-plus",
      bundleMonthlyPrice: 38500,
      mobileDiscount: 0,
      reward: {
        amount: 420000,
        extraBenefit: "추가 혜택",
      },
    },
    {
      id: "skylife-1g-plus",
      speed: "1G",
      tvPlanId: "skylife-tv-plus",
      bundleMonthlyPrice: 44000,
      mobileDiscount: 0,
      reward: {
        amount: 480000,
        extraBenefit: "추가 혜택",
      },
    },
  ],
};