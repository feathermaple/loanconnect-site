import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "缺少 userId" },
        { status: 400 }
      );
    }

    // 1. 先刪 profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    // 2. 再刪 Authentication Users
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "會員帳號已完整刪除",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "刪除會員失敗",
      },
      { status: 500 }
    );
  }
}