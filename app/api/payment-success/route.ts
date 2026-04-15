import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getExpireAt(plan: "monthly" | "yearly") {
  const now = new Date();

  if (plan === "monthly") {
    now.setMonth(now.getMonth() + 1);
  } else {
    now.setFullYear(now.getFullYear() + 1);
  }

  return now.toISOString();
}

function getOrderNo() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const i = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);

  return `ORD-${y}${m}${d}${h}${i}${s}-${rand}`;
}

export async function POST(req: Request) {
  try {
    const { userId, plan } = await req.json();

    if (!userId || !plan || !["monthly", "yearly"].includes(plan)) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    const membershipPlan = plan === "monthly" ? "VIP月費" : "VIP年費";
    const membershipExpiresAt = getExpireAt(plan);
    const amount = plan === "monthly" ? 2980 : 29800;
    const orderNo = getOrderNo();

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        membership_plan: membershipPlan,
        membership_status: "active",
        membership_expires_at: membershipExpiresAt,
      })
      .eq("id", userId);

    if (profileError) {
      console.error("profile update error:", profileError);
      return NextResponse.json({ error: "會員升級失敗" }, { status: 500 });
    }

    const { error: orderError } = await supabase.from("orders").insert({
      order_no: orderNo,
      user_id: userId,
      order_type: "membership",
      plan_code: plan,
      amount,
      currency: "TWD",
      status: "paid",
      payment_method: "fake_payment",
      paid_at: new Date().toISOString(),
      membership_expires_at: membershipExpiresAt,
      unlock_credits: 0,
      note: "測試付款成功，自動升級會員",
    });

    if (orderError) {
      console.error("order insert error:", orderError);
      return NextResponse.json(
        { error: "會員已升級，但訂單紀錄寫入失敗" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order_no: orderNo,
      membership_plan: membershipPlan,
      membership_status: "active",
      membership_expires_at: membershipExpiresAt,
    });
  } catch (error) {
    console.error("payment-success error:", error);
    return NextResponse.json({ error: "系統錯誤" }, { status: 500 });
  }
}