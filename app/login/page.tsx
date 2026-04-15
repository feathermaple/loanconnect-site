"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function isSafeRedirectPath(path: string | null) {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.startsWith("/login")) return false;
  return true;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorText("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorText(error.message || "登入失敗，請稍後再試。");
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setErrorText("登入失敗，找不到使用者資料。");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const isAdmin = profile?.role === "admin";
      const redirect = searchParams.get("redirect");

      if (isAdmin) {
        router.replace("/admin");
      } else if (
        isSafeRedirectPath(redirect) &&
        !redirect!.startsWith("/admin") &&
        !redirect!.startsWith("/dashboard")
      ) {
        router.replace(redirect!);
      } else {
        router.replace("/member");
      }

      router.refresh();
    } catch {
      setErrorText("系統發生錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-stone-800">會員登入</h1>
        <p className="mt-2 text-sm text-stone-500">
          登入後將依照帳號身份自動進入正確頁面。
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入 Email"
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-stone-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼"
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-stone-500"
              required
            />
          </div>

          {errorText ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorText}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-stone-800 px-4 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
    </main>
  );
}