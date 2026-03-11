import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      line_id,
      email,
      city,
      district,
      amount,
      loan_type,
      message,
      company,
      customer_user_id,
    } = body ?? {};

    if (company) {
      return NextResponse.json({ success: true });
    }

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "姓名與電話為必填欄位" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Supabase 環境變數未設定完整" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("customer_leads").insert([
      {
        customer_user_id: customer_user_id || null,
        name,
        phone,
        line_id: line_id || null,
        email: email || null,
        city: city || null,
        district: district || null,
        amount: amount || null,
        loan_type: loan_type || null,
        message: message || null,
        status: "new",
        source: "homepage_form",
      },
    ]);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFY_EMAIL;

    if (resendApiKey && notifyEmail) {
      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: "LoanConnect <onboarding@resend.dev>",
        to: [notifyEmail],
        subject: `新貸款申請：${name}`,
        html: `
          <h2>新貸款名單</h2>
          <p><strong>姓名：</strong> ${name}</p>
          <p><strong>電話：</strong> ${phone}</p>
          <p><strong>LINE：</strong> ${line_id || "-"}</p>
          <p><strong>Email：</strong> ${email || "-"}</p>
          <p><strong>城市：</strong> ${city || "-"}</p>
          <p><strong>區域：</strong> ${district || "-"}</p>
          <p><strong>金額：</strong> ${amount || "-"}</p>
          <p><strong>貸款類型：</strong> ${loan_type || "-"}</p>
          <p><strong>需求：</strong> ${message || "-"}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}