"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

// 👉 原本全部內容搬進來（完全不動）
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
      return "你已成功開通 VIP 月費會員";
    default:
      return "付款成功";
  }
}

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  return (
    <div>
      <h1>付款成功</h1>
      <p>{getSuccessDesc(plan)}</p>
      <div>{getPlanText(plan)}</div>
      <Link href="/member">回會員中心</Link>
    </div>
  );
}