"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getBundleRule,
  internetData,
  type BundleRule,
  type Carrier,
  type CarrierData,
  type InternetPlan,
  type RewardInfo,
  type TvPlan,
} from "@/lib/internet/data";

type CalculatorContextValue = {
  carrier: Carrier;
  carrierData: CarrierData;

  internetPlan: InternetPlan | null;
  tvPlan: TvPlan | null;
  bundleRule: BundleRule | null;

  monthlyBasePrice: number;
  mobileDiscount: number;
  cardDiscount: number;
  appliedMobileDiscount: number;
  appliedCardDiscount: number;
  estimatedMonthlyPrice: number;
  reward: RewardInfo | null;

  useMobileDiscount: boolean;
  useCardDiscount: boolean;

  hasProducts: boolean;

  selectCarrier: (carrier: Carrier) => void;
  selectInternetPlan: (plan: InternetPlan) => void;
  selectTvPlan: (plan: TvPlan) => void;
  clearTvPlan: () => void;

  toggleMobileDiscount: () => void;
  toggleCardDiscount: () => void;
  setUseMobileDiscount: (value: boolean) => void;
  setUseCardDiscount: (value: boolean) => void;
};

const CalculatorContext =
  createContext<CalculatorContextValue | null>(null);

function getDefaultInternetPlan(data: CarrierData) {
  return (
    data.internetPlans.find((plan) => plan.recommended) ??
    data.internetPlans[0] ??
    null
  );
}

function getDefaultTvPlan(data: CarrierData) {
  return (
    data.tvPlans.find((plan) => plan.recommended) ??
    data.tvPlans[0] ??
    null
  );
}

const initialCarrier: Carrier = "KT";

const initialInternetPlan = getDefaultInternetPlan(
  internetData[initialCarrier],
);

const initialTvPlan = getDefaultTvPlan(
  internetData[initialCarrier],
);

export function CalculatorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [carrier, setCarrier] =
    useState<Carrier>(initialCarrier);

  const [internetPlanId, setInternetPlanId] = useState(
    initialInternetPlan?.id ?? "",
  );

  const [tvPlanId, setTvPlanId] = useState<string | null>(
    initialTvPlan?.id ?? null,
  );

  // 할인은 최초 진입 시 모두 적용
  const [useMobileDiscount, setUseMobileDiscount] =
    useState(true);

  const [useCardDiscount, setUseCardDiscount] =
    useState(true);

  const carrierData = internetData[carrier];

  const internetPlan = useMemo<InternetPlan | null>(() => {
    return (
      carrierData.internetPlans.find(
        (plan) => plan.id === internetPlanId,
      ) ?? getDefaultInternetPlan(carrierData)
    );
  }, [carrierData, internetPlanId]);

  const tvPlan = useMemo<TvPlan | null>(() => {
    if (!tvPlanId) {
      return null;
    }

    return (
      carrierData.tvPlans.find(
        (plan) => plan.id === tvPlanId,
      ) ?? null
    );
  }, [carrierData.tvPlans, tvPlanId]);

  const bundleRule = useMemo<BundleRule | null>(() => {
    if (!internetPlan || !tvPlan) {
      return null;
    }

    return (
      getBundleRule(
        carrier,
        internetPlan.speed,
        tvPlan.id,
      ) ?? null
    );
  }, [carrier, internetPlan, tvPlan]);

  const monthlyBasePrice =
    bundleRule?.bundleMonthlyPrice ??
    internetPlan?.monthlyPrice ??
    0;

  // 원래 적용 가능한 할인 금액
  const mobileDiscount =
    bundleRule?.mobileDiscount ??
    internetPlan?.mobileDiscount ??
    0;

  const cardDiscount = carrierData.maxCardDiscount;

  // 사용자가 선택한 실제 적용 할인 금액
  const appliedMobileDiscount = useMobileDiscount
    ? mobileDiscount
    : 0;

  const appliedCardDiscount = useCardDiscount
    ? cardDiscount
    : 0;

  const estimatedMonthlyPrice = Math.max(
    monthlyBasePrice -
      appliedMobileDiscount -
      appliedCardDiscount,
    0,
  );

  const reward =
    bundleRule?.reward ??
    internetPlan?.reward ??
    null;

  function selectCarrier(nextCarrier: Carrier) {
    const nextData = internetData[nextCarrier];

    const nextInternetPlan =
      getDefaultInternetPlan(nextData);

    const nextTvPlan = getDefaultTvPlan(nextData);

    setCarrier(nextCarrier);
    setInternetPlanId(nextInternetPlan?.id ?? "");
    setTvPlanId(nextTvPlan?.id ?? null);

    // 통신사를 변경해도 할인 선택 상태는 유지
  }

  function selectInternetPlan(plan: InternetPlan) {
    setInternetPlanId(plan.id);
  }

  function selectTvPlan(plan: TvPlan) {
    setTvPlanId(plan.id);
  }

  function clearTvPlan() {
    setTvPlanId(null);
  }

  function toggleMobileDiscount() {
    setUseMobileDiscount((current) => !current);
  }

  function toggleCardDiscount() {
    setUseCardDiscount((current) => !current);
  }

  const value = useMemo<CalculatorContextValue>(
    () => ({
      carrier,
      carrierData,

      internetPlan,
      tvPlan,
      bundleRule,

      monthlyBasePrice,
      mobileDiscount,
      cardDiscount,
      appliedMobileDiscount,
      appliedCardDiscount,
      estimatedMonthlyPrice,
      reward,

      useMobileDiscount,
      useCardDiscount,

      hasProducts:
        carrierData.internetPlans.length > 0,

      selectCarrier,
      selectInternetPlan,
      selectTvPlan,
      clearTvPlan,

      toggleMobileDiscount,
      toggleCardDiscount,
      setUseMobileDiscount,
      setUseCardDiscount,
    }),
    [
      carrier,
      carrierData,
      internetPlan,
      tvPlan,
      bundleRule,
      monthlyBasePrice,
      mobileDiscount,
      cardDiscount,
      appliedMobileDiscount,
      appliedCardDiscount,
      estimatedMonthlyPrice,
      reward,
      useMobileDiscount,
      useCardDiscount,
    ],
  );

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);

  if (!context) {
    throw new Error(
      "useCalculator는 CalculatorProvider 내부에서 사용해야 합니다.",
    );
  }

  return context;
}