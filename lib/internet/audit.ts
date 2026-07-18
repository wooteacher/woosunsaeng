import type {
  BundleRule,
  Carrier,
  CarrierData,
  InternetPlan,
  Speed,
} from "@/lib/internet/data";
import {
  internetPriceReference,
  isCoreCarrier,
} from "@/lib/internet/price-reference";

export type PriceAuditSeverity = "error" | "warning";

export type PriceAuditIssue = {
  id: string;
  severity: PriceAuditSeverity;
  title: string;
  description: string;
  targetId?: string;
};

export type PriceAuditResult = {
  carrier: Carrier;
  issues: PriceAuditIssue[];
  errorCount: number;
  warningCount: number;
  referenceVerifiedAt?: string;
  referenceSourceLabel?: string;
};

const SPEEDS: Speed[] = ["100M", "500M", "1G"];
const formatPrice = (price: number) => `${price.toLocaleString("ko-KR")}원`;

function issue(
  severity: PriceAuditSeverity,
  id: string,
  title: string,
  description: string,
  targetId?: string,
): PriceAuditIssue {
  return { severity, id, title, description, targetId };
}

function getInternetPlanBySpeed(
  internetPlans: InternetPlan[],
  speed: Speed,
) {
  return internetPlans.find((plan) => plan.speed === speed);
}

function getBundleRule(
  bundleRules: BundleRule[],
  speed: Speed,
  tvPlanId: string,
) {
  return bundleRules.find(
    (rule) => rule.speed === speed && rule.tvPlanId === tvPlanId,
  );
}

function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[middle - 1] + sorted[middle]) / 2)
    : sorted[middle];
}

function auditReference(data: CarrierData, issues: PriceAuditIssue[]) {
  if (!isCoreCarrier(data.id)) return;

  const reference = internetPriceReference[data.id];

  for (const speed of SPEEDS) {
    const expected = reference.internetPlans[speed];
    const plan = getInternetPlanBySpeed(data.internetPlans, speed);
    if (expected === undefined || !plan) continue;
    if (plan.monthlyPrice !== expected) {
      issues.push(
        issue(
          "error",
          `reference-internet-${speed}`,
          `${speed} 인터넷 기준가 불일치`,
          `현재 ${formatPrice(plan.monthlyPrice)} · 기준 ${formatPrice(expected)}`,
          plan.id,
        ),
      );
    }
  }

  for (const [tvPlanId, expected] of Object.entries(reference.tvPlans)) {
    const plan = data.tvPlans.find((item) => item.id === tvPlanId);
    if (!plan) {
      issues.push(
        issue(
          "error",
          `reference-tv-missing-${tvPlanId}`,
          "기준 TV 상품 누락",
          `${tvPlanId} 상품이 현재 데이터에 없습니다.`,
          tvPlanId,
        ),
      );
      continue;
    }

    if (plan.monthlyPrice !== expected.monthlyPrice) {
      issues.push(
        issue(
          "error",
          `reference-tv-price-${tvPlanId}`,
          `${plan.name} 기준가 불일치`,
          `현재 ${formatPrice(plan.monthlyPrice)} · 기준 ${formatPrice(expected.monthlyPrice)}`,
          tvPlanId,
        ),
      );
    }

    if (expected.channels !== undefined && plan.channels !== expected.channels) {
      issues.push(
        issue(
          "warning",
          `reference-tv-channel-${tvPlanId}`,
          `${plan.name} 채널 수 확인 필요`,
          `현재 ${plan.channels}채널 · 기준 ${expected.channels}채널`,
          tvPlanId,
        ),
      );
    }
  }

  for (const [tvPlanId, prices] of Object.entries(reference.bundlePrices)) {
    for (const speed of SPEEDS) {
      const expected = prices[speed];
      if (expected === undefined) continue;
      const rule = getBundleRule(data.bundleRules, speed, tvPlanId);
      if (!rule) {
        issues.push(
          issue(
            "error",
            `reference-bundle-missing-${speed}-${tvPlanId}`,
            "기준 결합 요금 누락",
            `${speed} + ${tvPlanId} 결합 규칙이 없습니다.`,
            tvPlanId,
          ),
        );
        continue;
      }
      if (rule.bundleMonthlyPrice !== expected) {
        const tvName =
          data.tvPlans.find((plan) => plan.id === tvPlanId)?.name ?? tvPlanId;
        issues.push(
          issue(
            "error",
            `reference-bundle-price-${speed}-${tvPlanId}`,
            `${speed} + ${tvName} 기준가 불일치`,
            `현재 ${formatPrice(rule.bundleMonthlyPrice)} · 기준 ${formatPrice(expected)}`,
            rule.id,
          ),
        );
      }
    }
  }
}

function auditStructure(data: CarrierData, issues: PriceAuditIssue[]) {
  for (const speed of SPEEDS) {
    const plans = data.internetPlans.filter((plan) => plan.speed === speed);
    if (plans.length === 0) {
      issues.push(
        issue(
          "error",
          `missing-internet-${speed}`,
          `${speed} 인터넷 상품 누락`,
          "인터넷 계산기에서 해당 속도를 선택할 수 없습니다.",
        ),
      );
    } else if (plans.length > 1) {
      issues.push(
        issue(
          "warning",
          `duplicate-internet-${speed}`,
          `${speed} 인터넷 상품 중복`,
          `${plans.length}개 상품이 같은 속도로 등록되어 있습니다.`,
        ),
      );
    }
  }

  for (const tvPlan of data.tvPlans) {
    for (const speed of SPEEDS) {
      if (!getBundleRule(data.bundleRules, speed, tvPlan.id)) {
        issues.push(
          issue(
            "error",
            `missing-bundle-${speed}-${tvPlan.id}`,
            `${speed} + ${tvPlan.name} 결합 규칙 누락`,
            "상품은 노출되지만 최종 견적이 인터넷 단독 요금으로 계산될 수 있습니다.",
            tvPlan.id,
          ),
        );
      }
    }
  }

  for (const rule of data.bundleRules) {
    const internetPlan = getInternetPlanBySpeed(data.internetPlans, rule.speed);
    const tvPlan = data.tvPlans.find((plan) => plan.id === rule.tvPlanId);

    if (!internetPlan || !tvPlan) continue;

    if (rule.bundleMonthlyPrice < internetPlan.monthlyPrice) {
      issues.push(
        issue(
          "error",
          `bundle-below-internet-${rule.id}`,
          "결합요금이 인터넷 단독보다 낮음",
          `${rule.speed} + ${tvPlan.name} 결합요금 ${formatPrice(rule.bundleMonthlyPrice)}을 확인하세요.`,
          rule.id,
        ),
      );
    }

    if (rule.mobileDiscount > rule.bundleMonthlyPrice) {
      issues.push(
        issue(
          "error",
          `discount-over-price-${rule.id}`,
          "모바일 할인이 결합요금을 초과",
          `${formatPrice(rule.mobileDiscount)} 할인값을 확인하세요.`,
          rule.id,
        ),
      );
    }
  }
}

function auditInternalConsistency(
  data: CarrierData,
  issues: PriceAuditIssue[],
) {
  for (const speed of SPEEDS) {
    const internetPlan = getInternetPlanBySpeed(data.internetPlans, speed);
    if (!internetPlan) continue;

    const adjustments = data.tvPlans
      .map((tvPlan) => {
        const rule = getBundleRule(data.bundleRules, speed, tvPlan.id);
        if (!rule) return null;
        return {
          tvPlan,
          rule,
          adjustment:
            rule.bundleMonthlyPrice -
            internetPlan.monthlyPrice -
            tvPlan.monthlyPrice,
        };
      })
      .filter((value): value is NonNullable<typeof value> => value !== null);

    if (adjustments.length >= 2) {
      const typicalAdjustment = median(
        adjustments.map((item) => item.adjustment),
      );

      for (const item of adjustments) {
        const difference = Math.abs(item.adjustment - typicalAdjustment);
        if (difference > 500) {
          issues.push(
            issue(
              "warning",
              `bundle-adjustment-${speed}-${item.tvPlan.id}`,
              `${speed} + ${item.tvPlan.name} 요금 구조 이상`,
              `다른 TV 상품과 비교해 결합 조정액이 ${formatPrice(difference)} 차이 납니다. TV 기본료와 결합요금을 함께 확인하세요.`,
              item.rule.id,
            ),
          );
        }
      }
    }

    const discounts = data.tvPlans
      .map((tvPlan) => getBundleRule(data.bundleRules, speed, tvPlan.id))
      .filter((value): value is BundleRule => Boolean(value))
      .map((rule) => rule.mobileDiscount);

    if (discounts.length >= 2) {
      const typicalDiscount = median(discounts);
      data.tvPlans.forEach((tvPlan) => {
        const rule = getBundleRule(data.bundleRules, speed, tvPlan.id);
        if (!rule) return;
        if (Math.abs(rule.mobileDiscount - typicalDiscount) > 500) {
          issues.push(
            issue(
              "warning",
              `mobile-discount-${speed}-${tvPlan.id}`,
              `${speed} 모바일 결합 할인 불일치`,
              `${tvPlan.name} 할인 ${formatPrice(rule.mobileDiscount)} · 일반값 ${formatPrice(typicalDiscount)}`,
              rule.id,
            ),
          );
        }
      });
    }
  }

  const orderedTvPlans = [...data.tvPlans].sort(
    (a, b) => a.monthlyPrice - b.monthlyPrice,
  );

  for (let index = 1; index < orderedTvPlans.length; index += 1) {
    const previous = orderedTvPlans[index - 1];
    const current = orderedTvPlans[index];
    const gap = current.monthlyPrice - previous.monthlyPrice;
    if (gap > 0 && gap < 500) {
      issues.push(
        issue(
          "warning",
          `tiny-tv-gap-${previous.id}-${current.id}`,
          "TV 상품 간 요금 차이가 지나치게 작음",
          `${previous.name}와 ${current.name}의 차이가 ${formatPrice(gap)}뿐입니다.`,
          current.id,
        ),
      );
    }
  }

  for (const tvPlan of data.tvPlans) {
    const prices = SPEEDS.map((speed) =>
      getBundleRule(data.bundleRules, speed, tvPlan.id),
    ).filter((value): value is BundleRule => Boolean(value));

    for (let index = 1; index < prices.length; index += 1) {
      if (prices[index].bundleMonthlyPrice < prices[index - 1].bundleMonthlyPrice) {
        issues.push(
          issue(
            "error",
            `bundle-speed-order-${tvPlan.id}-${prices[index].speed}`,
            `${tvPlan.name} 속도별 요금 역전`,
            "상위 속도의 월요금이 하위 속도보다 낮습니다.",
            prices[index].id,
          ),
        );
      }
    }
  }
}

export function auditCarrierPricing(data: CarrierData): PriceAuditResult {
  const issues: PriceAuditIssue[] = [];

  auditStructure(data, issues);
  auditInternalConsistency(data, issues);
  auditReference(data, issues);

  const uniqueIssues = Array.from(
    new Map(issues.map((item) => [item.id, item])).values(),
  );

  const reference = isCoreCarrier(data.id)
    ? internetPriceReference[data.id]
    : undefined;

  return {
    carrier: data.id,
    issues: uniqueIssues,
    errorCount: uniqueIssues.filter((item) => item.severity === "error").length,
    warningCount: uniqueIssues.filter((item) => item.severity === "warning").length,
    referenceVerifiedAt: reference?.verifiedAt,
    referenceSourceLabel: reference?.sourceLabel,
  };
}

export function buildCarrierDataForAudit(input: {
  carrier: {
    id: Carrier;
    label: string;
    logo?: string;
    maxCardDiscount?: number;
    priceVerifiedAt?: string | null;
    pricingBasis?: string | null;
    equipmentNote?: string | null;
  };
  internetPlans: Array<{
    id: string;
    speed: string;
    name: string;
    description?: string | null;
    monthlyPrice: number;
    mobileDiscount: number;
    rewardAmount?: number;
    rewardExtraBenefit?: string | null;
    recommended?: boolean;
  }>;
  tvPlans: Array<{
    id: string;
    name: string;
    channels: number;
    description?: string | null;
    monthlyPrice: number;
    recommended?: boolean;
  }>;
  bundleRules: Array<{
    id: string;
    speed: string;
    tvPlanId: string;
    bundleMonthlyPrice: number;
    mobileDiscount: number;
    rewardAmount?: number;
    rewardExtraBenefit?: string | null;
  }>;
}): CarrierData {
  const validSpeeds = new Set<string>(SPEEDS);

  return {
    id: input.carrier.id,
    label: input.carrier.label,
    logo: input.carrier.logo ?? "",
    maxCardDiscount: input.carrier.maxCardDiscount ?? 0,
    priceVerifiedAt: input.carrier.priceVerifiedAt ?? "미입력",
    pricingBasis: input.carrier.pricingBasis ?? "",
    equipmentNote: input.carrier.equipmentNote ?? "",
    internetPlans: input.internetPlans
      .filter((plan) => validSpeeds.has(plan.speed))
      .map((plan) => ({
        id: plan.id,
        speed: plan.speed as Speed,
        name: plan.name,
        description: plan.description ?? "",
        monthlyPrice: plan.monthlyPrice,
        mobileDiscount: plan.mobileDiscount,
        reward: {
          amount: plan.rewardAmount ?? 0,
          extraBenefit:
            plan.rewardExtraBenefit ?? "추가 혜택은 상담 시 안내",
        },
        recommended: plan.recommended ?? false,
      })),
    tvPlans: input.tvPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      channels: plan.channels,
      description: plan.description ?? "",
      monthlyPrice: plan.monthlyPrice,
      recommended: plan.recommended ?? false,
    })),
    bundleRules: input.bundleRules
      .filter((rule) => validSpeeds.has(rule.speed))
      .map((rule) => ({
        id: rule.id,
        speed: rule.speed as Speed,
        tvPlanId: rule.tvPlanId,
        bundleMonthlyPrice: rule.bundleMonthlyPrice,
        mobileDiscount: rule.mobileDiscount,
        reward: {
          amount: rule.rewardAmount ?? 0,
          extraBenefit:
            rule.rewardExtraBenefit ?? "추가 혜택은 상담 시 안내",
        },
      })),
  };
}

export function getReferenceBundlePrice(
  carrier: Carrier,
  speed: Speed,
  tvPlanId: string,
) {
  if (!isCoreCarrier(carrier)) return undefined;
  return internetPriceReference[carrier].bundlePrices[tvPlanId]?.[speed];
}

export function getReferenceTvPlan(
  carrier: Carrier,
  tvPlanId: string,
) {
  if (!isCoreCarrier(carrier)) return undefined;
  return internetPriceReference[carrier].tvPlans[tvPlanId];
}
