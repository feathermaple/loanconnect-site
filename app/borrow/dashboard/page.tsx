"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LoanRequest = {
  id: string;
  user_id: string | null;
  nickname: string | null;
  phone: string | null;
  line_id: string | null;
  region: string | null;
  amount: number | null;
  purpose: string | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
};

export default function BorrowerDashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadRequests() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "borrower") {
      router.push("/member");
      return;
    }

    const { data, error } = await supabase
      .from("loan_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("讀取借款需求失敗：", error);
      setRequests([]);
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  }

  async function toggleStatus(id: string, currentStatus: string | null) {
    setUpdatingId(id);

    const nextStatus = currentStatus === "closed" ? "open" : "closed";

    const { error } = await supabase
      .from("loan_requests")
      .update({ status: nextStatus })
      .eq("id", id);

    if (error) {
      alert("更新狀態失敗，請稍後再試");
      console.error(error);
    } else {
      await loadRequests();
    }

    setUpdatingId(null);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2f2a25]">
              我的借款需求
            </h1>
            <p className="mt-2 text-sm text-[#7a7066]">
              你可以在這裡新增借款需求，或開啟 / 關閉目前刊登中的需求。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/apply-loan"
              className="rounded-full bg-[#3e3a34] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              新增借款需求
            </Link>

            <Link
              href="/member"
              className="rounded-full border border-[#d8cbbd] bg-white px-6 py-3 text-sm font-bold text-[#3e3a34] transition hover:bg-[#f7f3ed]"
            >
              回會員中心
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-[#e8dfd3] bg-white p-8 text-[#6b6258]">
            載入中...
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-[#e8dfd3] bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#2f2a25]">
              目前尚未刊登借款需求
            </h2>
            <p className="mt-2 text-sm text-[#7a7066]">
              點擊下方按鈕新增你的第一筆借款需求。
            </p>

            <Link
              href="/apply-loan"
              className="mt-6 inline-flex rounded-full bg-[#3e3a34] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              立即新增需求
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((item) => {
              const isClosed = item.status === "closed";

              return (
                <article
                  key={item.id}
                  className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            isClosed
                              ? "bg-gray-100 text-gray-600"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {isClosed ? "已關閉" : "刊登中"}
                        </span>

                        <span className="rounded-full bg-[#f3ece3] px-3 py-1 text-xs font-bold text-[#5a4b3d]">
                          {item.region || "未填地區"}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-[#2f2a25]">
                        {item.purpose || "借款需求"}
                      </h2>

                      <div className="mt-3 grid gap-2 text-sm text-[#6b6258] md:grid-cols-2">
                        <p>
                          借款金額：NT${" "}
                          {Number(item.amount || 0).toLocaleString()}
                        </p>
                        <p>
                          建立時間：
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "zh-TW"
                              )
                            : "未提供"}
                        </p>
                        <p>稱呼：{item.nickname || "未提供"}</p>
                        <p>電話：{item.phone || "未提供"}</p>
                        <p>LINE：{item.line_id || "未提供"}</p>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#6b6258]">
                        {item.description || "未提供需求說明"}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2">
                      <button
                        onClick={() => toggleStatus(item.id, item.status)}
                        disabled={updatingId === item.id}
                        className={`rounded-full px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60 ${
                          isClosed ? "bg-emerald-600" : "bg-[#3e3a34]"
                        }`}
                      >
                        {updatingId === item.id
                          ? "處理中..."
                          : isClosed
                          ? "重新開啟"
                          : "關閉需求"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}