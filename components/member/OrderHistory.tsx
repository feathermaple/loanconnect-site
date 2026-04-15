"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type OrderItem = {
  id: string;
  order_no: string | null;
  type: string | null;
  plan: string | null;
  amount: number | null;
  status: string | null;
  payment_method: string | null;
  created_at: string | null;
  expires_at: string | null;
  note: string | null;
};

function getPlanText(plan: string | null) {
  switch (plan) {
    case "monthly":
      return "VIP 月費";
    case "yearly":
      return "VIP 年費";
    case "credits_5":
      return "5 點解鎖";
    case "credits_20":
      return "20 點解鎖";
    case "credits_50":
      return "50 點解鎖";
    default:
      return plan || "未知方案";
  }
}

function getTypeText(type: string | null) {
  switch (type) {
    case "membership":
      return "會員方案";
    case "credits":
      return "點數方案";
    default:
      return type || "其他";
  }
}

function getStatusText(status: string | null) {
  switch (status) {
    case "paid":
      return "已付款";
    case "pending":
      return "處理中";
    case "failed":
      return "失敗";
    default:
      return status || "未知";
  }
}

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

function getStatusClass(status: string | null) {
  switch (status) {
    case "paid":
      return "bg-green-50 text-green-700 border border-green-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "failed":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
}

export default function OrderHistory() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      try {
        setLoading(true);
        setErrorText("");

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        const user = session?.user;
        if (!user) {
          if (!mounted) return;
          setErrorText("請先登入會員");
          setOrders([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select(
            "id, order_no, type, plan, amount, status, payment_method, created_at, expires_at, note"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (!mounted) return;
        setOrders((data || []) as OrderItem[]);
      } catch (error: any) {
        console.error("讀取訂單紀錄失敗：", error);
        if (!mounted) return;
        setErrorText(error?.message || "讀取訂單紀錄失敗");
        setOrders([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return (
    <section className="mt-8 rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2f2a25]">訂單紀錄</h2>
          <p className="mt-1 text-sm text-[#7b6f63]">
            這裡會顯示你購買 VIP 或解鎖點數的歷史紀錄。
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
      ) : orders.length === 0 ? (
        <div className="rounded-2xl bg-[#f8f5f0] px-4 py-8 text-center text-[#7b6f63]">
          目前還沒有訂單紀錄
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-[#eadfce] md:block">
            <div className="grid grid-cols-7 bg-[#faf7f2] text-sm font-semibold text-[#5f5750]">
              <div className="px-4 py-3">訂單編號</div>
              <div className="px-4 py-3">方案類型</div>
              <div className="px-4 py-3">購買方案</div>
              <div className="px-4 py-3">金額</div>
              <div className="px-4 py-3">狀態</div>
              <div className="px-4 py-3">付款方式</div>
              <div className="px-4 py-3">建立時間</div>
            </div>

            {orders.map((order, index) => (
              <div
                key={order.id}
                className={`grid grid-cols-7 text-sm text-[#2f2a25] ${
                  index !== orders.length - 1 ? "border-t border-[#f0e7db]" : ""
                }`}
              >
                <div className="px-4 py-4">{order.order_no || "-"}</div>
                <div className="px-4 py-4">{getTypeText(order.type)}</div>
                <div className="px-4 py-4">{getPlanText(order.plan)}</div>
                <div className="px-4 py-4 font-semibold">
                  NT${order.amount ?? 0}
                </div>
                <div className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="px-4 py-4">{order.payment_method || "-"}</div>
                <div className="px-4 py-4">{formatDate(order.created_at)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 md:hidden">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-[#eadfce] bg-[#fcfaf7] p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-[#8a7d70]">訂單編號</div>
                    <div className="font-semibold text-[#2f2a25]">
                      {order.order_no || "-"}
                    </div>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[#8a7d70]">方案類型</div>
                    <div className="font-medium text-[#2f2a25]">
                      {getTypeText(order.type)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#8a7d70]">購買方案</div>
                    <div className="font-medium text-[#2f2a25]">
                      {getPlanText(order.plan)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#8a7d70]">金額</div>
                    <div className="font-medium text-[#2f2a25]">
                      NT${order.amount ?? 0}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#8a7d70]">付款方式</div>
                    <div className="font-medium text-[#2f2a25]">
                      {order.payment_method || "-"}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-[#8a7d70]">建立時間</div>
                    <div className="font-medium text-[#2f2a25]">
                      {formatDate(order.created_at)}
                    </div>
                  </div>

                  {order.note ? (
                    <div className="col-span-2">
                      <div className="text-[#8a7d70]">備註</div>
                      <div className="font-medium text-[#2f2a25]">
                        {order.note}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}