"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Article = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
};

type FilterStatus = "all" | "published" | "draft";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [generatingSingle, setGeneratingSingle] = useState(false);
  const [generatingBulk, setGeneratingBulk] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, published, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(`讀取文章失敗：${error.message}`);
      setLoading(false);
      return;
    }

    setArticles(data || []);
    setLoading(false);
  }

  async function deleteArticle(id: string) {
    const ok = window.confirm("確定要刪除這篇文章嗎？");
    if (!ok) return;

    setDeletingId(id);
    setErrorMessage("");
    setMessage("");

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      setErrorMessage(`刪除失敗：${error.message}`);
      setDeletingId(null);
      return;
    }

    setArticles((prev) => prev.filter((article) => article.id !== id));
    setMessage("文章已刪除");
    setDeletingId(null);
  }

  async function generateArticle() {
    const keyword = window.prompt("請輸入文章主題，例如：民間借款安全嗎");
    if (!keyword?.trim()) return;

    setGeneratingSingle(true);
    setErrorMessage("");
    setMessage("");

    try {
      const res = await fetch("/api/admin/generate-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data?.error || "AI 文章生成失敗");
      }

      const generatedArticle = data?.article;

      if (!generatedArticle) {
        throw new Error("AI 沒有回傳文章資料");
      }

      try {
        sessionStorage.setItem(
          "generated_article_text",
          JSON.stringify({ article: generatedArticle })
        );
        sessionStorage.setItem("generated_article_keyword", keyword.trim());
      } catch {
        // sessionStorage 不可用時略過
      }

      setMessage("AI 文章已生成，正在前往新增文章頁...");
      window.location.href = "/admin/articles/new";
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "AI 文章生成失敗";
      setErrorMessage(msg);
    } finally {
      setGeneratingSingle(false);
    }
  }

  async function generateBulkArticles() {
    const ok = window.confirm(
      "確定要批量生成 SEO 文章嗎？系統會自動建立多篇草稿文章。"
    );
    if (!ok) return;

    const keywords = [
      "當鋪借款安全嗎",
      "民間借款合法嗎",
      "汽車借款流程",
      "機車借款條件",
      "房屋二胎貸款是什麼",
      "信用貸款利率怎麼算",
      "當鋪利息合法嗎",
      "汽車借款需要什麼資料",
    ];

    setGeneratingBulk(true);
    setErrorMessage("");
    setMessage("");

    try {
      const res = await fetch("/api/admin/generate-articles-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords }),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data?.error || "批量生成失敗");
      }

      const successCount = Number(data?.success_count || 0);
      const failCount = Number(data?.fail_count || 0);

      setMessage(`批量生成完成：成功 ${successCount} 篇，失敗 ${failCount} 篇`);
      await fetchArticles();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "批量生成失敗";
      setErrorMessage(msg);
    } finally {
      setGeneratingBulk(false);
    }
  }

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchSearch =
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.slug.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "published" && article.published) ||
        (filterStatus === "draft" && !article.published);

      return matchSearch && matchStatus;
    });
  }, [articles, search, filterStatus]);

  const totalCount = articles.length;
  const publishedCount = articles.filter((item) => item.published).length;
  const draftCount = articles.filter((item) => !item.published).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            可在這裡新增、編輯、篩選與管理 SEO 文章
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateArticle}
            disabled={generatingSingle || generatingBulk}
            className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400 disabled:text-white"
          >
            {generatingSingle ? "AI生成中..." : "AI生成文章"}
          </button>

          <button
            onClick={generateBulkArticles}
            disabled={generatingBulk || generatingSingle}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:text-white"
          >
            {generatingBulk ? "批量生成中..." : "批量生成SEO文章"}
          </button>

          <Link
            href="/admin/articles/new"
            className="inline-flex items-center rounded-lg bg-[#2f2a25] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
          >
            ＋ 新增文章
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">文章總數</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {totalCount}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">已發布</div>
          <div className="mt-2 text-3xl font-bold text-green-700">
            {publishedCount}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">草稿</div>
          <div className="mt-2 text-3xl font-bold text-amber-600">
            {draftCount}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋文章標題或 slug"
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-400"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-400"
          >
            <option value="all">全部狀態</option>
            <option value="published">已發布</option>
            <option value="draft">草稿</option>
          </select>
        </div>
      </div>

      {message ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b bg-gray-50 px-4 py-3 text-sm text-gray-600">
          目前顯示 {filteredArticles.length} 篇文章
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="border-b">
              <th className="px-4 py-3">標題</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">狀態</th>
              <th className="px-4 py-3">建立時間</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="px-4 py-4">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </td>
                </tr>
              ))
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <tr key={article.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {article.title}
                  </td>

                  <td className="px-4 py-3 text-gray-500">{article.slug}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        article.published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {article.published ? "已發布" : "草稿"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {new Date(article.created_at).toLocaleDateString("zh-TW")}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/admin/articles/edit/${article.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        編輯
                      </Link>

                      <Link
                        href={`/articles/${encodeURIComponent(article.slug)}`}
                        target="_blank"
                        className="text-gray-600 hover:underline"
                      >
                        預覽
                      </Link>

                      <button
                        onClick={() => deleteArticle(article.id)}
                        disabled={deletingId === article.id}
                        className="text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === article.id ? "刪除中..." : "刪除"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="mx-auto max-w-md">
                    <div className="text-base font-semibold text-gray-800">
                      找不到符合條件的文章
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      可以調整搜尋關鍵字或篩選條件，或直接新增一篇新文章。
                    </p>

                    <div className="mt-5 flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSearch("");
                          setFilterStatus("all");
                        }}
                        className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        清除篩選
                      </button>

                      <Link
                        href="/admin/articles/new"
                        className="rounded-lg bg-[#2f2a25] px-4 py-2 text-sm font-medium text-white"
                      >
                        新增文章
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}