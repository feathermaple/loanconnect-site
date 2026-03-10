"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  mode: "register" | "login";
  title: string;
  desc: string;
  primaryText: string;
  extraFields?: [string, string][];
};

export default function AuthCard({
  mode,
  title,
  desc,
  primaryText,
}: Props) {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lineId, setLineId] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setMsg("");

    try {
      if (!email || !password) {
        setMsg("請輸入 Email 與密碼");
        setLoading(false);
        return;
      }

      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              "https://loanconnect-site.vercel.app/auth/callback",
            data: {
              phone,
              line_id: lineId,
              company,
              role: "customer",
            },
          },
        });

        if (error) {
          setMsg(error.message);
          setLoading(false);
          return;
        }

        setMsg("註冊成功，請到信箱驗證 Email");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMsg("登入失敗，請確認帳號、密碼，並先完成 Email 驗證");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "發生未知錯誤，請稍後再試";
      setMsg(message);
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_0.95fr] md:px-6 md:py-16">
      <div className="flex flex-col justify-center rounded-[32px] bg-ink p-8 text-white md:p-10">
        <h2 className="text-4xl font-black">{title}</h2>
        <p className="mt-4 text-sm text-[#ddd3c7]">{desc}</p>
      </div>

      <div className="space-y-4 rounded-[32px] border border-line bg-paper p-6 shadow-soft md:p-8">
        {mode === "register" && (
          <>
            <Field label="手機號碼" value={phone} onChange={setPhone} />
            <Field
              label="營業名稱 / 店家名稱"
              value={company}
              onChange={setCompany}
            />
            <Field label="LINE ID" value={lineId} onChange={setLineId} />
          </>
        )}

        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field
          label="密碼"
          type="password"
          value={password}
          onChange={setPassword}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl bg-ink px-5 py-3 text-white disabled:opacity-60"
        >
          {loading ? "處理中..." : primaryText}
        </button>

        {msg && (
          <p
            className={`text-center text-sm ${
              msg.includes("成功") ? "text-green-600" : "text-red-500"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line px-4 py-3"
      />
    </div>
  );
}