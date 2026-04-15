import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, needId } = body;

    if (!userId || !needId) {
      return NextResponse.json(
        { error: "缺少參數" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ 必須用這個
    );

    // 1️⃣ 取得會員資料
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("unlock_credits, membership_status")
      .eq("id", userId)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "讀取會員資料失敗" },
        { status: 500 }
      );
    }

    const isVIP = profile.membership_status === "active";

    // 2️⃣ 如果不是 VIP 才扣點
    if (!isVIP) {
      const credits = profile.unlock_credits || 0;

      if (credits <= 0) {
        return NextResponse.json(
          { error: "點數不足" },
          { status: 400 }
        );
      }

      // 扣點
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          unlock_credits: credits - 1,
        })
        .eq("id", userId);

      if (updateError) {
        return NextResponse.json(
          { error: "扣點失敗" },
          { status: 500 }
        );
      }
    }

    // 3️⃣ 記錄解鎖（🔥重點）
    const { error: logError } = await supabase
      .from("unlock_logs")
      .insert({
        user_id: userId,
        need_id: needId,
        credit_cost: isVIP ? 0 : 1,
        unlock_type: isVIP ? "vip" : "credit",
        note: isVIP
          ? "VIP 會員查看需求"
          : "使用點數解鎖需求",
      });

    if (logError) {
      console.error("寫入 unlock_logs 失敗", logError);
    }

    return NextResponse.json({
      success: true,
      isVIP,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "系統錯誤" },
      { status: 500 }
    );
  }
}