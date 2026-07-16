"use client";

type ReceiptCodeInput = {
  carrier: string;
  speed?: string;
  tvIndex: number;
  useMobileDiscount: boolean;
  useCardDiscount: boolean;
};

const carrierCodes: Record<string, string> = {
  KT: "A", LG: "B", "LG U+": "B", SK: "C", SKB: "D",
  SkyLife: "E", SKY: "E", HelloVision: "F", "Hello Vision": "F",
};

const speedCodes: Record<string, string> = {
  "100M": "1", "500M": "5", "1G": "9",
};

export function createReceiptCode({
  carrier,
  speed,
  tvIndex,
  useMobileDiscount,
  useCardDiscount,
}: ReceiptCodeInput) {
  const carrierCode = carrierCodes[carrier] ?? "Z";
  const speedCode = speedCodes[speed ?? ""] ?? "0";
  const tvCode = String(Math.max(tvIndex, 0)).padStart(2, "0");

  const discountCode =
    useMobileDiscount && useCardDiscount
      ? "3"
      : useMobileDiscount
        ? "1"
        : useCardDiscount
          ? "2"
          : "0";

  return `${carrierCode}${speedCode}${tvCode}${discountCode}`;
}
