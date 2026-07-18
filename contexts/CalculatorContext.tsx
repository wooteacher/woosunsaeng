"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  type BundleRule,
  type Carrier,
  type CarrierData,
  type InternetPlan,
  type RewardInfo,
  type TvPlan,
} from "@/lib/internet/data";
import {
  getLocalInternetCatalog,
  type InternetCatalog,
} from "@/lib/internet/catalog";

type CalculatorContextValue = {
  carrier: Carrier;
  carrierData: CarrierData;
  carrierOrder: Carrier[];
  internetData: Partial<Record<Carrier, CarrierData>>;
  catalogSource: InternetCatalog["source"];

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

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

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

function getFirstCarrier(catalog: InternetCatalog): Carrier {
  const firstCarrier = catalog.carrierOrder.find(
    (carrier) => catalog.internetData[carrier],
  );

  return firstCarrier ?? "KT";
}

export function CalculatorProvider({
  children,
  initialCatalog,
}: {
  children: ReactNode;
  initialCatalog?: InternetCatalog;
}) {
  const catalog = initialCatalog ?? getLocalInternetCatalog();
  const initialCarrier = getFirstCarrier(catalog);
  const initialCarrierData =
    catalog.internetData[initialCarrier] ?? getLocalInternetCatalog().internetData.KT!;
  const initialInternetPlan = getDefaultInternetPlan(initialCarrierData);
  const initialTvPlan = getDefaultTvPlan(initialCarrierData);

  const [carrier, setCarrier] = useState<Carrier>(initialCarrier);
  const [internetPlanId, setInternetPlanId] = useState(
    initialInternetPlan?.id ?? "",
  );
  const [tvPlanId, setTvPlanId] = useState<string | null>(
    initialTvPlan?.id ?? null,
  );
  const [useMobileDiscount, setUseMobileDiscount] = useState(true);
  const [useCardDiscount, setUseCardDiscount] = useState(true);

  const fallbackCarrier = getFirstCarrier(catalog);
  const carrierData =
    catalog.internetData[carrier] ??
    catalog.internetData[fallbackCarrier] ??
    getLocalInternetCatalog().internetData.KT!;

  const internetPlan = useMemo<InternetPlan | null>(() => {
    return (
      carrierData.internetPlans.find((plan) => plan.id === internetPlanId) ??
      getDefaultInternetPlan(carrierData)
    );
  }, [carrierData, internetPlanId]);

  const tvPlan = useMemo<TvPlan | null>(() => {
    if (!tvPlanId) return null;
    return carrierData.tvPlans.find((plan) => plan.id === tvPlanId) ?? null;
  }, [carrierData.tvPlans, tvPlanId]);

  const bundleRule = useMemo<BundleRule | null>(() => {
    if (!internetPlan || !tvPlan) return null;

    return (
      carrierData.bundleRules.find(
        (rule) =>
          rule.speed === internetPlan.speed && rule.tvPlanId === tvPlan.id,
      ) ?? null
    );
  }, [carrierData.bundleRules, internetPlan, tvPlan]);

  const monthlyBasePrice =
    bundleRule?.bundleMonthlyPrice ?? internetPlan?.monthlyPrice ?? 0;
  const mobileDiscount =
    bundleRule?.mobileDiscount ?? internetPlan?.mobileDiscount ?? 0;
  const cardDiscount = carrierData.maxCardDiscount;
  const appliedMobileDiscount = useMobileDiscount ? mobileDiscount : 0;
  const appliedCardDiscount = useCardDiscount ? cardDiscount : 0;
  const estimatedMonthlyPrice = Math.max(
    monthlyBasePrice - appliedMobileDiscount - appliedCardDiscount,
    0,
  );
  const reward = bundleRule?.reward ?? internetPlan?.reward ?? null;

  function selectCarrier(nextCarrier: Carrier) {
    const nextData = catalog.internetData[nextCarrier];
    if (!nextData) return;

    const nextInternetPlan = getDefaultInternetPlan(nextData);
    const nextTvPlan = getDefaultTvPlan(nextData);

    setCarrier(nextCarrier);
    setInternetPlanId(nextInternetPlan?.id ?? "");
    setTvPlanId(nextTvPlan?.id ?? null);
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

  const value: CalculatorContextValue = {
    carrier,
    carrierData,
    carrierOrder: catalog.carrierOrder,
    internetData: catalog.internetData,
    catalogSource: catalog.source,
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
    hasProducts: carrierData.internetPlans.length > 0,
    selectCarrier,
    selectInternetPlan,
    selectTvPlan,
    clearTvPlan,
    toggleMobileDiscount,
    toggleCardDiscount,
    setUseMobileDiscount,
    setUseCardDiscount,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);

  if (!context) {
    throw new Error("useCalculator는 CalculatorProvider 내부에서 사용해야 합니다.");
  }

  return context;
}
