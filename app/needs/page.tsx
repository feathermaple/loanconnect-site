import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getMembershipInfo } from "@/lib/membership";

export const dynamic = "force-dynamic";

function maskNickname(nickname: string) {
  if (!nickname) return "未提供";

  const name = nickname.trim();

  if (
    name.endsWith("先生") ||
    name.endsWith("小姐") ||
    name.endsWith("同學")
  ) {
    return name;
  }

  return `${name.charAt(0)}ＯＯ`;
}

export default async function NeedsPage() {
  const adminSupabase = createAdminClient();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await adminSupabase
    .from("loan_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const requests = data || [];

  let role: string | null = null;
  let isPaidMember = false;
  let isExpiredMember = false;
  let membershipReason = "目前為免費會員";
  let unlockedNeedIds = new Set<string>();
  let unlockedCount = 0;
  let unlockCredits = 0;

  if (user) {
    const [{ data: profile }, { data: unlockLogs }] = await Promise.all([
      adminSupabase
        .from("profiles")
        .select(
          "role, membership_plan, membership_status, membership_expires_at, unlock_credits"
        )
        .eq("id", user.id)
        .maybeSingle(),
      adminSupabase
        .from("need_unlock_logs")
        .select("need_id")
        .eq("user_id", user.id),
    ]);

    role = profile?.role || null;

    const membership = getMembershipInfo(profile);
    isPaidMember = membership.canViewFull;
    isExpiredMember = membership.isExpired;
    membershipReason = membership.reason;
    unlockCredits = profile?.unlock_credits || 0;

    unlockedNeedIds = new Set((unlockLogs || []).map((item) => item.need_id));
    unlockedCount = unlockedNeedIds.size;
  }

  function canViewFullInList(needId: string) {
    if (!user) return false;
    if (role !== "lender" && role !== "admin") return false;
    if (isPaidMember) return true;
    if (unlockedNeedIds.has(needId)) return true;
    return false;
  }

  function getBadge(needId: string) {
    if (!user) {
      return {
        text: "請先登入",
        className: "bg-gray-100 text-gray-600 border border-gray-200",
      };
    }

    if (role !== "lender" && role !== "admin") {
      return {
        text: "非金主帳號",
        className: "bg-gray-100 text-gray-600 border border-gray-200",
      };
    }

    if (isPaidMember) {
      return {
        text: "VIP 可看",
        className: "bg-amber-100 text-amber-700 border border-amber-200",
      };
    }

    if (unlockedNeedIds.has(needId)) {
      return {
        text: "已解鎖",
        className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      };
    }

    if (unlockedCount < 2) {
      return {
        text: `可免費解鎖 ${2 - unlockedCount} 筆`,
        className: "bg-blue-100 text-blue-700 border border-blue-200",
      };
    }

    if (unlockCredits > 0) {
      return {
        text: `可扣點解鎖 (${unlockCredits})`,
        className: "bg-violet-100 text-violet-700 border border-violet-200",
      };
    }

    return {
      text: isExpiredMember ? "會員已到期" : "需升級會員",
      className: "bg-rose-100 text-rose-700 border border-rose-200",
    };
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2f2a25] md:text-4xl">
              借款需求
            </h1>
            <p className="mt-2 text-[#6b6258]">
              最新借款需求公開列表。登入後系統會依你的會員身份，自動顯示可查看的內容。
            </p>

            {user && (role === "lender" || role === "admin") && !isPaidMember ? (
              <p className="mt-2 text-sm text-[#8a5a00]">
                {isExpiredMember
                  ? `你的 VIP 會員已到期，目前改為一般查看規則。你目前還有 ${unlockCredits} 點解鎖點數。`
                  : `你目前已免費解鎖 ${unlockedCount} / 2 筆完整需求，並剩餘 ${unlockCredits} 點解鎖點數。`}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-[#d8cbbd] bg-white px-6 py-3 text-sm font-bold text-[#3e3a34] transition hover:bg-[#f7f3ed]"
            >
              查看會員方案
            </Link>

            <Link
              href="/unlock-pack"
              className="inline-flex items-center justify-center rounded-full border border-[#d8cbbd] bg-white px-6 py-3 text-sm font-bold text-[#3e3a34] transition hover:bg-[#f7f3ed]"
            >
              購買單筆解鎖
            </Link>

            <Link
              href="/apply-loan"
              className="inline-flex items-center justify-center rounded-full bg-[#3e3a34] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
            >
              免費刊登借款需求
            </Link>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            讀取資料失敗：{error.message}
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-[#e8dfd3] bg-white px-6 py-12 text-center text-[#6b6258]">
            目前還沒有借款需求，歡迎搶先刊登。
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {requests.map((item) => {
              const canView = canViewFullInList(item.id);
              const badge = getBadge(item.id);

              return (
                <article
                  key={item.id}
                  className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#f3ece3] px-3 py-1 text-xs font-bold text-[#5a4b3d]">
                      {item.region}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${badge.className}`}
                      >
                        {badge.text}
                      </span>

                      <span className="text-xs text-[#8a8178]">
                        {new Date(item.created_at).toLocaleDateString("zh-TW")}
                      </span>
                    </div>
                  </div>

                  <h2 className="mb-3 text-xl font-bold text-[#2f2a25]">
                    {item.purpose || "借款需求"}
                  </h2>

                  <div className="space-y-2 text-sm text-[#5f5750]">
                    <p>
                      <span className="font-semibold">稱呼：</span>
                      {canView ? item.nickname || "未提供" : maskNickname(item.nickname)}
                    </p>

                    <p>
                      <span className="font-semibold">借款金額：</span>
                      NT$ {Number(item.amount || 0).toLocaleString()}
                    </p>

                    {canView ? (
                      <>
                        <p>
                          <span className="font-semibold">電話：</span>
                          {item.phone || "未提供"}
                        </p>

                        <p>
                          <span className="font-semibold">LINE ID：</span>
                          {item.line_id || "未提供"}
                        </p>
                      </>
                    ) : (
                      <p>
                        <span className="font-semibold">聯絡方式：</span>
                        <span className="text-[#b36b00]">
                          {user
                            ? role === "lender" || role === "admin"
                              ? isExpiredMember
                                ? unlockCredits > 0
                                  ? `VIP 已到期，但你還有 ${unlockCredits} 點可扣點查看`
                                  : "VIP 已到期，請續費或購買單筆解鎖"
                                : unlockedCount < 2
                                  ? "進入詳情頁可免費解鎖查看"
                                  : unlockCredits > 0
                                    ? `進入詳情頁可扣點解鎖（剩餘 ${unlockCredits} 點）`
                                    : "免費額度已用完，請升級會員或購買單筆解鎖"
                              : "金主會員可查看"
                            : "登入後可依會員資格查看"}
                        </span>
                      </p>
                    )}
                  </div>

                  {item.description ? (
                    <div className="mt-4 rounded-2xl bg-[#f8f5ef] px-4 py-3 text-sm leading-6 text-[#5f5750]">
                      {item.description}
                    </div>
                  ) : null}

                  {!canView && (
                    <div className="mt-4 rounded-2xl border border-[#eadfce] bg-[#fffaf4] px-4 py-3 text-sm text-[#6b6258]">
                      {user
                        ? role === "lender" || role === "admin"
                          ? isExpiredMember
                            ? unlockCredits > 0
                              ? `${membershipReason}，但你仍可使用剩餘 ${unlockCredits} 點解鎖點數。`
                              : `${membershipReason}，目前沒有可用點數，請續費或購買單筆解鎖。`
                            : unlockedCount < 2
                              ? `你目前還可免費解鎖 ${2 - unlockedCount} 筆完整需求。`
                              : unlockCredits > 0
                                ? `你的免費解鎖額度已用完，但仍有 ${unlockCredits} 點可使用。`
                                : "你的免費解鎖額度已用完，升級 VIP 或購買單筆解鎖即可繼續查看。"
                          : "目前你的帳號不是金主會員身份，無法查看完整聯絡方式。"
                        : "登入後可依會員身份查看完整聯絡方式。"}
                    </div>
                  )}

                  <Link
                    href={`/needs/${item.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#3e3a34] px-5 py-3 text-sm font-bold text-white transition hover:opacity-95"
                  >
                    {canView
                      ? "查看詳情"
                      : user
                        ? role === "lender" || role === "admin"
                          ? unlockedCount < 2
                            ? "前往解鎖查看"
                            : unlockCredits > 0
                              ? "前往扣點解鎖"
                              : isExpiredMember
                                ? "續費或購買解鎖"
                                : "升級會員或購買解鎖"
                          : "查看詳情"
                        : "登入後查看"}
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}