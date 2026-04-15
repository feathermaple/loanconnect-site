export type MembershipProfile = {
  membership_plan?: string | null;
  membership_status?: string | null;
  membership_expires_at?: string | null;
};

export type MembershipResult = {
  isVipPlan: boolean;
  isStatusActive: boolean;
  hasExpiry: boolean;
  isExpired: boolean;
  canViewFull: boolean;
  effectiveStatus: "active" | "inactive" | "expired" | "free";
  reason: string;
};

export function getMembershipInfo(
  profile: MembershipProfile | null | undefined
): MembershipResult {
  const plan = profile?.membership_plan?.trim() || "";
  const status = (profile?.membership_status?.trim() || "").toLowerCase();
  const expiresAtRaw = profile?.membership_expires_at || null;

  const isVipPlan =
  plan.toUpperCase().includes("VIP");
  const isStatusActive = status === "active";
  const hasExpiry = !!expiresAtRaw;

  let isExpired = false;

  if (expiresAtRaw) {
    const expiresAt = new Date(expiresAtRaw);
    if (!Number.isNaN(expiresAt.getTime())) {
      isExpired = expiresAt.getTime() <= Date.now();
    }
  }

  const canViewFull = isVipPlan && isStatusActive && hasExpiry && !isExpired;

  if (!isVipPlan) {
    return {
      isVipPlan: false,
      isStatusActive,
      hasExpiry,
      isExpired: false,
      canViewFull: false,
      effectiveStatus: "free",
      reason: "目前為免費會員",
    };
  }

  if (!isStatusActive) {
    return {
      isVipPlan: true,
      isStatusActive: false,
      hasExpiry,
      isExpired,
      canViewFull: false,
      effectiveStatus: "inactive",
      reason: "會員尚未啟用或已停用",
    };
  }

  if (!hasExpiry) {
    return {
      isVipPlan: true,
      isStatusActive: true,
      hasExpiry: false,
      isExpired: false,
      canViewFull: false,
      effectiveStatus: "inactive",
      reason: "會員缺少到期時間，請聯絡管理員",
    };
  }

  if (isExpired) {
    return {
      isVipPlan: true,
      isStatusActive: true,
      hasExpiry: true,
      isExpired: true,
      canViewFull: false,
      effectiveStatus: "expired",
      reason: "會員已到期，請續費後查看",
    };
  }

  return {
    isVipPlan: true,
    isStatusActive: true,
    hasExpiry: true,
    isExpired: false,
    canViewFull: true,
    effectiveStatus: "active",
    reason: "VIP 會員有效期內，可查看完整資料",
  };
}