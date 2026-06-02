import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getMembershipInfo } from "@/lib/membership";

export const dynamic = "force-dynamic";

function maskNickname(nickname: string) {
  if (!nickname) return "未提供";
  const name = nickname.trim();
  if (name.endsWith("先生") || name.endsWith("小姐") || name.endsWith("同學")) {
    return name;
  }
  return `${name.charAt(0)}ＯＯ`;
}

function maskPhone(phone?: string | null) {
  if (!phone) return "未提供";
  if (phone.length <= 4) return "****";
  return `${phone.slice(0, 4)}******`;
}

function maskLine(line?: string | null) {
  if (!line) return "未提供";
  if (line.length <= 3) return "***";
  return `${line.slice(0, 2)}***`;
}

export default async function NeedsPage() {
  const adminSupabase = createAdminClient();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        .from("unlock_logs")
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

  const { data, error } = await adminSupabase
    .from("loan_requests")
    .select("*")
    .in("status", ["open", "closed"])
    .order("created_at", { ascending: false });

  const requests = data || [];

  function isBorrowerOwnNeed(item: any) {
    if (!user) return false;
    return item.user_id === user.id;
  }

  function isLenderLike() {
    return role === "lender" || role === "both" || role === "admin";
  }

  function canViewFullInList(item: any) {
    if (!user) return false;
    if (isBorrowerOwnNeed(item)) return true;
    if (role === "admin") return true;
    if (!isLenderLike()) return false;
    if (isPaidMember) return true;
    if (unlockedNeedIds.has(item.id)) return true;
    return false;
  }

  function getBadge(item: any) {
    if (item.status === "closed") {
      return {
       text: "借錢成功",
       className:
        "bg-green-600 text-white border border-green-600",
      };
    }

    if (!user) {
      return {
        text: "請先登入",
        className: "bg-gray-100 text-gray-600 border border-gray-200",
      };
    }

    if (isBorrowerOwnNeed(item)) {
    
      return {
        text: "我的刊登",
        className: "bg-blue-100 text-blue-700 border border-blue-200",
      };
    }

    if (role === "admin") {
      return {
        text: "管理員可看",
        className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      };
    }

    if (!isLenderLike()) {
      return {
        text: "金主可看",
        className: "bg-gray-100 text-gray-600 border border-gray-200",
      };
    }

    if (unlockedNeedIds.has(item.id)) {
      return {
        text: "已解鎖",
        className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      };
    }

    if (isPaidMember) {
      return {
        text: "VIP 可看",
        className: "bg-amber-100 text-amber-700 border border-amber-200",
      };
    }

    if (unlockCredits > 0) {
      return {
        text: `可扣點解鎖 (${unlockCredits})`,
        className: "bg-violet-100 text-violet-700 border border-violet-200",
      };
    }

    return {
      text: isExpiredMember ? "會員已到期" : "需解鎖",
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
              金主會員可解鎖查看完整聯絡資訊；借款會員可查看自己的刊登資料。
            </p>

            {user && isLenderLike() && !isPaidMember ? (
              <p className="mt-2 text-sm text-[#8a5a00]">
                {isExpiredMember
                  ? `你的 VIP 會員已到期，目前剩餘 ${unlockCredits} 點解鎖點數。`
                  : `你目前剩餘 ${unlockCredits} 點解鎖點數。`}
              </p>
            ) : null}
          </div>

          <Link
            href={user ? "/apply-loan" : "/register?redirect=/apply-loan"}
            className="inline-flex items-center justify-center rounded-full bg-[#3e3a34] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
          >
            免費刊登借款需求
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            讀取資料失敗：{error.message}
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-[#e8dfd3] bg-white px-6 py-12 text-center text-[#6b6258]">
            目前還沒有開啟中的借款需求。
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {requests.map((item: any) => {
              const canView = canViewFullInList(item);
              const badge = getBadge(item);
              const alreadyUnlocked = unlockedNeedIds.has(item.id);
              const ownNeed = isBorrowerOwnNeed(item);

              return (
                <article
                  key={item.id}
                  className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#f3ece3] px-3 py-1 text-xs font-bold text-[#5a4b3d]">
                      {item.region || "未提供地區"}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${badge.className}`}
                      >
                        {badge.text}
                      </span>

                      <span className="text-xs text-[#8a8178]">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              "zh-TW"
                            )
                          : ""}
                      </span>
                    </div>
                  </div>

                  <h2 className="mb-3 text-xl font-bold text-[#2f2a25]">
                    {item.purpose || "借款需求"}
                  </h2>

                  <div className="space-y-2 text-sm text-[#5f5750]">
                    <p>
                      <span className="font-semibold">稱呼：</span>
                      {canView
                        ? item.nickname || "未提供"
                        : maskNickname(item.nickname)}
                    </p>

                    <p>
                      <span className="font-semibold">借款金額：</span>
                      NT$ {Number(item.amount || 0).toLocaleString()}
                    </p>

                    <p>
                      <span className="font-semibold">電話：</span>
                      {canView ? item.phone || "未提供" : maskPhone(item.phone)}
                    </p>

                    <p>
                      <span className="font-semibold">LINE ID：</span>
                      {canView
                        ? item.line_id || "未提供"
                        : maskLine(item.line_id)}
                    </p>
                  </div>

                  {item.description ? (
                    <div className="mt-4 rounded-2xl bg-[#f8f5ef] px-4 py-3 text-sm leading-6 text-[#5f5750]">
                      {item.description}
                    </div>
                  ) : null}

                  {!canView && (
                    <div className="mt-4 rounded-2xl border border-[#eadfce] bg-[#fffaf4] px-4 py-3 text-sm text-[#6b6258]">
                      {!user
                        ? "登入後可依會員身份查看完整聯絡方式。"
                        : isLenderLike()
                          ? isExpiredMember
                            ? unlockCredits > 0
                              ? `${membershipReason}，但你仍可使用剩餘 ${unlockCredits} 點解鎖。`
                              : `${membershipReason}，目前沒有可用點數，請續費或購買單筆解鎖。`
                            : unlockCredits > 0
                              ? `可使用 ${unlockCredits} 點解鎖查看完整聯絡資訊。`
                              : "目前沒有可用點數，請升級會員或購買單筆解鎖。"
                          : "金主會員可查看完整聯絡方式。"}
                    </div>
                  )}

                  {alreadyUnlocked && (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      這筆你已解鎖過，進入詳情頁不會再次扣點。
                    </div>
                  )}

                  {ownNeed && (
                    <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                      這是你自己刊登的借款需求。
                    </div>
                  )}

                  <Link
                    href={`/needs/${item.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#3e3a34] px-5 py-3 text-sm font-bold text-white transition hover:opacity-95"
                  >
                    {canView
                      ? alreadyUnlocked
                        ? "查看已解鎖詳情"
                        : ownNeed
                          ? "查看我的刊登"
                          : "查看詳情"
                      : user
                        ? isLenderLike()
                          ? unlockCredits > 0 || isPaidMember
                            ? "前往解鎖查看"
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