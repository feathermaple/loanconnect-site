"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function ApplyLoanPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nickname: "",
    region: "",
    amount: "",
    purpose: "",
    phone: "",
    line_id: "",
    description: "",
    is_agreed: false,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.nickname || !form.region || !form.amount || !form.phone) {
      alert("請填寫必要欄位");
      return;
    }

    if (!form.is_agreed) {
      alert("請勾選同意條款");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("loan_requests").insert([
      {
        nickname: form.nickname,
        region: form.region,
        amount: Number(form.amount),
        purpose: form.purpose,
        phone: form.phone,
        line_id: form.line_id,
        description: form.description,
        is_agreed: form.is_agreed,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("送出失敗：" + error.message);
      return;
    }

    alert("送出成功！已幫你刊登借款需求");

    setForm({
      nickname: "",
      region: "",
      amount: "",
      purpose: "",
      phone: "",
      line_id: "",
      description: "",
      is_agreed: false,
    });
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          免費刊登借款需求
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl space-y-4"
        >
          <input
            placeholder="稱呼"
            value={form.nickname}
            onChange={(e) => handleChange("nickname", e.target.value)}
            className="w-full border p-3 rounded"
          />

          <select
            value={form.region}
            onChange={(e) => handleChange("region", e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="">選擇地區</option>
            <option>台北基隆</option>
            <option>桃竹苗</option>
            <option>中彰投</option>
            <option>雲嘉南</option>
            <option>高屏</option>
            <option>宜花東</option>
            <option>澎金馬</option>
          </select>

          <input
            type="number"
            placeholder="借款金額"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            placeholder="借款用途"
            value={form.purpose}
            onChange={(e) => handleChange("purpose", e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            placeholder="電話"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            placeholder="LINE ID"
            value={form.line_id}
            onChange={(e) => handleChange("line_id", e.target.value)}
            className="w-full border p-3 rounded"
          />

          <textarea
            placeholder="需求說明"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border p-3 rounded"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_agreed}
              onChange={(e) =>
                handleChange("is_agreed", e.target.checked)
              }
            />
            我同意平台媒合條款
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            {loading ? "送出中..." : "送出借款需求"}
          </button>
        </form>
      </div>
    </main>
  );
}