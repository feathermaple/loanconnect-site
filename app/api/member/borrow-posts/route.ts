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
      .from("customer_leads")
      .select("*")
      .eq("customer_user_id", user.id)
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
      customer_name,
      phone,
      line_id,
      city,
      district,
      loan_amount,
      purpose,
      note,
      status,
    } = body || {};

    if (!id) {
      return NextResponse.json({ error: "缺少資料 ID" }, { status: 400 });
    }

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (customer_name !== undefined) updatePayload.customer_name = customer_name;
    if (phone !== undefined) updatePayload.phone = phone;
    if (line_id !== undefined) updatePayload.line_id = line_id;
    if (city !== undefined) updatePayload.city = city;
    if (district !== undefined) updatePayload.district = district;
    if (loan_amount !== undefined) updatePayload.loan_amount = loan_amount;
    if (purpose !== undefined) updatePayload.purpose = purpose;
    if (note !== undefined) updatePayload.note = note;
    if (status !== undefined) updatePayload.status = status;

    const { data, error } = await supabase
      .from("customer_leads")
      .update(updatePayload)
      .eq("id", id)
      .eq("customer_user_id", user.id)
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
      return NextResponse.json({ error: "缺少資料 ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("customer_leads")
      .delete()
      .eq("id", id)
      .eq("customer_user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "借款需求已刪除",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "刪除借款需求失敗" },
      { status: 500 }
    );
  }
}