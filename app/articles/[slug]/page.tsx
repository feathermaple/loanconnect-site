import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/lib/articles";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return {
      title: "文章不存在",
    };
  }

  const url = `https://loanconnect-site.vercel.app/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName: "LoanConnect",
      locale: "zh_TW",
      type: "article",
      images: article.coverImage
        ? [
            {
              url: article.coverImage,
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  const url = `https://loanconnect-site.vercel.app/articles/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.coverImage,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: "LoanConnect",
    },
    publisher: {
      "@type": "Organization",
      name: "LoanConnect",
    },
    mainEntityOfPage: url,
  };

  return (
    <main className="bg-[#f8f5ef] text-[#2f2a25]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
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
            {article.category}
          </div>

          <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
            {article.title}
          </h1>

          <div className="mt-4 text-sm text-[#8a8178]">
            {article.date}
            {article.readingTime ? ` ・ ${article.readingTime}` : ""}
          </div>

          <p className="mt-6 text-base leading-8 text-[#6f675f] md:text-lg">
            {article.description}
          </p>

          {article.coverImage && (
            <div className="mt-10 overflow-hidden rounded-2xl border border-[#e8e1d8]">
              <Image
                src={article.coverImage}
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
          <div className="space-y-12">
            {article.content.map((block) => (
              <section key={block.heading}>
                <h2 className="text-2xl font-black leading-tight">
                  {block.heading}
                </h2>
                <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
                  {block.body}
                </p>
              </section>
            ))}
          </div>

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
            <h2 className="mt-2 text-3xl font-black md:text-4xl">推薦閱讀</h2>
            <p className="mt-3 text-sm leading-7 text-[#6f675f] md:text-base">
              延伸閱讀更多貸款整理與申請重點，幫助你在評估方案前先掌握關鍵方向。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map((item) => (
              <Link
                key={item.slug}
                href={`/articles/${item.slug}`}
                className="group overflow-hidden rounded-[28px] border border-[#e8e1d8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {item.coverImage && (
                  <div className="overflow-hidden">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      width={800}
                      height={480}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="text-xs font-semibold text-[#8a8178]">
                    {item.category}
                  </div>

                  <h3 className="mt-3 text-xl font-black leading-snug text-[#2f2a25] transition group-hover:text-[#5b5248]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#6f675f]">
                    {item.description}
                  </p>

                  <div className="mt-5 text-xs text-[#8a8178]">
                    {item.date}
                    {item.readingTime ? ` ・ ${item.readingTime}` : ""}
                  </div>

                  <div className="mt-5 inline-flex items-center text-sm font-semibold text-[#2f2a25]">
                    閱讀文章 →
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