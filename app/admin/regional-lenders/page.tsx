"use client";

import { useEffect, useMemo, useState } from "react";

type RegionalLender = {
  id?: string;
  title: string;
  region: string;
  city: string;
  district: string;
  contact_name: string;
  phone: string;
  line_id: string;
  description: string;
  is_active: boolean;
  is_top: boolean;
  created_at?: string | null;
};

const emptyForm: RegionalLender = {
  title: "",
  region: "",
  city: "",
  district: "",
  contact_name: "",
  phone: "",
  line_id: "",
  description: "",
  is_active: true,
  is_top: false,
};

export default function AdminRegionalLendersPage() {
  const [items, setItems] = useState<RegionalLender[]>([]);
  const [form, setForm] = useState<RegionalLender>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function fetchItems() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/regional-lenders");
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
      `${item.title} ${item.region} ${item.city} ${item.district} ${item.contact_name} ${item.phone} ${item.line_id}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [items, search]);

  function updateItem(id: string, patch: Partial<RegionalLender>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  async function createItem() {
    try {
      const res = await fetch("/api/admin/regional-lenders", {
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

      alert("已新增各區放款資訊");
      setForm(emptyForm);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("新增失敗");
    }
  }

  async function saveItem(item: RegionalLender) {
    if (!item.id) return;

    setSavingId(item.id);

    try {
      const res = await fetch("/api/admin/regional-lenders", {
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

  async function toggleActive(item: RegionalLender) {
    if (!item.id) return;

    setSavingId(item.id);

    try {
      const res = await fetch("/api/admin/regional-lenders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          is_active: !item.is_active,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "切換失敗");
        return;
      }

      alert(!item.is_active ? "已開啟" : "已關閉");
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("切換失敗");
    } finally {
      setSavingId(null);
    }
  }

  async function toggleTop(item: RegionalLender) {
    if (!item.id) return;

    setSavingId(item.id);

    try {
      const res = await fetch("/api/admin/regional-lenders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          is_top: !item.is_top,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "置頂切換失敗");
        return;
      }

      alert(!item.is_top ? "已設為置頂" : "已取消置頂");
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("置頂切換失敗");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(item: RegionalLender) {
    if (!item.id) return;

    const ok = window.confirm("確定要刪除這筆各區放款資訊嗎？");
    if (!ok) return;

    setSavingId(item.id);

    try {
      const res = await fetch("/api/admin/regional-lenders", {
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

      alert("已刪除");
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
          <h1 className="text-2xl font-bold">各區放款資訊管理</h1>
          <p className="mt-2 text-sm text-gray-500">
            管理員可新增、修改、刪除、開啟、關閉或置頂各區放款資訊。
          </p>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">新增各區放款資訊</h2>

          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="標題"
              className="rounded-xl border px-4 py-3 md:col-span-2"
            />

            <input
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              placeholder="區域，例如：北部 / 中部 / 南部"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="縣市，例如：台北市"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              placeholder="行政區，例如：信義區"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.contact_name}
              onChange={(e) =>
                setForm({ ...form, contact_name: e.target.value })
              }
              placeholder="聯絡人"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="電話"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={form.line_id}
              onChange={(e) => setForm({ ...form, line_id: e.target.value })}
              placeholder="LINE ID"
              className="rounded-xl border px-4 py-3"
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="內容描述"
              rows={4}
              className="rounded-xl border px-4 py-3 md:col-span-2"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              開啟顯示
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_top}
                onChange={(e) => setForm({ ...form, is_top: e.target.checked })}
              />
              置頂
            </label>
          </div>

          <button
            onClick={createItem}
            className="mt-4 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
          >
            新增各區放款資訊
          </button>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-bold">各區放款資訊列表</h2>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋標題 / 區域 / 縣市 / 行政區 / 聯絡人"
              className="w-full rounded-xl border px-4 py-3 md:w-[460px]"
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
                    <div className="text-xs text-gray-500">ID：{item.id}</div>
                    <div className="text-xs text-gray-500">
                      建立時間：
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString("zh-TW")
                        : "未設定"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold">
                      {item.is_active ? "顯示中" : "已關閉"}
                    </span>

                    {item.is_top && (
                      <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700">
                        置頂
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={item.title || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { title: e.target.value })
                    }
                    placeholder="標題"
                    className="rounded-xl border px-4 py-3 md:col-span-2"
                  />

                  <input
                    value={item.region || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { region: e.target.value })
                    }
                    placeholder="區域"
                    className="rounded-xl border px-4 py-3"
                  />

                  <input
                    value={item.city || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { city: e.target.value })
                    }
                    placeholder="縣市"
                    className="rounded-xl border px-4 py-3"
                  />

                  <input
                    value={item.district || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { district: e.target.value })
                    }
                    placeholder="行政區"
                    className="rounded-xl border px-4 py-3"
                  />

                  <input
                    value={item.contact_name || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { contact_name: e.target.value })
                    }
                    placeholder="聯絡人"
                    className="rounded-xl border px-4 py-3"
                  />

                  <input
                    value={item.phone || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { phone: e.target.value })
                    }
                    placeholder="電話"
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

                  <textarea
                    value={item.description || ""}
                    onChange={(e) =>
                      updateItem(item.id!, { description: e.target.value })
                    }
                    placeholder="內容描述"
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
                    onClick={() => toggleActive(item)}
                    disabled={savingId === item.id}
                    className="rounded-xl bg-[#6b5840] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {item.is_active ? "關閉顯示" : "開啟顯示"}
                  </button>

                  <button
                    onClick={() => toggleTop(item)}
                    disabled={savingId === item.id}
                    className="rounded-xl bg-yellow-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {item.is_top ? "取消置頂" : "設為置頂"}
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