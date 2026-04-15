"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UnlockLogItem = {
  id: string;
  need_id: string | null;
  credit_cost: number | null;
  unlock_type: string | null;
  note: string | null;
  created_at: string | null;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "-";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getUnlockTypeText(type: string | null) {
  switch (type) {
    case "credit":
      return "點數解鎖";
    case "vip":
      return "VIP 查看";
    case "free":
      return "免費查看";
    default:
      return type || "其他";
  }
}

function getUnlockTypeClass(type: string | null) {
  switch (type) {
    case "credit":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "vip":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "free":
      return "bg-green-50 text-green-700 border border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
}

export default function UnlockHistory() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<UnlockLogItem[]>([]);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadLogs() {
      try {
        setLoading(true);
        setErrorText("");

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const user = session?.user;
        if (!user) {
          if (!mounted) return;
          setErrorText("請先登入會員");
          setLogs([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("unlock_logs")
          .select("id, need_id, credit_cost, unlock_type, note, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (!mounted) return;
        setLogs((data || []) as UnlockLogItem[]);
      } catch (error: any) {
        console.error("讀取解鎖紀錄失敗：", error);
        if (!mounted) return;
        setErrorText(error?.message || "讀取解鎖紀錄失敗");
        setLogs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadLogs();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return (
    <section className="mt-8 rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2f2a25]">解鎖紀錄</h2>
          <p className="mt-1 text-sm text-[#7b6f63]">
            這裡會顯示你查看借款需求的使用紀錄。
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-[#f8f5f0] px-4 py-8 text-center text-[#7b6f63]">
          讀取中...
        </div>
      ) : errorText ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          {errorText}
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl bg-[#f8f5f0] px-4 py-8 text-center text-[#7b6f63]">
          目前還沒有解鎖紀錄
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-[#eadfce] md:block">
            <div className="grid grid-cols-5 bg-[#faf7f2] text-sm font-semibold text-[#5f5750]">
              <div className="px-4 py-3">需求 ID</div>
              <div className="px-4 py-3">解鎖方式</div>
              <div className="px-4 py-3">扣點數</div>
              <div className="px-4 py-3">備註</div>
              <div className="px-4 py-3">時間</div>
            </div>

            {logs.map((log, index) => (
              <div
                key={log.id}
                className={`grid grid-cols-5 text-sm text-[#2f2a25] ${
                  index !== logs.length - 1 ? "border-t border-[#f0e7db]" : ""
                }`}
              >
                <div className="break-all px-4 py-4">{log.need_id || "-"}</div>
                <div className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getUnlockTypeClass(
                      log.unlock_type
                    )}`}
                  >
                    {getUnlockTypeText(log.unlock_type)}
                  </span>
                </div>
                <div className="px-4 py-4 font-semibold">
                  {log.credit_cost ?? 0}
                </div>
                <div className="px-4 py-4">{log.note || "-"}</div>
                <div className="px-4 py-4">{formatDate(log.created_at)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 md:hidden">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-[#eadfce] bg-[#fcfaf7] p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#8a7d70]">需求 ID</div>
                    <div className="break-all font-semibold text-[#2f2a25]">
                      {log.need_id || "-"}
                    </div>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getUnlockTypeClass(
                      log.unlock_type
                    )}`}
                  >
                    {getUnlockTypeText(log.unlock_type)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[#8a7d70]">扣點數</div>
                    <div className="font-medium text-[#2f2a25]">
                      {log.credit_cost ?? 0}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#8a7d70]">時間</div>
                    <div className="font-medium text-[#2f2a25]">
                      {formatDate(log.created_at)}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-[#8a7d70]">備註</div>
                    <div className="font-medium text-[#2f2a25]">
                      {log.note || "-"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}