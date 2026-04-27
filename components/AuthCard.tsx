"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  mode: "register" | "login";
  title: string;
  desc: string;
  primaryText: string;
};

export default function AuthCard({ mode, title, desc, primaryText }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lineId, setLineId] = useState("");
  const [memberRole, setMemberRole] = useState("");
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

      if (mode === "register" && !memberRole) {
        setMsg("請選擇會員身分");
        setLoading(false);
        return;
      }

      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: "https://miaodaitong.com/auth/callback",
            data: {
              phone,
              line_id: lineId,
              role: memberRole,
            },
          },
        });

        if (error) {
          setMsg(error.message);
          setLoading(false);
          return;
        }

        // 🔥 同步寫入 profiles（重點）
        const user = data.user;

        if (user) {
          await supabase.from("profiles").insert({
            id: user.id,
            phone,
            line_id: lineId,
            role: memberRole,
          });
        }

        setMsg("註冊成功，請到信箱驗證 Email");
        setLoading(false);
        return;
      }

      // 登入
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMsg("登入失敗，請確認帳號、密碼，並先完成 Email 驗證");
        setLoading(false);
        return;
      }

      // 🔥 登入後依會員身分導向
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "lender") {
          router.push("/dashboard/lender");
        } else {
          router.push("/apply-loan");
        }
      }

      setLoading(false);
      router.refresh();
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

            {/* 🔥 會員身分 */}
            <SelectField
              label="會員身分"
              value={memberRole}
              onChange={setMemberRole}
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
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-[#b8872b] focus:ring-2 focus:ring-[#b8872b]/20"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-[#b8872b] focus:ring-2 focus:ring-[#b8872b]/20"
      >
        <option value="">請選擇會員身分</option>
        <option value="lender">金主會員</option>
        <option value="borrower">借錢會員</option>
      </select>
    </div>
  );
}