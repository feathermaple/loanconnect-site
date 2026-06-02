import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "尚未登入" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      posts: data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "讀取借款需求失敗" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "尚未登入" }, { status: 401 });
    }

    const body = await req.json();

    const {
      id,
      nickname,
      region,
      amount,
      purpose,
      phone,
      line_id,
      description,
      status,
    } = body || {};

    if (!id) {
      return NextResponse.json({ error: "缺少資料 ID" }, { status: 400 });
    }

    const updatePayload: any = {};

    if (nickname !== undefined) updatePayload.nickname = nickname;
    if (region !== undefined) updatePayload.region = region;
    if (amount !== undefined) updatePayload.amount = amount;
    if (purpose !== undefined) updatePayload.purpose = purpose;
    if (phone !== undefined) updatePayload.phone = phone;
    if (line_id !== undefined) updatePayload.line_id = line_id;
    if (description !== undefined) updatePayload.description = description;
    if (status !== undefined) updatePayload.status = status;

    const { data, error } = await supabase
      .from("loan_requests")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      post: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "更新借款需求失敗" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "尚未登入" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "缺少借款需求 ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("loan_requests")
      .update({
        status: "delete_requested",
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message || "送出刪除申請失敗" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "已送出刪除申請，等待管理員審核",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "送出刪除申請失敗" },
      { status: 500 }
    );
  }
}