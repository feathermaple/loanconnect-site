import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

type SearchParams = {
  q?: string;
  status?: string;
};

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

async function updateLeadStatus(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "new");

  if (!id) return;

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("customer_leads")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("更新狀態失敗：", error.message);
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
}

async function updateLeadAssign(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const assigned_to = String(formData.get("assigned_to") || "");

  if (!id) return;

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("customer_leads")
    .update({
      assigned_to,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("更新負責人失敗：", error.message);
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
}

async function updateLeadNote(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const note = String(formData.get("note") || "");

  if (!id) return;

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("customer_leads")
    .update({
      note,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("更新備註失敗：", error.message);
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
}

async function deleteLead(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("customer_leads")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("刪除名單失敗：", error.message);
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const statusFilter = params.status?.trim() || "";

  const supabase = createAdminClient();

  let query = supabase
    .from("customer_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(
      [
        `name.ilike.%${q}%`,
        `phone.ilike.%${q}%`,
        `line_id.ilike.%${q}%`,
        `city.ilike.%${q}%`,
        `district.ilike.%${q}%`,
        `email.ilike.%${q}%`,
        `assigned_to.ilike.%${q}%`,
        `note.ilike.%${q}%`,
      ].join(",")
    );
  }

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data: leads, error } = await query;

  const { data: allLeads, error: allError } = await supabase
    .from("customer_leads")
    .select("*");

  if (error || allError) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[#2f2a25]">貸款申請名單</h1>
        <p className="mt-4 text-red-600">
          讀取失敗：{error?.message || allError?.message}
        </p>
      </div>
    );
  }

  const list = leads ?? [];
  const allList = allLeads ?? [];

  const now = new Date();
  const todayStr = now.toLocaleDateString("en-CA");
  const month = now.getMonth();
  const year = now.getFullYear();

  const todayCount = allList.filter((lead: any) => {
    if (!lead.created_at) return false;
    return new Date(lead.created_at).toLocaleDateString("en-CA") === todayStr;
  }).length;

  const monthCount = allList.filter((lead: any) => {
    if (!lead.created_at) return false;
    const d = new Date(lead.created_at);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;

  const newCount = allList.filter(
    (lead: any) => !lead.status || lead.status === "new"
  ).length;

  const contactedCount = allList.filter(
    (lead: any) => lead.status === "contacted"
  ).length;

  const closedCount = allList.filter(
    (lead: any) => lead.status === "closed"
  ).length;

  const invalidCount = allList.filter(
    (lead: any) => lead.status === "invalid"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2f2a25]">貸款申請名單</h1>
          <p className="mt-2 text-sm text-[#7a7065]">
            管理表單名單、更新狀態、快速聯絡、備註追蹤與匯出資料
          </p>
        </div>

        <a
          href="/api/admin/export-leads"
          className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-white transition hover:opacity-90"
        >
          匯出 CSV
        </a>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="今日名單" value={todayCount} />
        <StatCard title="本月名單" value={monthCount} />
        <StatCard title="未聯絡" value={newCount} />
        <StatCard title="已聯絡" value={contactedCount} />
        <StatCard title="已成交" value={closedCount} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        <StatCard title="無效名單" value={invalidCount} />
        <StatCard title="目前顯示筆數" value={list.length} />
      </section>

      <form
        method="GET"
        className="grid gap-4 rounded-2xl border border-[#ddd6cc] bg-white p-4 shadow-sm md:grid-cols-[1fr_320px]"
      >
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="搜尋姓名、電話、LINE、地區、Email、負責人、備註"
          className="h-14 rounded-2xl border border-[#d9d1c7] bg-white px-4 text-base outline-none focus:border-[#8f7f6b]"
        />

        <select
          name="status"
          defaultValue={statusFilter}
          className="h-14 rounded-2xl border border-[#d9d1c7] bg-white px-4 text-base outline-none focus:border-[#8f7f6b]"
        >
          <option value="">全部狀態</option>
          <option value="new">未聯絡</option>
          <option value="contacted">已聯絡</option>
          <option value="closed">已成交</option>
          <option value="invalid">無效</option>
        </select>

        <div className="flex gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-[#4b433b] px-5 py-3 text-white transition hover:opacity-90"
          >
            搜尋
          </button>

          <a
            href="/admin/leads"
            className="rounded-xl border border-[#d9d1c7] bg-white px-5 py-3 text-[#4b433b] transition hover:bg-[#f7f4ef]"
          >
            清除條件
          </a>
        </div>
      </form>

      <div className="rounded-2xl border border-[#ddd6cc] bg-white p-4 text-sm text-[#6f665d] shadow-sm">
        共 {list.length} 筆名單
        {q ? `，關鍵字：「${q}」` : ""}
        {statusFilter ? `，狀態：${getStatusText(statusFilter)}` : ""}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#ddd6cc] bg-white shadow-sm">
        <table className="min-w-[1800px] w-full text-sm">
          <thead className="bg-[#f3f1ee] text-[#2f2a25]">
            <tr>
              <th className="px-4 py-4 text-left">姓名</th>
              <th className="px-4 py-4 text-left">電話</th>
              <th className="px-4 py-4 text-left">LINE</th>
              <th className="px-4 py-4 text-left">Email</th>
              <th className="px-4 py-4 text-left">城市</th>
              <th className="px-4 py-4 text-left">區域</th>
              <th className="px-4 py-4 text-left">金額</th>
              <th className="px-4 py-4 text-left">貸款類型</th>
              <th className="px-4 py-4 text-left">需求</th>
              <th className="px-4 py-4 text-left">狀態</th>
              <th className="px-4 py-4 text-left">負責人</th>
              <th className="px-4 py-4 text-left">備註</th>
              <th className="px-4 py-4 text-left">來源</th>
              <th className="px-4 py-4 text-left">建立時間</th>
              <th className="px-4 py-4 text-left">更新時間</th>
              <th className="px-4 py-4 text-left">操作</th>
            </tr>
          </thead>

          <tbody>
            {list.map((lead: any) => (
              <tr key={lead.id} className="border-t border-[#ebe5dd] align-top">
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
                  {lead.line_id ? (
                    <a
                      href={`https://line.me/ti/p/~${lead.line_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-600 underline"
                    >
                      {lead.line_id}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-4 py-4">{lead.email || "-"}</td>
                <td className="px-4 py-4">{lead.city || "-"}</td>
                <td className="px-4 py-4">{lead.district || "-"}</td>
                <td className="px-4 py-4">{lead.amount || "-"}</td>
                <td className="px-4 py-4">{lead.loan_type || "-"}</td>
                <td className="px-4 py-4 whitespace-pre-wrap">
                  {lead.message || "-"}
                </td>

                <td className="px-4 py-4">
                  <div className="mb-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                        lead.status
                      )}`}
                    >
                      {getStatusText(lead.status)}
                    </span>
                  </div>

                  <form action={updateLeadStatus} className="flex flex-col gap-2">
                    <input type="hidden" name="id" value={lead.id} />
                    <select
                      name="status"
                      defaultValue={lead.status || "new"}
                      className="rounded-lg border border-[#d9d1c7] px-3 py-2"
                    >
                      <option value="new">未聯絡</option>
                      <option value="contacted">已聯絡</option>
                      <option value="closed">已成交</option>
                      <option value="invalid">無效</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#4b433b] px-3 py-2 text-white transition hover:opacity-90"
                    >
                      更新
                    </button>
                  </form>
                </td>

                <td className="px-4 py-4">
                  <form action={updateLeadAssign} className="flex flex-col gap-2">
                    <input type="hidden" name="id" value={lead.id} />
                    <input
                      type="text"
                      name="assigned_to"
                      defaultValue={lead.assigned_to || ""}
                      placeholder="輸入負責人"
                      className="min-w-[120px] rounded-lg border border-[#d9d1c7] px-3 py-2"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-[#4b433b] px-3 py-2 text-white transition hover:opacity-90"
                    >
                      儲存
                    </button>
                  </form>
                </td>

                <td className="px-4 py-4">
                  <form action={updateLeadNote} className="flex flex-col gap-2">
                    <input type="hidden" name="id" value={lead.id} />
                    <textarea
                      name="note"
                      defaultValue={lead.note || ""}
                      placeholder="輸入備註內容"
                      rows={4}
                      className="min-w-[220px] rounded-lg border border-[#d9d1c7] px-3 py-2"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-[#4b433b] px-3 py-2 text-white transition hover:opacity-90"
                    >
                      儲存
                    </button>
                  </form>
                </td>

                <td className="px-4 py-4">{lead.source || "-"}</td>

                <td className="px-4 py-4">
                  {lead.created_at
                    ? new Date(lead.created_at).toLocaleString("zh-TW")
                    : "-"}
                </td>

                <td className="px-4 py-4">
                  {lead.updated_at
                    ? new Date(lead.updated_at).toLocaleString("zh-TW")
                    : "-"}
                </td>

                <td className="px-4 py-4">
                  <form action={deleteLead}>
                    <input type="hidden" name="id" value={lead.id} />
                    <button
                      type="submit"
                      className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                    >
                      刪除
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan={16} className="px-4 py-10 text-center text-[#7a7065]">
                  目前沒有符合條件的資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}