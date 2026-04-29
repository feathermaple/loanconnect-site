import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/require-admin";

type LeadType = "borrower" | "ads" | "lenders";

const TABLE_MAP: Record<LeadType, string> = {
  borrower: "loan_requests",
  ads: "lender_ads",
  lenders: "profiles",
};

function getType(request: NextRequest): LeadType {
  const type = request.nextUrl.searchParams.get("type");
  if (type === "ads") return "ads";
  if (type === "lenders") return "lenders";
  return "borrower";
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const type = getType(request);
    const admin = createAdminClient();

    let query = admin.from(TABLE_MAP[type]).select("*");

    if (type === "lenders") {
      query = query.eq("role", "lender");
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, rows: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      type,
      table: TABLE_MAP[type],
      rows: data ?? [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "讀取失敗", rows: [] },
      { status: 500 }
    );
  }
}
