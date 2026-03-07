"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  name: string;
  phone: string;
  line_id: string;
  city: string;
  amount: string;
  message: string;
  status: string;
  created_at: string;
};

const statusOptions = ["未聯絡", "已聯絡", "成交", "拒絕"];

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");

  useEffect(() => {
    fetchLeads();

    const interval = setInterval(() => {
      fetchLeads();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "讀取失敗");
      }

      setLeads(data.leads || []);
    } catch (err) {
      console.error("Fetch leads error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      setUpdatingId(id);

      const res = await fetch("/api/admin/leads/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "更新失敗");
      }

      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
      );
    } catch (err) {
      console.error("Update status error:", err);
      alert("更新狀態失敗");
    } finally {
      setUpdatingId("");
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("確定要刪除這筆名單嗎？");
    if (!confirmed) return;

    try {
      setDeletingId(id);

      const res = await fetch("/api/admin/leads/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "刪除失敗");
      }

      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (err) {
      console.error("Delete lead error:", err);
      alert("刪除失敗");
    } finally {
      setDeletingId("");
    }
  }

  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const todayCount = leads.filter(
      (lead) => new Date(lead.created_at).toDateString() === today
    ).length;

    const monthCount = leads.filter((lead) => {
      const d = new Date(lead.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const pending = leads.filter((lead) => lead.status === "未聯絡").length;
    const success = leads.filter((lead) => lead.status === "成交").length;

    return {
      todayCount,
      monthCount,
      pending,
      success,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesKeyword =
        lead.name?.includes(keyword) ||
        lead.phone?.includes(keyword) ||
        lead.line_id?.includes(keyword) ||
        lead.city?.includes(keyword);

      const matchesStatus =
        statusFilter === "全部" ? true : lead.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [leads, keyword, statusFilter]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] p-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">貸款申請名單</h1>

        <div className="flex gap-3">
          <button
            onClick={() => window.open("/api/admin/leads/export")}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white"
          >
            匯出 CSV
          </button>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-[#3e3a34] px-4 py-2 text-sm font-semibold text-white"
          >
            登出
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">今日名單</div>
          <div className="mt-2 text-2xl font-bold">{stats.todayCount}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">未聯絡</div>
          <div className="mt-2 text-2xl font-bold">{stats.pending}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">已成交</div>
          <div className="mt-2 text-2xl font-bold">{stats.success}</div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">本月名單</div>
          <div className="mt-2 text-2xl font-bold">{stats.monthCount}</div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜尋姓名、電話、LINE、地區"
          className="w-full rounded-xl border bg-white px-4 py-3 outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-xl border bg-white px-4 py-3 outline-none"
        >
          <option value="全部">全部狀態</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 text-sm text-slate-600">
        共 {filteredLeads.length} 筆名單
      </div>

      <div className="overflow-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">姓名</th>
              <th className="p-3 border">電話</th>
              <th className="p-3 border">LINE</th>
              <th className="p-3 border">地區</th>
              <th className="p-3 border">金額</th>
              <th className="p-3 border">需求</th>
              <th className="p-3 border">狀態</th>
              <th className="p-3 border">時間</th>
              <th className="p-3 border">操作</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td className="p-3 border">{lead.name}</td>
                <td className="p-3 border">{lead.phone}</td>
                <td className="p-3 border">{lead.line_id}</td>
                <td className="p-3 border">{lead.city}</td>
                <td className="p-3 border">{lead.amount}</td>
                <td className="p-3 border">{lead.message}</td>
                <td className="p-3 border">
                  <select
                    value={lead.status || "未聯絡"}
                    onChange={(e) =>
                      handleStatusChange(lead.id, e.target.value)
                    }
                    disabled={updatingId === lead.id}
                    className="rounded-lg border px-2 py-1"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 border">
                  {new Date(lead.created_at).toLocaleString()}
                </td>
                <td className="p-3 border">
                  <button
                    onClick={() => handleDelete(lead.id)}
                    disabled={deletingId === lead.id}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {deletingId === lead.id ? "刪除中..." : "刪除"}
                  </button>
                </td>
              </tr>
            ))}

            {filteredLeads.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="p-6 text-center text-sm text-slate-500"
                >
                  查無符合條件的名單
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}