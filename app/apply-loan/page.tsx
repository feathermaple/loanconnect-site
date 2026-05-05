"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UserRole = "admin" | "borrower" | "lender" | "both" | "member" | null;

export default function ApplyLoanPage() {
  const router = useRouter();
  const supabase = createClient();
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

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    if (!form.nickname.trim() || !form.region || !form.amount || !form.phone.trim()) {
      alert("請填寫必要欄位");
      return;
    }

    if (!form.is_agreed) {
      alert("請勾選同意條款");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (sessionError || !user) {
        alert("請先登入會員後再刊登借款需求");
        router.push("/login?redirect=/apply-loan");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        alert("會員資料讀取失敗，請稍後再試");
        return;
      }

      const role = (profile?.role ?? null) as UserRole;

      const canPostLoan =
        role === "borrower" ||
        role === "both" ||
        role === "admin" ||
        role === "member"; // 舊會員先放行，避免舊資料不能用

      if (!canPostLoan) {
        alert("此功能限借款會員使用");
        router.push("/member");
        return;
      }

      const amountNumber = Number(form.amount);

      if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
        alert("請填寫正確的借款金額");
        return;
      }

      const { error } = await supabase.from("loan_requests").insert([
        {
          user_id: user.id,
          nickname: form.nickname.trim(),
          region: form.region,
          amount: amountNumber,
          purpose: form.purpose.trim(),
          phone: form.phone.trim(),
          line_id: form.line_id.trim(),
          description: form.description.trim(),
          is_agreed: form.is_agreed,
          status: "open",
        },
      ]);

      if (error) {
        alert("送出失敗：" + error.message);
        return;
      }

      alert("送出成功！已幫你刊登借款需求");
      router.push("/borrower/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f2ec] text-[#2b2b2b]">
      <section className="bg-[#f3ede4] px-4 py-12 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">快速刊登借款需求</h1>
        <p className="mt-3 text-[#6b6257]">免費刊登，讓資金主動找上你</p>

        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm">
          <span className="rounded-full bg-[#fff4dd] px-3 py-1">不用跑銀行</span>
          <span className="rounded-full bg-[#fff4dd] px-3 py-1">不限條件評估</span>
          <span className="rounded-full bg-[#fff4dd] px-3 py-1">快速媒合</span>
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-4 text-sm text-[#6b6257]">
          🔒 本平台僅提供資訊媒合服務
          <br />
          ✔ 不收前期費用
          <br />
          ✔ 不會要求提供證件正本
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="稱呼（怎麼稱呼您）"
              value={form.nickname}
              onChange={(e) => handleChange("nickname", e.target.value)}
              className="w-full rounded-xl border p-4"
            />

            <select
              value={form.region}
              onChange={(e) => handleChange("region", e.target.value)}
              className="w-full rounded-xl border p-4"
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
              placeholder="借款金額（例如：50000、100000）"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              className="w-full rounded-xl border p-4"
            />

            <input
              placeholder="借款用途（例如：週轉、整合債務）"
              value={form.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              className="w-full rounded-xl border p-4"
            />

            <input
              placeholder="聯絡電話（方便資金方聯繫）"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full rounded-xl border p-4"
            />

            <input
              placeholder="LINE ID（建議填寫）"
              value={form.line_id}
              onChange={(e) => handleChange("line_id", e.target.value)}
              className="w-full rounded-xl border p-4"
            />

            <textarea
              placeholder="需求說明（越詳細越容易媒合）"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-[140px] w-full rounded-xl border p-4"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_agreed}
                onChange={(e) => handleChange("is_agreed", e.target.checked)}
              />
              我同意平台媒合條款
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#c89b45] py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "送出中..." : "立即免費刊登需求"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-[#8a8175]">
            資料僅用於媒合用途，不會公開個人資訊
          </div>
        </div>
      </section>
    </main>
  );
}