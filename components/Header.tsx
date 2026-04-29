"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eee] bg-[#f8f5f1]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 md:py-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="秒貸通"
            className="
              h-[48px]
              w-auto
              md:h-[64px]
              object-contain
            "
          />
        </Link>

        {/* 導覽列 */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700 whitespace-nowrap">
          <Link href="/">首頁</Link>
          <Link href="/apply-loan">我要借錢</Link>
          <Link href="/lend">我要放款</Link>
          <Link href="/loan-needs">借款需求</Link>
          <Link href="/ads">放款廣告</Link>
          <Link href="/articles">借貸知識</Link>
          <Link href="/dashboard">會員中心</Link>
          <Link href="/about">關於平台</Link>
        </nav>

        {/* 右側按鈕 */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border px-4 py-2 text-sm hover:bg-gray-100"
          >
            登入
          </Link>

          <Link
            href="/apply-loan"
            className="rounded-full bg-[#c0392b] px-5 py-2 text-sm text-white shadow hover:opacity-90"
          >
            立即申請
          </Link>
        </div>

        {/* 手機漢堡 */}
        <button className="md:hidden">
          <div className="flex flex-col gap-[4px]">
            <span className="h-[2px] w-6 bg-black"></span>
            <span className="h-[2px] w-6 bg-black"></span>
            <span className="h-[2px] w-6 bg-black"></span>
          </div>
        </button>
      </div>
    </header>
  );
}
