import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

function formatDateTime(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("zh-TW");
}

function getStatusText(status: string | null | undefined) {
  switch (status) {
    case "new":
      return "未聯絡";
    case "contacted":
      return "已聯絡";
    case "closed":
      return "已成交";
    case "invalid":
      return "無效";
    default:
      return "未聯絡";
  }
}

function getStatusBadgeClass(status: string | null | undefined) {
  switch (status) {
    case "contacted":
      return "bg-blue-100 text-blue-700";
    case "closed":
      return "bg-green-100 text-green-700";
    case "invalid":
      return "bg-red-100 text-red-700";
    case "new":
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-[#ddd6cc] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="text-sm text-[#7a7065]">{title}</div>
      <div className="mt-2 text-4xl font-bold text-[#2f2a25]">{value}</div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const { data: leads, error } = await supabase
    .from("customer_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[#2f2a25]">後台儀表板</h1>
        <p className="mt-4 text-red-600">讀取失敗：{error.message}</p>
      </div>
    );
  }

  const list = leads ?? [];

  const now = new Date();
  const todayStr = now.toLocaleDateString("en-CA");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString("en-CA");

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const todayCount = list.filter((lead: any) => {
    if (!lead.created_at) return false;
    return new Date(lead.created_at).toLocaleDateString("en-CA") === todayStr;
  }).length;

  const yesterdayCount = list.filter((lead: any) => {
    if (!lead.created_at) return false;
    return (
      new Date(lead.created_at).toLocaleDateString("en-CA") === yesterdayStr
    );
  }).length;

  const monthCount = list.filter((lead: any) => {
    if (!lead.created_at) return false;
    const d = new Date(lead.created_at);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).length;

  const totalCount = list.length;

  const newCount = list.filter(
    (lead: any) => !lead.status || lead.status === "new"
  ).length;

  const contactedCount = list.filter(
    (lead: any) => lead.status === "contacted"
  ).length;

  const closedCount = list.filter(
    (lead: any) => lead.status === "closed"
  ).length;

  const invalidCount = list.filter(
    (lead: any) => lead.status === "invalid"
  ).length;

  const closeRate =
    totalCount > 0 ? ((closedCount / totalCount) * 100).toFixed(1) : "0.0";

  const recentLeads = list.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2f2a25]">後台儀表板</h1>
          <p className="mt-2 text-sm text-[#7a7065]">
            查看整體名單表現與最新申請狀況
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/leads"
            className="rounded-xl bg-[#4b433b] px-5 py-3 text-white transition hover:opacity-90"
          >
            查看名單
          </Link>

          <a
            href="/api/admin/export-leads"
            className="rounded-xl bg-green-600 px-5 py-3 text-white transition hover:opacity-90"
          >
            匯出 CSV
          </a>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="今日名單" value={todayCount} />
        <StatCard title="昨日名單" value={yesterdayCount} />
        <StatCard title="本月名單" value={monthCount} />
        <StatCard title="總名單" value={totalCount} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="未聯絡" value={newCount} />
        <StatCard title="已聯絡" value={contactedCount} />
        <StatCard title="已成交" value={closedCount} />
        <StatCard title="無效名單" value={invalidCount} />
        <StatCard title="成交率" value={`${closeRate}%`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-[#ddd6cc] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#ebe5dd] px-5 py-4">
            <h2 className="text-lg font-bold text-[#2f2a25]">最新申請名單</h2>
            <Link
              href="/admin/leads"
              className="text-sm font-medium text-[#4b433b] underline"
            >
              查看全部
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f3f1ee] text-[#2f2a25]">
                <tr>
                  <th className="px-4 py-4 text-left">姓名</th>
                  <th className="px-4 py-4 text-left">電話</th>
                  <th className="px-4 py-4 text-left">城市</th>
                  <th className="px-4 py-4 text-left">金額</th>
                  <th className="px-4 py-4 text-left">狀態</th>
                  <th className="px-4 py-4 text-left">時間</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead: any) => (
                  <tr key={lead.id} className="border-t border-[#ebe5dd]">
                    <td className="px-4 py-4">{lead.name || "-"}</td>

                    <td className="px-4 py-4">
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-blue-600 underline"
                        >
                          {lead.phone}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {[lead.city, lead.district].filter(Boolean).join(" ") || "-"}
                    </td>

                    <td className="px-4 py-4">{lead.amount || "-"}</td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                          lead.status
                        )}`}
                      >
                        {getStatusText(lead.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {formatDateTime(lead.created_at)}
                    </td>
                  </tr>
                ))}

                {recentLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-[#7a7065]"
                    >
                      目前沒有資料
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#ddd6cc] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#2f2a25]">快速操作</h2>
            <div className="mt-4 grid gap-3">
              <Link
                href="/admin/leads"
                className="rounded-xl bg-[#4b433b] px-4 py-3 text-center text-white transition hover:opacity-90"
              >
                進入名單管理
              </Link>

              <a
                href="/api/admin/export-leads"
                className="rounded-xl bg-green-600 px-4 py-3 text-center text-white transition hover:opacity-90"
              >
                匯出全部名單 CSV
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ddd6cc] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#2f2a25]">狀態說明</h2>
            <div className="mt-4 space-y-3 text-sm text-[#6f665d]">
              <div className="flex items-center justify-between rounded-lg bg-[#f7f4ef] px-4 py-3">
                <span>未聯絡</span>
                <span>{newCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#f7f4ef] px-4 py-3">
                <span>已聯絡</span>
                <span>{contactedCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#f7f4ef] px-4 py-3">
                <span>已成交</span>
                <span>{closedCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#f7f4ef] px-4 py-3">
                <span>無效</span>
                <span>{invalidCount}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ddd6cc] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#2f2a25]">今日重點</h2>
            <div className="mt-4 space-y-2 text-sm text-[#6f665d]">
              <p>今日新進名單：{todayCount} 筆</p>
              <p>本月累積名單：{monthCount} 筆</p>
              <p>累積成交率：{closeRate}%</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}