import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-gray-300">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-3xl font-black text-white">
          {SITE.name}
        </h2>

        <p className="mt-2 text-gray-400">
          {SITE.slogan}
        </p>

        <div className="mt-8 border-t border-gray-700 pt-8">

          <p>대표번호 : {SITE.phone}</p>

          <p className="mt-2">
            인터넷 + TV · 렌탈 전문 상담
          </p>

          <p className="mt-6 text-sm text-gray-500">
            © 2026 {SITE.name}. All Rights Reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}