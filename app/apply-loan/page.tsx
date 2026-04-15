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
    <main className="min-h-screen bg-[#f6f2ec] text-[#2b2b2b]">
      {/* 🔥 上方轉換區 */}
      <section className="bg-[#f3ede4] px-4 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          快速刊登借款需求
        </h1>
        <p className="mt-3 text-[#6b6257]">
          免費刊登，讓資金主動找上你
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-[#fff4dd] px-3 py-1 rounded-full">不用跑銀行</span>
          <span className="bg-[#fff4dd] px-3 py-1 rounded-full">不限條件評估</span>
          <span className="bg-[#fff4dd] px-3 py-1 rounded-full">快速媒合</span>
        </div>
      </section>

      {/* 🔒 信任區 */}
      <section className="px-4 mt-6">
        <div className="max-w-3xl mx-auto bg-white p-4 rounded-xl text-sm text-[#6b6257]">
          🔒 本平台僅提供資訊媒合服務  
          <br />
          ✔ 不收前期費用  
          <br />
          ✔ 不會要求提供證件正本  
        </div>
      </section>

      {/* 🧾 表單 */}
      <section className="px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl space-y-4 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="稱呼（怎麼稱呼您）"
              value={form.nickname}
              onChange={(e) => handleChange("nickname", e.target.value)}
              className="w-full border p-4 rounded-xl"
            />

            <select
              value={form.region}
              onChange={(e) => handleChange("region", e.target.value)}
              className="w-full border p-4 rounded-xl"
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
              placeholder="借款金額（例如：5萬、10萬）"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              className="w-full border p-4 rounded-xl"
            />

            <input
              placeholder="借款用途（例如：週轉、整合債務）"
              value={form.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              className="w-full border p-4 rounded-xl"
            />

            <input
              placeholder="聯絡電話（方便資金方聯繫）"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border p-4 rounded-xl"
            />

            <input
              placeholder="LINE ID（建議填寫）"
              value={form.line_id}
              onChange={(e) => handleChange("line_id", e.target.value)}
              className="w-full border p-4 rounded-xl"
            />

            <textarea
              placeholder="需求說明（越詳細越容易媒合）"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border p-4 rounded-xl"
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
              className="w-full bg-[#c89b45] text-white py-4 rounded-xl font-bold"
            >
              {loading ? "送出中..." : "立即免費刊登需求"}
            </button>
          </form>

          {/* 🔐 安全補強 */}
          <div className="text-xs text-center text-[#8a8175] mt-4">
            資料僅用於媒合用途，不會公開個人資訊
          </div>
        </div>
      </section>
    </main>
  );
}