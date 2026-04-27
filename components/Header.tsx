"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-[999] w-full bg-[#f8f3ea]/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* 桌機選單 */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link href="/">首頁</Link>
            <Link href="/apply-loan">我要借錢</Link>
            <Link href="/posts">放款資訊</Link>
            <Link href="/dashboard">會員中心</Link>
          </nav>

          {/* 漢堡 */}
          <button
            onClick={() => setOpen(!open)}
            className="relative z-[1000] flex h-11 w-11 items-center justify-center rounded-full bg-white shadow md:hidden"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
      </header>

      {/* 手機選單 */}
      {open && (
        <div className="fixed inset-0 z-[998] bg-black/40">
          <div className="absolute right-0 top-0 h-full w-[70%] bg-white p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="mb-6 text-lg"
            >
              ✕
            </button>

            <div className="flex flex-col gap-4 text-base font-semibold">
              <Link href="/" onClick={() => setOpen(false)}>首頁</Link>
              <Link href="/apply-loan" onClick={() => setOpen(false)}>我要借錢</Link>
              <Link href="/posts" onClick={() => setOpen(false)}>放款資訊</Link>
              <Link href="/dashboard" onClick={() => setOpen(false)}>會員中心</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}