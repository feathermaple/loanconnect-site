import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "知識專區",
  description:
    "LoanConnect 貸款知識專區，整理信用貸款、整合負債與小額借款等常見主題。",
};

export default function ArticlesPage() {
  return (
    <main className="bg-[#f8f5ef] text-[#2f2a25]">
      <section className="border-b border-[#e8e1d8] bg-[#fbf8f3]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="mb-4 inline-flex rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-xs font-semibold text-[#7a7269]">
            知識專區
          </div>

          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            貸款知識專區
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#6f675f] md:text-lg">
            整理信用貸款、整合負債、小額借款等常見主題，
            幫助你在申請前先了解重點。
          </p>

          <p className="mt-4 text-sm text-[#8a8178]">
            目前共收錄 {articles.length} 篇貸款相關文章。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group overflow-hidden rounded-[28px] border border-[#e8e1d8] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              {article.coverImage && (
                <div className="overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    width={800}
                    height={480}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="text-xs font-semibold text-[#8a8178]">
                  {article.category}
                </div>

                <h2 className="mt-3 text-2xl font-black leading-tight">
                  {article.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#6f675f]">
                  {article.description}
                </p>

                <div className="mt-4 text-xs text-[#8a8178]">
                  {article.date}
                  {article.readingTime ? ` ・ ${article.readingTime}` : ""}
                </div>

                <div className="mt-6">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex rounded-full border border-[#e6dfd5] bg-[#faf7f2] px-5 py-2 text-sm font-semibold text-[#5f5750] transition hover:bg-[#f3eee7] hover:text-[#2f2a25]"
                  >
                    繼續閱讀
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}