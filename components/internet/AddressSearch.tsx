"use client";

import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          roadAddress: string;
          jibunAddress: string;
        }) => void;
      }) => { open: () => void };
    };
  }
}

type Props = {
  zonecode: string;
  address: string;
  detailAddress: string;
  onChange: (value: {
    zonecode: string;
    address: string;
    detailAddress: string;
  }) => void;
};

const SCRIPT_ID = "daum-postcode-script";
const SCRIPT_SRC =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

export default function AddressSearch({
  zonecode,
  address,
  detailAddress,
  onChange,
}: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.daum?.Postcode) {
      setReady(true);
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => setReady(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  function openSearch() {
    if (!window.daum?.Postcode) return;

    new window.daum.Postcode({
      oncomplete(data) {
        onChange({
          zonecode: data.zonecode,
          address: data.roadAddress || data.jibunAddress,
          detailAddress,
        });
      },
    }).open();
  }

  return (
    <div>
      <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <MapPin size={16} />
        주소
      </span>

      <div className="mt-2 flex gap-2">
        <input
          value={zonecode}
          readOnly
          placeholder="우편번호"
          className="h-12 w-28 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm"
        />

        <button
          type="button"
          onClick={openSearch}
          disabled={!ready}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white disabled:bg-slate-300"
        >
          <Search size={16} />
          주소 검색
        </button>
      </div>

      <input
        value={address}
        readOnly
        placeholder="주소 검색으로 입력해주세요"
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm"
      />

      <input
        value={detailAddress}
        onChange={(event) =>
          onChange({
            zonecode,
            address,
            detailAddress: event.target.value,
          })
        }
        placeholder="상세 주소를 입력해주세요"
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </div>
  );
}
