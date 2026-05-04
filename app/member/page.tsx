"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  email?: string | null;
  role?: string | null;
  membership_plan?: string | null;
  membership_status?: string | null;
  free_unlock_remaining?: number | null;
  unlock_points?: number | null;
};

type Membership = {
  id: string;
  plan_name?: string | null;
  status?: string | null;
  expires_at?: string | null;
};

export default function MemberPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [freeRemaining, setFreeRemaining] = useState(0);
  const [unlockPoints, setUnlockPoints] = useState(0);

  async function loadMemberData() {
    try {
      setLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("讀取 session 失敗", sessionError);
        setProfile(null);
        setMembership(null);
        setUnlockedCount(0);
        setFreeRemaining(0);
        setUnlockPoints(0);
        return;
      }

      if (!session?.user) {
        setProfile(null);
        setMembership(null);
        setUnlockedCount(0);
        setFreeRemaining(0);
        setUnlockPoints(0);
        return;
      }

      const user = session.user;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("讀取 profiles 失敗", profileError);
      }

      setProfile(profileData || null);

      const { data: membershipData, error: membershipError } = await supabase
        .from("lender_memberships")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (membershipError) {
        console.error("讀取會員方案失敗", membershipError);
      }

      setMembership(membershipData || null);

      const { count: unlockCount, error: unlockError } = await supabase
        .from("unlock_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (unlockError) {
        console.error("讀取 unlock_logs 失敗", unlockError);
      }

      setUnlockedCount(unlockCount || 0);
      setFreeRemaining(Number(profileData?.free_unlock_remaining ?? 0));
      setUnlockPoints(Number(profileData?.unlock_points ?? 0));
    } catch (err) {
      console.error("loadMemberData 錯誤", err);
      setProfile(null);
      setMembership(null);
      setUnlockedCount(0);
      setFreeRemaining(0);
      setUnlockPoints(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMemberData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadMemberData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const roleText =
    profile?.role === "admin"
      ? "管理員"
      : profile?.role === "lender"
      ? "金主"
      : profile?.role === "borrower"
      ? "借款會員"
      : profile?.role || "未設定";

  const currentPlan =
    membership?.plan_name ||
    profile?.membership_plan ||
    (profile?.role === "admin" ? "管理員帳號" : "免費會員");

  const currentStatus =
    membership?.status ||
    profile?.membership_status ||
    (profile?.role === "admin" ? "管理員" : "免費會員");

  const isLender =
    profile?.role === "lender" ||
    profile?.role === "admin" ||
    Boolean(profile?.membership_plan?.includes("金主")) ||
    Boolean(membership?.plan_name?.includes("金主"));

  return (
    <main className="min-h-screen bg-[#f8f6f1] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-[#1f2937]">會員中心</h1>
        <p className="mt-3 text-base text-[#6b7280]">
          這裡可以查看你的會員身份、解鎖額度與使用狀態。
        </p>

        {loading ? (
          <div className="mt-8 rounded-3xl border border-[#eadfce] bg-white p-8 text-[#6b7280]">
            載入中...
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
                <div className="text-sm text-[#8b7355]">會員身份</div>
                <div className="mt-3 text-2xl font-bold text-[#1f2937]">
                  {currentPlan}
                </div>
              </div>

              <div className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
                <div className="text-sm text-[#8b7355]">帳號角色</div>
                <div className="mt-3 text-2xl font-bold text-[#1f2937]">
                  {roleText}
                </div>
              </div>

              <div className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
                <div className="text-sm text-[#8b7355]">已解鎖筆數</div>
                <div className="mt-3 text-2xl font-bold text-[#1f2937]">
                  {unlockedCount}
                </div>
              </div>

              <div className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
                <div className="text-sm text-[#8b7355]">免費剩餘</div>
                <div className="mt-3 text-2xl font-bold text-[#1f2937]">
                  {freeRemaining}
                </div>
              </div>

              <div className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
                <div className="text-sm text-[#8b7355]">解鎖點數</div>
                <div className="mt-3 text-2xl font-bold text-[#1f2937]">
                  {unlockPoints}
                </div>
              </div>
            </div>

            <section className="mt-8 rounded-3xl border border-[#eadfce] bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-[#1f2937]">
                目前方案說明
              </h2>

              <div className="mt-6 space-y-4 text-lg leading-8 text-[#374151]">
                <p>目前會員方案：{currentPlan}</p>
                <p>會員權限狀態：{currentStatus}</p>
                <p>帳號角色：{roleText}</p>
                <p>目前已解鎖：{unlockedCount} 筆</p>
                <p>解鎖點數餘額：{unlockPoints} 點</p>
                <p>到期時間：{membership?.expires_at || "無"}</p>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f6f1e8] px-5 py-4 text-[#6b5b45]">
                {profile?.role === "admin"
                  ? "目前為管理員帳號"
                  : currentStatus === "active"
                  ? "目前方案已啟用"
                  : "目前為免費會員"}
              </div>
            </section>

            {isLender && (
              <section className="mt-8 rounded-3xl border border-[#eadfce] bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-[#3f2a14]">
                      金主會員專區
                    </h2>
                    <p className="mt-3 text-base leading-7 text-[#7a6a5a]">
                      升級會員方案或購買單筆解鎖，查看完整借款需求聯絡資料。
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/pricing"
                      className="inline-flex items-center justify-center rounded-full border border-[#d8c6ad] bg-white px-6 py-3 text-sm font-bold text-[#3f2a14] transition hover:bg-[#f7f1e8]"
                    >
                      查看會員方案
                    </Link>

                    <Link
                      href="/pricing?mode=unlock"
                      className="inline-flex items-center justify-center rounded-full bg-[#3f3a33] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#2f2a24]"
                    >
                      購買單筆解鎖
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}