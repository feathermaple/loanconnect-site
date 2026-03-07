import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get("admin_auth")?.value;

    if (adminAuth !== "ok") {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const headers = [
      "姓名",
      "電話",
      "LINE",
      "地區",
      "金額",
      "需求",
      "狀態",
      "時間"
    ];

    const rows = data.map((lead: any) => [
      lead.name,
      lead.phone,
      lead.line_id,
      lead.city,
      lead.amount,
      lead.message,
      lead.status,
      new Date(lead.created_at).toLocaleString()
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=loan-leads.csv"
      }
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "server error" },
      { status: 500 }
    );
  }
}