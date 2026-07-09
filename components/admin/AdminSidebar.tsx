"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const allMenus = [
  {
    href: "/admin",
    label: "📊 대시보드",
    roles: ["super_admin", "manager", "staff"],
  },
  {
    href: "/admin/products",
    label: "📦 상품관리",
    roles: ["super_admin", "manager"],
  },
  {
    href: "/admin/policies",
    label: "💰 정책관리",
    roles: ["super_admin", "manager"],
  },
  {
    href: "/admin/staff",
    label: "👨 직원관리",
    roles: ["super_admin"],
  },  
  {
  href: "/admin/installations",
  label: "📅 설치관리",
  roles: ["super_admin", "manager", "staff"],
 },
 {
  href: "/admin/payments",
  label: "💰 지급관리",
  roles: ["super_admin", "manager"],
},
];

export default function AdminSidebar({
  role,
  name,
}: {
  role: string;
  name: string;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  const menus = allMenus.filter((menu) => menu.roles.includes(role));

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 bg-gray-950 p-6 text-white md:block">
      <h1 className="text-2xl font-black">우선생 Admin</h1>
      <p className="mt-2 text-sm font-bold text-gray-400">
        WooTeacher Platform
      </p>

      <div className="mt-6 rounded-2xl bg-gray-900 p-4">
        <p className="font-black">{name}</p>
        <p className="mt-1 text-sm font-bold text-green-400">{role}</p>
      </div>

      <nav className="mt-8 space-y-2">
        {menus.map((menu) => {
          const active =
            menu.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(menu.href);

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`block rounded-2xl px-4 py-3 font-black transition ${
                active
                  ? "bg-green-500 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {menu.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Link
          href="/admin/logout"
          className="block rounded-2xl bg-gray-800 px-4 py-3 text-center font-black text-gray-200 transition hover:bg-red-600 hover:text-white"
        >
          로그아웃
        </Link>
      </div>
    </aside>
  );
}