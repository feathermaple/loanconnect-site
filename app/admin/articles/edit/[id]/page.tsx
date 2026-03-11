"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  faq?: FAQItem[] | null;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminEditArticlePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [faq, setFaq] = useState<FAQItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!params?.id) return;
    fetchArticle(params.id);
  }, [params?.id]);

  async function fetchArticle(id: string) {
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single<ArticleRow>();

    if (error || !data) {
      setErrorMessage(error?.message || "讀取文章失敗");
      setLoading(false);
      return;
    }

    setTitle(data.title || "");
    setSlug(data.slug || "");
    setExcerpt(data.excerpt || "");
    setContent(data.content || "");
    setCoverImage(data.cover_image || "");
    setSeoTitle(data.seo_title || "");
    setSeoDescription(data.seo_description || "");
    setPublished(Boolean(data.published));

    if (Array.isArray(data.faq)) {
      setFaq(
        data.faq.map((item) => ({
          question: String(item?.question || ""),
          answer: String(item?.answer || ""),
        }))
      );
    } else {
      setFaq([]);
    }

    setLoading(false);
  }

  const readingTime = useMemo(() => {
    const length = content.trim().length;
    if (!length) return "0 分鐘閱讀";
    return `${Math.max(1, Math.ceil(length / 500))} 分鐘閱讀`;
  }, [content]);

  function addFaqItem() {
    setFaq((prev) => [...prev, { question: "", answer: "" }]);
  }

  function updateFaqItem(
    index: number,
    field: keyof FAQItem,
    value: string
  ) {
    setFaq((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function removeFaqItem(index: number) {
    setFaq((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!params?.id) return;

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const cleanedFaq = faq
      .map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }))
      .filter((item) => item.question && item.answer);

    try {
      const basePayload = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        cover_image: coverImage.trim() || null,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        published,
      };

      if (!basePayload.title) {
        throw new Error("請輸入文章標題");
      }

      if (!basePayload.slug) {
        throw new Error("請輸入文章 slug");
      }

      if (!basePayload.content) {
        throw new Error("請輸入文章內容");
      }

      let updateError: any = null;

      const withFaqPayload = {
        ...basePayload,
        faq: cleanedFaq.length > 0 ? cleanedFaq : null,
      };

      const { error: firstError } = await supabase
        .from("articles")
        .update(withFaqPayload)
        .eq("id", params.id);

      updateError = firstError;

      if (
        updateError &&
        typeof updateError.message === "string" &&
        updateError.message.toLowerCase().includes("faq")
      ) {
        const { error: fallbackError } = await supabase
          .from("articles")
          .update(basePayload)
          .eq("id", params.id);

        updateError = fallbackError ?? null;
      }

      if (updateError) {
        throw new Error(updateError.message || "更新文章失敗");
      }

      setMessage("文章更新成功");
      setTimeout(() => {
        router.push("/admin/articles");
      }, 800);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "更新文章失敗";
      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
          <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-100" />
          <div className="mt-4 h-40 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link
            href="/admin/articles"
            className="inline-flex items-center rounded-lg border px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            ← 返回文章管理
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">編輯文章</h1>
          <p className="mt-1 text-sm text-gray-500">
            可調整內容、SEO 欄位與 FAQ 後重新儲存。
          </p>
        </div>

        <div className="rounded-xl border bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
          預估閱讀時間：<span className="font-semibold">{readingTime}</span>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">基本資料</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                文章標題 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                摘要 Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                封面圖片 URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                文章內容 *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={22}
                className="w-full rounded-lg border px-4 py-3 text-sm leading-7 outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">SEO 設定</h2>

          <div className="mt-5 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                SEO Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                SEO Description
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">FAQ 常見問題</h2>
              <p className="mt-1 text-sm text-gray-500">
                可調整文章的 FAQ，前台可搭配 FAQ schema 使用。
              </p>
            </div>

            <button
              type="button"
              onClick={addFaqItem}
              className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              ＋ 新增 FAQ
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {faq.length > 0 ? (
              faq.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="grid gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        問題 {index + 1}
                      </label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) =>
                          updateFaqItem(index, "question", e.target.value)
                        }
                        className="w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        答案 {index + 1}
                      </label>
                      <textarea
                        value={item.answer}
                        onChange={(e) =>
                          updateFaqItem(index, "answer", e.target.value)
                        }
                        rows={4}
                        className="w-full rounded-lg border bg-white px-4 py-3 text-sm leading-7 outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => removeFaqItem(index)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        刪除這組 FAQ
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                目前沒有 FAQ，可手動新增。
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="published" className="text-sm text-gray-700">
              已發布
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-[#2f2a25] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "儲存中..." : "更新文章"}
          </button>

          <Link
            href="/admin/articles"
            className="inline-flex items-center rounded-lg border px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            取消返回
          </Link>
        </div>
      </form>
    </div>
  );
}