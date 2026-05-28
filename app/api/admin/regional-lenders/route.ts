import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await adminSupabase
    .from("regional_lenders")
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
    .from("regional_lenders")
    .insert({
      title: body.title || "",
      region: body.region || "",
      city: body.city || "",
      district: body.district || "",
      contact_name: body.contact_name || "",
      phone: body.phone || "",
      line_id: body.line_id || "",
      description: body.description || "",
      is_active: body.is_active ?? true,
      is_top: body.is_top ?? false,
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
  if (body.region !== undefined) payload.region = body.region;
  if (body.city !== undefined) payload.city = body.city;
  if (body.district !== undefined) payload.district = body.district;
  if (body.contact_name !== undefined) payload.contact_name = body.contact_name;
  if (body.phone !== undefined) payload.phone = body.phone;
  if (body.line_id !== undefined) payload.line_id = body.line_id;
  if (body.description !== undefined) payload.description = body.description;
  if (body.is_active !== undefined) payload.is_active = body.is_active;
  if (body.is_top !== undefined) payload.is_top = body.is_top;

  const { data, error } = await adminSupabase
    .from("regional_lenders")
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
    .from("regional_lenders")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}