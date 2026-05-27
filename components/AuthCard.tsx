"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  mode: "register" | "login";
  title: string;
  desc: string;
  primaryText: string;
};

type MemberRole = "borrower" | "lender" | "both" | "admin" | "member" | "";

export default function AuthCard({ mode, title, desc, primaryText }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lineId, setLineId] = useState("");
  const [memberRole, setMemberRole] = useState<MemberRole>("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const redirect = searchParams.get("redirect");
  const registerHref = redirect
    ? `/register?redirect=${encodeURIComponent(redirect)}`
    : "/register";

  const loginHref = redirect
    ? `/login?redirect=${encodeURIComponent(redirect)}`
    : "/login";

  function getRedirectPath(role?: string | null) {
    if (redirect) return redirect;

    if (role === "admin") return "/admin";
    if (role === "lender") return "/dashboard/lender";
    if (role === "both") return "/member";
    if (role === "borrower") return "/apply-loan";

    return "/member";
  }

  async function handleSubmit() {
    setLoading(true);
    setMsg("");

    try {
      const cleanEmail = email.trim();
      const cleanPhone = phone.trim();
      const cleanLineId = lineId.trim();

      if (!cleanEmail || !password) {
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
        const selectedRole = memberRole === "lender" ? "lender" : "borrower";

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: "https://miaodaitong.com/auth/callback",
            data: {
              phone: cleanPhone,
              line_id: cleanLineId,
              role: selectedRole,
            },
          },
        });

        if (error) {
          setMsg(error.message);
          setLoading(false);
          return;
        }

        const user = data.user;

        if (user) {
          const { error: profileError } = await supabase.from("profiles").upsert(
            {
              id: user.id,
              email: cleanEmail,
              phone: cleanPhone,
              line_id: cleanLineId,
              role: selectedRole,
            },
            { onConflict: "id" }
          );

          if (profileError) {
            setMsg("帳號已建立，但會員資料寫入失敗：" + profileError.message);
            setLoading(false);
            return;
          }
        }

        setMsg("註冊成功，即將前往下一步");
        setLoading(false);

        router.push(getRedirectPath(selectedRole));
        router.refresh();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setMsg("登入失敗，請確認帳號、密碼，並先完成 Email 驗證");
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMsg("登入成功，但讀取會員資料失敗，請重新整理後再試");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setMsg("登入成功，但會員資料讀取失敗：" + profileError.message);
        setLoading(false);
        return;
      }

      const role = profile?.role ?? "member";

      setLoading(false);
      router.push(getRedirectPath(role));
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

            <SelectField
              label="會員身分"
              value={memberRole}
              onChange={(value) => setMemberRole(value as MemberRole)}
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

        {mode === "login" ? (
          <div className="rounded-2xl border border-[#eadfce] bg-white p-4 text-center">
            <p className="text-sm text-[#555]">還沒有帳號嗎？</p>
            <Link
              href={registerHref}
              className="mt-3 block rounded-xl bg-[#c89b45] px-4 py-3 text-sm font-bold text-white"
            >
              免費註冊會員
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#eadfce] bg-white p-4 text-center">
            <p className="text-sm text-[#555]">已經有帳號了嗎？</p>
            <Link
              href={loginHref}
              className="mt-3 block rounded-xl border border-[#c89b45] px-4 py-3 text-sm font-bold text-[#c89b45]"
            >
              直接登入
            </Link>
          </div>
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