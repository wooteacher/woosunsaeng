import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/"
              className="text-2xl font-black text-white"
            >
              우선생
            </Link>

            <p className="mt-3 font-bold text-gray-400">
              우리가 선택한 생활서비스
            </p>

            <p className="mt-5 text-sm font-medium leading-6 text-gray-400">
              인터넷 · TV · 렌탈 상담을 쉽고 빠르게 안내합니다.
            </p>
          </div>

          <div>
            <h2 className="font-black text-white">고객센터</h2>

            <a
              href="tel:0324228010"
              className="mt-3 block text-xl font-black text-green-400"
            >
              032-422-8010
            </a>

            <p className="mt-2 text-sm font-medium text-gray-400">
              상담 가능 시간은 운영 상황에 따라 달라질 수 있습니다.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-gray-800 pt-6 text-sm font-bold">
          <Link
            href="/privacy"
            className="text-white transition hover:text-green-400"
          >
            개인정보처리방침
          </Link>

          <Link
            href="/terms"
            className="transition hover:text-green-400"
          >
            이용약관
          </Link>

          <Link
            href="/#estimate"
            className="transition hover:text-green-400"
          >
            상담 신청
          </Link>
        </div>

        <p className="mt-6 text-sm font-medium text-gray-500">
          © {new Date().getFullYear()} 우선생. All rights reserved.
        </p>
      </div>
    </footer>
  );
}