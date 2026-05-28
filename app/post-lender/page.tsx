"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function PostLenderPage() {
  const router = useRouter();
const [checkingAuth, setCheckingAuth] = useState(true);
const [allowed, setAllowed] = useState(false);

useEffect(() => {
  const checkPermission = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login?redirect=/post-lender");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (
      !profile ||
      (
        profile.role !== "lender" &&
        profile.role !== "both" &&
        profile.role !== "admin"
      )
    ) {
      router.replace("/pricing");
      return;
    }

    setAllowed(true);
    setCheckingAuth(false);
  };

  checkPermission();
}, [router]);

if (checkingAuth) {
  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#e8dfd3] bg-white p-8 text-center shadow-sm">
        權限確認中...
      </div>
    </main>
  );
}

if (!allowed) {
  return null;
}

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    region: "",
    loan_types: "",
    min_amount: "",
    max_amount: "",
    phone: "",
    line_id: "",
    ad_content: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.company_name ||
      !form.contact_name ||
      !form.region ||
      !form.loan_types ||
      !form.phone
    ) {
      alert("請填寫必要欄位");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("lender_ads").insert([
      {
        company_name: form.company_name,
        contact_name: form.contact_name,
        region: form.region,
        loan_types: form.loan_types,
        min_amount: form.min_amount ? Number(form.min_amount) : null,
        max_amount: form.max_amount ? Number(form.max_amount) : null,
        phone: form.phone,
        line_id: form.line_id,
        ad_content: form.ad_content,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("送出失敗：" + error.message);
      return;
    }

    alert("送出成功！已刊登放款資訊");

    setForm({
      company_name: "",
      contact_name: "",
      region: "",
      loan_types: "",
      min_amount: "",
      max_amount: "",
      phone: "",
      line_id: "",
      ad_content: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#2f2a25] md:text-4xl">
            免費刊登放款資訊
          </h1>
          <p className="mt-3 text-base text-[#6b6258] md:text-lg">
            放款方可免費刊登資訊，讓更多借款需求主動看到您。
          </p>
        </div>

        <div className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2f2a25]">
                公司名稱 / 品牌名稱
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                placeholder="例如：台中速貸中心"
                className="w-full rounded-2xl border border-[#ddd2c4] px-4 py-3 outline-none focus:border-[#8b6b4a]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2f2a25]">
                聯絡人
              </label>
              <input
                type="text"
                value={form.contact_name}
                onChange={(e) => handleChange("contact_name", e.target.value)}
                placeholder="例如：王先生"
                className="w-full rounded-2xl border border-[#ddd2c4] px-4 py-3 outline-none focus:border-[#8b6b4a]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2f2a25]">
                地區
              </label>
              <select
                value={form.region}
                onChange={(e) => handleChange("region", e.target.value)}
                className="w-full rounded-2xl border border-[#ddd2c4] px-4 py-3 outline-none focus:border-[#8b6b4a]"
              >
                <option value="">請選擇地區</option>
                <option>台北基隆</option>
                <option>桃竹苗</option>
                <option>中彰投</option>
                <option>雲嘉南</option>
                <option>高屏</option>
                <option>宜花東</option>
                <option>澎金馬</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2f2a25]">
                可承作借款類型
              </label>
              <input
                type="text"
                value={form.loan_types}
                onChange={(e) => handleChange("loan_types", e.target.value)}
                placeholder="例如：小額借款、汽車借款、機車借款"
                className="w-full rounded-2xl border border-[#ddd2c4] px-4 py-3 outline-none focus:border-[#8b6b4a]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2f2a25]">
                  最低金額
                </label>
                <input
                  type="number"
                  value={form.min_amount}
                  onChange={(e) => handleChange("min_amount", e.target.value)}
                  placeholder="例如：10000"
                  className="w-full rounded-2xl border border-[#ddd2c4] px-4 py-3 outline-none focus:border-[#8b6b4a]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2f2a25]">
                  最高金額
                </label>
                <input
                  type="number"
                  value={form.max_amount}
                  onChange={(e) => handleChange("max_amount", e.target.value)}
                  placeholder="例如：500000"
                  className="w-full rounded-2xl border border-[#ddd2c4] px-4 py-3 outline-none focus:border-[#8b6b4a]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2f2a25]">
                聯絡電話
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="請輸入電話"
                className="w-full rounded-2xl border border-[#ddd2c4] px-4 py-3 outline-none focus:border-[#8b6b4a]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2f2a25]">
                LINE ID
              </label>
              <input
                type="text"
                value={form.line_id}
                onChange={(e) => handleChange("line_id", e.target.value)}
                placeholder="請輸入 LINE ID"
                className="w-full rounded-2xl border border-[#ddd2c4] px-4 py-3 outline-none focus:border-[#8b6b4a]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2f2a25]">
                放款介紹
              </label>
              <textarea
                rows={5}
                value={form.ad_content}
                onChange={(e) => handleChange("ad_content", e.target.value)}
                placeholder="請介紹您的放款服務、可承作對象、流程特色等"
                className="w-full rounded-2xl border border-[#ddd2c4] px-4 py-3 outline-none focus:border-[#8b6b4a]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#3e3a34] px-6 py-4 text-base font-bold text-white transition hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "送出中..." : "送出放款刊登"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}