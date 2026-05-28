"use client";

import { useEffect, useMemo, useState } from "react";

type LoanRequest = {
  id?: string;
  user_id?: string | null;
  nickname: string;
  region: string;
  amount: number | string | null;
  purpose: string;
  phone: string;
  line_id: string;
  description: string;
  status: string;
  created_at?: string | null;
};

const emptyForm: LoanRequest = {
  nickname: "",
  region: "",
  amount: "",
  purpose: "",
  phone: "",
  line_id: "",
  description: "",
  status: "open",
  user_id: "",
};

export default function AdminLoanRequestsPage() {
  const [items, setItems] = useState<LoanRequest[]>([]);
  const [form, setForm] = useState<LoanRequest>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function fetchItems() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/loan-requests");
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "讀取失敗");
        return;
      }

      setItems(result.items || []);
    } catch (err) {
      console.error(err);
      alert("讀取失敗");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase();

    return items.filter((item) =>
      `${item.nickname} ${item.region} ${item.purpose} ${item.phone} ${item.line_id} ${item.status}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [items, search]);

  function updateItem(id: string, patch: Partial<LoanRequest>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  async function createItem() {
    try {
      const res = await fetch("/api/admin/loan-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "新增失敗");
        return;
      }

      alert("已新增借款需求");
      setForm(emptyForm);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("新增失敗");
    }
  }

  async function saveItem(item: LoanRequest) {
    if (!item.id) return;

    setSavingId(item.id);

    try {
      const res = await fetch("/api/admin/loan-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "儲存失敗");
        return;
      }

      alert("已儲存修改");
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("儲存失敗");
    } finally {
      setSavingId(null);
    }
  }

  async function toggleStatus(item: LoanRequest) {
    if (!item.id) return;

    const nextStatus = item.status === "open" ? "closed" : "open";

    setSavingId(item.id);

    try {
      const res = await fetch("/api/admin/loan-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          status: nextStatus,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "切換狀態失敗");
        return;
      }

      alert(nextStatus === "open" ? "已開啟刊登" : "已關閉刊登");
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("切換狀態失敗");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(item: LoanRequest) {
    if (!item.id) return;

    const ok = window.confirm("確定要刪除這筆借款需求嗎？刪除後無法復原。");
    if (!ok) return;

    setSavingId(item.id);

    try {
      const res = await fetch("/api/admin/loan-requests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "刪除失敗");
        return;
      }

      alert("已刪除借款需求");
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("刪除失敗");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">借款需求管理</h1>
          <p className="mt-2 text-sm text-gray-500">
            管理員可新增、修改、刪除、開啟或關閉借款需求。
          </p>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">新增借款需求</h2>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              placeholder="暱稱"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              placeholder="地區"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.amount || ""}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="借款金額"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              placeholder="用途"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="手機"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.line_id}
              onChange={(e) => setForm({ ...form, line_id: e.target.value })}
              placeholder="LINE ID"
              className="rounded-xl border px-4 py-3"
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="rounded-xl border px-4 py-3"
            >
              <option value="open">開啟中</option>
              <option value="closed">已關閉</option>
            </select>

            <input
              value={form.user_id || ""}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              placeholder="會員 UID，可空白"
              className="rounded-xl border px-4 py-3"
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="需求描述"
              rows={4}
              className="rounded-xl border px-4 py-3 md:col-span-2"
            />
          </div>

          <button
            onClick={createItem}
            className="mt-4 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
          >
            新增借款需求
          </button>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-bold">借款需求列表</h2>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋暱稱 / 地區 / 用途 / 電話 / LINE / 狀態"
              className="w-full rounded-xl border px-4 py-3 md:w-[420px]"
            />
          </div>

          {loading && <div className="rounded-xl bg-gray-50 p-6">載入中...</div>}

          {!loading && filteredItems.length === 0 && (
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              目前沒有資料
            </div>
          )}

          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="rounded-2xl border p-5">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs text-gray-500">
                      ID：{item.id}
                    </div>
                    <div className="text-xs text-gray-500">
                      建立時間：
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString("zh-TW")
                        : "未設定"}
                    </div>
                  </div>

                  <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold">
                    狀態：{item.status || "未設定"}
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={item.nickname || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { nickname: e.target.value })
                    }
                    placeholder="暱稱"
                    className="rounded-xl border px-4 py-3"
                  />

                  <input
                    value={item.region || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { region: e.target.value })
                    }
                    placeholder="地區"
                    className="rounded-xl border px-4 py-3"
                  />

                  <input
                    value={item.amount || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { amount: e.target.value })
                    }
                    placeholder="借款金額"
                    className="rounded-xl border px-4 py-3"
                  />

                  <input
                    value={item.purpose || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { purpose: e.target.value })
                    }
                    placeholder="用途"
                    className="rounded-xl border px-4 py-3"
                  />

                  <input
                    value={item.phone || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { phone: e.target.value })
                    }
                    placeholder="手機"
                    className="rounded-xl border px-4 py-3"
                  />

                  <input
                    value={item.line_id || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { line_id: e.target.value })
                    }
                    placeholder="LINE ID"
                    className="rounded-xl border px-4 py-3"
                  />

                  <select
                    value={item.status || "open"}
                    onChange={(e) =>
                      updateItem(item.id!, { status: e.target.value })
                    }
                    className="rounded-xl border px-4 py-3"
                  >
                    <option value="open">開啟中</option>
                    <option value="closed">已關閉</option>
                  </select>

                  <input
                    value={item.user_id || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { user_id: e.target.value })
                    }
                    placeholder="會員 UID"
                    className="rounded-xl border px-4 py-3"
                  />

                  <textarea
                    value={item.description || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { description: e.target.value })
                    }
                    placeholder="需求描述"
                    rows={4}
                    className="rounded-xl border px-4 py-3 md:col-span-2"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => saveItem(item)}
                    disabled={savingId === item.id}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {savingId === item.id ? "儲存中..." : "儲存修改"}
                  </button>

                  <button
                    onClick={() => toggleStatus(item)}
                    disabled={savingId === item.id}
                    className="rounded-xl bg-[#6b5840] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {item.status === "open" ? "關閉刊登" : "開啟刊登"}
                  </button>

                  <button
                    onClick={() => deleteItem(item)}
                    disabled={savingId === item.id}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}