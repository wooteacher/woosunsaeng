import Link from "next/link";
import { Clock3, Phone, ShieldCheck } from "lucide-react";

import BrandLogo from "@/components/common/BrandLogo";
import Container from "@/components/ui/Container";

const PHONE = "032-422-8010";
const PHONE_HREF = "tel:0324228010";

const navigation = [
  { label: "인터넷", href: "/internet" },
  { label: "렌탈", href: "/rental" },
  { label: "고객센터", href: "/customer-center" },
  { label: "상담 신청", href: "/#estimate" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/70">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <BrandLogo />
            <p className="mt-5 max-w-xl break-keep text-sm font-medium leading-7 text-slate-500">
              인터넷과 생활가전 렌탈을 복잡하지 않게 비교하고, 상담부터 설치까지
              우선생이 함께합니다.
            </p>

            <a
              href={PHONE_HREF}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 transition hover:border-green-300 hover:text-green-700"
            >
              <Phone size={17} />
              {PHONE}
            </a>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm font-bold text-slate-600" aria-label="하단 메뉴">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-green-700">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 grid gap-3 border-t border-slate-200/70 pt-6 text-xs font-semibold leading-5 text-slate-400 sm:grid-cols-2 lg:grid-cols-3">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={15} />
            고객 정보는 상담 목적으로만 사용합니다.
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 size={15} />
            상담 가능 여부는 운영시간에 따라 달라질 수 있습니다.
          </span>
          <span className="sm:col-span-2 lg:col-span-1 lg:text-right">
            © {new Date().getFullYear()} 우선생. All rights reserved.
          </span>
        </div>
      </Container>
    </footer>
  );
}
