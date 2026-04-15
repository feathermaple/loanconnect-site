"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const plans = [
  {
    name: "免費會員",
    price: "NT$0",
    period: "/永久",
    badge: "先免費體驗",
    badgeClassName:
      "border border-gray-200 bg-gray-100 text-gray-700",
    cardClassName: "border-[#e8dfd3] bg-white",
    buttonClassName:
      "bg-[#3e3a34] text-white hover:opacity-95",
    buttonText: "立即免費註冊",
    buttonHref: "/register",
    features: [
      "可瀏覽借款需求公開列表",
      "可免費查看 2 筆完整需求資料",
      "可查看已解鎖案件的完整聯絡方式",
      "適合先體驗平台與觀察案件品質",
    ],
    note: "適合剛開始使用的平台新會員",
  },
  {
    name: "VIP 月費會員",
    price: "NT$2,980",
    period: "/月",
    badge: "熱門方案",
    badgeClassName:
      "border border-amber-200 bg-amber-100 text-amber-700",
    cardClassName:
      "border-2 border-[#c8a97e] bg-[#fffaf4] shadow-lg",
    buttonClassName:
      "bg-[#8f2f23] text-white hover:opacity-95",
    buttonText: "選擇月費方案",
    buttonHref: "/register?plan=monthly",
    features: [
      "不限次查看完整借款需求",
      "完整顯示電話與 LINE ID",
      "可快速聯繫案件需求方",
      "適合持續開發案件的金主會員",
    ],
    note: "推薦給每月固定開發案件的會員",
  },
  {
    name: "VIP 年費會員",
    price: "NT$29,800",
    period: "/年",
    badge: "送 1 個月",
    badgeClassName:
      "border border-emerald-200 bg-emerald-100 text-emerald-700",
    cardClassName: "border-[#d8e7d3] bg-[#f8fff6]",
    buttonClassName:
      "bg-[#224f8f] text-white hover:opacity-95",
    buttonText: "選擇年費方案",
    buttonHref: "/register?plan=yearly",
    features: [
      "不限次查看完整借款需求",
      "完整顯示電話與 LINE ID",
      "年繳方案更划算",
      "加送 1 個月使用期限",
    ],
    note: "適合長期經營、重視成本效益的會員",
  },
];

const faqs = [
  {
    q: "免費會員真的可以查看 2 筆完整需求嗎？",
    a: "可以。免費會員註冊登入後，可免費解鎖 2 筆完整借款需求，包含完整聯絡方式。",
  },
  {
    q: "超過 2 筆之後怎麼辦？",
    a: "當免費解鎖額度用完後，需升級為 VIP 月費會員或 VIP 年費會員，才可繼續不限次查看完整需求。",
  },
  {
    q: "VIP 月費與年費有什麼差別？",
    a: "兩者都可不限次查看完整需求。差別在於年費方案平均每月更划算，且加送 1 個月使用期限。",
  },
  {
    q: "升級後可以看到哪些內容？",
    a: "升級後可查看完整稱呼、電話、LINE ID 與需求內容，更方便快速聯繫案件需求方。",
  },
];

export default function PricingClient() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const isFromUnlock = from === "unlock";

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      <section className="border-b border-[#eee4d8] bg-[#f7f4ef]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex rounded-full border border-[#e3d9cc] bg-white px-4 py-1.5 text-xs font-bold text-[#6f655b] shadow-sm">
              會員方案
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight text-[#2f2a25] md:text-5xl">
              先免費體驗，再依需求升級
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6b6258] md:text-lg">
              免費會員可先查看 2 筆完整借款需求。
              <br className="hidden md:block" />
              升級 VIP 月費或年費會員後，即可不限次查看完整聯絡資訊，快速開發案件。
            </p>

            {isFromUnlock && (
              <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-left shadow-sm">
                <div className="text-base font-bold text-red-700 md:text-lg">
                  你已用完免費查看次數
                </div>
                <p className="mt-2 text-sm leading-7 text-red-700 md:text-base">
                  升級 VIP 會員後，即可不限次查看借款需求、完整電話與 LINE ID，
                  不再受免費額度限制。
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/register?plan=monthly"
                    className="inline-flex items-center justify-center rounded-full bg-[#8f2f23] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
                  >
                    立即升級月費會員
                  </Link>
                  <Link
                    href="/register?plan=yearly"
                    className="inline-flex items-center justify-center rounded-full bg-[#224f8f] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
                  >
                    立即升級年費會員
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-[#3e3a34] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
              >
                立即免費註冊
              </Link>

              <Link
                href="/needs"
                className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-[#d8cbbd] bg-white px-6 py-3 text-sm font-bold text-[#3e3a34] transition hover:bg-[#f7f3ed]"
              >
                先查看借款需求
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl p-6 md:p-8 ${plan.cardClassName}`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-[#2f2a25]">
                  {plan.name}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${plan.badgeClassName}`}
                >
                  {plan.badge}
                </span>
              </div>

              <div className="mb-2 flex items-end gap-2">
                <span className="text-4xl font-black leading-none text-[#2f2a25]">
                  {plan.price}
                </span>
                <span className="pb-1 text-sm font-semibold text-[#7a7269]">
                  {plan.period}
                </span>
              </div>

              <p className="mb-6 text-sm leading-7 text-[#6b6258]">
                {plan.note}
              </p>

              <ul className="space-y-3 text-sm text-[#5f5750]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 text-[#8f2f23]">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.buttonHref}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition ${plan.buttonClassName}`}
              >
                {plan.buttonText}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#2f2a25] md:text-3xl">
              方案比較
            </h2>
            <p className="mt-3 text-[#6b6258]">
              一眼看懂各方案差異，選擇最適合你的使用方式。
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#e8dfd3]">
            <div className="grid grid-cols-4 bg-[#f8f5ef] text-sm font-bold text-[#2f2a25]">
              <div className="border-r border-[#e8dfd3] px-4 py-4">項目</div>
              <div className="border-r border-[#e8dfd3] px-4 py-4 text-center">
                免費會員
              </div>
              <div className="border-r border-[#e8dfd3] px-4 py-4 text-center">
                月費會員
              </div>
              <div className="px-4 py-4 text-center">年費會員</div>
            </div>

            {[
              ["查看公開需求列表", "可", "可", "可"],
              ["完整查看需求資料", "2 筆", "不限次", "不限次"],
              ["完整電話 / LINE ID", "2 筆內可看", "可", "可"],
              ["適合對象", "先體驗", "固定開發", "長期經營"],
              ["優惠內容", "-", "-", "送 1 個月"],
            ].map((row) => (
              <div
                key={row[0]}
                className="grid grid-cols-4 border-t border-[#e8dfd3] bg-white text-sm text-[#5f5750]"
              >
                <div className="border-r border-[#e8dfd3] px-4 py-4 font-semibold text-[#2f2a25]">
                  {row[0]}
                </div>
                <div className="border-r border-[#e8dfd3] px-4 py-4 text-center">
                  {row[1]}
                </div>
                <div className="border-r border-[#e8dfd3] px-4 py-4 text-center">
                  {row[2]}
                </div>
                <div className="px-4 py-4 text-center">{row[3]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <div className="rounded-3xl border border-[#e8dfd3] bg-[#fffaf4] px-6 py-10 text-center shadow-sm md:px-10">
          <h2 className="text-2xl font-bold text-[#2f2a25] md:text-3xl">
            想更快聯繫案件需求方？
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#6b6258]">
            免費會員可先體驗 2 筆完整需求，
            若你已開始穩定開發案件，建議直接升級 VIP 會員，
            查看效率會高很多。
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register?plan=monthly"
              className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-[#8f2f23] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
            >
              升級月費會員
            </Link>

            <Link
              href="/register?plan=yearly"
              className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-[#224f8f] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
            >
              升級年費會員
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#2f2a25] md:text-3xl">
              常見問題
            </h2>
            <p className="mt-3 text-[#6b6258]">
              先把常見疑問說清楚，方便你快速選擇方案。
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-3xl border border-[#e8dfd3] bg-[#f8f5ef] shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-base font-bold text-[#2f2a25] [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <span className="text-xl text-[#8b8178] transition-transform duration-200 group-open:rotate-45">
                    ＋
                  </span>
                </summary>

                <div className="border-t border-[#e8dfd3] px-6 py-5 text-sm leading-7 text-[#5f5750]">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}