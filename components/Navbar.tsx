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
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
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
      <header className="sticky top-0 z-[999] w-full overflow-hidden border-b border-[#e7dece] bg-[#fbf8f3]/95 backdrop-blur-xl shadow-[0_12px_35px_rgba(94,70,36,0.08)]">
        <div className="mx-auto flex max-w-[1920px] items-center px-3 py-4 sm:px-4 md:px-10 md:py-5 xl:px-16">
          <Link
            href="/"
            className="flex w-[180px] shrink-0 items-center sm:w-[230px] md:w-[360px] lg:w-[48vw] lg:max-w-[820px] lg:min-w-[420px]"
            aria-label="回到首頁"
          >
            <div className="relative h-[110px] w-full sm:h-[130px] md:h-[150px] xl:h-[170px]">
              <Image
                src="/logo.png"
                alt="秒貸通"
                fill
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 360px, 820px"
                className="object-contain object-left drop-shadow-[0_6px_14px_rgba(178,132,38,0.22)]"
                priority
              />
            </div>
          </Link>

          <div className="ml-auto hidden items-center gap-4 lg:flex">
            <nav className="flex items-center gap-4 rounded-full border border-[#eadfce] bg-white/70 px-5 py-3 shadow-[0_8px_24px_rgba(94,70,36,0.06)] xl:gap-5">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap text-[14px] font-medium text-[#5f5750] transition hover:-translate-y-0.5 hover:text-[#b8872b]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/apply-loan"
              className="flex h-[92px] w-[58px] items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 px-3 text-center text-[15px] font-bold leading-[1.35] text-white shadow-[0_12px_25px_rgba(220,38,38,0.28)] transition hover:-translate-y-1"
            >
              我要借錢
            </Link>

            <Link
              href="/post-lender"
              className="flex h-[92px] w-[58px] items-center justify-center rounded-full bg-gradient-to-b from-blue-500 to-blue-700 px-3 text-center text-[15px] font-bold leading-[1.35] text-white shadow-[0_12px_25px_rgba(37,99,235,0.28)] transition hover:-translate-y-1"
            >
              我要放款
            </Link>

            {!authReady ? (
              <div className="flex h-[74px] w-[56px] items-center justify-center rounded-full border border-[#e6ded3] bg-white/80 text-center text-xs text-gray-400">
                載入中
              </div>
            ) : isLoggedIn ? (
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex h-[74px] w-[56px] items-center justify-center rounded-full border border-[#e6ded3] bg-white/80 text-center text-sm font-medium text-[#5f5750] transition hover:bg-white disabled:opacity-60"
                type="button"
              >
                {loggingOut ? "登出中" : "登出"}
              </button>
            ) : (
              <Link
                href="/login"
                className="flex h-[74px] w-[56px] items-center justify-center rounded-full border border-[#e6ded3] bg-white/80 text-center text-sm font-medium text-[#5f5750] transition hover:bg-white"
              >
                登入
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="relative z-[1000] ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#eadfce] bg-white text-2xl text-[#5f5750] shadow-sm lg:hidden"
            aria-label="開啟選單"
            type="button"
          >
            ☰
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[1001] lg:hidden">
          <button
            type="button"
            aria-label="關閉選單背景"
            className="absolute inset-0 bg-black/45"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 h-dvh w-[86%] max-w-[390px] bg-[#fbf8f3] shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-[#eadfce] px-5 py-4">
                <div className="relative h-[72px] w-[250px]">
                  <Image
                    src="/logo.png"
                    alt="秒貸通"
                    fill
                    sizes="250px"
                    className="object-contain object-left"
                    priority
                  />
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="關閉選單"
                  className="rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm text-[#5f5750]"
                  type="button"
                >
                  關閉
                </button>
              </div>

              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 pb-32"
                style={{
                  WebkitOverflowScrolling: "touch",
                  touchAction: "pan-y",
                }}
              >
                <div className="flex flex-col gap-3">
                  {navLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-base font-medium text-[#5f5750] shadow-sm"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <Link
                    href="/apply-loan"
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 rounded-2xl bg-red-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg"
                  >
                    我要借錢
                  </Link>

                  <Link
                    href="/post-lender"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg"
                  >
                    我要放款
                  </Link>

                  {!authReady ? (
                    <div className="rounded-2xl border border-[#eadfce] bg-white px-5 py-3 text-center text-sm text-gray-400">
                      載入中...
                    </div>
                  ) : isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="rounded-2xl border border-[#eadfce] bg-white px-5 py-3 text-sm font-medium text-[#5f5750] disabled:opacity-60"
                      type="button"
                    >
                      {loggingOut ? "登出中..." : "登出"}
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-2xl border border-[#eadfce] bg-white px-5 py-3 text-center text-sm font-medium text-[#5f5750]"
                    >
                      登入
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}