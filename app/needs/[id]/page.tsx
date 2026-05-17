import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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

type NeedDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NeedDetailPage({
  params,
}: NeedDetailPageProps) {
  const { id } = await params;

  const adminSupabase = createAdminClient();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: item, error } = await adminSupabase
    .from("loan_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !item) {
    notFound();
  }

  if (!user) {
    redirect("/login");
  }

  let role: string | null = null;
  let canViewFull = false;
  let statusText = "未解鎖";
  let remainingFreeUnlocks = 0;

  let membershipPlan: string | null = null;
  let membershipStatus: string | null = null;
  let membershipExpiresAt: string | null = null;
  let membershipReason = "目前為免費會員";
  let isPaidMember = false;
  let isExpired = false;
  let unlockCredits = 0;

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
  membershipPlan = profile?.membership_plan || null;
  membershipStatus = profile?.membership_status || null;
  membershipExpiresAt = profile?.membership_expires_at || null;
  unlockCredits = profile?.unlock_credits || 0;

  const isLenderRole = role === "lender" || role === "both" || role === "admin";

  if (!isLenderRole) {
    redirect("/member");
  }

  const membership = getMembershipInfo(profile);
  isPaidMember = membership.canViewFull;
  isExpired = membership.isExpired;
  membershipReason = membership.reason;

  const unlockedNeedIds = new Set((unlockLogs || []).map((log) => log.need_id));
  const alreadyUnlocked = unlockedNeedIds.has(id);

  remainingFreeUnlocks = Math.max(0, 2 - unlockedNeedIds.size);

  if (role === "admin") {
    canViewFull = true;
    statusText = "管理員可看";
    membershipReason = "目前為管理員帳號";
  } else if (role === "lender" || role === "both") {
    if (isPaidMember) {
      canViewFull = true;
      statusText = alreadyUnlocked ? "已解鎖" : "VIP 可看";

      if (!alreadyUnlocked) {
        const { error: insertError } = await adminSupabase
          .from("unlock_logs")
          .insert({
            user_id: user.id,
            need_id: id,
            credit_cost: 0,
            unlock_type: "vip",
            note: "VIP 查看借款需求",
          });

        if (insertError) {
          console.error("VIP 寫入 unlock_logs 失敗", insertError);
        }
      }
    } else if (alreadyUnlocked) {
      canViewFull = true;
      statusText = "已解鎖";
    } else if (remainingFreeUnlocks > 0) {
      const { error: insertError } = await adminSupabase
        .from("unlock_logs")
        .insert({
          user_id: user.id,
          need_id: id,
          credit_cost: 0,
          unlock_type: "free",
          note: "使用免費額度查看借款需求",
        });

      if (!insertError) {
        canViewFull = true;
        statusText = "已解鎖";
        remainingFreeUnlocks = Math.max(0, remainingFreeUnlocks - 1);
      } else {
        console.error("免費額度寫入 unlock_logs 失敗", insertError);
      }
    } else if (unlockCredits > 0) {
      const nextCredits = Math.max(0, unlockCredits - 1);

      const { error: creditUpdateError } = await adminSupabase
        .from("profiles")
        .update({
          unlock_credits: nextCredits,
        })
        .eq("id", user.id);

      if (!creditUpdateError) {
        const { error: insertError } = await adminSupabase
          .from("unlock_logs")
          .insert({
            user_id: user.id,
            need_id: id,
            credit_cost: 1,
            unlock_type: "credit",
            note: "使用點數解鎖借款需求",
          });

        if (!insertError) {
          canViewFull = true;
          statusText = "點數解鎖";
          unlockCredits = nextCredits;
        } else {
          console.error("點數解鎖寫入 unlock_logs 失敗", insertError);
        }
      } else {
        console.error("扣除 unlock_credits 失敗", creditUpdateError);
      }
    } else {
      redirect("/unlock-pack");
    }
  }

  const maskedName = maskNickname(item.nickname);
  const isLenderOrAdmin =
    role === "lender" || role === "both" || role === "admin";

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/needs"
            className="inline-flex items-center justify-center rounded-full border border-[#ddd2c5] bg-white px-5 py-2 text-sm font-bold text-[#3e3a34] transition hover:bg-[#f7f3ed]"
          >
            返回需求列表
          </Link>

          {isLenderOrAdmin ? (
            <>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-[#ddd2c5] bg-white px-5 py-2 text-sm font-bold text-[#3e3a34] transition hover:bg-[#f7f3ed]"
              >
                查看會員方案
              </Link>

              <Link
                href="/unlock-pack"
                className="inline-flex items-center justify-center rounded-full border border-[#ddd2c5] bg-white px-5 py-2 text-sm font-bold text-[#3e3a34] transition hover:bg-[#f7f3ed]"
              >
                購買單筆解鎖
              </Link>
            </>
          ) : null}
        </div>

        <article className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f3ece3] px-3 py-1 text-xs font-bold text-[#5a4b3d]">
                {item.region}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  statusText === "VIP 可看"
                    ? "border border-amber-200 bg-amber-100 text-amber-700"
                    : statusText === "已解鎖" ||
                      statusText === "點數解鎖" ||
                      statusText === "管理員可看"
                    ? "border border-emerald-200 bg-emerald-100 text-emerald-700"
                    : "border border-gray-200 bg-gray-100 text-gray-600"
                }`}
              >
                {statusText}
              </span>
            </div>

            <span className="text-sm text-[#8a8178]">
              發布日期：{new Date(item.created_at).toLocaleDateString("zh-TW")}
            </span>
          </div>

          <h1 className="mb-4 text-2xl font-bold text-[#2f2a25] md:text-3xl">
            {item.purpose || "借款需求"}
          </h1>

          {role === "admin" ? (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-800">
              目前為管理員帳號，可查看完整需求資料。
            </div>
          ) : isPaidMember ? (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-800">
              {membershipReason}
            </div>
          ) : isExpired ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-7 text-red-700">
              你的 VIP 會員已到期，系統會優先使用免費額度或解鎖點數查看完整需求。
            </div>
          ) : statusText === "點數解鎖" ? (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-800">
              已使用 1 點解鎖點數查看本筆需求，目前剩餘 {unlockCredits} 點。
            </div>
          ) : (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-800">
              本筆需求已成功解鎖。
              {remainingFreeUnlocks >= 0
                ? ` 你目前還剩 ${remainingFreeUnlocks} 筆免費解鎖額度。`
                : ""}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#f8f5ef] px-5 py-4">
              <div className="text-sm font-semibold text-[#6a6157]">稱呼</div>
              <div className="mt-1 text-base text-[#2f2a25]">
                {canViewFull ? item.nickname || "未提供" : maskedName}
              </div>
            </div>

            <div className="rounded-2xl bg-[#f8f5ef] px-5 py-4">
              <div className="text-sm font-semibold text-[#6a6157]">
                借款金額
              </div>
              <div className="mt-1 text-base text-[#2f2a25]">
                NT$ {Number(item.amount || 0).toLocaleString()}
              </div>
            </div>

            <div className="rounded-2xl bg-[#f8f5ef] px-5 py-4">
              <div className="text-sm font-semibold text-[#6a6157]">電話</div>
              <div className="mt-1 text-base text-[#2f2a25]">
                {canViewFull ? item.phone || "未提供" : "解鎖後可查看"}
              </div>
            </div>

            <div className="rounded-2xl bg-[#f8f5ef] px-5 py-4">
              <div className="text-sm font-semibold text-[#6a6157]">
                LINE ID
              </div>
              <div className="mt-1 text-base text-[#2f2a25]">
                {canViewFull ? item.line_id || "未提供" : "解鎖後可查看"}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-[#f8f5ef] px-5 py-4">
            <div className="text-sm font-semibold text-[#6a6157]">需求說明</div>
            <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#2f2a25]">
              {item.description || "未提供"}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#eee4d8] bg-[#fcfaf7] px-4 py-4 text-sm leading-7 text-[#6b6258]">
            <div>會員方案：{membershipPlan || "免費會員"}</div>
            <div>會員狀態：{membershipStatus || "未設定"}</div>
            <div>到期時間：{membershipExpiresAt || "未設定"}</div>
            <div>解鎖點數：{unlockCredits}</div>
            <div>權限說明：{membershipReason}</div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {item.phone ? (
              <a
                href={`tel:${item.phone}`}
                className="inline-flex items-center justify-center rounded-full bg-[#3e3a34] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
              >
                立即撥打電話
              </a>
            ) : null}

            {isLenderOrAdmin ? (
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-[#d8cbbd] bg-white px-6 py-3 text-sm font-bold text-[#3e3a34] transition hover:bg-[#f7f3ed]"
              >
                查看會員方案
              </Link>
            ) : null}
          </div>
        </article>
      </div>
    </main>
  );
}