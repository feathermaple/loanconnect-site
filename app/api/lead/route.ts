import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, phone, line_id, city, amount, message, company } = body;

    if (company) { 
      return Response.json({ success: true });
    }

    const { error } = await supabase.from("leads").insert([
      {
        name,
        phone,
        line_id,
        city,
        amount,
        message,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.NOTIFY_EMAIL!,
      subject: `新貸款申請：${name}`,
      html: `
      <h2>新貸款名單</h2>
      <p><strong>姓名:</strong> ${name}</p>
      <p><strong>電話:</strong> ${phone}</p>
      <p><strong>LINE:</strong> ${line_id || "-"}</p>
      <p><strong>地區:</strong> ${city}</p>
      <p><strong>金額:</strong> ${amount}</p>
      <p><strong>需求:</strong> ${message || "-"}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "server error" },
      { status: 500 }
    );
  }
}