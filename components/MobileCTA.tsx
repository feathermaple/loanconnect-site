"use client";

import Link from "next/link";

export default function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] border-t border-[#e9e2d8] bg-white md:hidden">
      <div className="flex">


        {/* LINE */}
        <a
          href="https://line.me/R/ti/p/@yourline"
          target="_blank"
          className="flex-1 flex flex-col items-center justify-center border-x border-[#e9e2d8] py-3 text-xs font-semibold text-[#2f2a25]"
        >
          💬
          <span className="mt-1">LINE諮詢</span>
        </a>

        {/* 評估 */}
        <Link
          href="/borrow"
          className="flex-1 flex flex-col items-center justify-center py-3 text-xs font-semibold text-white bg-[#3e3a34]"
        >
          📝
          <span className="mt-1">立即評估</span>
        </Link>

      </div>
    </div>
  );
}