"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type LoanRequest = {
  id: string;
  nickname: string | null;
  region: string | null;
  amount: number | null;
  purpose: string | null;
  phone: string | null;
  line_id: string | null;
  description: string | null;
  created_at?: string | null;
};

type Profile = {
  unlock_credits: number | null;
  membership_status: string | null;
};

export default function AdminLoanRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  const [userId, setUserId] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [list, setList] = useState<LoanRequest[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  const isVIP = profile?.membership_status === "active";
  const credits = profile?.unlock_credits ?? 0;

  const fetchCurrentUser = useCallback(async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("取得使用者失敗", error);
      return null;
    }

    if (!user) {
      return null;
    }

    setUserId(user.id);
    return user.id;
  }, []);

  const fetchProfile = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("unlock_credits, membership_status")
      .eq("id", uid)
      .single();

    if (error) {
      console.error("讀取會員資料失敗", error);
      return;
    }

    setProfile(data);
  }, []);

  const fetchLoanRequests = useCallback(async () => {
    const { data, error } = await supabase
      .from("loan_requests")
      .select(
        "id, nickname, region, amount, purpose, phone, line_id, description, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("讀取名單失敗", error);
      return;
    }

    setList(data || []);
  }, []);

  const fetchUnlockedIds = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from("unlock_logs")
      .select("need_id")
      .eq("user_id", uid);

    if (error) {
      console.error("讀取解鎖紀錄失敗", error);
      return;
    }

    const ids =
      data
        ?.map((item: any) => item.need_id)
        .filter((id: string | null) => Boolean(id)) || [];

    setUnlockedIds(ids);
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);

    const uid = await fetchCurrentUser();

    if (!uid) {
      setLoading(false);
      return;
    }

    await Promise.all([
      fetchProfile(uid),
      fetchLoanRequests(),
      fetchUnlockedIds(uid),
    ]);

    setLoading(false);
  }, [fetchCurrentUser, fetchProfile, fetchLoanRequests, fetchUnlockedIds]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleUnlock = async (needId: string) => {
    if (!userId) {
      alert("請先登入會員");
      return;
    }

    if (unlockedIds.includes(needId)) {
      return;
    }

    setUnlockingId(needId);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          needId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result?.error || "解鎖失敗");
        return;
      }

      setUnlockedIds((prev) => [...prev, needId]);

      if (!isVIP) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                unlock_credits: Math.max((prev.unlock_credits || 0) - 1, 0),
              }
            : prev
        );
      }

      alert(isVIP ? "VIP 已開啟查看權限" : "解鎖成功，已扣 1 點");
    } catch (error) {
      console.error(error);
      alert("系統錯誤，請稍後再試");
    } finally {
      setUnlockingId(null);
    }
  };

  const summaryText = useMemo(() => {
    if (!profile) return "讀取中...";
    if (isVIP) return "目前為 VIP 會員，可直接解鎖查看名單";
    return `目前剩餘點數：${credits} 點`;
  }, [profile, isVIP, credits]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f2ec] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm">
            載入中...
          </div>
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-[#f6f2ec] px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#2b2b2b]">名單管理</h1>
            <p className="mt-4 text-[#6b6257]">請先登入後再查看名單資料。</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f2ec] px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#2b2b2b]">名單管理</h1>
              <p className="mt-2 text-sm text-[#6b6257]">
                可查看借款需求名單，解鎖後顯示完整聯絡資訊。
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf6ef] px-4 py-3 text-sm text-[#5f554a]">
              {summaryText}
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-[28px] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            目前沒有借款需求名單
          </div>
        ) : (
          <div className="grid gap-5">
            {list.map((item) => {
              const unlocked = unlockedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-[#2b2b2b]">
                          {item.nickname || "未填稱呼"}
                        </h2>

                        <span className="rounded-full bg-[#fff4dd] px-3 py-1 text-xs font-semibold text-[#9a6b18]">
                          {item.region || "未填地區"}
                        </span>

                        {unlocked ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            已解鎖
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            未解鎖
                          </span>
                        )}
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-[#faf6ef] p-4">
                          <div className="text-xs text-[#8a7f72]">借款金額</div>
                          <div className="mt-1 text-lg font-bold text-[#2b2b2b]">
                            {item.amount ? `${item.amount.toLocaleString()} 元` : "未填"}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-[#faf6ef] p-4">
                          <div className="text-xs text-[#8a7f72]">借款用途</div>
                          <div className="mt-1 text-[#2b2b2b]">
                            {item.purpose || "未填"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl bg-[#faf6ef] p-4">
                        <div className="text-xs text-[#8a7f72]">需求說明</div>
                        <div className="mt-1 whitespace-pre-line text-[#2b2b2b]">
                          {item.description || "未填"}
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-[#8a7f72]">
                        建立時間：
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString("zh-TW")
                          : "未提供"}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-[#eadfce] bg-[#fcfaf7] p-5">
                      <div className="text-sm font-semibold text-[#9a6b18]">
                        聯絡資訊
                      </div>

                      {unlocked ? (
                        <div className="mt-4 space-y-4">
                          <div className="rounded-2xl bg-white p-4">
                            <div className="text-xs text-[#8a7f72]">電話</div>
                            <div className="mt-1 break-all font-semibold text-[#2b2b2b]">
                              {item.phone || "未填"}
                            </div>
                          </div>

                          <div className="rounded-2xl bg-white p-4">
                            <div className="text-xs text-[#8a7f72]">LINE ID</div>
                            <div className="mt-1 break-all font-semibold text-[#2b2b2b]">
                              {item.line_id || "未填"}
                            </div>
                          </div>

                          <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-700">
                            這筆名單已可查看完整聯絡方式
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-4">
                          <div className="rounded-2xl bg-white p-4 text-sm text-[#6b6257]">
                            🔒 尚未解鎖，解鎖後可查看電話與 LINE ID
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUnlock(item.id)}
                            disabled={unlockingId === item.id}
                            className="w-full rounded-2xl bg-[#c89b45] px-4 py-3 font-bold text-white transition hover:bg-[#b98c35] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {unlockingId === item.id
                              ? "解鎖中..."
                              : isVIP
                              ? "VIP 立即查看"
                              : "解鎖名單（扣 1 點）"}
                          </button>

                          {!isVIP && (
                            <div className="text-center text-xs text-[#8a7f72]">
                              目前剩餘點數：{credits} 點
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}