"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "borrower" | "lender" | "both" | "admin" | "member" | null;

type Profile = {
  id: string;
  email: string;
  role: Role;
  phone?: string | null;
  line_id?: string | null;
};

export default function MemberPage() {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user;

        if (!user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error(error);
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f2ec] px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[32px] bg-white p-10 text-center shadow-sm">
            載入中...
          </div>
        </div>
      </main>
    );
  }

  const role = profile?.role ?? "member";

  const roleLabelMap: Record<string, string> = {
    borrower: "借錢會員",
    lender: "金主會員",
    both: "雙身分會員",
    admin: "管理員",
    member: "一般會員",
  };

  const roleLabel = roleLabelMap[role] || "未設定";

  const isBorrower =
    role === "borrower" ||
    role === "both" ||
    role === "admin" ||
    role === "member";

  const isLender =
    role === "lender" ||
    role === "both" ||
    role === "admin";

  return (
    <main className="min-h-screen bg-[#f6f2ec] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* 會員資訊 */}
        <section className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-[#8a8175]">會員中心</p>

              <h1 className="mt-2 text-3xl font-black text-[#2b2b2b]">
                歡迎回來
              </h1>

              <div className="mt-4 space-y-2 text-sm text-[#5f564c]">
                <p>
                  <span className="font-semibold">帳號：</span>
                  {profile?.email || "未設定"}
                </p>

                <p>
                  <span className="font-semibold">會員身份：</span>
                  {roleLabel}
                </p>

                <p>
                  <span className="font-semibold">LINE ID：</span>
                  {profile?.line_id || "未設定"}
                </p>

                <p>
                  <span className="font-semibold">手機：</span>
                  {profile?.phone || "未設定"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-2xl border border-[#d7c8b4] px-5 py-3 text-sm font-semibold text-[#6b5840] transition hover:bg-[#f8f3ec]"
              >
                返回首頁
              </Link>

              <Link
                href="/pricing"
                className="rounded-2xl bg-[#c89b45] px-5 py-3 text-sm font-bold text-white transition hover:scale-105"
              >
                升級會員方案
              </Link>
            </div>
          </div>
        </section>

        {/* 借錢會員功能 */}
        {isBorrower && (
          <section className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8a8175]">Borrower Area</p>

                <h2 className="mt-1 text-2xl font-black text-[#2b2b2b]">
                  借款會員專區
                </h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Card
                title="刊登借款需求"
                desc="快速刊登資金需求，等待資金方主動聯繫。"
                href="/apply-loan"
                color="bg-[#b31217]"
              />

              <Card
                title="查看借款需求"
                desc="查看目前平台上的借款需求內容。"
                href="/needs"
                color="bg-[#6b5840]"
              />
            </div>
          </section>
        )}

        {/* 金主會員功能 */}
        {isLender && (
          <section className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8a8175]">Lender Area</p>

                <h2 className="mt-1 text-2xl font-black text-[#2b2b2b]">
                  金主會員專區
                </h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Card
                title="刊登放款廣告"
                desc="曝光你的放款服務與條件。"
                href="/post-lender"
                color="bg-[#1d4ed8]"
              />

              <Card
                title="查看借款名單"
                desc="瀏覽目前借款會員刊登的需求資料。"
                href="/needs"
                color="bg-[#111827]"
              />

              <Card
                title="會員方案"
                desc="查看金主會員方案與升級內容。"
                href="/pricing"
                color="bg-[#c89b45]"
              />
            </div>
          </section>
        )}

        {/* 管理員 */}
        {role === "admin" && (
          <section className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <p className="text-sm text-[#8a8175]">Admin Area</p>

              <h2 className="mt-1 text-2xl font-black text-[#2b2b2b]">
                管理後台
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Card
                title="進入管理後台"
                desc="管理會員、借款需求、放款廣告等內容。"
                href="/admin"
                color="bg-black"
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Card({
  title,
  desc,
  href,
  color,
}: {
  title: string;
  desc: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[28px] border border-[#eadfce] bg-[#fcfaf7] p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={`inline-flex rounded-full px-4 py-2 text-sm font-bold text-white ${color}`}
      >
        功能入口
      </div>

      <h3 className="mt-5 text-xl font-black text-[#2b2b2b]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-[#6f665d]">
        {desc}
      </p>

      <div className="mt-6 text-sm font-semibold text-[#8b6b2c]">
        前往 →
      </div>
    </Link>
  );
}