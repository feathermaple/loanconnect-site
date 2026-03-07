"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "登入失敗");
      }

      router.push("/dashboard/leads");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "登入失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] px-4 py-16">
      <div className="mx-auto max-w-md rounded-[28px] border border-[#e8e1d8] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight text-[#3e3a34]">
          後台登入
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#8a8178]">
          請輸入管理密碼以查看貸款申請名單。
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              管理密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#e8e1d8] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
              placeholder="請輸入密碼"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#3e3a34] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "登入中..." : "登入後台"}
          </button>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}