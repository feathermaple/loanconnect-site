import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <div className="text-lg font-black text-ink">LoanConnect</div>
          <p className="mt-3 text-sm leading-6 text-muted">
            借款媒合型網站前端專案骨架。適合承接 SEO、廣告與 LINE／社群流量。
          </p>
        </div>
        <div>
          <div className="font-semibold text-ink">建議補齊頁面</div>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <div>服務條款</div>
            <div>隱私權政策</div>
            <div>費用與風險揭露</div>
            <div>客服與申訴資訊</div>
          </div>
        </div>
        <div>
          <div className="font-semibold text-ink">快速入口</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link href="/borrow">立即申請</Link>
            <Link href="/articles">知識專區</Link>
            <Link href="/register">會員註冊</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
