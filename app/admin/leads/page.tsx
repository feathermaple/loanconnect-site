"use client";

import { useEffect, useMemo, useState } from "react";

type TabKey = "borrower" | "ads" | "lenders";
type RowData = Record<string, any>;

const TABLE_MAP: Record<
  TabKey,
  { label: string; table: string; pk: string }
> = {
  borrower: { label: "借款需求", table: "loan_requests", pk: "id" },
  ads: { label: "放款廣告", table: "lender_ads", pk: "id" },
  lenders: { label: "各區放款資訊", table: "profiles", pk: "id" },
};

const HIDDEN_FIELDS = ["password", "hashed_password"];

function formatValue(value: any) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function isEditableField(key: string) {
  if (["id", "created_at", "updated_at"].includes(key)) return false;
  if (HIDDEN_FIELDS.includes(key)) return false;
  return true;
}

export default function AdminLeadsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("borrower");
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingRow, setEditingRow] = useState<RowData | null>(null);
  const [editForm, setEditForm] = useState<RowData>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const currentConfig = TABLE_MAP[activeTab];

  async function fetchRows(tab: TabKey) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/leads?type=${tab}`, {
        method: "GET",
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) {
        setRows([]);
        setError(json?.error || "讀取資料失敗");
        setLoading(false);
        return;
      }

      setRows(json?.rows || []);
      setLoading(false);
    } catch (err: any) {
      setRows([]);
      setError(err?.message || "讀取資料失敗");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRows(activeTab);
  }, [activeTab]);

  const columns = useMemo(() => {
    if (!rows.length) return [];
    return Object.keys(rows[0]).filter((key) => !HIDDEN_FIELDS.includes(key));
  }, [rows]);

  function openEdit(row: RowData) {
    setEditingRow(row);
    setEditForm({ ...row });
  }

  function closeEdit() {
    setEditingRow(null);
    setEditForm({});
  }

  function handleInputChange(key: string, value: string) {
    let parsed: any = value;
    const currentValue = editingRow?.[key];

    if (typeof currentValue === "number") {
      parsed = value === "" ? null : Number(value);
    } else if (typeof currentValue === "boolean") {
      parsed = value === "true";
    }

    setEditForm((prev) => ({
      ...prev,
      [key]: parsed,
    }));
  }

  async function handleSave() {
    if (!editingRow) return;

    const pk = currentConfig.pk;
    const rowPkValue = editingRow?.[pk];

    if (!rowPkValue) {
      alert(`這筆資料沒有 ${pk}，無法編輯`);
      return;
    }

    setSaving(true);

    const payload: RowData = {};
    Object.keys(editForm).forEach((key) => {
      if (isEditableField(key)) {
        payload[key] = editForm[key];
      }
    });

    try {
      const res = await fetch(`/api/admin/leads/${rowPkValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: activeTab,
          payload,
        }),
      });

      const json = await res.json();
      setSaving(false);

      if (!res.ok) {
        alert(json?.error || "更新失敗");
        return;
      }

      closeEdit();
      await fetchRows(activeTab);
      alert("儲存成功");
    } catch (err: any) {
      setSaving(false);
      alert(err?.message || "更新失敗");
    }
  }

  async function handleDelete(row: RowData) {
    const pk = currentConfig.pk;
    const rowPkValue = row?.[pk];

    if (!rowPkValue) {
      alert(`這筆資料沒有 ${pk}，無法刪除`);
      return;
    }

    const ok = window.confirm("確定要刪除這筆資料嗎？刪除後無法恢復。");
    if (!ok) return;

    setDeletingId(rowPkValue);

    try {
      const res = await fetch(
        `/api/admin/leads/${rowPkValue}?type=${activeTab}`,
        {
          method: "DELETE",
        }
      );

      const json = await res.json();
      setDeletingId(null);

      if (!res.ok) {
        alert(json?.error || "刪除失敗");
        return;
      }

      await fetchRows(activeTab);
      alert("刪除成功");
    } catch (err: any) {
      setDeletingId(null);
      alert(err?.message || "刪除失敗");
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          名單管理
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          可查看、編輯、刪除借款需求、放款廣告、各區放款資訊資料。
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {(Object.keys(TABLE_MAP) as TabKey[]).map((key) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {TABLE_MAP[key].label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-sm text-slate-500">
          目前資料表：
          <span className="font-semibold text-slate-700">
            {" "}{currentConfig.table}
          </span>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-sm text-slate-500">讀取中...</div>
          ) : error ? (
            <div className="p-8 text-sm text-red-500">讀取失敗：{error}</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-sm text-slate-500">目前沒有資料</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold text-slate-700"
                      >
                        {col}
                      </th>
                    ))}
                    <th className="sticky right-0 z-10 whitespace-nowrap border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
                      操作
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => {
                    const rowPkValue = row?.[currentConfig.pk];

                    return (
                      <tr
                        key={rowPkValue ?? index}
                        className="border-b border-slate-100 align-top"
                      >
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="max-w-[220px] whitespace-pre-wrap px-4 py-3 text-slate-700"
                          >
                            {formatValue(row[col])}
                          </td>
                        ))}

                        <td className="sticky right-0 z-10 whitespace-nowrap bg-white px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(row)}
                              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                            >
                              編輯
                            </button>

                            <button
                              onClick={() => handleDelete(row)}
                              disabled={deletingId === rowPkValue}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                            >
                              {deletingId === rowPkValue ? "刪除中..." : "刪除"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">編輯資料</h2>
              <button
                onClick={closeEdit}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                關閉
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.keys(editForm)
                .filter((key) => !HIDDEN_FIELDS.includes(key))
                .map((key) => {
                  const value = editForm[key];
                  const editable = isEditableField(key);
                  const originalValue = editingRow[key];
                  const isBoolean = typeof originalValue === "boolean";

                  return (
                    <div key={key} className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">
                        {key}
                      </label>

                      {!editable ? (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                          {formatValue(value)}
                        </div>
                      ) : isBoolean ? (
                        <select
                          value={String(value)}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : String(value ?? "").length > 80 ? (
                        <textarea
                          value={value ?? ""}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          rows={4}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                        />
                      ) : (
                        <input
                          value={value ?? ""}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                        />
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeEdit}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "儲存中..." : "儲存修改"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}