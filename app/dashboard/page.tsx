"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/useAuth";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  amount: number;
  city: string;
  district: string;
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadLoading, setLeadLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchLeads() {
      const { data, error } = await supabase
        .from("customer_leads")
        .select("*")
        .eq("customer_user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setLeads(data);
      }

      setLeadLoading(false);
    }

    fetchLeads();
  }, [user]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-sm text-[#8a8178]">載入會員資料中...</div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">

      <h1 className="text-5xl font-black text-ink">會員中心</h1>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Card title="會員 Email" value={user.email ?? "-"} />
        <Card title="會員 UID" value={user.id} />
        <Card title="驗證狀態" value={user.email_confirmed_at ? "已驗證" : "未驗證"} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">

        <div className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
          <div className="mb-5 text-xl font-bold">我的貸款申請</div>

          {leadLoading && (
            <div className="text-sm text-[#8a8178]">載入申請資料...</div>
          )}

          {!leadLoading && leads.length === 0 && (
            <div className="text-sm text-[#8a8178]">
              尚未有申請紀錄
            </div>
          )}

          {!leadLoading && leads.length > 0 && (
            <div className="space-y-4">

              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-xl border border-[#eee4d8] p-4"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">
                      {lead.city} {lead.district}
                    </span>
                    <span className="text-[#8a8178]">
                      {new Date(lead.created_at).toLocaleDateString("zh-TW")}
                    </span>
                  </div>

                  <div className="mt-2 text-sm">
                    申請金額：{lead.amount?.toLocaleString()} 元
                  </div>

                  <div className="mt-1 text-sm text-[#8a8178]">
                    狀態：{lead.status}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        <div className="space-y-5">
          <InfoCard title="客服追蹤" desc="客服回覆與案件追蹤紀錄。" />
          <InfoCard title="帳號設定" desc="修改會員資料與密碼設定。" />
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

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
      <div className="text-lg font-bold">{title}</div>
      <p className="mt-3 text-sm text-[#8a8178]">{desc}</p>
    </div>
  );
}