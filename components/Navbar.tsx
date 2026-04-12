"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "免費評估", href: "/borrow" },
  { label: "信用貸款", href: "/credit-loan" },
  { label: "貸款條件", href: "/loan-info" },
  { label: "知識專區", href: "/articles" },
  { label: "聯繫客服", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e9e2d8] bg-[#fbf8f3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3 md:px-8 md:py-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="秒貸通"
              width={720}
              height={160}
              className="h-14 w-auto md:h-24 drop-shadow-sm"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-base font-medium text-[#5f5750] transition hover:text-[#2f2a25]"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/borrow"
              className="rounded-full bg-[#3e3a34] px-7 py-3 text-base font-semibold text-white transition hover:opacity-95"
            >
              立即免費評估
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "關閉選單" : "開啟選單"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e6dfd5] bg-white text-[#2f2a25] lg:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[2px] w-5 rounded bg-current transition ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[2px] w-5 rounded bg-current transition ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-[2px] w-5 rounded bg-current transition ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/30 transition ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-[360px] flex-col bg-[#fbf8f3] shadow-2xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#e9e2d8] px-5 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="秒貸通"
                width={180}
                height={48}
                className="h-10 w-auto"
                priority
              />
            </div>

            <button
              type="button"
              aria-label="關閉選單"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e6dfd5] bg-white text-[#2f2a25]"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-5">
            <div className="space-y-3">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl border border-[#ece4da] bg-white px-4 py-4 text-base font-semibold text-[#2f2a25] transition hover:bg-[#f7f2eb]"
                >
                  <span>{item.label}</span>
                  <span className="text-[#8a8178]">→</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t border-[#e9e2d8] px-5 py-4">
            <Link
              href="/borrow"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-[#3e3a34] px-5 py-3.5 text-base font-semibold text-white transition hover:opacity-95"
            >
              立即免費評估
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}