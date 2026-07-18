import type { Carrier, Speed } from "@/lib/internet/data";

export type CoreCarrier = Extract<Carrier, "KT" | "LG U+" | "SK">;

export type PriceReference = {
  verifiedAt: string;
  sourceLabel: string;
  internetPlans: Partial<Record<Speed, number>>;
  tvPlans: Record<string, { monthlyPrice: number; channels?: number }>;
  bundlePrices: Record<string, Partial<Record<Speed, number>>>;
};

export const internetPriceReference: Record<CoreCarrier, PriceReference> = {
  KT: {
    verifiedAt: "2026.07.18",
    sourceLabel: "KT 공식 요금표 · 우선생 운영 기준",
    internetPlans: {
      "100M": 22000,
      "500M": 33000,
      "1G": 38500,
    },
    tvPlans: {
      "kt-tv-basic": { monthlyPrice: 16500, channels: 238 },
      "kt-tv-light": { monthlyPrice: 17600, channels: 240 },
      "kt-tv-essence": { monthlyPrice: 20900, channels: 263 },
      "kt-tv-allg": { monthlyPrice: 24200, channels: 250 },
      "kt-tv-disney-allg": { monthlyPrice: 25900, channels: 250 },
    },
    bundlePrices: {
      "kt-tv-basic": { "100M": 38500, "500M": 44000, "1G": 49500 },
      "kt-tv-light": { "100M": 39600, "500M": 45100, "1G": 50600 },
      "kt-tv-essence": { "100M": 42900, "500M": 48400, "1G": 53900 },
      "kt-tv-allg": { "100M": 46200, "500M": 51700, "1G": 57200 },
      "kt-tv-disney-allg": {
        "100M": 47900,
        "500M": 53400,
        "1G": 58900,
      },
    },
  },
  "LG U+": {
    verifiedAt: "2026.07.18",
    sourceLabel: "LG U+ 공식 요금표 · 아정당 비교표",
    internetPlans: {
      "100M": 22000,
      "500M": 33000,
      "1G": 38500,
    },
    tvPlans: {
      "lg-tv-value": { monthlyPrice: 17600, channels: 217 },
      "lg-tv-basic": { monthlyPrice: 18700, channels: 223 },
      "lg-tv-premium": { monthlyPrice: 20900, channels: 252 },
      "lg-tv-disney": { monthlyPrice: 29000, channels: 257 },
      "lg-tv-netflix": { monthlyPrice: 32200, channels: 257 },
    },
    bundlePrices: {
      "lg-tv-value": { "100M": 39600, "500M": 45100, "1G": 50600 },
      "lg-tv-basic": { "100M": 40700, "500M": 46200, "1G": 51700 },
      "lg-tv-premium": { "100M": 42900, "500M": 48400, "1G": 53900 },
      "lg-tv-disney": { "100M": 51000, "500M": 56500, "1G": 62000 },
      "lg-tv-netflix": { "100M": 54200, "500M": 59700, "1G": 65200 },
    },
  },
  SK: {
    verifiedAt: "2026.07.18",
    sourceLabel: "B world 공식 요금표 · 아정당 비교표",
    internetPlans: {
      "100M": 22000,
      "500M": 33000,
      "1G": 38500,
    },
    tvPlans: {
      "sk-tv-economy": { monthlyPrice: 14300, channels: 182 },
      "sk-tv-standard": { monthlyPrice: 17600, channels: 235 },
      "sk-tv-all": { monthlyPrice: 20900, channels: 255 },
      "sk-tv-all-netflix": { monthlyPrice: 32400, channels: 255 },
    },
    bundlePrices: {
      "sk-tv-economy": { "100M": 34100, "500M": 41800, "1G": 47300 },
      "sk-tv-standard": { "100M": 37400, "500M": 45100, "1G": 50600 },
      "sk-tv-all": { "100M": 40700, "500M": 48400, "1G": 53900 },
      "sk-tv-all-netflix": {
        "100M": 52200,
        "500M": 59900,
        "1G": 65400,
      },
    },
  },
};

export function isCoreCarrier(carrier: Carrier): carrier is CoreCarrier {
  return carrier === "KT" || carrier === "LG U+" || carrier === "SK";
}
