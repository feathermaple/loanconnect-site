export type ArticleSection = {
  heading: string;
  body: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  type: string;
  date: string;
  readingTime: string;
  coverImage: string;
  content: ArticleSection[];
};

export const articles: Article[] = [
  {
    slug: "credit-loan-conditions",
    title: "信用貸款條件有哪些？申請前先看這幾點",
    description:
      "整理信用貸款常見申請條件、利率、額度與評估重點，幫助你快速了解申請方向。",
    category: "信用貸款",
    type: "article",
    date: "2026-03-08",
    readingTime: "3 分鐘閱讀",
    coverImage: "/images/articles/credit-loan.jpg",
    content: [
      {
        heading: "什麼是信用貸款？",
        body: "信用貸款是一種不需提供擔保品的借款方式，通常依申請人的信用紀錄、收入條件與負債狀況進行評估。對於有短中期資金需求的人來說，是常見的資金規劃工具之一。",
      },
      {
        heading: "常見申請條件",
        body: "常見條件包含年滿法定年齡、具有穩定收入來源、信用紀錄正常，以及能提供基本身分與聯絡資訊。實際審核標準仍會依不同方案與條件而有所不同。",
      },
      {
        heading: "申請前要注意什麼？",
        body: "申請前建議先評估自己的還款能力，並了解利率、期數、費用與總還款金額。若有多筆債務，也可先考慮是否適合做整體財務規劃。",
      },
    ],
  },
  {
    slug: "debt-consolidation-guide",
    title: "整合負債怎麼做？適合哪些人申請",
    description:
      "整合負債可協助簡化還款壓力，本文整理適合對象、申請重點與注意事項。",
    category: "整合負債",
    type: "article",
    date: "2026-03-08",
    readingTime: "3 分鐘閱讀",
    coverImage: "/images/articles/debt-consolidation.jpg",
    content: [
      {
        heading: "整合負債是什麼？",
        body: "整合負債是將多筆貸款、信用卡循環或其他負債整合成較容易管理的單一方案，目的是讓還款節奏更清楚，並降低財務壓力。",
      },
      {
        heading: "哪些人適合整合負債？",
        body: "若你目前有多筆貸款需要分別繳款、月付壓力高，或想要重新整理財務結構，整合負債通常會是可以先評估的方向之一。",
      },
      {
        heading: "整合負債前的注意事項",
        body: "整合前應確認整體總費用、還款期限、利率與是否有額外手續費。不是所有情況都一定適合整合，因此申請前應詳細比較條件。",
      },
    ],
  },
  {
    slug: "small-loan-tips",
    title: "小額借款怎麼評估？申請前注意這些事",
    description:
      "小額借款適合短期資金需求者，本文整理申請前應注意的重點與基本方向。",
    category: "小額借款",
    type: "article",
    date: "2026-03-08",
    readingTime: "3 分鐘閱讀",
    coverImage: "/images/articles/small-loan.jpg",
    content: [
      {
        heading: "小額借款適合什麼情況？",
        body: "若你有短期週轉需求、生活費調整、臨時支出等情況，小額借款通常是較常見的資金工具。但仍建議依實際需求與還款能力審慎規劃。",
      },
      {
        heading: "申請流程通常怎麼進行？",
        body: "通常會先提交基本資料，由專人或系統初步了解資金需求，再依申請條件提供適合的方案方向與後續流程。",
      },
      {
        heading: "申請前建議",
        body: "申請前建議先釐清借款用途、期望額度與每月可負擔金額，避免只看核准速度而忽略整體財務安排。",
      },
    ],
  },
];