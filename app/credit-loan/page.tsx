import { Metadata } from "next";
import Link from "next/link";
import QuickApplyCard from "@/components/QuickApplyCard";

export const metadata: Metadata = {
  title: "信用貸款是什麼？條件、利率、流程一次看懂",
  description:
    "想申請信用貸款卻不知道條件與利率？本頁整理信用貸款申請條件、利率比較、申請流程與常見問題，快速了解並進行貸款評估。",
  keywords: [
    "信用貸款",
    "銀行信用貸款",
    "信用貸款條件",
    "信用貸款利率",
    "貸款申請流程",
    "貸款評估",
    "整合負債",
    "資金週轉",
  ],
  alternates: {
    canonical: "https://loanconnect-site.vercel.app/credit-loan",
  },
  openGraph: {
    title: "信用貸款是什麼？條件、利率、流程一次看懂",
    description:
      "整理信用貸款申請條件、利率比較、申請流程與常見問題，幫助你快速了解並進行貸款評估。",
    url: "https://loanconnect-site.vercel.app/credit-loan",
    siteName: "LoanConnect",
    locale: "zh_TW",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "信用貸款是什麼？條件、利率、流程一次看懂",
    description:
      "整理信用貸款申請條件、利率比較、申請流程與常見問題，幫助你快速了解並進行貸款評估。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "信用貸款是什麼？申請條件、利率與流程一次看懂",
  description:
    "整理信用貸款申請條件、利率比較、申請流程與常見問題，幫助你快速了解並進行貸款評估。",
  author: {
    "@type": "Organization",
    name: "LoanConnect",
  },
  publisher: {
    "@type": "Organization",
    name: "LoanConnect",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://loanconnect-site.vercel.app/credit-loan",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "信用貸款一定要有薪轉嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "不一定。有些銀行會要求薪轉，但也有貸款方案只要提供收入證明即可申請。",
      },
    },
    {
      "@type": "Question",
      name: "信用貸款會影響信用評分嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "若按時還款通常不會影響信用評分，但若逾期或遲繳則可能降低信用評分。",
      },
    },
    {
      "@type": "Question",
      name: "信用貸款利率是多少？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般銀行信用貸款利率約落在 2% 到 10% 之間，會依個人信用評分、收入狀況與貸款額度有所不同。",
      },
    },
  ],
};

export default function CreditLoanPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mb-4 text-sm text-[#8a8178]">
        <Link href="/" className="hover:underline">
          首頁
        </Link>{" "}
        / <span className="font-medium text-[#2f2a25]">信用貸款</span>
      </div>

      <h1 className="mb-6 text-3xl font-bold leading-tight text-[#2f2a25]">
        信用貸款是什麼？申請條件、利率與流程一次看懂
      </h1>

      <p className="mb-6 text-lg leading-relaxed text-[#5f5750]">
        信用貸款是目前最常見的借款方式之一，不需要提供抵押品，
        只要有穩定收入與良好信用紀錄即可申請。許多人會透過信用貸款
        來進行資金周轉、整合負債或支付緊急支出。
      </p>

      <div className="mb-10 rounded-3xl border border-[#e8e1d8] bg-[#fbf8f3] p-6">
        <h2 className="text-xl font-bold text-[#2f2a25]">這頁你會看到什麼？</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[#5f5750]">
          <li>信用貸款申請條件</li>
          <li>信用貸款利率區間</li>
          <li>信用貸款申請流程</li>
          <li>常見問題與申請提醒</li>
        </ul>
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-semibold text-[#2f2a25]">
        信用貸款申請條件
      </h2>

      <p className="mb-4 leading-8 text-[#5f5750]">
        信用貸款的核准重點通常會落在申請人的收入狀況、信用紀錄與整體負債比。
        不同銀行或貸款方案的審核標準不完全相同，但通常都會先看以下幾個基本條件。
      </p>

      <ul className="list-disc space-y-2 pl-6 text-[#5f5750]">
        <li>年滿 20 歲以上</li>
        <li>有穩定收入來源</li>
        <li>信用紀錄正常</li>
        <li>沒有嚴重信用瑕疵</li>
      </ul>

      <h2 className="mb-4 mt-10 text-2xl font-semibold text-[#2f2a25]">
        信用貸款利率是多少？
      </h2>

      <p className="mb-6 leading-8 text-[#5f5750]">
        一般銀行信用貸款利率約落在 2% 到 10% 之間，會依照個人信用分數、工作收入、
        負債比與申請額度不同而有所差異。如果你想比較不同方案，
        建議先做免費評估，再決定是否申請。
      </p>

      <div className="my-10">
        <QuickApplyCard />
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-semibold text-[#2f2a25]">
        信用貸款申請流程
      </h2>

      <p className="mb-4 leading-8 text-[#5f5750]">
        如果你是第一次接觸信用貸款，通常流程大致如下：
      </p>

      <ol className="list-decimal space-y-2 pl-6 text-[#5f5750]">
        <li>填寫貸款評估表單</li>
        <li>專人聯絡確認資料</li>
        <li>銀行審核信用與收入條件</li>
        <li>核准後撥款</li>
      </ol>

      <h2 className="mb-4 mt-10 text-2xl font-semibold text-[#2f2a25]">
        常見問題 FAQ
      </h2>

      <div className="space-y-6 text-[#5f5750]">
        <div>
          <p className="mb-2 font-semibold text-[#2f2a25]">
            Q：信用貸款一定要有薪轉嗎？
          </p>
          <p>
            不一定。有些銀行會要求薪轉，但也有貸款方案只要提供收入證明即可申請。
          </p>
        </div>

        <div>
          <p className="mb-2 font-semibold text-[#2f2a25]">
            Q：信用貸款會影響信用評分嗎？
          </p>
          <p>
            若按時還款通常不會影響信用評分，但若逾期或遲繳則可能降低信用評分。
          </p>
        </div>

        <div>
          <p className="mb-2 font-semibold text-[#2f2a25]">
            Q：信用貸款適合哪些人？
          </p>
          <p>
            適合有穩定收入、臨時有資金需求、想整合負債或短期週轉的人，
            但實際仍需依個人條件評估。
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-3xl bg-[#3e3a34] p-8 text-white">
        <h3 className="text-2xl font-bold">想了解自己適不適合申請信用貸款？</h3>
        <p className="mt-3 leading-7 text-[#efe7dd]">
          可以先填寫基本需求，由線上客服協助初步評估方向，再決定是否進一步申請。
        </p>

        <div className="mt-6">
          <Link
            href="/apply-loan"
            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#2f2a25] transition hover:opacity-95"
          >
            前往免費評估
          </Link>
        </div>
      </div>

      <div className="mt-12 border-t border-[#e8e1d8] pt-8">
        <h3 className="text-xl font-bold text-[#2f2a25]">延伸閱讀</h3>
        <div className="mt-4 flex flex-col gap-3">
          <Link href="/articles" className="text-[#5c534c] hover:underline">
            查看所有貸款知識文章
          </Link>
          <Link href="/apply-loan" className="text-[#5c534c] hover:underline">
            免費貸款需求評估
          </Link>
        </div>
      </div>
    </main>
  );
}