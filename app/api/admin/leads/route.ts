import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "borrower";

  try {
    if (type === "borrower") {
      const { data, error } = await supabase
        .from("loan_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return NextResponse.json({
        rows: (data || []).map((row) => ({
          source_label: "借款需求",
          __source_table: "loan_requests",
          ...row,
        })),
      });
    }

    if (type === "ads") {
      const { data: freeAds, error: freeError } = await supabase
        .from("lender_ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (freeError) throw freeError;

      const { data: paidAds, error: paidError } = await supabase
        .from("paid_lender_ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (paidError) throw paidError;

      const rows = [
        ...(paidAds || []).map((row) => ({
          source_label: "付費圖文廣告",
          __source_table: "paid_lender_ads",
          ...row,
        })),
        ...(freeAds || []).map((row) => ({
          source_label: "免費放款廣告",
          __source_table: "lender_ads",
          ...row,
        })),
      ];

      return NextResponse.json({ rows });
    }

    if (type === "lenders") {
      const { data, error } = await supabase
        .from("lender_ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return NextResponse.json({
        rows: (data || []).map((row) => ({
          source_label: "各區放款資訊",
          __source_table: "lender_ads",
          ...row,
        })),
      });
    }

    return NextResponse.json({ error: "未知的資料類型" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "讀取資料失敗" },
      { status: 500 }
    );
  }
}