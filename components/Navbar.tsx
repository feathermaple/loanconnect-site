"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "首頁", href: "/" },
  { label: "我要借錢", href: "/apply-loan" },
  { label: "我要放款", href: "/post-lender" },
  { label: "借款需求", href: "/needs" },
  { label: "放款廣告", href: "/ads" },
  { label: "各區金主", href: "/lenders" },
  { label: "借錢知識", href: "/articles" },
  { label: "會員中心", href: "/member" },
  { label: "關於平台", href: "/about-platform" },
  { label: "聯絡我們", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#e9e2d8] bg-[#fbf8f3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-3 md:px-8 md:py-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="秒貸通"
              width={1024}
              height={408}
              className="h-20 w-auto md:h-28"
              priority
            />
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-base font-medium text-[#5f5750] hover:text-black"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/apply-loan"
              className="rounded-full bg-red-600 px-6 py-2 text-white font-semibold"
            >
              我要借錢
            </Link>

            <Link
              href="/post-lender"
              className="rounded-full bg-blue-600 px-6 py-2 text-white font-semibold"
            >
              我要放款
            </Link>
          </nav>

          {/* Mobile Btn */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-[85%] bg-white p-5 overflow-y-auto">

            {/* 雙CTA */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <Link
                href="/apply-loan"
                className="bg-red-600 text-white text-center py-3 rounded-xl font-bold"
                onClick={() => setMenuOpen(false)}
              >
                我要借錢
              </Link>
              <Link
                href="/post-lender"
                className="bg-blue-600 text-white text-center py-3 rounded-xl font-bold"
                onClick={() => setMenuOpen(false)}
              >
                我要放款
              </Link>
            </div>

            {/* Menu */}
            <div className="space-y-3">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border rounded-xl px-4 py-3 font-semibold"
                >
                  {item.label}
                </Link>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
}