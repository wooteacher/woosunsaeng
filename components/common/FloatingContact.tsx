import { MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-8 right-8 z-50 hidden flex-col gap-3 md:flex">
      <a
        href={SITE.kakaoUrl}
        className="flex items-center gap-3 rounded-full bg-yellow-300 px-6 py-4 font-black text-gray-950 shadow-xl transition hover:-translate-y-1"
      >
        <MessageCircle size={22} />
        카카오 상담
      </a>

      <a
        href={SITE.phoneHref}
        className="flex items-center gap-3 rounded-full bg-green-600 px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-green-700"
      >
        <Phone size={22} />
        {SITE.phone}
      </a>
    </div>
  );
}