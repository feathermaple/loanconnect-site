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
      role,
      membership_plan,
      membership_status,
      membership_expires_at,
      admin_note,
    } = body || {};

    if (!userId) {
      return NextResponse.json({ error: "缺少 userId" }, { status: 400 });
    }

    const allowedRoles = ["user", "borrower", "lender", "admin"];
    const allowedPlans = ["free", "vip", "monthly", "yearly", "gold", "platinum"];
    const allowedStatuses = ["inactive", "active", "expired", "suspended"];

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (role !== undefined) {
      if (!allowedRoles.includes(role)) {
        return NextResponse.json({ error: "role 不合法" }, { status: 400 });
      }
      updatePayload.role = role;
    }

    if (membership_plan !== undefined) {
      if (!allowedPlans.includes(membership_plan)) {
        return NextResponse.json(
          { error: "membership_plan 不合法" },
          { status: 400 }
        );
      }
      updatePayload.membership_plan = membership_plan;
    }

    if (membership_status !== undefined) {
      if (!allowedStatuses.includes(membership_status)) {
        return NextResponse.json(
          { error: "membership_status 不合法" },
          { status: 400 }
        );
      }
      updatePayload.membership_status = membership_status;
    }

    if (membership_expires_at !== undefined) {
      updatePayload.membership_expires_at = membership_expires_at || null;
    }

    if (admin_note !== undefined) {
      updatePayload.admin_note = admin_note || "";
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update(updatePayload)
      .eq("id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "會員資料已更新",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "伺服器錯誤" },
      { status: 500 }
    );
  }
}