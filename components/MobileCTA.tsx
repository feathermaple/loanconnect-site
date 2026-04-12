"use client";

import Link from "next/link";

export default function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] border-t border-[#e9e2d8] bg-white md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      
      <div className="grid grid-cols-2">

        {/* LINE */}
        <a
          href="https://lin.ee/WPqaDbx"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-3 text-xs font-semibold text-[#2f2a25] transition active:bg-[#f5f1eb]"
        >
          <span className="text-base">💬</span>
          <span className="mt-1">LINE快速諮詢</span>
        </a>

        {/* 免費評估 */}
        <Link
          href="/borrow"
          className="flex flex-col items-center justify-center bg-[#3e3a34] py-3 text-xs font-semibold text-white transition active:opacity-90"
        >
          <span className="text-base">📝</span>
          <span className="mt-1">免費貸款評估</span>
        </Link>

      </div>
    </div>
  );
}