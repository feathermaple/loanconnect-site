import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "關於平台｜秒貸通 MIAO DAI TONG",
  description:
    "秒貸通是貸款資訊與資金媒合平台，提供借款需求刊登、放款資訊曝光、會員服務與借款知識內容，幫助用戶更快速找到適合的資金方案。",
  keywords: [
    "關於平台",
    "秒貸通",
    "貸款媒合平台",
    "借款平台",
    "民間借款",
    "資金媒合",
    "放款資訊",
    "借錢平台",
  ],
  openGraph: {
    title: "關於平台｜秒貸通 MIAO DAI TONG",
    description:
      "提供借款資訊與資金媒合服務，幫助用戶更快速找到適合的資金方案。",
    url: "https://loanconnect-site.vercel.app/about-platform",
    siteName: "秒貸通 MIAO DAI TONG",
    locale: "zh_TW",
    type: "website",
  },
};

const features = [
  {
    title: "借款需求刊登",
    desc: "有資金需求的用戶，可以快速刊登需求，讓合適的資金方看見。",
  },
  {
    title: "放款資訊曝光",
    desc: "放款方可刊登服務內容，提升曝光度，接觸更精準的需求客群。",
  },
  {
    title: "會員服務機制",
    desc: "透過會員制度，提供更多查看資訊、刊登曝光與平台使用權限。",
  },
  {
    title: "借款知識整理",
    desc: "提供借貸、風險、流程與注意事項，幫助用戶更安心做決定。",
  },
];

const steps = [
  {
    step: "01",
    title: "選擇您的需求",
    desc: "您可以依照自身情況，選擇借款、放款、刊登需求或加入會員。",
  },
  {
    step: "02",
    title: "填寫或瀏覽資訊",
    desc: "借款人可刊登需求，放款方可提供資訊，雙方都能更快找到合適對象。",
  },
  {
    step: "03",
    title: "進一步聯繫與評估",
    desc: "平台提供資訊媒合，實際合作條件、利率、費用與審核方式，需由雙方自行確認。",
  },
];

const reasons = [
  "頁面簡單清楚，長輩也看得懂",
  "借款、放款、會員功能整合在同一平台",
  "可快速增加需求曝光與資金曝光",
  "提供借款知識與風險提醒，降低資訊落差",
  "平台定位清楚，以資訊媒合為核心，不誇大不誤導",
];

const notices = [
  "本平台提供的是資訊刊登與媒合服務，並非銀行，也非直接放款機構。",
  "實際借款條件、額度、利率、還款方式、費用與核貸結果，仍以雙方洽談內容為準。",
  "借款前請務必詳閱條件，確認總費用年百分率、違約責任與還款能力。",
  "若遇到不合理費用、證件押留、要求先匯款等情形，請提高警覺並停止交易。",
];

export default function AboutPlatformPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#2b2b2b]">
      {/* Hero */}
      <section className="border-b border-[#e8dfd2] bg-gradient-to-b from-[#f8f5ef] to-[#f3ede3]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full border border-[#d8c5a2] bg-[#fff8ea] px-4 py-2 text-sm font-semibold text-[#9a6b18]">
                關於秒貸通｜貸款資訊與資金媒合平台
              </div>

              <h1 className="text-3xl font-bold leading-tight text-[#1f1f1f] md:text-5xl">
                讓借款更快找到方向，
                <br className="hidden md:block" />
                讓資金更容易被看見
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#5b5146] md:text-lg">
                秒貸通提供借款資訊、需求刊登、放款曝光與會員服務，
                協助有資金需求的用戶，更快速找到合適方案；
                也讓放款服務方更有效率接觸精準客群。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/apply-loan"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#c89b45] px-6 py-4 text-base font-bold text-white shadow-sm transition hover:scale-[1.02] hover:bg-[#b98c35]"
                >
                  我要借錢
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-2xl border border-[#d8c5a2] bg-white px-6 py-4 text-base font-bold text-[#6b4d1f] transition hover:bg-[#fff9ef]"
                >
                  立即加入會員
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
                  <div className="text-xl font-bold text-[#b8842c]">借款方</div>
                  <div className="mt-1 text-sm text-[#6b6257]">
                    快速刊登需求，提升被看見機會
                  </div>
                </div>

                <div className="rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
                  <div className="text-xl font-bold text-[#b8842c]">放款方</div>
                  <div className="mt-1 text-sm text-[#6b6257]">
                    提升曝光，接觸更精準名單
                  </div>
                </div>

                <div className="rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
                  <div className="text-xl font-bold text-[#b8842c]">會員服務</div>
                  <div className="mt-1 text-sm text-[#6b6257]">
                    解鎖更多平台功能與資訊權限
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
              <div className="mb-4 text-sm font-semibold text-[#b8842c]">
                平台核心定位
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-[#faf6ef] p-4">
                  <div className="text-lg font-bold text-[#2f2a24]">
                    我們做的是資訊媒合
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#665d52]">
                    平台主要提供借款資訊整理、需求刊登、放款曝光與會員服務，
                    幫助雙方更有效率找到合適對象。
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf6ef] p-4">
                  <div className="text-lg font-bold text-[#2f2a24]">
                    我們重視的是清楚與安全
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#665d52]">
                    借款前先了解流程、費用、條件與風險，比急著成交更重要。
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf6ef] p-4">
                  <div className="text-lg font-bold text-[#2f2a24]">
                    我們希望讓每一位用戶都更好理解
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#665d52]">
                    不管您是第一次借款、想刊登需求，還是想增加放款曝光，
                    都能用更簡單的方式操作。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 平台提供什麼 */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold tracking-wide text-[#b8842c]">
            平台提供哪些服務
          </div>
          <h2 className="mt-3 text-2xl font-bold text-[#1f1f1f] md:text-4xl">
            一個平台，整合借款需求、放款曝光與資訊內容
          </h2>
          <p className="mt-4 text-base leading-8 text-[#665d52]">
            不只是單一表單，也不只是單純廣告頁，
            而是把使用者真正會需要的功能整合在一起。
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm"
            >
              <div className="mb-3 inline-flex rounded-full bg-[#fff4dd] px-3 py-1 text-sm font-bold text-[#9a6b18]">
                核心服務
              </div>
              <h3 className="text-xl font-bold text-[#2a241d]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#665d52]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 使用流程 */}
      <section className="border-y border-[#eadfce] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-sm font-semibold tracking-wide text-[#b8842c]">
              使用方式很簡單
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[#1f1f1f] md:text-4xl">
              3 個步驟，快速開始使用平台
            </h2>
            <p className="mt-4 text-base leading-8 text-[#665d52]">
              不用複雜流程，也不用看不懂的專業術語，
              照著步驟走，就能快速開始。
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-[28px] border border-[#eadfce] bg-[#fcfaf7] p-6 shadow-sm"
              >
                <div className="text-3xl font-extrabold text-[#d0a55a]">
                  {item.step}
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#2a241d]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#665d52]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 為什麼選擇我們 */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
            <div className="text-sm font-semibold tracking-wide text-[#b8842c]">
              為什麼選擇秒貸通
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[#1f1f1f] md:text-4xl">
              我們不是把資訊堆給您看，
              <br className="hidden md:block" />
              而是幫您更快看懂、找到方向
            </h2>

            <div className="mt-8 space-y-4">
              {reasons.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-[#faf6ef] p-4"
                >
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c89b45] text-sm font-bold text-white">
                    ✓
                  </div>
                  <div className="text-sm leading-7 text-[#554d43]">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-[#eadfce] bg-gradient-to-b from-[#fff8ec] to-[#f8f2e7] p-6 shadow-sm md:p-8">
            <div className="text-sm font-semibold tracking-wide text-[#b8842c]">
              適合哪些人使用
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[#1f1f1f] md:text-3xl">
              不管您是借款方還是放款方，
              都能找到適合自己的入口
            </h2>

            <div className="mt-8 space-y-5">
              <div className="rounded-2xl bg-white/90 p-5">
                <div className="text-lg font-bold text-[#2a241d]">借款需求用戶</div>
                <p className="mt-2 text-sm leading-7 text-[#665d52]">
                  適合想快速了解方案、刊登需求、提高曝光，
                  並希望用更簡單方式找到資金方向的用戶。
                </p>
              </div>

              <div className="rounded-2xl bg-white/90 p-5">
                <div className="text-lg font-bold text-[#2a241d]">放款服務方</div>
                <p className="mt-2 text-sm leading-7 text-[#665d52]">
                  適合希望增加品牌曝光、擴大名單來源、
                  接觸精準借款需求的服務方。
                </p>
              </div>

              <div className="rounded-2xl bg-white/90 p-5">
                <div className="text-lg font-bold text-[#2a241d]">想先了解的人</div>
                <p className="mt-2 text-sm leading-7 text-[#665d52]">
                  若您還沒決定是否借款，也可以先從知識專區開始，
                  先了解流程、風險與注意事項。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 重要提醒 */}
      <section className="border-y border-[#eadfce] bg-[#fffdf9]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-sm font-semibold tracking-wide text-[#b8842c]">
              重要提醒
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[#1f1f1f] md:text-4xl">
              借款前，先看懂條件與風險
            </h2>
            <p className="mt-4 text-base leading-8 text-[#665d52]">
              我們希望每一位使用者都在清楚了解資訊後，再做下一步決定。
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {notices.map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-[#f0e2c8] bg-[#fff8ec] p-5"
              >
                <p className="text-sm leading-7 text-[#6b5840]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="rounded-[36px] border border-[#e2d3bb] bg-[#2d2418] px-6 py-10 text-white shadow-sm md:px-10 md:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <div className="text-sm font-semibold tracking-[0.2em] text-[#f2d29a]">
              START NOW
            </div>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              現在就開始使用秒貸通
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#f7ead2] md:text-lg">
              不管您是想借錢、想增加曝光、想刊登需求，
              或只是想先了解流程，現在就可以開始。
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/apply-loan"
                className="inline-flex items-center justify-center rounded-2xl bg-[#c89b45] px-6 py-4 text-base font-bold text-white transition hover:scale-[1.02] hover:bg-[#b98c35]"
              >
                我要借錢
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl border border-[#f0d39c] bg-transparent px-6 py-4 text-base font-bold text-[#fff4df] transition hover:bg-white/10"
              >
                註冊會員
              </Link>

              <Link
                href="/articles"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-base font-bold text-white transition hover:bg-white/15"
              >
                先看借錢知識
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "關於平台｜秒貸通 MIAO DAI TONG",
            url: "https://loanconnect-site.vercel.app/about-platform",
            description:
              "秒貸通是貸款資訊與資金媒合平台，提供借款需求刊登、放款資訊曝光、會員服務與借款知識內容。",
            isPartOf: {
              "@type": "WebSite",
              name: "秒貸通 MIAO DAI TONG",
              url: "https://loanconnect-site.vercel.app",
            },
            about: {
              "@type": "Service",
              name: "貸款資訊與資金媒合服務",
              description:
                "提供借款需求刊登、放款資訊曝光、會員服務與借款知識內容。",
            },
          }),
        }}
      />
    </main>
  );
}