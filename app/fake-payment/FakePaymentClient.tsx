"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PlanInfo = {
  name: string;
  price: number;
  type: "membership" | "credits";
};

export default function FakePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const plan = searchParams.get("plan");
  const [loading, setLoading] = useState(false);

  const getPlanInfo = (): PlanInfo => {
    switch (plan) {
      case "monthly":
        return { name: "VIP月費", price: 2980, type: "membership" };
      case "yearly":
        return { name: "VIP年費", price: 29800, type: "membership" };
      case "credits_5":
        return { name: "5點解鎖點數", price: 300, type: "credits" };
      case "credits_20":
        return { name: "20點解鎖點數", price: 1000, type: "credits" };
      case "credits_50":
        return { name: "50點解鎖點數", price: 2000, type: "credits" };
      default:
        return { name: "未知方案", price: 0, type: "credits" };
    }
  };

  const addDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const addYear = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString();
  };

  const handlePay = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (!plan) {
        alert("付款方案錯誤");
        setLoading(false);
        return;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("讀取 session 失敗：", sessionError);
      }

      const user = session?.user;

      if (!user) {
        alert("請先登入會員");
        setLoading(false);
        router.push(`/login?redirect=/fake-payment?plan=${plan}`);
        return;
      }

      const { name, price, type } = getPlanInfo();

      let updateData: Record<string, any> = {};
      let expiresAt: string | null = null;

      if (plan === "monthly") {
        expiresAt = addDays(30);
        updateData = {
          membership_plan: "VIP月費",
          membership_status: "active",
          membership_expires_at: expiresAt,
        };
      }

      if (plan === "yearly") {
        expiresAt = addYear();
        updateData = {
          membership_plan: "VIP年費",
          membership_status: "active",
          membership_expires_at: expiresAt,
        };
      }

      if (plan.startsWith("credits")) {
        let addCredits = 0;

        if (plan === "credits_5") addCredits = 5;
        if (plan === "credits_20") addCredits = 20;
        if (plan === "credits_50") addCredits = 50;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("unlock_credits")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("讀取會員資料失敗：", profileError);
          alert(`讀取會員資料失敗：${profileError.message}`);
          setLoading(false);
          return;
        }

        const currentCredits = profile?.unlock_credits ?? 0;

        updateData = {
          unlock_credits: currentCredits + addCredits,
        };
      }

      if (Object.keys(updateData).length === 0) {
        alert("無效方案");
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) {
        console.error("更新 profiles 失敗：", updateError);
        alert(`付款失敗（更新會員資料失敗）：${updateError.message}`);
        setLoading(false);
        return;
      }

      const orderNo = `ORD-${Date.now()}`;

      const { error: orderError } = await supabase.from("orders").insert({
        user_id: user.id,
        order_no: orderNo,
        type,
        plan,
        amount: price,
        status: "paid",
        payment_method: "fake_payment",
        expires_at: expiresAt,
        note: `測試付款成功：${name}`,
      });

      if (orderError) {
        console.error("寫入 orders 失敗：", orderError);
        alert(`付款成功，但訂單紀錄寫入失敗：${orderError.message}`);
        setLoading(false);
        router.push("/member");
        return;
      }

      router.push(`/payment-success?plan=${plan}`);
    } catch (error: any) {
      console.error("付款流程錯誤：", error);
      alert(`系統錯誤：${error?.message || "請稍後再試"}`);
      setLoading(false);
    }
  };

  const { name, price } = getPlanInfo();

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">測試付款頁</h1>

        <div className="mb-4 rounded-xl bg-gray-50 p-4">
          <div className="text-sm text-gray-500">方案名稱</div>
          <div className="mt-1 text-lg font-semibold text-gray-900">{name}</div>
        </div>

        <div className="mb-6 rounded-xl bg-gray-50 p-4">
          <div className="text-sm text-gray-500">付款金額</div>
          <div className="mt-1 text-3xl font-bold text-gray-900">NT${price}</div>
        </div>

        <button
          onClick={handlePay}
          disabled={loading || price <= 0}
          className="w-full rounded-xl bg-red-500 py-3 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "處理中..." : "立即付款（測試）"}
        </button>
      </div>
    </div>
  );
}