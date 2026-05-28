import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const SOURCE_TABLES = {
  needs: ["loan_requests"],
  ads: ["paid_lender_ads", "lender_ads"],
  lenders: ["paid_lender_ads", "lender_ads"],
  orders: ["orders"],
} as const;

async function findWorkingTable(
  supabase: ReturnType<typeof createAdminClient>,
  tables: readonly string[]
) {
  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true });

    if (!error) return table;
  }
  return null;
}

async function getCount(
  supabase: ReturnType<typeof createAdminClient>,
  tables: readonly string[]
) {
  let total = 0;
  const workingTables: string[] = [];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true });

    if (!error) {
      total += count || 0;
      workingTables.push(table);
    }
  }

  return {
    table: workingTables.join(" + ") || null,
    count: total,
  };
}

async function getRecentRows(
  supabase: ReturnType<typeof createAdminClient>,
  tables: readonly string[],
  limit = 5
) {
  const allRows: any[] = [];
  const workingTables: string[] = [];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .limit(limit);

    if (!error) {
      workingTables.push(table);

      allRows.push(
        ...(data || []).map((row) => ({
          ...row,
          source_table: table,
        }))
      );
    }
  }

  const rows = allRows
    .sort((a: any, b: any) => {
      const ta = a?.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b?.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    })
    .slice(0, limit);

  return {
    table: workingTables.join(" + ") || null,
    rows,
  };
}

function formatDate(value: any) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("zh-TW");
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/member");
  }

  const adminSupabase = createAdminClient();

  const [needsCount, adsCount, lendersCount, ordersCount, recentNeeds, recentAds, recentLenders] =
    await Promise.all([
      getCount(adminSupabase, SOURCE_TABLES.needs),
      getCount(adminSupabase, SOURCE_TABLES.ads),
      getCount(adminSupabase, SOURCE_TABLES.lenders),
      getCount(adminSupabase, SOURCE_TABLES.orders),
      getRecentRows(adminSupabase, SOURCE_TABLES.needs),
      getRecentRows(adminSupabase, SOURCE_TABLES.ads),
      getRecentRows(adminSupabase, SOURCE_TABLES.lenders),
    ]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">儀表板</h1>
            <p className="mt-2 text-sm text-slate-600">
              查看網站整體數據與後台狀態。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              返回後台首頁
            </Link>

            <Link
              href="/admin/leads"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              前往名單管理
            </Link>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="借款需求"
            value={needsCount.count}
            sub={needsCount.table || "未找到資料表"}
          />
          <StatCard
            title="放款廣告"
            value={adsCount.count}
            sub={adsCount.table || "未找到資料表"}
          />
          <StatCard
            title="各區放款資訊"
            value={lendersCount.count}
            sub={lendersCount.table || "未找到資料表"}
          />
          <StatCard
            title="訂單紀錄"
            value={ordersCount.count}
            sub={ordersCount.table || "未找到資料表"}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <RecentCard
            title="最新借款需求"
            rows={recentNeeds.rows}
            fields={["created_at", "region", "purpose", "nickname", "amount"]}
          />
          <RecentCard
            title="最新放款廣告"
            rows={recentAds.rows}
            fields={["source_table", "created_at", "region", "title", "company_name", "contact_name", "phone"]}
          />
          <RecentCard
            title="最新各區放款資訊"
            rows={recentLenders.rows}
            fields={["created_at", "region", "company_name", "title", "contact_name", "phone"]}
          />
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-4xl font-bold text-slate-900">{value}</div>
      <div className="mt-3 text-sm text-slate-500">{sub}</div>
    </div>
  );
}

function RecentCard({
  title,
  rows,
  fields,
}: {
  title: string;
  rows: any[];
  fields: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>

      {rows.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-6 text-center text-slate-500">
          目前沒有資料
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.id || index}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              {fields.map((field) => {
                if (!(field in row)) return null;

                return (
                  <div key={field} className="mb-1 text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">{field}：</span>
                    {field === "created_at"
                      ? formatDate(row[field])
                      : String(row[field] ?? "-")}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}