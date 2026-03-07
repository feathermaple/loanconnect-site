import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <div className="text-lg font-black text-ink">LoanConnect</div>
          <p className="mt-3 text-sm leading-7 text-muted">
            借款媒合型網站前端專案展示。適合承接 SEO、廣告與 LINE／社群流量，
            讓使用者能更快了解借款條件與申請方向。
          </p>
        </div>

        <div>
          <div className="font-semibold text-ink">建議補齊頁面</div>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <Link href="/terms" className="transition hover:text-ink">
                服務條款
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="transition hover:text-ink"
              >
                隱私權政策
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="transition hover:text-ink">
                費用與風險揭露
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-ink">
                客服與申訴資訊
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-ink">快速入口</div>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <Link href="/borrow" className="transition hover:text-ink">
                立即申請
              </Link>
            </li>
            <li>
              <Link href="/articles" className="transition hover:text-ink">
                知識專區
              </Link>
            </li>
            <li>
              <Link href="/register" className="transition hover:text-ink">
                會員註冊
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/80">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted md:px-6">
          © {new Date().getFullYear()} LoanConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}