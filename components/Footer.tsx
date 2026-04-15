import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="秒貸通"
              width={720}
              height={160}
              className="h-22 md:h-28 w-auto"
              priority
            />

            </div>
             
            
          <p className="mt-3 text-sm leading-7 text-muted">
            提供貸款資訊與媒合服務，協助用戶快速找到合適資金方案。
          </p>
        </div>

        <div>
          <div className="font-semibold text-ink">條款政策</div>
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
              <Link href="/apply-loan" className="transition hover:text-ink">
                我要借錢
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
          © {new Date().getFullYear()} 秒貸通. All rights reserved.
        </div>
      </div>
    </footer>
  );
}