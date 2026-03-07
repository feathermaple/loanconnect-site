import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, phone, line_id, city, amount, message, company } = body ?? {};

    // 蜜罐欄位：機器人填到就直接假裝成功
    if (company) {
      return NextResponse.json({ success: true });
    }

    // 基本欄位檢查
    if (!name || !phone) {
      return NextResponse.json(
        { error: "姓名與電話為必填欄位" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFY_EMAIL;

    // 先寫入 Supabase（如果有設定）
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase.from("leads").insert([
        {
          name,
          phone,
          line_id: line_id || null,
          city: city || null,
          amount: amount || null,
          message: message || null,
        },
      ]);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    // 再寄送通知信（如果有設定）
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
          <p><strong>地區：</strong> ${city || "-"}</p>
          <p><strong>金額：</strong> ${amount || "-"}</p>
          <p><strong>需求：</strong> ${message || "-"}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}