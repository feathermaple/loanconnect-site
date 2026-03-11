import type { Metadata } from "next";
import Link from "next/link";
import QuickApplyCard from "@/components/QuickApplyCard";
import SectionTitle from "@/components/SectionTitle";
import { channels, faq } from "@/lib/data";
import { articles } from "@/lib/articles";
import ProcessSection from "@/components/home/process-section";
import CtaSection from "@/components/home/cta-section";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "｜貸款評估、信用貸款、整合負債媒合平台",
  description:
    "本平台 提供信用貸款、整合負債與資金週轉需求評估服務，快速填表、專人聯繫，協助你找到適合的貸款方案。",
  keywords: [
    "貸款",
    "信用貸款",
    "整合負債",
    "小額貸款",
    "借款評估",
    "貸款平台",
    "貸款媒合",
    "LoanConnect",
  ],
  alternates: {
    canonical: "https://loanconnect-site.vercel.app",
  },
  openGraph: {
    title: "｜貸款評估、信用貸款、整合負債媒合平台",
    description:
      "快速填表、專人聯繫，協助你找到適合的信用貸款與資金方案。",
    url: "https://loanconnect-site.vercel.app",
    siteName: "LoanConnect",
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "｜貸款評估平台",
    description: "信用貸款、整合負債與資金週轉需求評估平台。",
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

export default async function HomePage() {
  const supabase = createAdminClient();

  const { data: stats } = await supabase
    .from("site_stats")
    .select("*")
    .limit(1)
    .single();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#fbf8f3]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-xs font-semibold text-[#7a7269]">
              貸款媒合平台
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#2f2a25] md:text-5xl">
              快速評估貸款需求
              <span className="block">找到適合你的資金方案</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#6f675f] md:text-lg">
              本平台提供信用貸款、整合負債與資金週轉需求媒合服務，
              只需填寫簡單資料，即可快速評估貸款方案，
              專人協助聯繫，讓資金需求更安心、更透明。
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/borrow"
                className="rounded-full bg-[#3e3a34] px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
              >
                立即免費評估
              </Link>

              <Link
                href="/credit-loan"
                className="rounded-full border border-[#d8c2a8] bg-[#fffaf4] px-7 py-3 text-sm font-semibold text-[#6b5642] transition hover:bg-[#f8efe4]"
              >
                信用貸款專區
              </Link>

              <Link
                href="/loan-info"
                className="rounded-full border border-[#e6dfd5] bg-white px-7 py-3 text-sm font-semibold text-[#5f5750] transition hover:bg-[#f5f1eb]"
              >
                了解貸款條件
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 text-sm text-[#7a7269]">
              <div>
                <div className="text-xl font-bold text-[#2f2a25]">
                  {stats?.applied_count ?? 1000}+
                </div>
                <div>需求評估案例</div>
              </div>

              <div>
                <div className="text-xl font-bold text-[#2f2a25]">
                  {stats?.member_count ?? 356}
                </div>
                <div>會員人數</div>
              </div>

              <div>
                <div className="text-xl font-bold text-[#2f2a25]">
                  {stats?.closed_count ?? 98}
                </div>
                <div>成功媒合</div>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-xs leading-6 text-[#8a8178]">
              提醒：本站提供需求評估與資訊媒合服務，實際申辦條件、額度、利率與核准結果，
              仍需依個人條件與合作單位最終審核為準。
            </p>
          </div>

          <QuickApplyCard />
        </div>
      </section>

      {/* LOAN ENTRY */}
      <section className="border-t border-line/70 bg-[#fcfaf7]">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <SectionTitle
            badge="貸款入口"
            title="依需求快速找到適合的貸款方向"
            desc="把首頁流量導向主要貸款分類，讓使用者更快找到對應資訊，也有助於頁面權重傳遞。"
            center
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "信用貸款",
                desc: "適合有穩定收入、想比較貸款方案與額度條件的人。",
                href: "/credit-loan",
              },
              {
                title: "整合負債",
                desc: "整合多筆債務、降低月付壓力，改善整體資金配置。",
                href: "/loan-info",
              },
              {
                title: "資金週轉",
                desc: "有短期週轉需求時，先了解可行方案與申辦方向。",
                href: "/borrow",
              },
              {
                title: "貸款知識",
                desc: "先看懂貸款條件、流程與注意事項，再決定下一步。",
                href: "/articles",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-[28px] border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-lg font-bold text-ink transition group-hover:text-[#3e3a34]">
                  {item.title}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{item.desc}</p>
                <div className="mt-5 text-sm font-semibold text-[#5c534c]">
                  立即查看 →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR NEEDS */}
      <section className="border-t border-line/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <SectionTitle
            badge="熱門需求"
            title="你現在比較像哪一種資金需求？"
            desc="先從你的情況出發，快速找到適合的了解方向與申請入口。"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "信用貸款評估",
                desc: "適合有穩定收入、想快速比較貸款方案的人。",
                href: "/credit-loan",
              },
              {
                title: "整合負債規劃",
                desc: "將多筆債務整合，降低月付壓力，改善資金配置。",
                href: "/loan-info",
              },
              {
                title: "短期資金週轉",
                desc: "臨時需要週轉金時，先評估可行方案與申辦方向。",
                href: "/borrow",
              },
              {
                title: "借款流程諮詢",
                desc: "不確定自己適合哪一種方案，可先由專人協助判斷。",
                href: "/borrow",
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
                  了解更多 →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <ProcessSection />

      {/* FEATURES */}
      <section className="border-y border-line/80 bg-paper/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 pt-8 md:px-6">
          {[
            "快速需求評估",
            "一對一協助說明",
            "資料保密處理",
            "條件透明了解",
          ].map((item) => (
            <div
              key={item}
              className="rounded-full border border-line bg-paper px-4 py-2 text-xs font-semibold text-muted shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <SectionTitle
            badge="平台優勢"
            title="不只填表，更幫你釐清適合的借款方向"
            desc="從需求了解、條件說明到後續媒合，讓借款流程更清楚，也更安心。"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "01 先了解再申請",
                "先釐清資金用途、額度需求與條件方向，避免盲目申請造成額外負擔。",
              ],
              [
                "02 專人協助說明",
                "有疑問可先了解流程與評估方式，再決定是否進一步申請。",
              ],
              [
                "03 依條件媒合評估",
                "依個人情況與需求內容，協助判斷較適合的方案方向。",
              ],
              [
                "04 流程透明安心",
                "申請前先了解條件、聯繫流程與注意事項，降低資訊不對稱。",
              ],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="min-h-[190px] rounded-[28px] border border-line bg-gradient-to-b from-paper to-soft p-6 shadow-sm"
              >
                <div className="text-lg font-bold text-ink">{title}</div>
                <p className="mt-3 text-sm leading-7 text-muted">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <Link href="/borrow" className="font-semibold text-[#5c534c]">
              立即免費評估 →
            </Link>

            <Link href="/credit-loan" className="font-semibold text-[#5c534c]">
              前往信用貸款專區 →
            </Link>

            <Link href="/loan-info" className="font-semibold text-[#5c534c]">
              先了解貸款條件 →
            </Link>
          </div>
        </div>
      </section>

      {/* TARGET USERS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-8 rounded-[32px] border border-line bg-paper p-6 shadow-sm md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex rounded-full border border-[#e8dfd4] bg-white px-3 py-1 text-xs font-semibold text-[#7a7269]">
              適合對象
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-ink">
              不確定自己適不適合？
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted md:text-base">
              如果你正在比較貸款方式、想先了解條件、或擔心申請流程太複雜，
              都可以先從免費評估開始。先了解，再決定，會比直接申請更安心。
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/borrow"
                className="inline-flex rounded-full bg-[#3e3a34] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                先做免費評估
              </Link>

              <Link
                href="/credit-loan"
                className="inline-flex rounded-full border border-[#d8c2a8] bg-[#fffaf4] px-6 py-3 text-sm font-semibold text-[#6b5642] transition hover:bg-[#f8efe4]"
              >
                看信用貸款方案
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "上班族有資金需求",
              "想整合多筆債務者",
              "需要短期週轉者",
              "第一次申請貸款者",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-[#efe7de] bg-[#f9f6f1] p-5"
              >
                <div className="text-base font-bold text-ink">{item}</div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  可先由專人協助了解條件與方向，再判斷下一步是否申請。
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-[32px] border border-line bg-paper p-6 shadow-sm md:p-8">
          <SectionTitle
            badge="聯繫方式"
            title="多種聯繫管道，依你的習慣選擇"
            desc="可透過網站表單留下需求、由專人協助說明，或透過客服管道進一步了解流程。"
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {channels.map(([title, desc]) => (
              <div
                key={title}
                className="rounded-[24px] border border-[#efe7de] bg-[#f9f6f1] p-5"
              >
                <div className="text-base font-bold text-ink">{title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/borrow" className="font-semibold text-[#5c534c]">
              立即免費評估 →
            </Link>
            <Link href="/contact" className="font-semibold text-[#5c534c]">
              聯繫客服 →
            </Link>
          </div>
        </div>
      </section>

      {/* KNOWLEDGE */}
      <section className="border-y border-line/70 bg-[#fcfaf7]">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <SectionTitle
            badge="知識專區"
            title="先看懂借款重點，再做選擇"
            desc="整理常見貸款觀念、申請流程與注意事項，幫助你做出更穩的資金決策。"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="rounded-[28px] border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="text-sm font-semibold text-[#8a8178]">
                  {article.category}
                </div>

                <div className="mt-2 text-lg font-bold text-ink">
                  {article.title}
                </div>

                <p className="mt-3 text-sm leading-6 text-muted">
                  {article.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-[#5c534c]">
                  前往閱讀 →
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/articles"
              className="inline-flex rounded-full border border-[#e6dfd5] bg-white px-6 py-3 text-sm font-semibold text-[#5f5750] transition hover:bg-[#f5f1eb]"
            >
              查看所有文章
            </Link>
          </div>
        </div>
      </section>

      {/* HOME SEO INTERNAL LINKS */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="mb-6 text-3xl font-black text-[#2f2a25]">
          貸款資訊與評估
        </h2>

        <p className="mb-8 max-w-4xl leading-8 text-[#5f5750]">
          本平台 提供貸款知識整理與信用貸款評估服務，
          讓你在申請貸款前能先了解申請條件、利率與流程，
          再決定是否進一步申請。你可以先閱讀信用貸款介紹、查看貸款知識文章，
          或直接填寫需求進行免費貸款評估。
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/credit-loan"
            className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[#f8f5ef] hover:shadow-md"
          >
            <h3 className="mb-2 text-xl font-bold text-[#2f2a25]">
              信用貸款介紹
            </h3>
            <p className="text-sm leading-7 text-[#6f675f]">
              了解信用貸款申請條件、利率區間與申請流程，幫助你先建立完整概念。
            </p>
          </Link>

          <Link
            href="/articles"
            className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[#f8f5ef] hover:shadow-md"
          >
            <h3 className="mb-2 text-xl font-bold text-[#2f2a25]">
              貸款知識文章
            </h3>
            <p className="text-sm leading-7 text-[#6f675f]">
              閱讀貸款知識、借款流程與常見問題整理，先看懂再評估更安心。
            </p>
          </Link>

          <Link
            href="/borrow"
            className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[#f8f5ef] hover:shadow-md"
          >
            <h3 className="mb-2 text-xl font-bold text-[#2f2a25]">
              免費貸款評估
            </h3>
            <p className="text-sm leading-7 text-[#6f675f]">
              提交貸款需求，快速進行貸款方案評估，由專人協助釐清適合方向。
            </p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <CtaSection />

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <SectionTitle
          badge="FAQ"
          title="常見貸款問題"
          desc="以下整理一些常見問題，幫助你更了解貸款流程。"
          center
        />

        <div className="mt-10 space-y-4">
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