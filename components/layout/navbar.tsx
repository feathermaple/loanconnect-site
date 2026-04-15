"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { label: "首頁", href: "/" },
  { label: "貸款資訊", href: "/loan-info" },
  { label: "常見問題", href: "/faq" },
  { label: "我要借錢", href: "/apply-loan" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ebe3d8] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2f2a25] text-sm font-black text-white shadow-sm">
            LC
          </div>
          <div>
            <div className="text-base font-black leading-none text-[#2f2a25]">
              LoanConnect
            </div>
            <div className="mt-1 text-[11px] font-medium tracking-wide text-[#8a8178]">
              貸款媒合平台
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#5f5750] transition hover:bg-[#f6efe7] hover:text-[#2f2a25]"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/apply-loan"
            className="ml-2 rounded-full bg-[#3e3a34] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            立即免費評估
          </Link>
        </nav>

        <button
          type="button"
          aria-label="切換選單"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e5dbcf] bg-white text-[#4e473f] md:hidden"
        >
          <span className="text-lg">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#efe6db] bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#5f5750] transition hover:bg-[#f8f2eb] hover:text-[#2f2a25]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}