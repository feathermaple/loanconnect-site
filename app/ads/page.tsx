import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export const dynamic = "force-dynamic";

function formatMoney(value: any) {
  const num = Number(value);
  if (!num || Number.isNaN(num)) return "-";
  return `NT$ ${num.toLocaleString("zh-TW")}`;
}

function formatDate(value: any) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("zh-TW");
}

export default async function AdsPage() {
  // 付費圖文廣告：先不要用 is_active 過濾，避免資料是 null / false 時前台不顯示
  const { data: paidAds, error: paidError } = await supabase
    .from("paid_lender_ads")
    .select("*")
    .order("is_top", { ascending: false })
    .order("created_at", { ascending: false });

  // 免費放款廣告：保留你原本的上架判斷
  const { data: freeAds, error: freeError } = await supabase
    .from("lender_ads")
    .select("*")
    .eq("is_active", true)
    .order("is_vip", { ascending: false })
    .order("created_at", { ascending: false });

  const paidList = paidAds || [];
  const freeList = freeAds || [];

  const isEmpty = paidList.length === 0 && freeList.length === 0;

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2f2a25] md:text-4xl">
              放款廣告
            </h1>
            <p className="mt-2 text-[#6b6258]">
              查看最新放款資訊，快速找到合適的放款方。
            </p>
          </div>

          <Link
            href="/lenders/taipei-keelung"
            className="w-fit rounded-full border border-[#d8c8b6] bg-white px-5 py-3 text-sm font-semibold text-[#3b332c] shadow-sm transition hover:bg-[#f1e8dc]"
          >
            查看各區放款資訊
          </Link>
        </div>

        {(paidError || freeError) && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            部分資料讀取失敗，請稍後再試。
          </div>
        )}

        {isEmpty ? (
          <div className="rounded-3xl border border-[#e8dfd3] bg-white p-10 text-center text-[#6b6258] shadow-sm">
            目前沒有資料
          </div>
        ) : (
          <>
            {paidList.length > 0 && (
              <section className="mb-12">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-[#2f2a25]">
                    精選圖文廣告
                  </h2>
                  <p className="mt-1 text-sm text-[#7a7066]">
                    優先展示的圖文放款資訊。
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {paidList.map((item) => (
                    <article
                      key={item.id}
                      className={`overflow-hidden rounded-[28px] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                        item.is_top
                          ? "border-[#e2b95b] ring-2 ring-[#f4df9a]/60"
                          : "border-[#e8dfd3]"
                      }`}
                    >
                      {item.image_url ? (
                        <div className="relative h-56 w-full overflow-hidden bg-[#eee5d8]">
                          <img
                            src={item.image_url}
                            alt={item.title || "圖文廣告"}
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute left-4 top-4 flex gap-2">
                            <span className="rounded-full bg-[#d6a738] px-3 py-1 text-xs font-bold text-white shadow">
                              圖文廣告
                            </span>

                            {item.is_top && (
                              <span className="rounded-full bg-[#2f2a25] px-3 py-1 text-xs font-bold text-white shadow">
                                置頂
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#fff7e6] to-[#efe0c8]">
                          <span className="rounded-full bg-[#d6a738] px-4 py-2 text-sm font-bold text-white">
                            圖文廣告
                          </span>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="rounded-full bg-[#f4efe7] px-3 py-1 text-xs font-semibold text-[#7a5a2a]">
                            {item.region || "不限地區"}
                          </span>

                          <span className="text-xs text-[#8a8178]">
                            {formatDate(item.created_at)}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-[#2f2a25]">
                          {item.title || item.company_name || "放款廣告"}
                        </h3>

                        {item.company_name && (
                          <p className="mt-2 text-sm font-medium text-[#6b6258]">
                            {item.company_name}
                          </p>
                        )}

                        {item.ad_content && (
                          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#4f463d]">
                            {item.ad_content}
                          </p>
                        )}

                        <div className="mt-5 space-y-2 rounded-2xl bg-[#faf7f1] p-4 text-sm text-[#4f463d]">
                          {item.contact_name && (
                            <p>聯絡人：{item.contact_name}</p>
                          )}

                          {item.loan_types && (
                            <p>可承作類型：{item.loan_types}</p>
                          )}

                          {(item.min_amount || item.max_amount) && (
                            <p>
                              金額範圍：{formatMoney(item.min_amount)} ～{" "}
                              {formatMoney(item.max_amount)}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-[#2f2a25]">
                  最新放款廣告
                </h2>
                <p className="mt-1 text-sm text-[#7a7066]">
                  免費刊登的放款資訊。
                </p>
              </div>

              {freeList.length === 0 ? (
                <div className="rounded-3xl border border-[#e8dfd3] bg-white p-8 text-center text-[#6b6258] shadow-sm">
                  目前沒有免費放款廣告
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {freeList.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-[#f4efe7] px-3 py-1 text-xs font-semibold text-[#7a5a2a]">
                          {item.region || "不限地區"}
                        </span>

                        <span className="text-xs text-[#8a8178]">
                          {formatDate(item.created_at)}
                        </span>
                      </div>

                      <h2 className="mb-2 text-xl font-bold text-[#2f2a25]">
                        {item.company_name || item.title || "放款廣告"}
                      </h2>

                      <p className="mb-2 text-sm text-[#4f463d]">
                        聯絡人：{item.contact_name || "-"}
                      </p>

                      <p className="text-sm text-[#4f463d]">
                        可承作類型：{item.loan_types || "-"}
                      </p>

                      {(item.min_amount || item.max_amount) && (
                        <p className="mt-2 text-sm text-[#4f463d]">
                          金額範圍：{formatMoney(item.min_amount)} ～{" "}
                          {formatMoney(item.max_amount)}
                        </p>
                      )}

                      {item.ad_content && (
                        <div className="mt-4 whitespace-pre-line rounded-2xl bg-[#faf7f1] p-4 text-sm leading-7 text-[#4f463d]">
                          {item.ad_content}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}