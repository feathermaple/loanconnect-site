"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminEntryButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/admin/me", {
          method: "GET",
          cache: "no-store",
        });

        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setChecking(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });

      setIsLoggedIn(false);
      router.replace("/admin/login");
      router.refresh();
    } catch {
      alert("登出失敗");
    }
  };

  if (checking) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/admin/login"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center rounded-full border border-[#d8cec2] bg-white/95 px-4 py-2 text-sm font-semibold text-[#3e3a34] shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#f8f5ef]"
      >
        後台登入
      </Link>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <Link
        href="/admin/leads"
        className="inline-flex items-center rounded-full border border-[#d8cec2] bg-white/95 px-4 py-2 text-sm font-semibold text-[#3e3a34] shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#f8f5ef]"
      >
        後台管理
      </Link>

      <button
        onClick={handleLogout}
        className="inline-flex items-center rounded-full border border-[#e7cfcf] bg-white/95 px-4 py-2 text-sm font-semibold text-[#8b3a3a] shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#fff5f5]"
      >
        登出
      </button>
    </div>
  );
}