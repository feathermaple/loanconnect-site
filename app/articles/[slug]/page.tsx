import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type FAQItem = {
  question: string;
  answer: string;
};

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  created_at: string;
  updated_at?: string | null;
  faqs?: FAQItem[] | null;
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getReadingTime(content: string | null) {
  if (!content) return null;
  const words = content.trim().length;
  const minutes = Math.max(1, Math.ceil(words / 500));
  return `${minutes} 分鐘閱讀`;
}

function getCategory(title: string) {
  if (title.includes("信用")) return "信用貸款";
  if (title.includes("小額")) return "小額借款";
  if (title.includes("整合")) return "整合負債";
  if (title.includes("民間")) return "民間借款";
  if (title.includes("當舖") || title.includes("當鋪")) return "當鋪借款";
  if (title.includes("汽車")) return "汽車借款";
  if (title.includes("機車")) return "機車借款";
  if (title.includes("房屋")) return "房屋貸款";
  return "貸款知識";
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addInternalLinks(
  content: string | null,
  relatedArticles: Pick<ArticleRow, "title" | "slug">[],
  currentSlug: string
) {
  if (!content) return "";

  const staticLinks: { keyword: string; url: string }[] = [];

  const dynamicLinks = relatedArticles
    .filter((item) => item.slug !== currentSlug)
    .map((item) => ({
      keyword: item.title,
      url: `/articles/${encodeURIComponent(item.slug)}`,
    }));

  const mergedLinks = [...dynamicLinks, ...staticLinks];

  let newContent = content;
  const usedKeywords = new Set<string>();

  for (const link of mergedLinks) {
    if (!link.keyword || usedKeywords.has(link.keyword)) continue;

    const escapedKeyword = escapeRegExp(link.keyword);
    const regex = new RegExp(escapedKeyword, "i");

    if (regex.test(newContent)) {
      newContent = newContent.replace(
        regex,
        `<a href="${link.url}" class="text-blue-600 underline underline-offset-4 hover:text-blue-800">${link.keyword}</a>`
      );
      usedKeywords.add(link.keyword);
    }
  }

  return newContent;
}

function extractFaqs(content: string | null): FAQItem[] {
  if (!content?.trim()) return [];

  const faqRegex =
    /(?:^|\n)#{0,3}\s*(?:Q\d+|Q|問)\s*[：:]\s*(.+?)\n\s*(?:A\d+|A|答)\s*[：:]\s*([\s\S]*?)(?=\n#{0,3}\s*(?:Q\d+|Q|問)\s*[：:]|\n##\s|$)/g;

  const faqs: FAQItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = faqRegex.exec(content)) !== null) {
    const question = match[1]?.trim();
    const answer = match[2]?.trim();

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  if (faqs.length > 0) {
    return faqs.slice(0, 5);
  }

  return [
    {
      question: "貸款申請通常需要多久審核？",
      answer:
        "一般貸款審核時間會依貸款類型、資料完整度與申請管道不同而有所差異，常見約需 1 至 3 個工作天。",
    },
    {
      question: "信用不好還可以申請貸款嗎？",
      answer:
        "即使信用條件不理想，仍可能有適合的借款方案，例如擔保型貸款或其他評估條件較彈性的借款方式。",
    },
    {
      question: "申請貸款需要準備哪些資料？",
      answer:
        "常見需要身分證明、聯絡方式、收入或工作證明以及銀行帳戶資訊。",
    },
  ];
}

function parseContentBlocks(
  content: string | null,
  relatedArticles: Pick<ArticleRow, "title" | "slug">[],
  currentSlug: string
) {
  if (!content?.trim()) return [];

  const sections = content
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return sections.map((section, index) => {
    const lines = section
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const heading =
      lines[0]?.replace(/^#+\s*/, "") || `重點 ${String(index + 1)}`;

    const rawBody = lines.slice(1).join("\n") || lines[0] || "";
    const body = addInternalLinks(rawBody, relatedArticles, currentSlug);

    return { heading, body };
  });
}

async function getArticleBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", decodedSlug)
    .eq("published", true)
    .single<ArticleRow>();

  if (error || !data) return null;
  return data;
}

async function getRelatedArticles(currentSlug: string) {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .neq("slug", currentSlug)
    .order("created_at", { ascending: false })
    .limit(3);

  return (data as ArticleRow[] | null) || [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "文章不存在",
    };
  }

  const title = article.seo_title?.trim() || article.title;
  const description =
    article.seo_description?.trim() ||
    article.excerpt?.trim() ||
    "LoanConnect 貸款知識文章";
  const url = `https://loanconnect-site.vercel.app/articles/${encodeURIComponent(
    article.slug
  )}`;

  return {
    title,
    description,
    keywords: [
      getCategory(article.title),
      article.title,
      "貸款知識",
      "信用貸款",
      "借款教學",
      "貸款申請",
      "借款流程",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "LoanConnect",
      locale: "zh_TW",
      type: "article",
      images: article.cover_image
        ? [
            {
              url: article.cover_image,
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.cover_image ? [article.cover_image] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.slug);
  const readingTime = getReadingTime(article.content);
  const category = getCategory(article.title);

  const blocks = parseContentBlocks(
    article.content,
    relatedArticles.map((item) => ({
      title: item.title,
      slug: item.slug,
    })),
    article.slug
  );

  const faqs =
    Array.isArray(article.faqs) && article.faqs.length > 0
      ? article.faqs
          .map((item) => ({
            question: String(item?.question || "").trim(),
            answer: String(item?.answer || "").trim(),
          }))
          .filter((item) => item.question && item.answer)
          .slice(0, 5)
      : extractFaqs(article.content);

  const description =
    article.seo_description?.trim() ||
    article.excerpt?.trim() ||
    "LoanConnect 貸款知識文章";
  const url = `https://loanconnect-site.vercel.app/articles/${encodeURIComponent(
    article.slug
  )}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    image: article.cover_image ? [article.cover_image] : [],
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
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
      "@id": url,
    },
  };

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: "https://loanconnect-site.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "知識專區",
        item: "https://loanconnect-site.vercel.app/articles",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  };

  return (
    <main className="bg-[#f8f5ef] text-[#2f2a25]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />

      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <section className="border-b border-[#e8e1d8] bg-[#fbf8f3]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
          <Link
            href="/articles"
            className="inline-flex rounded-full border border-[#e6dfd5] bg-white px-4 py-2 text-xs font-semibold text-[#7a7269] transition hover:bg-[#f5f1eb]"
          >
            ← 返回知識專區
          </Link>

          <div className="mt-6 text-xs font-semibold text-[#8a8178]">
            {category}
          </div>

          <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
            {article.title}
          </h1>

          <div className="mt-4 text-sm text-[#8a8178]">
            {formatDate(article.created_at)}
            {readingTime ? ` ・ ${readingTime}` : ""}
          </div>

          <p className="mt-6 text-base leading-8 text-[#6f675f] md:text-lg">
            {description}
          </p>

          {article.cover_image && (
            <div className="mt-10 overflow-hidden rounded-2xl border border-[#e8e1d8]">
              <Image
                src={article.cover_image}
                alt={article.title}
                width={1200}
                height={700}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="rounded-[32px] border border-[#e8e1d8] bg-white p-8 shadow-sm md:p-10">
          <div className="mb-8 text-sm text-[#8a8178]">
            <Link href="/" className="transition hover:text-[#2f2a25]">
              首頁
            </Link>
            <span className="mx-2">/</span>
            <Link href="/articles" className="transition hover:text-[#2f2a25]">
              知識專區
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#2f2a25]">{article.title}</span>
          </div>

          {blocks.length > 0 ? (
            <div className="space-y-12">
              {blocks.map((block, index) => (
                <section key={`${block.heading}-${index}`}>
                  <h2 className="text-2xl font-black leading-tight">
                    {block.heading}
                  </h2>

                  <div
                    className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base"
                    dangerouslySetInnerHTML={{
                      __html: block.body.replace(/\n/g, "<br />"),
                    }}
                  />
                </section>
              ))}
            </div>
          ) : (
            <div className="text-sm leading-8 text-[#6f675f] md:text-base">
              暫無文章內容
            </div>
          )}

          {faqs.length > 0 && (
            <section className="mt-14 border-t border-[#eee7dc] pt-10">
              <div className="text-sm font-semibold tracking-[0.18em] text-[#8a8178]">
                FAQ
              </div>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                常見問題
              </h2>

              <div className="mt-8 space-y-4">
                {faqs.map((item, index) => (
                  <div
                    key={`${item.question}-${index}`}
                    className="rounded-2xl border border-[#e8e1d8] bg-[#fcfaf6] p-5"
                  >
                    <h3 className="text-lg font-bold text-[#2f2a25]">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-sm leading-8 text-[#6f675f] md:text-base">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 rounded-[28px] bg-[#3e3a34] p-8 text-white">
            <h3 className="text-2xl font-black">
              想進一步了解適合自己的方案？
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#e7ddd2]">
              可先提交貸款需求，由 LoanConnect 協助初步評估與媒合方向。
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-[#f1e7dc]">
              <span className="rounded-full border border-white/15 px-3 py-1">
                不收前期費用
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                專人協助評估
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1">
                資料保密處理
              </span>
            </div>

            <div className="mt-6">
              <Link
                href="/borrow"
                className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#3e3a34] transition hover:opacity-95"
              >
                前往免費評估
              </Link>
            </div>
          </div>
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
          <div className="mb-8">
            <div className="text-sm font-semibold tracking-[0.18em] text-[#8a8178]">
              MORE ARTICLES
            </div>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">延伸閱讀</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f675f] md:text-base">
              延伸閱讀更多貸款整理與申請重點，幫助你在評估方案前先掌握關鍵方向。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map((item) => (
              <Link
                key={item.id}
                href={`/articles/${encodeURIComponent(item.slug)}`}
                className="group overflow-hidden rounded-[28px] border border-[#e8e1d8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {item.cover_image && (
                  <div className="overflow-hidden">
                    <Image
                      src={item.cover_image}
                      alt={item.title}
                      width={800}
                      height={480}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="text-xs font-semibold text-[#8a8178]">
                    {getCategory(item.title)}
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-xl font-black leading-snug transition group-hover:text-[#7a7269]">
                    {item.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#6f675f]">
                    {item.excerpt?.trim() || "延伸閱讀更多貸款申請與評估重點。"}
                  </p>

                  <div className="mt-5 text-sm font-semibold text-[#2f2a25]">
                    繼續閱讀 →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}