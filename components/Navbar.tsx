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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <header
        className={[
          "sticky top-0 z-50 border-b border-[#eadfce] bg-[#fbf8f3]/95 backdrop-blur-xl transition-all duration-300",
          scrolled ? "shadow-[0_10px_30px_rgba(95,69,36,0.08)]" : "shadow-none",
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex max-w-[1800px] items-center px-4 md:px-8 transition-all duration-300",
            scrolled ? "py-2 md:py-2.5" : "py-3 md:py-4",
          ].join(" ")}
        >
          {/* LOGO：左半邊品牌區 */}
          <Link
            href="/"
            className="flex w-[42%] min-w-[240px] shrink-0 items-center lg:w-[34%] xl:w-[36%]"
            aria-label="回到首頁"
          >
            <div
              className={[
                "relative w-full transition-all duration-300",
                scrolled
                  ? "h-[58px] sm:h-[64px] md:h-[72px] lg:h-[78px]"
                  : "h-[76px] sm:h-[86px] md:h-[98px] lg:h-[108px]",
              ].join(" ")}
            >
              <Image
                src="/logo.png"
                alt="秒貸通"
                fill
                sizes="(max-width: 640px) 260px, (max-width: 1024px) 360px, 560px"
                className="object-contain object-left drop-shadow-[0_3px_8px_rgba(160,116,34,0.16)]"
                priority
              />
            </div>
          </Link>

          {/* 桌機選單 */}
          <div className="ml-auto hidden items-center gap-4 lg:flex xl:gap-5">
            <nav className="flex items-center gap-4 rounded-full border border-[#eadfce]/70 bg-white/45 px-5 py-3 shadow-sm xl:gap-5">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap text-[14px] font-medium tracking-wide text-[#5f5750] transition hover:-translate-y-0.5 hover:text-[#b8872b]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/apply-loan"
                className="flex h-[86px] w-[54px] items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 px-3 text-center text-[15px] font-bold leading-[1.35] text-white shadow-[0_10px_22px_rgba(220,38,38,0.28)] transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(220,38,38,0.34)]"
              >
                我要借錢
              </Link>

              <Link
                href="/post-lender"
                className="flex h-[86px] w-[54px] items-center justify-center rounded-full bg-gradient-to-b from-blue-500 to-blue-700 px-3 text-center text-[15px] font-bold leading-[1.35] text-white shadow-[0_10px_22px_rgba(37,99,235,0.28)] transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(37,99,235,0.34)]"
              >
                我要放款
              </Link>

              {!authReady ? (
                <div className="flex h-[72px] w-[52px] items-center justify-center rounded-full border border-[#e6ded3] bg-white/70 text-center text-xs text-gray-400">
                  載入中
                </div>
              ) : isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex h-[72px] w-[52px] items-center justify-center rounded-full border border-[#e6ded3] bg-white/70 text-center text-sm font-medium text-[#5f5750] transition hover:bg-white disabled:opacity-60"
                  type="button"
                >
                  {loggingOut ? "登出中" : "登出"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex h-[72px] w-[52px] items-center justify-center rounded-full border border-[#e6ded3] bg-white/70 text-center text-sm font-medium text-[#5f5750] transition hover:bg-white"
                >
                  登入
                </Link>
              )}
            </div>
          </div>

          {/* 手機選單按鈕 */}
          <button
            onClick={() => setMenuOpen(true)}
            className="ml-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#eadfce] bg-white text-2xl text-[#5f5750] shadow-sm lg:hidden"
            aria-label="開啟選單"
            type="button"
          >
            ☰
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="關閉選單背景"
            className="absolute inset-0 bg-black/45"
            onClick={() => setMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 h-dvh w-[86%] max-w-[390px] bg-[#fbf8f3] shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-[#eadfce] px-5 py-4">
                <div className="relative h-[58px] w-[210px]">
                  <Image
                    src="/logo.png"
                    alt="秒貸通"
                    fill
                    sizes="210px"
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