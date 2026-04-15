import Link from "next/link";

const nav = [
  ["/", "首頁"],
  ["/apply-loan", "我要借錢"],
  ["/lenders", "服務據點"],
  ["/articles", "知識專區"],
  ["/register", "會員註冊"],
  ["/dashboard", "後台預覽"],
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-left">
          <div className="text-xl font-black tracking-tight text-ink">LoanConnect</div>
          <div className="text-xs text-[#8a8178]">暖白米色信任系平台網站</div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-soft hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:bg-soft md:block"
          >
            登入
          </Link>
          <Link
            href="/apply-loan"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
          >
            免費諮詢
          </Link>
        </div>
      </div>
    </header>
  );
}
