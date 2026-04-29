"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type TabKey = "borrower" | "ads" | "lenders";
type RowData = Record<string, any>;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TABLE_MAP: Record<TabKey, { label: string; table: string; pk: string }> = {
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

  const [showPaidAdModal, setShowPaidAdModal] = useState(false);
  const [paidAdLoading, setPaidAdLoading] = useState(false);
  const [paidAdImage, setPaidAdImage] = useState<File | null>(null);

  const [paidAdForm, setPaidAdForm] = useState({
    title: "",
    company_name: "",
    contact_name: "",
    region: "",
    loan_types: "",
    min_amount: "",
    max_amount: "",
    phone: "",
    line_id: "",
    ad_content: "",
    is_active: true,
    is_top: false,
  });

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

  function handlePaidAdChange(key: string, value: string | boolean) {
    setPaidAdForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleCreatePaidAd() {
    if (!paidAdForm.title.trim()) {
      alert("請填寫廣告標題");
      return;
    }

    setPaidAdLoading(true);

    try {
      let imageUrl = "";

      if (paidAdImage) {
        const fileExt = paidAdImage.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`;
        const filePath = `paid-ads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("paid-ads")
          .upload(filePath, paidAdImage, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          alert(`圖片上傳失敗：${uploadError.message}`);
          setPaidAdLoading(false);
          return;
        }

        const { data } = supabase.storage
          .from("paid-ads")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const { error } = await supabase.from("paid_lender_ads").insert({
        title: paidAdForm.title,
        company_name: paidAdForm.company_name || null,
        contact_name: paidAdForm.contact_name || null,
        region: paidAdForm.region || null,
        loan_types: paidAdForm.loan_types || null,
        min_amount: paidAdForm.min_amount
          ? Number(paidAdForm.min_amount)
          : null,
        max_amount: paidAdForm.max_amount
          ? Number(paidAdForm.max_amount)
          : null,
        phone: paidAdForm.phone || null,
        line_id: paidAdForm.line_id || null,
        ad_content: paidAdForm.ad_content || null,
        image_url: imageUrl || null,
        is_active: paidAdForm.is_active,
        is_top: paidAdForm.is_top,
      });

      if (error) {
        alert(`新增圖文廣告失敗：${error.message}`);
        setPaidAdLoading(false);
        return;
      }

      alert("圖文廣告新增成功");
      setShowPaidAdModal(false);
      setPaidAdImage(null);
      setPaidAdForm({
        title: "",
        company_name: "",
        contact_name: "",
        region: "",
        loan_types: "",
        min_amount: "",
        max_amount: "",
        phone: "",
        line_id: "",
        ad_content: "",
        is_active: true,
        is_top: false,
      });
    } catch (err: any) {
      alert(err?.message || "新增圖文廣告失敗");
    } finally {
      setPaidAdLoading(false);
    }
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

        <div className="mt-6 flex flex-wrap items-center gap-3">
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

          {activeTab === "ads" && (
            <button
              onClick={() => setShowPaidAdModal(true)}
              className="rounded-full border border-amber-300 bg-amber-100 px-5 py-3 text-sm font-bold text-amber-900 transition hover:bg-amber-200"
            >
              ＋新增圖文廣告
            </button>
          )}
        </div>

        <div className="mt-6 text-sm text-slate-500">
          目前資料表：
          <span className="font-semibold text-slate-700">
            {" "}
            {currentConfig.table}
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
                              {deletingId === rowPkValue
                                ? "刪除中..."
                                : "刪除"}
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

      {showPaidAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                新增圖文廣告
              </h2>
              <button
                onClick={() => setShowPaidAdModal(false)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                關閉
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4">
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  廣告標題 *
                </label>
                <input
                  value={paidAdForm.title}
                  onChange={(e) => handlePaidAdChange("title", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  placeholder="例如：台北快速週轉、彈性放款"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  公司 / 品牌名稱
                </label>
                <input
                  value={paidAdForm.company_name}
                  onChange={(e) =>
                    handlePaidAdChange("company_name", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  聯絡人
                </label>
                <input
                  value={paidAdForm.contact_name}
                  onChange={(e) =>
                    handlePaidAdChange("contact_name", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  地區
                </label>
                <input
                  value={paidAdForm.region}
                  onChange={(e) => handlePaidAdChange("region", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  placeholder="例如：台北、新北、桃園"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  可承作類型
                </label>
                <input
                  value={paidAdForm.loan_types}
                  onChange={(e) =>
                    handlePaidAdChange("loan_types", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  placeholder="例如：汽機車、房屋、信用、民間"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  最低金額
                </label>
                <input
                  type="number"
                  value={paidAdForm.min_amount}
                  onChange={(e) =>
                    handlePaidAdChange("min_amount", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  最高金額
                </label>
                <input
                  type="number"
                  value={paidAdForm.max_amount}
                  onChange={(e) =>
                    handlePaidAdChange("max_amount", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  電話
                </label>
                <input
                  value={paidAdForm.phone}
                  onChange={(e) => handlePaidAdChange("phone", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  LINE ID
                </label>
                <input
                  value={paidAdForm.line_id}
                  onChange={(e) =>
                    handlePaidAdChange("line_id", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  廣告內容
                </label>
                <textarea
                  value={paidAdForm.ad_content}
                  onChange={(e) =>
                    handlePaidAdChange("ad_content", e.target.value)
                  }
                  rows={5}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  placeholder="輸入要顯示在前台的廣告文案"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  廣告圖片
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaidAdImage(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                />
                {paidAdImage && (
                  <p className="mt-2 text-xs text-slate-500">
                    已選擇：{paidAdImage.name}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={paidAdForm.is_active}
                  onChange={(e) =>
                    handlePaidAdChange("is_active", e.target.checked)
                  }
                />
                上架顯示
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={paidAdForm.is_top}
                  onChange={(e) =>
                    handlePaidAdChange("is_top", e.target.checked)
                  }
                />
                置頂推薦
              </label>
            </div>

            <div className="flex shrink-0 justify-end gap-3 border-t bg-white px-6 py-4">
              <button
                onClick={() => setShowPaidAdModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                取消
              </button>

              <button
                onClick={handleCreatePaidAd}
                disabled={paidAdLoading}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {paidAdLoading ? "新增中..." : "新增圖文廣告"}
              </button>
            </div>
          </div>
        </div>
      )}

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

            <div className="flex-1 overflow-y-auto px-6 pb-4">
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
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : String(value ?? "").length > 80 ? (
                        <textarea
                          value={value ?? ""}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          rows={4}
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                        />
                      ) : (
                        <input
                          value={value ?? ""}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                        />
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="flex shrink-0 justify-end gap-3 border-t bg-white px-6 py-4">
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