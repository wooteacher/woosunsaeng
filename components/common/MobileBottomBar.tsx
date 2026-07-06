"use client";

import { Phone, MessageCircle, ClipboardList } from "lucide-react";
import { SITE } from "@/lib/site";

export default function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-2xl md:hidden">
      <div className="grid grid-cols-3">

        <a
          href={SITE.phoneHref}
          className="flex flex-col items-center gap-1 py-3 text-green-600"
        >
          <Phone size={22} />
          <span className="text-xs font-bold">
            전화상담
          </span>
        </a>

        <a
          href={SITE.kakaoUrl}
          className="flex flex-col items-center gap-1 py-3 text-yellow-500"
        >
          <MessageCircle size={22} />
          <span className="text-xs font-bold">
            카카오
          </span>
        </a>

        <a
          href="#estimate"
          className="flex flex-col items-center gap-1 py-3 text-blue-600"
        >
          <ClipboardList size={22} />
          <span className="text-xs font-bold">
            견적요청
          </span>
        </a>

      </div>
    </div>
  );
}