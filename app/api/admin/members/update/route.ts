import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      membership_plan,
      membership_status,
      membership_expires_at,
      admin_note,
    } = body || {};

    if (!userId) {
      return NextResponse.json(
        { error: "缺少 userId" },
        { status: 400 }
      );
    }

    const allowedPlans = ["free", "vip", "gold", "platinum"];
    const allowedStatuses = ["inactive", "active", "expired", "suspended"];

    if (!allowedPlans.includes(membership_plan)) {
      return NextResponse.json(
        { error: "membership_plan 不合法" },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(membership_status)) {
      return NextResponse.json(
        { error: "membership_status 不合法" },
        { status: 400 }
      );
    }

    const updatePayload = {
      membership_plan,
      membership_status,
      membership_expires_at: membership_expires_at || null,
      admin_note: admin_note || "",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin
      .from("profiles")
      .update(updatePayload)
      .eq("id", userId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "會員狀態已更新",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "伺服器錯誤" },
      { status: 500 }
    );
  }
}