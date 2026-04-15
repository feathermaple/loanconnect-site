import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const loanPages = {
  "credit-loan": {
    title: "信用貸款",
    description:
      "了解信用貸款申請條件、利率、額度與常見問題，快速評估適合自己的資金方案。",
    intro:
      "信用貸款是常見的資金週轉方式之一，適合有穩定收入、希望快速取得資金的人。實際額度、利率與核准條件，仍需依個人信用狀況與審核結果為準。",
    points: [
      "可用於資金週轉、日常支出規劃或整合短期資金需求",
      "通常不需提供擔保品，但會依信用條件審核",
      "額度、期數與利率會依個人條件不同而有差異",
    ],
  },
  "debt-consolidation": {
    title: "整合負債",
    description:
      "了解整合負債的申請方式、適合對象、優缺點與注意事項，協助降低還款壓力。",
    intro:
      "整合負債適合名下有多筆貸款或卡債、希望簡化還款與降低財務壓力的族群。透過整合後，可將多筆負債集中管理，提升還款規劃效率。",
    points: [
      "可將多筆債務整合成單一方案，方便管理",
      "有機會降低月付壓力，但仍須依條件審核",
      "申請前應詳細評估整體費用與還款期間",
    ],
  },
  "small-loan": {
    title: "小額借款",
    description:
      "了解小額借款條件、申請流程與注意事項，快速掌握適合自己的資金方案。",
    intro:
      "小額借款適合短期資金需求者，例如日常週轉、臨時支出或生活費調整。雖然申請門檻通常較彈性，但仍應審慎評估還款能力。",
    points: [
      "適合短期或中小型資金需求",
      "申請流程通常較快，但仍須提供基本資料",
      "借款前應留意利率、期數與相關費用",
    ],
  },
} as const;

type Slug = keyof typeof loanPages;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = loanPages[slug as Slug];

  if (!page) {
    return {
      title: "頁面不存在",
    };
  }

  return {
    title: `${page.title}申請與條件說明`,
    description: page.description,
    alternates: {
      canonical: `https://loanconnect-site.vercel.app/loan/${slug}`,
    },
  };
}

export default async function LoanSeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = loanPages[slug as Slug];

  if (!page) {
    notFound();
  }

  return (
    <main className="bg-[#f8f5ef] text-[#2f2a25]">
      <section className="border-b border-[#e8e1d8] bg-[#fbf8f3]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="mb-4 inline-flex rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-xs font-semibold text-[#7a7269]">
            Loan Guide
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-5xl">
            {page.title}申請條件、流程與重點整理
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#6f675f] md:text-lg">
            {page.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/apply-loan"
              className="rounded-full bg-[#3e3a34] px-7 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95"
            >
              立即免費評估
            </Link>

            <Link
              href="/loan-info"
              className="rounded-full border border-[#e6dfd5] bg-white px-7 py-3 text-sm font-semibold text-[#5f5750] hover:bg-[#f5f1eb]"
            >
              查看貸款條件
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm">
            <div className="text-sm text-[#8a8178]">申請重點</div>
            <div className="mt-2 text-2xl font-black text-[#2f2a25]">
              先評估條件
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6f675f]">
              了解個人收入、信用狀況與資金需求，是申請前的重要準備。
            </p>
          </div>

          <div className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm">
            <div className="text-sm text-[#8a8178]">流程方向</div>
            <div className="mt-2 text-2xl font-black text-[#2f2a25]">
              填表後媒合
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6f675f]">
              提交基本需求後，可由專人協助評估與媒合適合的貸款方案。
            </p>
          </div>

          <div className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm">
            <div className="text-sm text-[#8a8178]">注意事項</div>
            <div className="mt-2 text-2xl font-black text-[#2f2a25]">
              審慎規劃還款
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6f675f]">
              借款前應了解利率、費用與還款能力，避免造成額外財務壓力。
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e8e1d8] bg-[#fcfaf7]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="rounded-[32px] border border-[#e8e1d8] bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-2xl font-black">{page.title}重點整理</h2>

            <div className="mt-6 space-y-4">
              {page.points.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#efe7de] bg-[#faf7f2] p-4 text-sm leading-7 text-[#6f675f]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[32px] border border-[#e8e1d8] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black">常見問題</h2>

            <div className="mt-6 space-y-5">
              <div>
                <div className="text-base font-bold">申請前要準備什麼？</div>
                <p className="mt-2 text-sm leading-7 text-[#6f675f]">
                  建議先準備基本身分資訊、聯絡方式、收入狀況與資金需求，方便進行初步評估。
                </p>
              </div>

              <div>
                <div className="text-base font-bold">一定會核准嗎？</div>
                <p className="mt-2 text-sm leading-7 text-[#6f675f]">
                  不一定。實際是否核准、核准額度與利率條件，仍需依個人條件與審核結果為準。
                </p>
              </div>

              <div>
                <div className="text-base font-bold">可以先了解條件再申請嗎？</div>
                <p className="mt-2 text-sm leading-7 text-[#6f675f]">
                  可以，您可先透過 LoanConnect 提交需求，了解可能的貸款方向與基本條件。
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-[#3e3a34] p-8 text-white shadow-xl">
            <div className="text-sm text-[#e7ddd2]">立即開始</div>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              想了解適合自己的{page.title}方案？
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#e7ddd2]">
              現在就填寫需求資料，讓專人協助您評估與媒合適合的貸款方向。
            </p>

            <div className="mt-8">
              <Link
                href="/apply-loan"
                className="inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#3e3a34]"
              >
                前往免費評估
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}