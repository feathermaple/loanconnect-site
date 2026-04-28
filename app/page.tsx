import type { Metadata } from "next";
import Link from "next/link";
import { loanCities } from "@/lib/loanCities";
import SectionTitle from "@/components/SectionTitle";
import { faq } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "秒貸通｜借款需求與放款廣告媒合平台",
  description:
    "提供借款需求刊登、放款資訊刊登、借款需求公開列表、放款廣告列表與借錢知識內容，協助借款方與放款方快速媒合。",
  keywords: [
    "借款需求",
    "放款廣告",
    "借貸媒合",
    "小額借款",
    "汽車借款",
    "機車借款",
    "資金週轉",
    "貸款平台",
    "秒貸通",
  ],
  alternates: {
    canonical: "https://miaodaitong.com/",
  },
  openGraph: {
    title: "秒貸通｜借款需求與放款廣告媒合平台",
    description:
      "借款方可免費刊登需求，放款方可免費刊登資訊，快速建立雙邊媒合平台。",
    url: "https://miaodaitong.com",
    siteName: "秒貸通",
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "秒貸通｜借貸媒合平台",
    description: "借款需求刊登、放款廣告刊登、借錢知識與平台媒合服務。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const regionLinks = [
  { label: "台北基隆", href: "/lenders/taipei-keelung" },
  { label: "桃竹苗", href: "/lenders/taoyuan-hsinchu-miaoli" },
  { label: "中彰投", href: "/lenders/taichung-changhua-nantou" },
  { label: "雲嘉南", href: "/lenders/yunlin-chiayi-tainan" },
  { label: "高屏", href: "/lenders/kaohsiung-pingtung" },
  { label: "宜花東", href: "/lenders/yilan-hualien-taitung" },
  { label: "澎金馬", href: "/lenders/penghu-kinmen-matsu" },
];

function maskNickname(nickname: string) {
  if (!nickname) return "未提供";

  const name = nickname.trim();

  if (
    name.endsWith("先生") ||
    name.endsWith("小姐") ||
    name.endsWith("同學")
  ) {
    return name;
  }

  return `${name.charAt(0)}ＯＯ`;
}

export default async function HomePage() {
  const adminSupabase = createAdminClient();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: siteStats }, { data: latestNeeds }, { data: latestAds }] =
    await Promise.all([
      adminSupabase.from("site_stats").select("*").limit(1).single(),
      adminSupabase
        .from("loan_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6),
      adminSupabase
        .from("lender_ads")
        .select("*")
        .eq("is_active", true)
        .order("is_vip", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  let role: string | null = null;
  let isPaidMember = false;
  let unlockedNeedIds = new Set<string>();
  let unlockedCount = 0;

  if (user) {
    const [{ data: profile }, { data: membership }, { data: unlockLogs }] =
      await Promise.all([
        adminSupabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle(),
        adminSupabase
          .from("lender_memberships")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        adminSupabase
          .from("need_unlock_logs")
          .select("need_id")
          .eq("user_id", user.id),
      ]);

    role = profile?.role || null;

    const paidPlanNames = [
      "VIP 月費金主會員",
      "VIP 年費金主會員",
      "VIP 金主會員",
      "年費金主會員",
    ];

    if (membership && paidPlanNames.includes(membership.plan_name)) {
      isPaidMember = true;
    }

    unlockedNeedIds = new Set((unlockLogs || []).map((item) => item.need_id));
    unlockedCount = unlockedNeedIds.size;
  }

  function canViewNeedInHome(needId: string) {
    if (!user) return false;
    if (role !== "lender" && role !== "admin") return false;
    if (isPaidMember) return true;
    if (unlockedNeedIds.has(needId)) return true;
    return false;
  }

  function getNeedBadge(needId: string) {
    if (!user) {
      return {
        text: "請先登入",
        className: "bg-gray-100 text-gray-600 border border-gray-200",
      };
    }

    if (role !== "lender" && role !== "admin") {
      return {
        text: "非金主帳號",
        className: "bg-gray-100 text-gray-600 border border-gray-200",
      };
    }

    if (isPaidMember) {
      return {
        text: "VIP 可看",
        className: "bg-amber-100 text-amber-700 border border-amber-200",
      };
    }

    if (unlockedNeedIds.has(needId)) {
      return {
        text: "已解鎖",
        className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      };
    }

    if (unlockedCount < 2) {
      return {
        text: `可免費解鎖 ${2 - unlockedCount} 筆`,
        className: "bg-blue-100 text-blue-700 border border-blue-200",
      };
    }

    return {
      text: "需升級會員",
      className: "bg-rose-100 text-rose-700 border border-rose-200",
    };
  }

  const stats = siteStats;
  const needs = latestNeeds || [];
  const ads = latestAds || [];
  const mobileFaq = faq.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#f7f4ef]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,194,168,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(230,223,213,0.45),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-4 inline-flex rounded-full border border-[#e6dfd5] bg-white/90 px-3 py-1 text-xs font-semibold text-[#7a7269] shadow-sm">
              借款需求 × 放款資訊 雙邊媒合平台
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#2f2a25] md:text-6xl">
              借款方快速刊登需求
              <span className="mt-2 block text-[#6b5642]">
                放款方直接曝光資訊
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#6f675f] md:mt-6 md:text-lg">
              平台提供借款需求刊登、放款廣告刊登、公開需求列表、放款資訊列表與借錢知識內容，
              協助借款方與放款方更快速建立聯繫與媒合。
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10">
              <Link
                href="/apply-loan"
                className="rounded-[28px] bg-[#8f2f23] px-6 py-5 text-center text-white shadow-lg transition hover:opacity-95"
              >
                <div className="text-lg font-black">我要借錢</div>
                <div className="mt-1 text-sm text-white/90">
                  免費刊登借款需求，讓放款方更快看到你
                </div>
              </Link>

              <Link
                href="/post-lender"
                className="rounded-[28px] bg-[#224f8f] px-6 py-5 text-center text-white shadow-lg transition hover:opacity-95"
              >
                <div className="text-lg font-black">我要放款</div>
                <div className="mt-1 text-sm text-white/90">
                  免費刊登放款資訊，快速曝光你的承作內容
                </div>
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/needs"
                className="rounded-full border border-[#d8c2a8] bg-[#fffaf4] px-5 py-3 text-sm font-semibold text-[#6b5642] transition hover:bg-[#f8efe4]"
              >
                查看借款需求
              </Link>

              <Link
                href="/ads"
                className="rounded-full border border-[#d8c2a8] bg-[#fffaf4] px-5 py-3 text-sm font-semibold text-[#6b5642] transition hover:bg-[#f8efe4]"
              >
                查看放款廣告
              </Link>

              <Link
                href="/articles"
                className="rounded-full border border-[#d8c2a8] bg-[#fffaf4] px-5 py-3 text-sm font-semibold text-[#6b5642] transition hover:bg-[#f8efe4]"
              >
                借錢知識
              </Link>
            </div>

            <div className="mt-10 grid gap-3 text-center text-xs text-[#7a7269] sm:grid-cols-2 md:grid-cols-4 md:gap-6 md:text-sm">
              <div className="rounded-2xl border border-[#ece4da] bg-white/80 px-3 py-4 shadow-sm">
                <div className="text-2xl font-bold text-[#2f2a25] md:text-3xl">
                  {stats?.applied_count ?? 3000}+
                </div>
                <div className="mt-1">借款需求數</div>
              </div>

              <div className="rounded-2xl border border-[#ece4da] bg-white/80 px-3 py-4 shadow-sm">
                <div className="text-2xl font-bold text-[#2f2a25] md:text-3xl">
                  {stats?.member_count ?? 555}
                </div>
                <div className="mt-1">會員人數</div>
              </div>

              <div className="rounded-2xl border border-[#ece4da] bg-white/80 px-3 py-4 shadow-sm">
                <div className="text-2xl font-bold text-[#2f2a25] md:text-3xl">
                  {stats?.closed_count ?? 188}
                </div>
                <div className="mt-1">成功媒合</div>
              </div>

              <div className="rounded-2xl border border-[#ece4da] bg-white/80 px-3 py-4 shadow-sm">
                <div className="text-2xl font-bold text-[#2f2a25] md:text-3xl">
                  {ads.length}
                </div>
                <div className="mt-1">最新放款廣告</div>
              </div>
            </div>

            <p className="mx-auto mt-5 max-w-3xl text-[11px] leading-6 text-[#8a8178] md:text-xs">
              提醒：本站提供資訊刊登與媒合服務，實際借貸條件、額度、利率、費用與核准結果，
              仍需由借款方與放款方雙方自行確認。
            </p>
          </div>
        </div>
      </section>

      {/* 全台借錢入口 */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
        <div className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#9b6b32]">
                全台服務地區
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#2b2118] md:text-3xl">
                全台借錢媒合入口
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6f675f]">
                依照縣市快速找到借款媒合入口，包含台北、新北、桃園、新竹、台中、台南、高雄等地區。
              </p>
            </div>

            <Link
              href="/loan"
              className="hidden rounded-full border border-[#d8c7b2] px-5 py-3 text-sm font-bold text-[#5a4030] transition hover:bg-[#f8f1e8] md:inline-flex"
            >
              查看全部地區
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {loanCities.slice(0, 10).map((city) => (
              <Link
                key={city.slug}
                href={`/loan/${city.slug}`}
                className="rounded-2xl bg-[#fbf7f1] px-4 py-3 text-center font-bold text-[#5a4030] transition hover:bg-[#f1e4d4]"
              >
                {city.name}借錢
              </Link>
            ))}
          </div>

          <Link
            href="/loan"
            className="mt-5 flex justify-center rounded-full bg-[#8b5a2b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6f4520] md:hidden"
          >
            查看全部地區
          </Link>
        </div>
      </section>


      {/* PLATFORM FEATURES */}
      <section className="border-t border-line/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
          <SectionTitle
            badge="平台特色"
            title="借款方與放款方都能快速上手"
            desc="首頁直接分流，降低理解成本，讓借款需求與放款資訊更快被看見。"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "免費刊登借款需求",
                desc: "借款方可快速刊登需求，讓更多放款方主動看到。",
                href: "/apply-loan",
              },
              {
                title: "免費刊登放款資訊",
                desc: "放款方可刊登承作類型、金額區間與聯絡方式。",
                href: "/post-lender",
              },
              {
                title: "公開需求列表",
                desc: "需求公開展示，方便放款方快速瀏覽與聯繫。",
                href: "/needs",
              },
              {
                title: "放款廣告曝光",
                desc: "放款資訊可公開展示，持續獲得借款方注意。",
                href: "/ads",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-[28px] border border-line bg-paper p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-lg font-bold text-ink transition group-hover:text-[#3e3a34]">
                  {item.title}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{item.desc}</p>
                <div className="mt-5 text-sm font-semibold text-[#5c534c]">
                  前往查看 →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEEDS */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTitle
              badge="最新借款需求"
              title="最新刊登的借款需求"
              desc="放款方可快速查看需求內容與聯絡方式。"
            />
            {user && role === "lender" && !isPaidMember ? (
              <p className="mt-2 text-sm text-[#8a5a00]">
                你目前已免費解鎖 {unlockedCount} / 2 筆完整需求。
              </p>
            ) : null}
          </div>

          <Link
            href="/needs"
            className="inline-flex items-center justify-center rounded-full bg-[#3e3a34] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
          >
            查看全部需求
          </Link>
        </div>

        {needs.length === 0 ? (
          <div className="rounded-[28px] border border-line bg-paper px-6 py-12 text-center text-muted">
            目前還沒有借款需求，歡迎搶先刊登。
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {needs.map((item) => {
              const canView = canViewNeedInHome(item.id);
              const badge = getNeedBadge(item.id);

              return (
                <article
                  key={item.id}
                  className="rounded-[28px] border border-line bg-paper p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#f3ece3] px-3 py-1 text-xs font-bold text-[#5a4b3d]">
                      {item.region}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${badge.className}`}
                      >
                        {badge.text}
                      </span>

                      <span className="text-xs text-[#8a8178]">
                        {new Date(item.created_at).toLocaleDateString("zh-TW")}
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-[#2f2a25]">
                    {item.purpose || "借款需求"}
                  </h3>

                  <div className="space-y-2 text-sm text-[#5f5750]">
                    <p>
                      <span className="font-semibold">稱呼：</span>
                      {canView ? item.nickname || "未提供" : maskNickname(item.nickname)}
                    </p>

                    <p>
                      <span className="font-semibold">借款金額：</span>
                      NT$ {Number(item.amount || 0).toLocaleString()}
                    </p>

                    {canView ? (
                      <>
                        <p>
                          <span className="font-semibold">電話：</span>
                          {item.phone || "未提供"}
                        </p>

                        <p>
                          <span className="font-semibold">LINE ID：</span>
                          {item.line_id || "未提供"}
                        </p>
                      </>
                    ) : (
                      <p>
                        <span className="font-semibold">聯絡方式：</span>
                        <span className="text-[#b36b00]">
                          {user
                            ? role === "lender" || role === "admin"
                              ? unlockedCount < 2
                                ? "進入詳情頁可免費解鎖查看"
                                : "免費額度已用完，請升級會員"
                              : "金主會員可查看"
                            : "登入後可依會員資格查看"}
                        </span>
                      </p>
                    )}
                  </div>

                  {item.description ? (
                    <div className="mt-4 rounded-2xl bg-[#f8f5ef] px-4 py-3 text-sm leading-6 text-[#5f5750]">
                      {item.description}
                    </div>
                  ) : null}

                  {!canView && (
                    <div className="mt-4 rounded-2xl border border-[#eadfce] bg-[#fffaf4] px-4 py-3 text-sm text-[#6b6258]">
                      {user
                        ? role === "lender" || role === "admin"
                          ? unlockedCount < 2
                            ? `你目前還可免費解鎖 ${2 - unlockedCount} 筆完整需求。`
                            : "你的免費解鎖額度已用完，升級 VIP / 年費會員可無限查看。"
                          : "目前你的帳號不是金主會員身份，無法查看完整聯絡方式。"
                        : "登入後可依會員身份查看完整聯絡方式。"}
                    </div>
                  )}

                  <Link
                    href={`/needs/${item.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#3e3a34] px-5 py-3 text-sm font-bold text-white transition hover:opacity-95"
                  >
                    {canView
                      ? "查看詳情"
                      : user
                        ? role === "lender" || role === "admin"
                          ? unlockedCount < 2
                            ? "前往解鎖查看"
                            : "升級會員查看更多"
                          : "查看詳情"
                        : "登入後查看"}
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* LATEST ADS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              badge="最新放款廣告"
              title="最新刊登的放款資訊"
              desc="借款方可快速比較不同放款方的承作類型與聯絡方式。"
            />

            <Link
              href="/ads"
              className="inline-flex items-center justify-center rounded-full bg-[#3e3a34] px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
            >
              查看全部廣告
            </Link>
          </div>

          {ads.length === 0 ? (
            <div className="rounded-[28px] border border-line bg-paper px-6 py-12 text-center text-muted">
              目前還沒有放款廣告，歡迎搶先刊登。
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {ads.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[28px] border border-line bg-paper p-6 shadow-sm"
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

                  <h3 className="mb-2 text-xl font-bold text-[#2f2a25]">
                    {item.company_name}
                  </h3>

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
      </section>

      {/* REGIONS */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <SectionTitle
          badge="各區放款資訊"
          title="依地區快速查看放款資訊"
          desc="先從你所在區域開始查看，更快找到合適的放款方。"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regionLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-[24px] border border-line bg-paper px-5 py-5 text-base font-bold text-ink shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {/* KNOWLEDGE */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
          <SectionTitle
            badge="借錢知識"
            title="先看懂，再決定要不要刊登或聯繫"
            desc="整理借款流程、媒合觀念、借貸注意事項與常見問題。"
          />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Link
              href="/articles"
              className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[#f8f5ef] hover:shadow-md"
            >
              <h3 className="mb-2 text-xl font-bold text-[#2f2a25]">
                借錢知識文章
              </h3>
              <p className="text-sm leading-7 text-[#6f675f]">
                閱讀借款流程、借貸觀念、刊登注意事項與常見風險整理。
              </p>
            </Link>

            <Link
              href="/needs"
              className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[#f8f5ef] hover:shadow-md"
            >
              <h3 className="mb-2 text-xl font-bold text-[#2f2a25]">
                查看借款需求
              </h3>
              <p className="text-sm leading-7 text-[#6f675f]">
                瀏覽目前公開需求，了解市場上常見的借款用途與金額範圍。
              </p>
            </Link>

            <Link
              href="/ads"
              className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[#f8f5ef] hover:shadow-md"
            >
              <h3 className="mb-2 text-xl font-bold text-[#2f2a25]">
                查看放款廣告
              </h3>
              <p className="text-sm leading-7 text-[#6f675f]">
                比較不同放款方資訊、承作範圍與聯繫方式，建立媒合入口。
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <SectionTitle
          badge="FAQ"
          title="常見平台問題"
          desc="以下整理一些常見問題，幫助你更了解刊登與媒合流程。"
          center
        />

        {/* Mobile */}
        <div className="mt-8 space-y-3 md:hidden">
          {mobileFaq.map((item) => (
            <details
              key={item.q}
              className="group rounded-[22px] border border-line bg-paper shadow-sm transition"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink outline-none [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span className="shrink-0 text-lg text-[#8b8178] transition-transform duration-200 group-open:rotate-45">
                  ＋
                </span>
              </summary>

              <div className="border-t border-line/70 px-5 py-4 text-sm leading-6 text-muted">
                {item.a}
              </div>
            </details>
          ))}

          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-[#e6dfd5] bg-white px-5 py-3 text-sm font-semibold text-[#5f5750] transition hover:bg-[#f5f1eb]"
            >
              還有問題？聯繫我們
            </Link>
          </div>
        </div>

        {/* Desktop */}
        <div className="mt-10 hidden space-y-4 md:block">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-[28px] border border-line bg-paper shadow-sm transition"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-ink outline-none [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span className="shrink-0 text-xl text-[#8b8178] transition-transform duration-200 group-open:rotate-45">
                  ＋
                </span>
              </summary>

              <div className="border-t border-line/70 px-6 py-5 text-sm leading-7 text-muted">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}