"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const syncUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;

      setUser(currentUser);

      // 加速重點：Navbar 不再每次查 profiles
      // 管理員判斷先讀 auth metadata，避免全站重複打 Supabase DB
      const role = currentUser?.user_metadata?.role;
      setIsAdmin(role === "admin");

      setAuthReady(true);
    };

    syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      const role = currentUser?.user_metadata?.role;
      setIsAdmin(role === "admin");

      setAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error);
        alert("登出失敗");
        return;
      }

      setUser(null);
      setIsAdmin(false);
      setMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { href: "/", label: "首頁" },
    { href: "/needs", label: "借款需求" },
    { href: "/ads", label: "放款廣告" },
    { href: "/lenders", label: "各區放款資訊" },
    { href: "/articles", label: "借錢知識" },
    { href: "/about-platform", label: "關於平台" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-[#f6f2ec]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="秒貸通"
            width={220}
            height={80}
            priority
            className="h-auto w-[180px] md:w-[220px]"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-[#ede3d3] font-semibold text-[#8b6b2c]"
                    : "text-[#4b4b4b] hover:bg-[#f1ebe3]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Buttons */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={user ? "/apply-loan" : "/register?redirect=/apply-loan"}
            className="rounded-full bg-[#b31217] px-5 py-3 text-sm font-bold text-white transition hover:scale-105"
          >
            我要借錢
          </Link>

          <Link
            href={user ? "/post-lender" : "/register?redirect=/post-lender"}
            className="rounded-full bg-[#1d4ed8] px-5 py-3 text-sm font-bold text-white transition hover:scale-105"
          >
            我要放款
          </Link>

          {!authReady ? null : !user ? (
            <>
              <Link
                href="/login"
                className="rounded-full border border-[#c89b45] px-4 py-3 text-sm font-medium text-[#c89b45] transition hover:bg-[#c89b45] hover:text-white"
              >
                登入
              </Link>

              <Link
                href="/register?redirect=/apply-loan"
                className="rounded-full bg-[#c89b45] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:scale-105"
              >
                免費註冊
              </Link>
            </>
          ) : (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-full bg-black px-4 py-3 text-sm font-semibold text-white"
                >
                  管理後台
                </Link>
              )}

              <Link
                href="/member"
                className="rounded-full border border-gray-300 px-4 py-3 text-sm transition hover:bg-gray-100"
              >
                會員中心
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full border border-gray-300 px-4 py-3 text-sm transition hover:bg-gray-100 disabled:opacity-60"
              >
                {loggingOut ? "登出中..." : "登出"}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#eadfce] bg-white lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#4b4b4b]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-[#eadfce] bg-[#f6f2ec] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm transition ${
                    active
                      ? "bg-[#ede3d3] font-semibold text-[#8b6b2c]"
                      : "bg-white text-[#4b4b4b]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {!authReady ? null : !user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-[#c89b45] px-4 py-3 text-center text-sm font-medium text-[#c89b45]"
                >
                  登入
                </Link>

                <Link
                  href="/register?redirect=/apply-loan"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-[#c89b45] px-4 py-3 text-center text-sm font-bold text-white"
                >
                  免費註冊會員
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    管理後台
                  </Link>
                )}

                <Link
                  href="/member"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm"
                >
                  會員中心
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm disabled:opacity-60"
                >
                  {loggingOut ? "登出中..." : "登出"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}