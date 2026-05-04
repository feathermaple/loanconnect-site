import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/require-admin";

type LeadType = "borrower" | "ads" | "lenders";

const TABLE_MAP: Record<LeadType, { table: string; pk: string }> = {
  borrower: { table: "loan_requests", pk: "id" },
  ads: { table: "lender_ads", pk: "id" },
  lenders: { table: "profiles", pk: "id" },
};

const ALLOWED_SOURCE_TABLES = [
  "loan_requests",
  "lender_ads",
  "paid_lender_ads",
  "profiles",
];

const HIDDEN_FIELDS = ["password", "hashed_password"];

function getConfig(type: LeadType, sourceTable?: string | null) {
  const base = TABLE_MAP[type];

  if (
    sourceTable &&
    ALLOWED_SOURCE_TABLES.includes(sourceTable) &&
    (
      (type === "borrower" && sourceTable === "loan_requests") ||
      (type === "ads" &&
        (sourceTable === "lender_ads" || sourceTable === "paid_lender_ads")) ||
      (type === "lenders" &&
        (sourceTable === "profiles" || sourceTable === "lender_ads"))
    )
  ) {
    return {
      table: sourceTable,
      pk: "id",
    };
  }

  return base;
}

function sanitizePayload(payload: Record<string, any>) {
  const next: Record<string, any> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (["id", "created_at", "updated_at", "source_label"].includes(key)) continue;
    if (key.startsWith("__")) continue;
    if (HIDDEN_FIELDS.includes(key)) continue;
    next[key] = value;
  }

  return next;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const body = await request.json();

  const type = body?.type as LeadType | undefined;
  const sourceTable = body?.source_table as string | undefined;
  const payload = body?.payload as Record<string, any> | undefined;

  if (!type || !TABLE_MAP[type]) {
    return NextResponse.json({ error: "缺少或無效的 type" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "缺少 payload" }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const config = getConfig(type, sourceTable);
    const safePayload = sanitizePayload(payload);

    const { data, error } = await admin
      .from(config.table)
      .update(safePayload)
      .eq(config.pk, id)
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: `更新失敗：${error.message}` },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "沒有任何資料被更新" },
        { status: 400 }
      );
    }

    return NextResponse.json({ row: data[0] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "更新失敗" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const type = request.nextUrl.searchParams.get("type") as LeadType | null;
  const sourceTable = request.nextUrl.searchParams.get("source_table");

  if (!type || !TABLE_MAP[type]) {
    return NextResponse.json({ error: "缺少或無效的 type" }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const config = getConfig(type, sourceTable);

    const { data, error } = await admin
      .from(config.table)
      .delete()
      .eq(config.pk, id)
      .select("*");

    if (error) {
      return NextResponse.json(
        { error: `刪除失敗：${error.message}` },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "沒有任何資料被刪除" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "刪除失敗" },
      { status: 500 }
    );
  }
}