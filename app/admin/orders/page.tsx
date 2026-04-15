import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  order_no: string;
  user_id: string | null;
  order_type: string;
  plan_code: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  paid_at: string | null;
  membership_expires_at: string | null;
  unlock_credits: number;
  note: string | null;
  created_at: string;
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/orders");
  }

  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/member");
  }

  const { data: orders, error } = await adminSupabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#2f2a25]">訂單紀錄</h1>
            <p className="mt-2 text-sm text-[#6b6258]">
              查看會員付款、方案類型、付款狀態與到期時間。
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-full border border-[#d8cbbd] bg-white px-5 py-2 text-sm font-bold text-[#3e3a34] transition hover:bg-[#f7f3ed]"
          >
            返回後台
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            讀取訂單失敗：{error.message}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="rounded-3xl border border-[#e8dfd3] bg-white px-6 py-12 text-center text-[#6b6258]">
            目前還沒有任何訂單紀錄。
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-[#e8dfd3] bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f3ece3] text-left text-[#4f463d]">
                <tr>
                  <th className="px-4 py-4 font-bold">訂單編號</th>
                  <th className="px-4 py-4 font-bold">類型</th>
                  <th className="px-4 py-4 font-bold">方案</th>
                  <th className="px-4 py-4 font-bold">金額</th>
                  <th className="px-4 py-4 font-bold">狀態</th>
                  <th className="px-4 py-4 font-bold">付款方式</th>
                  <th className="px-4 py-4 font-bold">付款時間</th>
                  <th className="px-4 py-4 font-bold">會員到期</th>
                  <th className="px-4 py-4 font-bold">備註</th>
                </tr>
              </thead>
              <tbody>
                {(orders as OrderRow[]).map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#eee4d8] text-[#2f2a25]"
                  >
                    <td className="px-4 py-4 font-medium">{order.order_no}</td>
                    <td className="px-4 py-4">{order.order_type}</td>
                    <td className="px-4 py-4">{order.plan_code || "-"}</td>
                    <td className="px-4 py-4">
                      {order.currency} {order.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          order.status === "paid"
                            ? "border border-emerald-200 bg-emerald-100 text-emerald-700"
                            : order.status === "pending"
                              ? "border border-amber-200 bg-amber-100 text-amber-700"
                              : "border border-gray-200 bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{order.payment_method || "-"}</td>
                    <td className="px-4 py-4">
                      {order.paid_at
                        ? new Date(order.paid_at).toLocaleString("zh-TW")
                        : "-"}
                    </td>
                    <td className="px-4 py-4">
                      {order.membership_expires_at
                        ? new Date(order.membership_expires_at).toLocaleString(
                            "zh-TW"
                          )
                        : "-"}
                    </td>
                    <td className="px-4 py-4">{order.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}