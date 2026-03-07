import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e1d8] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="leading-tight">
          <div className="text-[32px] font-black tracking-tight text-[#2f2a25]">
            LoanConnect
          </div>
          <div className="text-[12px] text-[#8a8178]">
            暖白米色信任系平台網站
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/" className="text-sm font-medium text-[#5f5750] hover:text-[#2f2a25]">
            首頁
          </Link>
          <Link href="/borrow" className="text-sm font-medium text-[#5f5750] hover:text-[#2f2a25]">
            立即申請
          </Link>
          <Link href="/lenders" className="text-sm font-medium text-[#5f5750] hover:text-[#2f2a25]">
            服務據點
          </Link>
          <Link href="/articles" className="text-sm font-medium text-[#5f5750] hover:text-[#2f2a25]">
            知識專區
          </Link>
          <Link href="/register" className="text-sm font-medium text-[#5f5750] hover:text-[#2f2a25]">
            會員註冊
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-[#5f5750] hover:text-[#2f2a25]">
            後台預覽
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-full border border-[#e8e1d8] px-5 py-2 text-sm font-medium text-[#5f5750] hover:bg-[#f7f3ee]"
          >
            登入
          </Link>
          <Link
            href="/borrow"
            className="rounded-full bg-[#3e3a34] px-5 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            免費諮詢
          </Link>
        </div>
      </div>
    </header>
  );
}