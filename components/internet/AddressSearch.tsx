"use client";

import Script from "next/script";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";

export type DaumAddressResult = {
  zonecode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumAddressResult) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

type AddressSearchProps = {
  postcode?: string;
  address?: string;
  detailAddress?: string;
  disabled?: boolean;
  onPostcodeChange?: (value: string) => void;
  onAddressChange?: (value: string) => void;
  onDetailAddressChange?: (value: string) => void;
  onComplete?: (result: {
    postcode: string;
    address: string;
    raw: DaumAddressResult;
  }) => void;
  className?: string;
  [key: string]: unknown;
};

const inputClass =
  "h-[54px] w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 text-[15px] font-semibold tracking-[-0.02em] text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60";

export default function AddressSearch({
  postcode = "",
  address = "",
  detailAddress = "",
  disabled = false,
  onPostcodeChange,
  onAddressChange,
  onDetailAddressChange,
  onComplete,
  className = "",
}: AddressSearchProps) {
  const [errorMessage, setErrorMessage] = useState("");

  function openPostcodeSearch() {
    if (disabled) return;

    if (!window.daum?.Postcode) {
      setErrorMessage(
        "주소 검색을 불러오는 중입니다. 잠시 후 다시 눌러주세요.",
      );
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        const baseAddress =
          data.roadAddress || data.address || data.jibunAddress || "";

        const selectedAddress = data.buildingName
          ? `${baseAddress} (${data.buildingName})`
          : baseAddress;

        onPostcodeChange?.(data.zonecode);
        onAddressChange?.(selectedAddress);
        onComplete?.({
          postcode: data.zonecode,
          address: selectedAddress,
          raw: data,
        });

        setErrorMessage("");
      },
    }).open();
  }

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />

      <div className={className}>
        <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
          <div className="relative">
            <MapPin
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              value={address}
              readOnly
              disabled={disabled}
              placeholder="주소검색 버튼을 눌러주세요"
              className={`${inputClass} pl-11`}
            />
          </div>

          <button
            type="button"
            onClick={openPostcodeSearch}
            disabled={disabled}
            className="flex h-[54px] items-center justify-center gap-2 rounded-[18px] bg-slate-950 px-4 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search size={17} />
            주소검색
          </button>
        </div>

        {postcode && (
          <p className="mt-2 text-xs font-bold text-slate-500">
            우편번호 {postcode}
          </p>
        )}

        <div className="mt-4">
          <label className="mb-2 block text-[14px] font-bold tracking-[-0.02em] text-slate-800">
            상세주소
            <span className="ml-1 text-emerald-600">*</span>
          </label>

          <input
            type="text"
            value={detailAddress}
            onChange={(event) =>
              onDetailAddressChange?.(event.target.value)
            }
            disabled={disabled}
            placeholder="동·호수 또는 상세 위치"
            className={inputClass}
          />
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700"
          >
            {errorMessage}
          </p>
        )}
      </div>
    </>
  );
}
