"use client";

import Link from "next/link";
import { useState } from "react";

type PaidPlan = "monthly" | "yearly";
type CreditPlan = "credits_5" | "credits_20" | "credits_50";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<
    PaidPlan | CreditPlan | null
  >(null);

  const handleSubscribe = async (plan: PaidPlan) => {
    try {
      setLoadingPlan(plan);

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "建立訂單失敗");
        return;
      }

      if (!data?.paymentUrl) {
        alert("付款連結不存在");
        return;
      }

      window.location.href = data.paymentUrl;
    } catch (error) {
      console.error("handleSubscribe error:", error);
      alert("系統發生錯誤，請稍後再試");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCreditPurchase = (plan: CreditPlan) => {
    try {
      setLoadingPlan(plan);
      window.location.href = `/fake-payment?plan=${plan}`;
    } catch (error) {
      console.error("handleCreditPurchase error:", error);
      alert("系統發生錯誤，請稍後再試");
      setLoadingPlan(null);
    }
  };

  return (
    <main className="bg-[#f5f3ef] text-[#2f2a25]">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-6 md:pb-24 md:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-[#d8c7a5] bg-[#fffaf2] px-4 py-1 text-sm font-medium text-[#a67c2d]">
            會員方案
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
            選擇最適合你的查看方案
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#6b6257] md:text-base">
            可依使用需求選擇 VIP 會員或解鎖點數方案，立即查看完整借款需求內容與聯絡資訊。
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-[#ebe4da] bg-white p-7 shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">免費會員</h2>
                <p className="mt-2 text-sm text-[#6b6257]">
                  適合剛開始使用的平台新會員
                </p>
              </div>

              <span className="rounded-full bg-[#f5f0e8] px-3 py-1 text-xs font-semibold text-[#6f6253]">
                先免費體驗
              </span>
            </div>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">NT$0</span>
              <span className="mb-1 text-base text-[#6b6257]">/ 永久</span>
            </div>

            <ul className="mt-8 space-y-4 text-[15px] leading-7 text-[#5f554b]">
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>可瀏覽借款需求公開列表</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>可免費查看 2 筆完整借款資料</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>可查看已解鎖案件的完整聯絡方式</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>適合先體驗平台與觀察案件品質</span>
              </li>
            </ul>

            <Link
              href="/register"
              className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-[#3b342d] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90"
            >
              立即免費註冊
            </Link>
          </div>

          <div className="relative rounded-[28px] border border-[#d9b27f] bg-[#fffaf5] p-7 shadow-[0_10px_30px_rgba(73,48,21,0.08)] md:p-8">
            <div className="absolute right-6 top-6 rounded-full bg-[#f6d391] px-3 py-1 text-xs font-bold text-[#8a5200]">
              熱門方案
            </div>

            <div className="pr-20">
              <h2 className="text-2xl font-bold">VIP 月費會員</h2>
              <p className="mt-2 text-sm text-[#6b6257]">
                推薦給每月固定開發案件的會員
              </p>
            </div>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">NT$2,980</span>
              <span className="mb-1 text-base text-[#6b6257]">/ 月</span>
            </div>

            <ul className="mt-8 space-y-4 text-[15px] leading-7 text-[#5f554b]">
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>不限次查看完整借款需求</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>完整顯示電話與 LINE ID</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>可快速聯繫案件需求方</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>適合持續開發案件的金主會員</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => handleSubscribe("monthly")}
              disabled={loadingPlan !== null}
              className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-[#ab3b2b] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingPlan === "monthly" ? "跳轉中..." : "選擇月費方案"}
            </button>
          </div>

          <div className="relative rounded-[28px] border border-[#dcebdd] bg-[#f3fbf3] p-7 shadow-sm md:p-8">
            <div className="absolute right-6 top-6 rounded-full bg-[#d7f3d7] px-3 py-1 text-xs font-bold text-[#26814a]">
              送 1 個月
            </div>

            <div className="pr-20">
              <h2 className="text-2xl font-bold">VIP 年費會員</h2>
              <p className="mt-2 text-sm text-[#6b6257]">
                適合長期經營、重視成本效益的會員
              </p>
            </div>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">NT$29,800</span>
              <span className="mb-1 text-base text-[#6b6257]">/ 年</span>
            </div>

            <ul className="mt-8 space-y-4 text-[15px] leading-7 text-[#5f554b]">
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>不限次查看完整借款需求</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>完整顯示電話與 LINE ID</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>年繳方案更划算</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>加送 1 個月使用期限</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => handleSubscribe("yearly")}
              disabled={loadingPlan !== null}
              className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-[#2459b8] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingPlan === "yearly" ? "跳轉中..." : "選擇年費方案"}
            </button>
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex rounded-full border border-[#d8c7a5] bg-[#fffaf2] px-4 py-1 text-sm font-medium text-[#a67c2d]">
            單筆解鎖方案
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
            不想訂 VIP，也可以購買解鎖點數
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#6b6257] md:text-base">
            適合只想查看少量借款需求的會員。購買後會獲得解鎖點數，每查看 1 筆完整需求扣 1 點。
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-[#ebe4da] bg-white p-7 shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">入門包</h2>
                <p className="mt-2 text-sm text-[#6b6257]">
                  適合先體驗平台、少量查看需求的會員
                </p>
              </div>

              <span className="rounded-full bg-[#f5f0e8] px-3 py-1 text-xs font-semibold text-[#6f6253]">
                輕量體驗
              </span>
            </div>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">NT$300</span>
            </div>

            <ul className="mt-8 space-y-4 text-[15px] leading-7 text-[#5f554b]">
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>可解鎖完整需求 5 筆</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>每筆平均 NT$60</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>適合短期測試平台品質</span>
              </li>
            </ul>

            <p className="mt-4 text-sm text-[#7b6f63]">
              適合先體驗平台，快速開始查看需求。
            </p>

            <button
              type="button"
              onClick={() => handleCreditPurchase("credits_5")}
              disabled={loadingPlan !== null}
              className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-[#3b342d] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingPlan === "credits_5" ? "跳轉中..." : "立即購買 5 點"}
            </button>
          </div>

          <div className="relative rounded-[28px] border border-[#d9b27f] bg-[#fffaf5] p-7 shadow-[0_10px_30px_rgba(73,48,21,0.08)] md:p-8">
            <div className="absolute right-6 top-6 rounded-full bg-[#f6d391] px-3 py-1 text-xs font-bold text-[#8a5200]">
              最多人選
            </div>

            <div className="pr-20">
              <h2 className="text-2xl font-bold">標準包</h2>
              <p className="mt-2 text-sm text-[#6b6257]">
                適合穩定查看，但不想直接升級 VIP 的會員
              </p>
            </div>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">NT$1,000</span>
            </div>

            <ul className="mt-8 space-y-4 text-[15px] leading-7 text-[#5f554b]">
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>可解鎖完整需求 20 筆</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>每筆平均 NT$50</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>適合穩定使用但仍想控制成本</span>
              </li>
            </ul>

            <p className="mt-4 text-sm text-[#7b6f63]">
              平均單筆成本更低，是最多會員選擇的方案。
            </p>

            <button
              type="button"
              onClick={() => handleCreditPurchase("credits_20")}
              disabled={loadingPlan !== null}
              className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-[#ab3b2b] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingPlan === "credits_20" ? "跳轉中..." : "立即購買 20 點"}
            </button>
          </div>

          <div className="rounded-[28px] border border-[#dcebdd] bg-[#f3fbf3] p-7 shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">高級包</h2>
                <p className="mt-2 text-sm text-[#6b6257]">
                  適合長期使用，單筆成本更低
                </p>
              </div>

              <span className="rounded-full bg-[#d7f3d7] px-3 py-1 text-xs font-bold text-[#26814a]">
                最划算
              </span>
            </div>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">NT$2,000</span>
            </div>

            <ul className="mt-8 space-y-4 text-[15px] leading-7 text-[#5f554b]">
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>可解鎖完整需求 50 筆</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>每筆平均 NT$40</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-[#b04a36]">✓</span>
                <span>大量使用者最適合</span>
              </li>
            </ul>

            <p className="mt-4 text-sm text-[#7b6f63]">
              單筆成本最低，適合長期穩定使用。
            </p>

            <button
              type="button"
              onClick={() => handleCreditPurchase("credits_50")}
              disabled={loadingPlan !== null}
              className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-[#2459b8] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingPlan === "credits_50" ? "跳轉中..." : "立即購買 50 點"}
            </button>
          </div>
        </div>

        <section className="mt-14 rounded-[28px] border border-[#e7dfd5] bg-white p-6 shadow-sm md:mt-16 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">升級後可獲得什麼？</h2>
              <p className="mt-2 text-sm text-[#6b6257]">
                不同需求可自由搭配，快速提升查看效率。
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#faf7f2] p-5">
              <div className="text-lg font-bold text-[#2f2a25]">查看完整內容</div>
              <p className="mt-2 text-sm leading-7 text-[#6f6458]">
                可查看借款需求的完整資訊，不再只看到部分內容。
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf7f2] p-5">
              <div className="text-lg font-bold text-[#2f2a25]">快速掌握案件</div>
              <p className="mt-2 text-sm leading-7 text-[#6f6458]">
                更快篩選合適案件，提升媒合效率與成交機會。
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf7f2] p-5">
              <div className="text-lg font-bold text-[#2f2a25]">依需求彈性選擇</div>
              <p className="mt-2 text-sm leading-7 text-[#6f6458]">
                可選擇月費、年費或點數方案，依使用頻率自由搭配。
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[28px] border border-[#e7dfd5] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">方案怎麼選？</h2>
              <p className="mt-2 text-sm text-[#6b6257]">
                依你的查看頻率與預算，選擇最合適的方案。
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#f8f5ef] p-5">
              <div className="text-lg font-bold text-[#2f2a25]">先體驗平台</div>
              <p className="mt-2 text-sm leading-7 text-[#6b6257]">
                建議先從免費會員開始，了解平台案件品質與操作方式。
              </p>
            </div>

            <div className="rounded-2xl bg-[#fffaf5] p-5">
              <div className="text-lg font-bold text-[#2f2a25]">穩定開發案件</div>
              <p className="mt-2 text-sm leading-7 text-[#6b6257]">
                若每月固定查看需求，VIP 月費或年費會比點數更划算。
              </p>
            </div>

            <div className="rounded-2xl bg-[#f3fbf3] p-5">
              <div className="text-lg font-bold text-[#2f2a25]">偶爾查看需求</div>
              <p className="mt-2 text-sm leading-7 text-[#6b6257]">
                若只是偶爾查看幾筆案件，購買解鎖點數會更彈性。
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}