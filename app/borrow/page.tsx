"use client";

declare global {
  interface Window {
    dataLayer?: object[];
  }
}

import { useState } from "react";
import { cityOptions } from "@/lib/data";
import SectionTitle from "@/components/SectionTitle";
import { useAuth } from "@/components/useAuth";

export default function BorrowPage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    line_id: "",
    city: "",
    amount: "",
    message: "",
  });

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("請填寫姓名");
      return;
    }

    if (!form.phone.trim()) {
      alert("請填寫手機號碼");
      return;
    }

    if (!agree) {
      alert("請先勾選同意服務條款與隱私權說明");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          company: "",
          customer_user_id: user?.id || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "送出失敗，請稍後再試");
        return;
      }

      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "lead_submit",
          form_name: "borrow_form",
          page_path: "/borrow",
        });

        console.log("lead_submit pushed", window.dataLayer);
      }

      alert("申請已送出，我們會盡快與你聯繫");

      setForm({
        name: "",
        phone: "",
        line_id: "",
        city: "",
        amount: "",
        message: "",
      });

      setAgree(false);
    } catch (error) {
      console.error(error);
      alert("送出失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <SectionTitle
        badge="Borrow Page"
        title="立即申請"
        desc="填寫基本資料後，將由專人協助初步評估適合的貸款方向與方案。"
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-line bg-paper p-6 shadow-soft md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="姓名"
              placeholder="請輸入姓名"
              value={form.name}
              onChange={(v) => handleChange("name", v)}
            />

            <Field
              label="手機號碼"
              placeholder="09xx-xxx-xxx"
              value={form.phone}
              onChange={(v) => handleChange("phone", v)}
            />

            <Field
              label="LINE ID"
              placeholder="請輸入 LINE ID"
              value={form.line_id}
              onChange={(v) => handleChange("line_id", v)}
            />

            <SelectField
              label="地區"
              value={form.city}
              options={cityOptions}
              onChange={(v) => handleChange("city", v)}
            />

            <SelectField
              label="需求金額"
              value={form.amount}
              options={[
                "1 - 5 萬",
                "5 - 10 萬",
                "10 - 30 萬",
                "30 - 100 萬",
                "100 萬以上",
              ]}
              onChange={(v) => handleChange("amount", v)}
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-muted">
              需求補充
            </label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="w-full rounded-2xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-ink"
              placeholder="請補充你的需求內容"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-soft p-4">
            <div className="flex items-start gap-3 text-sm text-muted">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <label htmlFor="agree" className="leading-6">
                我已閱讀並同意平台服務條款、隱私權政策與資料使用說明。
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "送出中..." : "送出申請"}
          </button>
        </div>

        <div className="space-y-5">
          <InfoCard
            title="申請後流程"
            desc="送出資料後，將由專人與你聯繫，先了解需求、初步評估條件，再協助說明適合的貸款方向與後續流程。"
          />

          <InfoCard
            title="適合這些情況"
            desc="適合短期資金需求、上班族信用貸款、想整合多筆債務，或第一次申請貸款、想先了解條件與流程的人。"
          />

          <InfoCard
            title="安心申請說明"
            desc="資料僅用於貸款需求評估與聯繫，不會任意公開；流程以先了解、再決定為原則，讓你更安心掌握申請方向。"
          />
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-ink"
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-ink"
      >
        <option value="">請選擇</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
      <div className="text-lg font-bold text-ink">{title}</div>
      <p className="mt-3 text-sm leading-6 text-muted">{desc}</p>
    </div>
  );
}