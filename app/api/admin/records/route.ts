import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const SOURCE_TABLES = {
  needs: ["loan_requests"],
  ads: ["lender_ads", "loan_ads", "ads"],
  lenders: ["regional_lenders", "lenders", "lender_profiles"],
} as const;

type SourceKey = keyof typeof SOURCE_TABLES;

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "請先登入" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { ok: false as const, error: "沒有權限" };
  }

  return { ok: true as const, user };
}

async function findWorkingTable(
  adminSupabase: ReturnType<typeof createAdminClient>,
  source: SourceKey
) {
  for (const table of SOURCE_TABLES[source]) {
    const { error } = await adminSupabase
      .from(table)
      .select("id", { head: true, count: "exact" });

    if (!error) return table;
  }
  return null;
}

async function getRows(
  adminSupabase: ReturnType<typeof createAdminClient>,
  source: SourceKey
) {
  const table = await findWorkingTable(adminSupabase, source);
  if (!table) return { table: null, rows: [] as any[] };

  const { data } = await adminSupabase.from(table).select("*").limit(500);

  const rows = (data || []).sort((a: any, b: any) => {
    const ta = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const tb = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return tb - ta;
  });

  return { table, rows };
}

export async function GET() {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const adminSupabase = createAdminClient();

  const [needs, ads, lenders] = await Promise.all([
    getRows(adminSupabase, "needs"),
    getRows(adminSupabase, "ads"),
    getRows(adminSupabase, "lenders"),
  ]);

  return NextResponse.json({
    sources: {
      needs,
      ads,
      lenders,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const body = await req.json();
  const source = body?.source as SourceKey;
  const id = body?.id as string;
  const payload = body?.payload as Record<string, any>;

  if (!source || !SOURCE_TABLES[source]) {
    return NextResponse.json({ error: "無效 source" }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "缺少更新資料" }, { status: 400 });
  }

  delete payload.id;

  const adminSupabase = createAdminClient();
  const table = await findWorkingTable(adminSupabase, source);

  if (!table) {
    return NextResponse.json({ error: "找不到可用資料表" }, { status: 404 });
  }

  const { error } = await adminSupabase.from(table).update(payload).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const body = await req.json();
  const source = body?.source as SourceKey;
  const id = body?.id as string;

  if (!source || !SOURCE_TABLES[source]) {
    return NextResponse.json({ error: "無效 source" }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }

  const adminSupabase = createAdminClient();
  const table = await findWorkingTable(adminSupabase, source);

  if (!table) {
    return NextResponse.json({ error: "找不到可用資料表" }, { status: 404 });
  }

  const { error } = await adminSupabase.from(table).delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}