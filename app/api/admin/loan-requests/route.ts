import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await adminSupabase
    .from("loan_requests")
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
    .from("loan_requests")
    .insert({
      nickname: body.nickname || "",
      region: body.region || "",
      amount: body.amount ? Number(body.amount) : null,
      purpose: body.purpose || "",
      phone: body.phone || "",
      line_id: body.line_id || "",
      description: body.description || "",
      status: body.status || "open",
      is_agreed: true,
      user_id: body.user_id || null,
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

  if (body.nickname !== undefined) payload.nickname = body.nickname;
  if (body.region !== undefined) payload.region = body.region;
  if (body.amount !== undefined) payload.amount = body.amount ? Number(body.amount) : null;
  if (body.purpose !== undefined) payload.purpose = body.purpose;
  if (body.phone !== undefined) payload.phone = body.phone;
  if (body.line_id !== undefined) payload.line_id = body.line_id;
  if (body.description !== undefined) payload.description = body.description;
  if (body.status !== undefined) payload.status = body.status;
  if (body.user_id !== undefined) payload.user_id = body.user_id || null;

  const { data, error } = await adminSupabase
    .from("loan_requests")
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
    .from("loan_requests")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}