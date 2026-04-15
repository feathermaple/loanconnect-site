import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const regionMap: Record<string, string> = {
  "taipei-keelung": "台北基隆",
  "taoyuan-hsinchu-miaoli": "桃竹苗",
  "taichung-changhua-nantou": "中彰投",
  "yunlin-chiayi-tainan": "雲嘉南",
  "kaohsiung-pingtung": "高屏",
  "yilan-hualien-taitung": "宜花東",
  "penghu-kinmen-matsu": "澎金馬",
};

export const dynamic = "force-dynamic";

export default async function RegionLendersPage({
  params,
}: {
  params: { region: string };
}) {
  const regionName = regionMap[params.region];

  if (!regionName) {
    return (
      <main className="min-h-screen bg-[#f8f5ef] px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-white px-6 py-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">找不到此地區</h1>
          <Link
            href="/lenders"
            className="mt-4 inline-flex rounded-full bg-[#3e3a34] px-5 py-3 text-white"
          >
            回各區金主
          </Link>
        </div>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("lender_ads")
    .select("*")
    .eq("is_active", true)
    .eq("region", regionName)
    .order("is_vip", { ascending: false })
    .order("created_at", { ascending: false });

  const ads = data || [];

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2f2a25] md:text-4xl">
              {regionName} 金主
            </h1>
            <p className="mt-2 text-[#6b6258]">
              查看 {regionName} 地區的放款資訊與聯絡方式。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/lenders"
              className="inline-flex items-center justify-center rounded-full border border-[#d8cfc3] bg-white px-5 py-3 text-sm font-bold text-[#3e3a34]"
            >
              回各區金主
            </Link>
            <Link
              href="/post-lender"
              className="inline-flex items-center justify-center rounded-full bg-[#3e3a34] px-5 py-3 text-sm font-bold text-white"
            >
              免費刊登放款資訊
            </Link>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            讀取資料失敗：{error.message}
          </div>
        ) : ads.length === 0 ? (
          <div className="rounded-3xl border border-[#e8dfd3] bg-white px-6 py-12 text-center text-[#6b6258]">
            目前 {regionName} 還沒有放款廣告，歡迎搶先刊登。
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ads.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-[#e8dfd3] bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#f3ece3] px-3 py-1 text-xs font-bold text-[#5a4b3d]">
                      {item.region}
                    </span>
                    {item.is_vip ? (
                      <span className="rounded-full bg-[#ffe7a3] px-3 py-1 text-xs font-bold text-[#6b4d00]">
                        VIP
                      </span>
                    ) : null}
                  </div>

                  <span className="text-xs text-[#8a8178]">
                    {new Date(item.created_at).toLocaleDateString("zh-TW")}
                  </span>
                </div>

                <h2 className="mb-2 text-xl font-bold text-[#2f2a25]">
                  {item.company_name}
                </h2>

                <p className="mb-4 text-sm text-[#7b7268]">
                  聯絡人：{item.contact_name}
                </p>

                <div className="space-y-2 text-sm text-[#5f5750]">
                  <p>
                    <span className="font-semibold">可承作類型：</span>
                    {item.loan_types}
                  </p>

                  {(item.min_amount || item.max_amount) && (
                    <p>
                      <span className="font-semibold">承作金額：</span>
                      {item.min_amount
                        ? `NT$ ${Number(item.min_amount).toLocaleString()}`
                        : "不限"}
                      {" ~ "}
                      {item.max_amount
                        ? `NT$ ${Number(item.max_amount).toLocaleString()}`
                        : "不限"}
                    </p>
                  )}

                  <p>
                    <span className="font-semibold">聯絡電話：</span>
                    {item.phone}
                  </p>

                  {item.line_id ? (
                    <p>
                      <span className="font-semibold">LINE ID：</span>
                      {item.line_id}
                    </p>
                  ) : null}
                </div>

                {item.ad_content ? (
                  <div className="mt-4 rounded-2xl bg-[#f8f5ef] px-4 py-3 text-sm leading-6 text-[#5f5750]">
                    {item.ad_content}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}