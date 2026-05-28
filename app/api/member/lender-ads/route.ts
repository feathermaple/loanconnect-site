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
      .from("paid_lender_ads")
      .select("*")
      .eq("lender_user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ads: data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "讀取放款廣告失敗" },
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
      title,
      company_name,
      contact_name,
      region,
      loan_types,
      min_amount,
      max_amount,
      phone,
      line_id,
      ad_content,
      is_active,
    } = body || {};

    if (!id) {
      return NextResponse.json({ error: "缺少廣告 ID" }, { status: 400 });
    }

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updatePayload.title = title;
    if (company_name !== undefined) updatePayload.company_name = company_name;
    if (contact_name !== undefined) updatePayload.contact_name = contact_name;
    if (region !== undefined) updatePayload.region = region;
    if (loan_types !== undefined) updatePayload.loan_types = loan_types;
    if (min_amount !== undefined) updatePayload.min_amount = min_amount ? Number(min_amount) : null;
    if (max_amount !== undefined) updatePayload.max_amount = max_amount ? Number(max_amount) : null;
    if (phone !== undefined) updatePayload.phone = phone;
    if (line_id !== undefined) updatePayload.line_id = line_id;
    if (ad_content !== undefined) updatePayload.ad_content = ad_content;
    if (is_active !== undefined) updatePayload.is_active = is_active;

    const { data, error } = await supabase
      .from("paid_lender_ads")
      .update(updatePayload)
      .eq("id", id)
      .eq("lender_user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ad: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "更新放款廣告失敗" },
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
      return NextResponse.json({ error: "缺少廣告 ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("paid_lender_ads")
      .delete()
      .eq("id", id)
      .eq("lender_user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "放款廣告已刪除",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "刪除放款廣告失敗" },
      { status: 500 }
    );
  }
}