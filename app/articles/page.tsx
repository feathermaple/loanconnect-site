import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "知識專區",
  description:
    "LoanConnect 貸款知識專區，整理信用貸款、整合負債與小額借款等常見主題。",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const PAGE_SIZE = 9;

type ArticlesPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

function buildPageHref(page: number) {
  return page <= 1 ? "/articles" : `/articles?page=${page}`;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>();

  pages.add(1);
  pages.add(totalPages);

  for (let i = currentPage - 2; i <= currentPage + 2; i += 1) {
    if (i >= 1 && i <= totalPages) {
      pages.add(i);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const params = (await searchParams) || {};
  const requestedPage = Number(params.page || "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const [{ count, error: countError }, { data: articles, error: articlesError }] =
    await Promise.all([
      supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("published", true),

      supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(from, to),
    ]);

  if (countError) {
    console.error("讀取文章總數失敗：", countError);
  }

  if (articlesError) {
    console.error("讀取文章列表失敗：", articlesError);
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visiblePages = getVisiblePages(safeCurrentPage, totalPages);

  const needsRefetch = safeCurrentPage !== currentPage;
  let safeArticles = articles ?? [];

  if (needsRefetch) {
    const safeFrom = (safeCurrentPage - 1) * PAGE_SIZE;
    const safeTo = safeFrom + PAGE_SIZE - 1;

    const { data: fallbackArticles, error: fallbackError } = await supabase
      .from("articles")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range(safeFrom, safeTo);

    if (fallbackError) {
      console.error("重新讀取安全頁碼文章失敗：", fallbackError);
    } else {
      safeArticles = fallbackArticles ?? [];
    }
  }

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
            目前共收錄 {totalCount} 篇貸款相關文章。
          </p>

          <p className="mt-2 text-sm text-[#8a8178]">
            第 {safeCurrentPage} 頁／共 {totalPages} 頁
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        {safeArticles.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {safeArticles.map((article) => (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-[28px] border border-[#e8e1d8] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  {article.cover_image && (
                    <div className="overflow-hidden">
                      <Image
                        src={article.cover_image}
                        alt={article.title}
                        width={800}
                        height={480}
                        className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="text-xs font-semibold text-[#8a8178]">
                      貸款知識
                    </div>

                    <h2 className="mt-3 text-2xl font-black leading-tight">
                      {article.title}
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-[#6f675f]">
                      {article.excerpt || "閱讀完整貸款知識文章。"}
                    </p>

                    <div className="mt-4 text-xs text-[#8a8178]">
                      {article.created_at
                        ? new Date(article.created_at).toLocaleDateString(
                            "zh-TW"
                          )
                        : ""}
                    </div>

                    <div className="mt-6">
                      <Link
                        href={`/articles/${encodeURIComponent(article.slug)}`}
                        className="inline-flex rounded-full border border-[#e6dfd5] bg-[#faf7f2] px-5 py-2 text-sm font-semibold text-[#5f5750] transition hover:bg-[#f3eee7] hover:text-[#2f2a25]"
                      >
                        繼續閱讀
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {safeCurrentPage > 1 ? (
                <Link
                  href={buildPageHref(safeCurrentPage - 1)}
                  className="inline-flex rounded-full border border-[#e6dfd5] bg-white px-4 py-2 text-sm font-semibold text-[#5f5750] transition hover:bg-[#f3eee7]"
                >
                  上一頁
                </Link>
              ) : (
                <span className="inline-flex cursor-not-allowed rounded-full border border-[#eee6dc] bg-[#f7f3ed] px-4 py-2 text-sm font-semibold text-[#b2a79a]">
                  上一頁
                </span>
              )}

              {visiblePages.map((page, index) => {
                const prevPage = visiblePages[index - 1];
                const showDots = index > 0 && page - prevPage > 1;

                return (
                  <div key={page} className="flex items-center gap-2">
                    {showDots && (
                      <span className="px-1 text-sm text-[#8a8178]">…</span>
                    )}

                    <Link
                      href={buildPageHref(page)}
                      className={`inline-flex min-w-[42px] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                        page === safeCurrentPage
                          ? "bg-[#2f2a25] text-white"
                          : "border border-[#e6dfd5] bg-white text-[#5f5750] hover:bg-[#f3eee7]"
                      }`}
                    >
                      {page}
                    </Link>
                  </div>
                );
              })}

              {safeCurrentPage < totalPages ? (
                <Link
                  href={buildPageHref(safeCurrentPage + 1)}
                  className="inline-flex rounded-full border border-[#e6dfd5] bg-white px-4 py-2 text-sm font-semibold text-[#5f5750] transition hover:bg-[#f3eee7]"
                >
                  下一頁
                </Link>
              ) : (
                <span className="inline-flex cursor-not-allowed rounded-full border border-[#eee6dc] bg-[#f7f3ed] px-4 py-2 text-sm font-semibold text-[#b2a79a]">
                  下一頁
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-[28px] border border-[#e8e1d8] bg-white p-10 text-center text-[#6f675f] shadow-sm">
            目前尚無已發布文章。
          </div>
        )}
      </section>
    </main>
  );
}