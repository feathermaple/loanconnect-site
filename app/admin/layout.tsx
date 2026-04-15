"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menu = [
    { name: "後台首頁", href: "/admin/dashboard" },
    { name: "網站文章", href: "/admin/articles" },
    { name: "會員管理", href: "/admin/members" }, // ⭐ 新增
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 border-r border-slate-200 bg-white p-4">
        <div className="mb-6 text-lg font-bold text-slate-900">
          管理後台
        </div>

        <nav className="space-y-1">
          {menu.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-slate-200 text-slate-900 font-medium"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}