import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/require-admin";

type LeadType = "borrower" | "ads" | "lenders";

const TABLE_MAP: Record<LeadType, { table: string }> = {
  borrower: { table: "loan_requests" },
  ads: { table: "lender_ads" },
  lenders: { table: "profiles" },
};

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const type = request.nextUrl.searchParams.get("type") as LeadType | null;

  if (!type || !TABLE_MAP[type]) {
    return NextResponse.json({ error: "缺少或無效的 type" }, { status: 400 });
  }

  try {
    const admin = createAdminClient();

    let query = admin.from(TABLE_MAP[type].table).select("*");

    if (type === "lenders") {
      query = query.eq("role", "lender");
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      return NextResponse.json(
        { error: `讀取資料失敗：${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ rows: data ?? [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "讀取資料失敗" },
      { status: 500 }
    );
  }
}