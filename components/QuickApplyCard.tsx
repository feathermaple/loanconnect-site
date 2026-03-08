"use client";

import { useState } from "react";
import { pushEvent } from "@/lib/gtm";

type FormState = {
  name: string;
  phone: string;
  line_id: string;
  city: string;
  amount: string;
  message: string;
  company: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  line_id: "",
  city: "",
  amount: "",
  message: "",
  company: "",
};

export default function QuickApplyCard() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.phone.trim()) {
      setError("請先填寫姓名與電話");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "送出失敗，請稍後再試");
      }

      pushEvent({
        event: "lead_submit",
        lead_type: "quick_apply",
        source_page: window.location.pathname,
      });

      setSuccess("已送出申請，我們會盡快與你聯繫。");
      setForm(initialForm);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "送出失敗，請稍後再試";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[32px] border border-[#e8e1d8] bg-white p-6 shadow-xl md:p-7">
      <div className="mb-5">
        <div className="inline-flex rounded-full bg-[#f5efe7] px-3 py-1 text-xs font-semibold text-[#7a7269]">
          免費快速評估
        </div>
        <h2 className="mt-3 text-2xl font-black text-[#2f2a25]">
          立即留下需求
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6f675f]">
          填寫基本資料後，將由專人協助初步了解需求與媒合方向。
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="hidden">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            value={form.company}
            onChange={handleChange}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-[#4c463f]"
          >
            姓名 *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="請輸入姓名"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#e7dfd5] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#b9ada0] focus:bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-[#4c463f]"
          >
            電話 *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="例如 0912345678"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#e7dfd5] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#b9ada0] focus:bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="line_id"
            className="mb-2 block text-sm font-semibold text-[#4c463f]"
          >
            LINE ID
          </label>
          <input
            id="line_id"
            name="line_id"
            type="text"
            placeholder="方便聯繫可填"
            value={form.line_id}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#e7dfd5] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#b9ada0] focus:bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-semibold text-[#4c463f]"
          >
            地區
          </label>
          <select
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#e7dfd5] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#b9ada0] focus:bg-white"
          >
            <option value="">請選擇地區</option>
            <option value="台北市">台北市</option>
            <option value="新北市">新北市</option>
            <option value="桃園市">桃園市</option>
            <option value="台中市">台中市</option>
            <option value="台南市">台南市</option>
            <option value="高雄市">高雄市</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-semibold text-[#4c463f]"
          >
            需求金額
          </label>
          <select
            id="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#e7dfd5] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#b9ada0] focus:bg-white"
          >
            <option value="">請選擇金額區間</option>
            <option value="5萬以下">5萬以下</option>
            <option value="5萬 - 10萬">5萬 - 10萬</option>
            <option value="10萬 - 30萬">10萬 - 30萬</option>
            <option value="30萬 - 50萬">30萬 - 50萬</option>
            <option value="50萬以上">50萬以上</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-semibold text-[#4c463f]"
          >
            需求說明
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="例如：目前想整合負債、短期週轉、了解可行方案..."
            value={form.message}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#e7dfd5] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#b9ada0] focus:bg-white"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#3e3a34] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "送出中..." : "立即免費評估"}
        </button>

        <p className="text-xs leading-6 text-[#8a8178]">
          送出即表示你同意我們依據需求與你聯繫，資料將用於需求評估與媒合處理。
        </p>
      </form>
    </div>
  );
}