import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await adminSupabase
    .from("paid_lender_ads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, items: data || [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await adminSupabase
    .from("paid_lender_ads")
    .insert({
      title: body.title || `${body.company_name || "未命名"} 放款廣告`,
      company_name: body.company_name || "",
      contact_name: body.contact_name || "",
      region: body.region || "",
      loan_types: body.loan_types || "",
      min_amount: body.min_amount ? Number(body.min_amount) : null,
      max_amount: body.max_amount ? Number(body.max_amount) : null,
      phone: body.phone || "",
      line_id: body.line_id || "",
      ad_content: body.ad_content || "",
      is_active: body.is_active ?? true,
      is_top: body.is_top ?? false,
      lender_user_id: body.lender_user_id || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, item: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }

  const payload: any = {};

  if (body.title !== undefined) payload.title = body.title;
  if (body.company_name !== undefined) payload.company_name = body.company_name;
  if (body.contact_name !== undefined) payload.contact_name = body.contact_name;
  if (body.region !== undefined) payload.region = body.region;
  if (body.loan_types !== undefined) payload.loan_types = body.loan_types;
  if (body.min_amount !== undefined)
    payload.min_amount = body.min_amount ? Number(body.min_amount) : null;
  if (body.max_amount !== undefined)
    payload.max_amount = body.max_amount ? Number(body.max_amount) : null;
  if (body.phone !== undefined) payload.phone = body.phone;
  if (body.line_id !== undefined) payload.line_id = body.line_id;
  if (body.ad_content !== undefined) payload.ad_content = body.ad_content;
  if (body.is_active !== undefined) payload.is_active = body.is_active;
  if (body.is_top !== undefined) payload.is_top = body.is_top;
  if (body.lender_user_id !== undefined)
    payload.lender_user_id = body.lender_user_id || null;

  const { data, error } = await adminSupabase
    .from("paid_lender_ads")
    .update(payload)
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, item: data });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }

  const { error } = await adminSupabase
    .from("paid_lender_ads")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}