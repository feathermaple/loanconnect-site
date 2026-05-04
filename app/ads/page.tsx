import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export const dynamic = "force-dynamic";

export default async function AdsPage() {
  // 🔥 付費圖文廣告
  const { data: paidAds } = await supabase
    .from("paid_lender_ads")
    .select("*")
    .eq("is_active", true)
    .order("is_top", { ascending: false })
    .order("created_at", { ascending: false });

  // 🔥 免費文字廣告（你原本的）
  const { data: freeAds, error } = await supabase
    .from("lender_ads")
    .select("*")
    .eq("is_active", true)
    .order("is_vip", { ascending: false })
    .order("created_at", { ascending: false });

  const ads = freeAds || [];

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* 標題 */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2f2a25] md:text-4xl">
              放款廣告
            </h1>
            <p className="mt-2 text-[#6b6258]">
              查看最新放款資訊，快速找到合適的放款方。
            </p>
          </div>

        </div>

        {/* 🔥 付費圖文廣告 */}
        {paidAds && paidAds.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-[#2f2a25]">
              🔥 精選推薦
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {paidAds.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-3xl border bg-white shadow-md"
                >
                  {/* 圖片 */}
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="mb-2 text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mb-2 text-sm text-gray-600">
                      {item.company_name}
                    </p>

                    <p className="mb-3 text-sm text-gray-700">
                      {item.ad_content}
                    </p>

                    <div className="text-sm text-gray-600 space-y-1">
                      {item.phone && <p>📞 {item.phone}</p>}
                      {item.line_id && <p>LINE：{item.line_id}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔽 免費文字廣告（你原本） */}
        {error ? (
          <div className="text-red-500">讀取資料失敗</div>
        ) : ads.length === 0 ? (
          <div className="text-center">目前沒有資料</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ads.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs">{item.region}</span>
                  <span className="text-xs">
                    {new Date(item.created_at).toLocaleDateString("zh-TW")}
                  </span>
                </div>

                <h2 className="mb-2 text-xl font-bold">
                  {item.company_name}
                </h2>

                <p className="mb-2 text-sm">
                  聯絡人：{item.contact_name}
                </p>

                <p className="text-sm">
                  {item.loan_types}
                </p>

                {item.ad_content && (
                  <div className="mt-3 text-sm">
                    {item.ad_content}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}