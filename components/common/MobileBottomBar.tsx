"use client";

import {
  ClipboardList,
  MessageCircle,
  Phone,
} from "lucide-react";

import { SITE } from "@/lib/site";

export default function MobileBottomBar() {
  return (
    <div
      className="
        fixed
        inset-x-0
        bottom-0
        z-50
        border-t
        border-gray-200
        bg-white/95
        pb-[env(safe-area-inset-bottom)]
        shadow-[0_-16px_40px_-24px_rgba(17,24,39,0.35)]
        backdrop-blur-xl
        md:hidden
      "
    >

      <div className="mx-auto grid h-[72px] max-w-lg grid-cols-3 gap-1 px-2">


        <a
          href={SITE.phoneHref}
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-1
            rounded-2xl
            text-gray-600
            transition
            active:bg-green-50
            active:text-green-700
          "
        >

          <Phone
            size={22}
            strokeWidth={2.3}
          />

          <span className="text-[11px] font-black">
            전화상담
          </span>

        </a>



        <a
          href={SITE.kakaoUrl}
          target="_blank"
          rel="noreferrer"
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-1
            rounded-2xl
            text-gray-600
            transition
            active:bg-yellow-50
            active:text-yellow-700
          "
        >

          <MessageCircle
            size={22}
            strokeWidth={2.3}
          />

          <span className="text-[11px] font-black">
            카카오
          </span>

        </a>



        <a
          href="#estimate"
          className="
            my-2
            flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-green-600
            px-3
            text-white
            shadow-lg
            shadow-green-200
            transition
            active:bg-green-700
          "
        >

          <ClipboardList
            size={20}
            strokeWidth={2.5}
          />

          <span className="text-xs font-black">
            무료 상담
          </span>

        </a>


      </div>

    </div>
  );
}