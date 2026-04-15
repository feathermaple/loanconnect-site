"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const baseNavLinks = [
  { label: "首頁", href: "/" },
  { label: "我要借錢", href: "/apply-loan" },
  { label: "我要放款", href: "/post-lender" },
  { label: "借款需求", href: "/needs" },
  { label: "放款廣告", href: "/ads" },
  { label: "各區放款資訊", href: "/lenders" },
  { label: "借錢知識", href: "/articles" },
  { label: "會員中心", href: "/member" },
  { label: "關於平台", href: "/about-platform" },
  { label: "聯絡我們", href: "/contact" },
] as const;

const adminNavLink = { label: "管理後台", href: "/admin" } as const;

export default function Navbar() {
  const supabase = createClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionError) {
          console.error("讀取 session 失敗", sessionError);
          setIsLoggedIn(false);
          setIsAdmin(false);
          setAuthReady(true);
          return;
        }

        const user = session?.user ?? null;

        if (!user) {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setAuthReady(true);
          return;
        }

        setIsLoggedIn(true);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;

        if (profileError) {
          console.error("讀取 role 失敗", profileError);
          setIsAdmin(false);
          setAuthReady(true);
          return;
        }

        setIsAdmin(profile?.role === "admin");
        setAuthReady(true);
      } catch (err) {
        if (!mounted) return;
        console.error("Navbar loadUser 錯誤", err);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setAuthReady(true);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      void loadUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const navLinks = useMemo(() => {
    return isAdmin ? [...baseNavLinks, adminNavLink] : baseNavLinks;
  }, [isAdmin]);

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      setMenuOpen(false);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("登出失敗", error);
      }
    } catch (err) {
      console.error("handleLogout 錯誤", err);
    } finally {
      window.location.href = "/";
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e9e2d8] bg-[#fbf8f3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="秒貸通"
              width={1024}
              height={408}
              className="h-16 w-auto md:h-24 xl:h-28"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="whitespace-nowrap text-[15px] font-medium text-[#5f5750] hover:text-black"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/apply-loan"
              className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              我要借錢
            </Link>

            <Link
              href="/post-lender"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              我要放款
            </Link>

            {!authReady ? (
              <div className="rounded-full border px-4 py-2.5 text-sm text-gray-400">
                載入中...
              </div>
            ) : isLoggedIn ? (
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full border px-4 py-2.5 text-sm disabled:opacity-60"
              >
                {loggingOut ? "登出中..." : "登出"}
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full border px-4 py-2.5 text-sm"
              >
                登入
              </Link>
            )}
          </nav>

          <button
            onClick={() => setMenuOpen(true)}
            className="text-2xl lg:hidden"
            aria-label="開啟選單"
          >
            ☰
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 lg:hidden">
          <div className="absolute right-0 top-0 flex h-full w-[80%] flex-col bg-white p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-lg font-semibold">選單</div>
              <button onClick={() => setMenuOpen(false)} aria-label="關閉選單">
                關閉
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-gray-100 pb-3 text-base text-[#5f5750]"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/apply-loan"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-red-600 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                我要借錢
              </Link>

              <Link
                href="/post-lender"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                我要放款
              </Link>

              {!authReady ? (
                <div className="rounded-full border px-5 py-3 text-center text-sm text-gray-400">
                  載入中...
                </div>
              ) : isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-full border px-5 py-3 text-sm disabled:opacity-60"
                >
                  {loggingOut ? "登出中..." : "登出"}
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border px-5 py-3 text-center text-sm"
                >
                  登入
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}