"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "儀表板",
  },
  {
    href: "/admin/leads",
    label: "名單管理",
  },
];

function isActivePath(currentPath: string, href: string) {
  if (href === "/admin/dashboard") {
    return currentPath === "/admin" || currentPath === "/admin/dashboard";
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-[#e5ded5] bg-white lg:flex lg:flex-col">
        <div className="border-b border-[#e5ded5] px-6 py-6">
          <Link href="/admin/dashboard" className="block">
            <div className="text-xl font-bold text-[#2f2a25]">LoanConnect</div>
            <div className="mt-1 text-sm text-[#7a7065]">Admin Console</div>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-[#4b433b] text-white shadow-sm"
                    : "text-[#4b433b] hover:bg-[#f3eee7]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#e5ded5] p-4">
          <Link
            href="/"
            className="block rounded-xl px-4 py-3 text-sm font-medium text-[#6f665d] transition hover:bg-[#f3eee7]"
          >
            回前台首頁
          </Link>
        </div>
      </aside>

      <header className="border-b border-[#e5ded5] bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/admin/dashboard" className="block">
            <div className="text-lg font-bold text-[#2f2a25]">
              LoanConnect 後台
            </div>
          </Link>

          <Link href="/" className="text-sm text-[#6f665d] hover:underline">
            回前台
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 pb-4">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[#4b433b] text-white"
                    : "bg-[#f3eee7] text-[#4b433b]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>
    </>
  );
}