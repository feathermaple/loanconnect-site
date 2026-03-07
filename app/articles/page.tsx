import { Metadata } from "next";

export const metadata: Metadata = {
  title: "貸款知識文章｜信用貸款與負債整合指南",
  description:
    "LoanConnect 提供貸款知識文章，包括信用貸款條件、整合負債方法、小額借款注意事項等實用指南。",
};

import SectionTitle from "@/components/SectionTitle";
import { blogSeed } from "@/lib/data";

export default function ArticlesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <SectionTitle badge="Blog / SEO" title="知識專區" desc="這一頁可作為 SEO 文章列表、知識內容頁或地區型長尾流量入口。" />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {blogSeed.map((post) => (
          <article key={post.id} className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-[#8a8178]">
              <span className="rounded-full bg-soft px-3 py-1">{post.category}</span>
              <span>{post.date}</span>
            </div>
            <h3 className="mt-4 text-xl font-bold leading-8 text-ink">{post.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              這裡可延伸為完整文章頁、FAQ 內容頁、縣市頁與搜尋流量入口頁。
            </p>
            <button className="mt-5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:bg-soft">閱讀更多</button>
          </article>
        ))}
      </div>
    </section>
  );
}
