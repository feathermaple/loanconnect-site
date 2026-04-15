"use client";

import { useEffect, useMemo, useState } from "react";

type SourceKey = "needs" | "ads" | "lenders";

type ApiResponse = {
  sources: Record<
    SourceKey,
    {
      table: string | null;
      rows: any[];
    }
  >;
};

const SOURCE_LABELS: Record<SourceKey, string> = {
  needs: "借款需求",
  ads: "放款廣告",
  lenders: "各區放款資訊",
};

const SOURCE_FIELDS: Record<SourceKey, string[]> = {
  needs: [
    "created_at",
    "region",
    "purpose",
    "nickname",
    "amount",
    "phone",
    "line_id",
    "description",
  ],
  ads: [
    "created_at",
    "region",
    "title",
    "contact_name",
    "contact_person",
    "loan_type",
    "loan_types",
    "min_amount",
    "max_amount",
    "phone",
    "line_id",
    "description",
  ],
  lenders: [
    "created_at",
    "region",
    "name",
    "title",
    "contact_name",
    "phone",
    "line_id",
    "description",
  ],
};

function formatDate(value: any) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("zh-TW");
}

function valueToInput(value: any) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function parseInputValue(raw: string, original: any) {
  if (raw === "") return null;

  if (typeof original === "number") {
    const n = Number(raw);
    return Number.isNaN(n) ? original : n;
  }

  if (typeof original === "boolean") {
    return raw === "true";
  }

  if (typeof original === "object" && original !== null) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  return raw;
}

export default function AdminLeadsManager() {
  const [activeTab, setActiveTab] = useState<SourceKey>("needs");
  const [data, setData] = useState<ApiResponse["sources"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setErrorText("");

      const res = await fetch("/api/admin/records", { cache: "no-store" });
      const json = (await res.json()) as ApiResponse & { error?: string };

      if (!res.ok) {
        throw new Error(json.error || "讀取資料失敗");
      }

      setData(json.sources);
    } catch (error: any) {
      console.error(error);
      setErrorText(error?.message || "讀取資料失敗");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const rows = useMemo(() => data?.[activeTab]?.rows || [], [data, activeTab]);
  const tableName = data?.[activeTab]?.table || null;

  function openEdit(row: any) {
    setEditingRow(row);

    const next: Record<string, string> = {};
    Object.keys(row).forEach((key) => {
      if (key === "id") return;
      next[key] = valueToInput(row[key]);
    });

    setFormData(next);
  }

  async function handleSave() {
    if (!editingRow?.id) return;

    try {
      setSaving(true);

      const payload: Record<string, any> = {};
      Object.keys(formData).forEach((key) => {
        payload[key] = parseInputValue(formData[key], editingRow[key]);
      });

      const res = await fetch("/api/admin/records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: activeTab,
          id: editingRow.id,
          payload,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "更新失敗");
      }

      setEditingRow(null);
      setFormData({});
      await loadData();
      alert("更新成功");
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "更新失敗");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("確定要刪除這筆資料嗎？刪除後無法恢復。");
    if (!ok) return;

    try {
      setDeletingId(id);

      const res = await fetch("/api/admin/records", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: activeTab,
          id,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "刪除失敗");
      }

      await loadData();
      alert("刪除成功");
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "刪除失敗");
    } finally {
      setDeletingId(null);
    }
  }

  const columns = useMemo(() => {
    const preferred = SOURCE_FIELDS[activeTab];
    const allKeys = new Set<string>();

    rows.forEach((row) => {
      Object.keys(row || {}).forEach((key) => {
        if (key === "id") return;
        allKeys.add(key);
      });
    });

    const preferredExisting = preferred.filter((key) => allKeys.has(key));
    const remaining = [...allKeys].filter((key) => !preferredExisting.includes(key));

    return [...preferredExisting, ...remaining];
  }, [rows, activeTab]);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3">
        {(Object.keys(SOURCE_LABELS) as SourceKey[]).map((key) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {SOURCE_LABELS[key]}
            </button>
          );
        })}
      </div>

      <div className="mb-4 text-sm text-slate-500">
        目前資料表：{tableName || "未找到可用資料表"}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
          讀取中...
        </div>
      ) : errorText ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-6 text-red-700 shadow-sm">
          {errorText}
        </div>
      ) : !tableName ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6 text-amber-800 shadow-sm">
          找不到 {SOURCE_LABELS[activeTab]} 對應的資料表，若你的實際表名不同，我再幫你改成正確名稱。
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
          目前沒有資料
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-3 font-semibold whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">操作</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.id || index}
                    className={index !== rows.length - 1 ? "border-t border-slate-200" : ""}
                  >
                    {columns.map((col) => (
                      <td key={col} className="max-w-[240px] px-4 py-4 align-top text-slate-900">
                        <div className="line-clamp-3 break-words">
                          {col === "created_at"
                            ? formatDate(row[col])
                            : typeof row[col] === "object" && row[col] !== null
                            ? JSON.stringify(row[col])
                            : String(row[col] ?? "-")}
                        </div>
                      </td>
                    ))}

                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          編輯
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          disabled={deletingId === row.id}
                          className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                        >
                          {deletingId === row.id ? "刪除中..." : "刪除"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingRow ? (
        <div className="fixed inset-0 z-[100] bg-black/40 p-4">
          <div className="mx-auto mt-10 max-w-4xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">編輯資料</h2>
                <p className="mt-1 text-sm text-slate-500">ID：{editingRow.id}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingRow(null);
                  setFormData({});
                }}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm"
              >
                關閉
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {key}
                  </label>
                  <textarea
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    rows={key === "description" || key === "note" ? 5 : 2}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "儲存中..." : "儲存修改"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingRow(null);
                  setFormData({});
                }}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}