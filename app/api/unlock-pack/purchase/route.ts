import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PackCode = "unlock_1" | "unlock_5" | "unlock_10";

function getPackInfo(packCode: PackCode) {
  switch (packCode) {
    case "unlock_1":
      return {
        credits: 1,
        amount: 99,
        note: "購買單筆解鎖 1 筆",
      };
    case "unlock_5":
      return {
        credits: 5,
        amount: 399,
        note: "購買單筆解鎖 5 筆",
      };
    case "unlock_10":
      return {
        credits: 10,
        amount: 699,
        note: "購買單筆解鎖 10 筆",
      };
    default:
      return null;
  }
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
    const { userId, packCode } = await req.json();

    if (!userId || !packCode) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    const pack = getPackInfo(packCode);

    if (!pack) {
      return NextResponse.json({ error: "無效的方案" }, { status: 400 });
    }

    const { data: profile, error: profileReadError } = await supabase
      .from("profiles")
      .select("unlock_credits")
      .eq("id", userId)
      .maybeSingle();

    if (profileReadError) {
      console.error("profile read error:", profileReadError);
      return NextResponse.json({ error: "讀取會員資料失敗" }, { status: 500 });
    }

    const currentCredits = profile?.unlock_credits || 0;
    const nextCredits = currentCredits + pack.credits;

    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        unlock_credits: nextCredits,
      })
      .eq("id", userId);

    if (profileUpdateError) {
      console.error("profile update error:", profileUpdateError);
      return NextResponse.json({ error: "點數加值失敗" }, { status: 500 });
    }

    const orderNo = getOrderNo();

    const { error: orderError } = await supabase.from("orders").insert({
      order_no: orderNo,
      user_id: userId,
      order_type: "unlock_pack",
      plan_code: packCode,
      amount: pack.amount,
      currency: "TWD",
      status: "paid",
      payment_method: "fake_payment",
      paid_at: new Date().toISOString(),
      unlock_credits: pack.credits,
      note: pack.note,
    });

    if (orderError) {
      console.error("order insert error:", orderError);
      return NextResponse.json(
        { error: "點數已加值，但訂單紀錄寫入失敗" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order_no: orderNo,
      packCode,
      added_credits: pack.credits,
      unlock_credits: nextCredits,
    });
  } catch (error) {
    console.error("unlock pack purchase error:", error);
    return NextResponse.json({ error: "系統錯誤" }, { status: 500 });
  }
}