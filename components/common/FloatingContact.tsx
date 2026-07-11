import {
  MessageCircle,
  Phone,
} from "lucide-react";

import { SITE } from "@/lib/site";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden flex-col gap-3 md:flex">

      <a
        href={SITE.kakaoUrl}
        target="_blank"
        rel="noreferrer"
        className="
          group
          inline-flex
          min-h-14
          items-center
          gap-3
          rounded-full
          border
          border-yellow-300
          bg-yellow-300
          px-5
          py-3
          text-sm
          font-black
          text-gray-950
          shadow-lg
          shadow-gray-900/10
          transition-all
          duration-200
          hover:-translate-y-1
          hover:bg-yellow-400
        "
      >

        <MessageCircle
          size={20}
          className="transition group-hover:scale-110"
        />

        카카오 상담

      </a>



      <a
        href={SITE.phoneHref}
        className="
          group
          inline-flex
          min-h-14
          items-center
          gap-3
          rounded-full
          bg-green-600
          px-5
          py-3
          text-sm
          font-black
          text-white
          shadow-lg
          shadow-green-200
          transition-all
          duration-200
          hover:-translate-y-1
          hover:bg-green-700
        "
      >

        <Phone
          size={20}
          className="transition group-hover:scale-110"
        />

        {SITE.phone}

      </a>


    </div>
  );
}