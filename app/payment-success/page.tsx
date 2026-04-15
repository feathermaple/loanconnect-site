"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function getPlanText(plan: string | null) {
  switch (plan) {
    case "monthly":
      return "VIP 月費";
    case "yearly":
      return "VIP 年費";
    case "credits_5":
      return "5 點解鎖";
    case "credits_20":
      return "20 點解鎖";
    case "credits_50":
      return "50 點解鎖";
    default:
      return "已購買方案";
  }
}

function getSuccessDesc(plan: string | null) {
  switch (plan) {
    case "monthly":
      return "你已成功開通 VIP 月費會員，現在可以查看完整借款需求內容。";
    case "yearly":
      return "你已成功開通 VIP 年費會員，現在可以不限次查看完整借款需求內容。";
    case "credits_5":
      return "你已成功購買 5 點解鎖點數，可立即用於查看完整借款需求。";
    case "credits_20":
      return "你已成功購買 20 點解鎖點數，現在可以更彈性地解鎖多筆需求。";
    case "credits_50":
      return "你已成功購買 50 點解鎖點數，適合長期穩定使用。";
    default:
      return "你的付款已成功完成，現在可以開始使用對應功能。";
  }
}

function getHighlight(plan: string | null) {
  switch (plan) {
    case "monthly":
      return "已開通 VIP 月費會員";
    case "yearly":
      return "已開通 VIP 年費會員";
    case "credits_5":
      return "解鎖點數 +5";
    case "credits_20":
      return "解鎖點數 +20";
    case "credits_50":
      return "解鎖點數 +50";
    default:
      return "付款成功";
  }
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  return (
    <main className="min-h-screen bg-[#f6f2ec] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-10">
          <div className="mb-6 inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            付款成功
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#2f2a25] md:text-4xl">
            已成功完成購買
          </h1>

          <p className="mt-4 text-base leading-8 text-[#6f6458]">
            {getSuccessDesc(plan)}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-[#eadfce] bg-[#fcfaf7] p-5">
              <div className="text-sm text-[#8a7d70]">購買方案</div>
              <div className="mt-2 text-2xl font-bold text-[#2f2a25]">
                {getPlanText(plan)}
              </div>
            </div>

            <div className="rounded-3xl border border-[#eadfce] bg-[#fcfaf7] p-5">
              <div className="text-sm text-[#8a7d70]">入帳結果</div>
              <div className="mt-2 text-2xl font-bold text-[#c8741f]">
                {getHighlight(plan)}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-[#f0d27a] bg-[#fff8e8] p-5 text-[#7a5a18]">
              你的權限已立即開通，建議現在就開始查看最新借款需求，避免錯過優質案件。
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/needs"
              className="inline-flex items-center justify-center rounded-full bg-[#3b342d] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              立即查看借款需求
            </Link>

            <Link
              href="/member"
              className="inline-flex items-center justify-center rounded-full border border-[#d8cdbf] bg-white px-6 py-3 text-sm font-semibold text-[#3b342d] transition hover:bg-[#faf7f2]"
            >
              前往會員中心
            </Link>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-[#d8cdbf] bg-white px-6 py-3 text-sm font-semibold text-[#3b342d] transition hover:bg-[#faf7f2]"
            >
              查看其他方案
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}