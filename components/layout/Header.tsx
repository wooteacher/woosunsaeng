import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";

const menus = [
  {
    name: "인터넷 + TV",
    href: "#service",
  },
  {
    name: "렌탈",
    href: "#service",
  },
  {
    name: "견적요청",
    href: "#estimate",
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        <Link href="/" className="leading-tight">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            우선생
          </h1>

          <p className="text-xs font-bold text-green-600">
            {SITE.slogan}
          </p>
        </Link>

        <nav className="hidden gap-10 md:flex">
          {menus.map((menu) => (
            <Link
              key={menu.name}
              href={menu.href}
              className="font-bold text-gray-700 transition hover:text-green-600"
            >
              {menu.name}
            </Link>
          ))}
        </nav>

        <a
          href={SITE.phoneHref}
          className="hidden items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-green-700 md:flex"
        >
          <Phone size={18} />
          {SITE.phone}
        </a>

      </div>
    </header>
  );
}