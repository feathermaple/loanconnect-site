"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="text-sm text-[#8a8178]">載入會員資料中...</div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="inline-flex rounded-full border border-line bg-paper px-4 py-1 text-sm text-[#8a8178]">
        Dashboard
      </div>

      <h1 className="mt-4 text-5xl font-black tracking-tight text-ink">會員中心</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        歡迎回來，這裡先顯示目前會員帳號資料。下一步可再接上借款申請紀錄、會員資料表與客服紀錄。
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Card title="會員 Email" value={user.email ?? "-"} />
        <Card title="會員 UID" value={user.id} />
        <Card title="驗證狀態" value={user.email_confirmed_at ? "已驗證" : "未驗證"} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
          <div className="mb-5 text-xl font-bold text-ink">我的資料</div>
          <div className="space-y-4 text-sm">
            <InfoRow label="Email" value={user.email ?? "-"} />
            <InfoRow label="會員 ID" value={user.id} />
            <InfoRow
              label="Email 驗證"
              value={user.email_confirmed_at ? "已完成" : "尚未完成"}
            />
            <InfoRow
              label="建立時間"
              value={user.created_at ? new Date(user.created_at).toLocaleString("zh-TW") : "-"}
            />
          </div>
        </div>

        <div className="space-y-5">
          <InfoCard title="借款申請" desc="下一步可接上 leads 資料，顯示會員自己的申請紀錄。" />
          <InfoCard title="客服追蹤" desc="下一步可補上 LINE 客服、指派顧問與回覆紀錄。" />
          <InfoCard title="帳號設定" desc="下一步可補修改密碼、會員資料與通知設定。" />
        </div>
      </div>
    </section>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
      <div className="text-sm text-[#8a8178]">{title}</div>
      <div className="mt-3 break-all text-2xl font-black text-ink">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[#f0e9df] pb-4 last:border-b-0">
      <div className="text-xs text-[#8a8178]">{label}</div>
      <div className="mt-1 break-all text-sm text-muted">{value}</div>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
      <div className="text-lg font-bold text-ink">{title}</div>
      <p className="mt-3 text-sm leading-6 text-muted">{desc}</p>
    </div>
  );
}