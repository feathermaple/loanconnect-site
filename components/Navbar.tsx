"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e2d8] bg-[#fbf8f3]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="shrink-0 leading-tight">
          <div className="text-2xl font-bold tracking-tight text-[#2f2a25]">
            LoanConnect
          </div>
          <div className="text-[12px] text-[#8a8178]">
            暖白米色信任系平台網站
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden flex-1 items-center justify-center gap-10 lg:flex">
          <Link
            href="/"
            className="text-sm font-medium text-[#5f5750] transition hover:text-[#2f2a25]"
          >
            首頁
          </Link>

          <Link
            href="/borrow"
            className="text-sm font-medium text-[#5f5750] transition hover:text-[#2f2a25]"
          >
            立即申請
          </Link>

          <Link
            href="/lenders"
            className="text-sm font-medium text-[#5f5750] transition hover:text-[#2f2a25]"
          >
            服務據點
          </Link>

          <Link
            href="/articles"
            className="text-sm font-medium text-[#5f5750] transition hover:text-[#2f2a25]"
          >
            知識專區
          </Link>

          <Link
            href="/register"
            className="text-sm font-medium text-[#5f5750] transition hover:text-[#2f2a25]"
          >
            會員註冊
          </Link>
        </nav>

        {/* Desktop buttons */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-full border border-[#e8e1d8] px-5 py-2 text-sm font-medium text-[#5f5750] transition hover:bg-[#f3eee7]"
          >
            登入
          </Link>

          <Link
            href="/borrow"
            className="rounded-full bg-[#3e3a34] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-95"
          >
            免費諮詢
          </Link>
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5ddd2] lg:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#e9e2d8] bg-[#fbf8f3] lg:hidden">
          <div className="flex flex-col px-6 py-4">
            <Link
              href="/"
              className="py-3 text-sm font-medium text-[#5f5750]"
              onClick={() => setOpen(false)}
            >
              首頁
            </Link>

            <Link
              href="/borrow"
              className="py-3 text-sm font-medium text-[#5f5750]"
              onClick={() => setOpen(false)}
            >
              立即申請
            </Link>

            <Link
              href="/lenders"
              className="py-3 text-sm font-medium text-[#5f5750]"
              onClick={() => setOpen(false)}
            >
              服務據點
            </Link>

            <Link
              href="/articles"
              className="py-3 text-sm font-medium text-[#5f5750]"
              onClick={() => setOpen(false)}
            >
              知識專區
            </Link>

            <Link
              href="/register"
              className="py-3 text-sm font-medium text-[#5f5750]"
              onClick={() => setOpen(false)}
            >
              會員註冊
            </Link>

            <div className="mt-4 flex gap-3">
              <Link
                href="/login"
                className="flex-1 rounded-full border border-[#e8e1d8] px-4 py-2 text-center text-sm font-medium text-[#5f5750]"
              >
                登入
              </Link>

              <Link
                href="/borrow"
                className="flex-1 rounded-full bg-[#3e3a34] px-4 py-2 text-center text-sm font-semibold text-white"
              >
                免費諮詢
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}