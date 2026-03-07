"use client";

import { useState } from "react";

const cityOptions = [
  "台北市",
  "新北市",
  "桃園市",
  "台中市",
  "台南市",
  "高雄市",
  "基隆市",
  "新竹市",
  "新竹縣",
  "苗栗縣",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義市",
  "嘉義縣",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "台東縣",
];

export default function QuickApplyCard() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    line_id: "",
    city: "",
    amount: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setSuccess("");
  setError("");

  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        line_id: form.line_id,
        city: form.city,
        amount: form.amount,
        message: form.message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "送出失敗");
    }

    setSuccess("已成功送出，我們會盡快與你聯繫。");
    setForm({
      name: "",
      phone: "",
      line_id: "",
      city: "",
      amount: "",
      message: "",
    });
  } catch (err: any) {
    console.error("Lead submit error:", err);
    setError(err?.message || "送出失敗，請稍後再試一次。");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-[#fffdf9]/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur md:p-8">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-slate-200/70 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-zinc-200/70 blur-3xl" />

      <div className="relative">
        <div className="mb-6">
          <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            30 秒快速填寫
          </div>
          <h3 className="mt-4 text-2xl font-black tracking-tight text-[#3e3a34]">
            立即開始需求評估
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#8a8178]">
            用更乾淨、更高信任感的表單設計取代傳統名單站風格，讓轉換率和品牌感一起提升。
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              姓名 / 稱呼
            </label>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-2xl border border-[#e8e1d8] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
              placeholder="請輸入姓名"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                手機號碼
              </label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-2xl border border-[#e8e1d8] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
                placeholder="09xx-xxx-xxx"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                LINE ID
              </label>
              <input
                value={form.line_id}
                onChange={(e) => updateField("line_id", e.target.value)}
                className="w-full rounded-2xl border border-[#e8e1d8] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
                placeholder="請輸入 LINE ID"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                所在地區
              </label>
              <select
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full rounded-2xl border border-[#e8e1d8] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
                required
              >
                <option value="">請選擇縣市</option>
                {cityOptions.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                需求金額
              </label>
              <select
                value={form.amount}
                onChange={(e) => updateField("amount", e.target.value)}
                className="w-full rounded-2xl border border-[#e8e1d8] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
                required
              >
                <option value="">請選擇金額範圍</option>
                <option>1 - 5 萬</option>
                <option>5 - 10 萬</option>
                <option>10 - 30 萬</option>
                <option>30 - 100 萬</option>
                <option>100 萬以上</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              需求說明
            </label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              className="w-full rounded-2xl border border-[#e8e1d8] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
              placeholder="簡述需求內容，例如用途、期望聯繫時間、其他備註"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#3e3a34] px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "送出中..." : "立即送出需求"}
          </button>

          {success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}