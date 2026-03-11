"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type FAQItem = {
  question: string;
  answer: string;
};

type GeneratedArticle = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  faqs?: FAQItem[];
  faq?: FAQItem[];
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

export default function AdminNewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);
  const [faq, setFaq] = useState<FAQItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("generated_article_text");
      const keyword = sessionStorage.getItem("generated_article_keyword") || "";

      if (raw) {
        let parsed: any = null;

        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = null;
        }

        const article: GeneratedArticle | null =
          parsed?.article && typeof parsed.article === "object"
            ? parsed.article
            : null;

        if (article) {
          const nextTitle = String(article.title || keyword || "").trim();
          const nextSlug = String(article.slug || "").trim();
          const nextExcerpt = String(article.excerpt || "").trim();
          const nextContent = String(article.content || "").trim();
          const nextSeoTitle = String(
            article.seo_title || article.title || keyword || ""
          ).trim();
          const nextSeoDescription = String(
            article.seo_description || article.excerpt || ""
          ).trim();

          setTitle(nextTitle);
          setSlug(nextSlug || slugify(nextTitle || keyword));
          setExcerpt(nextExcerpt);
          setContent(nextContent);
          setSeoTitle(nextSeoTitle);
          setSeoDescription(nextSeoDescription);

          const incomingFaqs = Array.isArray(article.faqs)
            ? article.faqs
            : Array.isArray(article.faq)
            ? article.faq
            : [];

          if (incomingFaqs.length > 0) {
            setFaq(
              incomingFaqs
                .map((item) => ({
                  question: String(item?.question || "").trim(),
                  answer: String(item?.answer || "").trim(),
                }))
                .filter((item) => item.question || item.answer)
            );
          }
        } else if (keyword) {
          setTitle(keyword);
          setSlug(slugify(keyword));
        }
      } else if (keyword) {
        setTitle(keyword);
        setSlug(slugify(keyword));
      }

      sessionStorage.removeItem("generated_article_text");
      sessionStorage.removeItem("generated_article_keyword");
    } catch {
      // sessionStorage 不可用時略過
    } finally {
      setPageReady(true);
    }
  }, []);

  const readingTime = useMemo(() => {
    const length = content.trim().length;
    if (!length) return "0 分鐘閱讀";
    return `${Math.max(1, Math.ceil(length / 500))} 分鐘閱讀`;
  }, [content]);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug.trim()) {
      setSlug(slugify(value));
    }

    if (!seoTitle.trim()) {
      setSeoTitle(value);
    }
  }

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

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const cleanedFaq = faq
      .map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }))
      .filter((item) => item.question && item.answer);

    try {
      const finalTitle = title.trim();
      const finalSlug = slug.trim();
      const finalContent = content.trim();

      if (!finalTitle) {
        throw new Error("請輸入文章標題");
      }

      if (!finalSlug) {
        throw new Error("請輸入文章 slug");
      }

      if (!finalContent) {
        throw new Error("請輸入文章內容");
      }

      const basePayload = {
        title: finalTitle,
        slug: finalSlug,
        excerpt: excerpt.trim() || null,
        content: finalContent,
        cover_image: coverImage.trim() || null,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        published,
      };

      let insertError: any = null;

      // 優先嘗試新的 faqs 欄位
      const withFaqsPayload = {
        ...basePayload,
        faqs: cleanedFaq.length > 0 ? cleanedFaq : null,
      };

      const { error: faqsError } = await supabase
        .from("articles")
        .insert([withFaqsPayload]);

      insertError = faqsError ?? null;

      // 若資料表還沒有 faqs 欄位，嘗試舊 faq 欄位
      if (
        insertError &&
        typeof insertError.message === "string" &&
        insertError.message.toLowerCase().includes("faqs")
      ) {
        const withFaqPayload = {
          ...basePayload,
          faq: cleanedFaq.length > 0 ? cleanedFaq : null,
        };

        const { error: faqError } = await supabase
          .from("articles")
          .insert([withFaqPayload as any]);

        insertError = faqError ?? null;
      }

      // 若連 faq 欄位也沒有，就只存主體文章，避免整體失敗
      if (
        insertError &&
        typeof insertError.message === "string" &&
        insertError.message.toLowerCase().includes("faq")
      ) {
        const { error: fallbackError } = await supabase
          .from("articles")
          .insert([basePayload]);

        insertError = fallbackError ?? null;
      }

      if (insertError) {
        if (
          typeof insertError.message === "string" &&
          insertError.message.toLowerCase().includes("duplicate")
        ) {
          throw new Error("這個 slug 已經存在，請更換一個 slug");
        }

        throw new Error(insertError.message || "新增文章失敗");
      }

      setMessage("文章新增成功");
      setTimeout(() => {
        router.push("/admin/articles");
      }, 800);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "新增文章失敗";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  if (!pageReady) {
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

          <h1 className="mt-4 text-2xl font-bold text-gray-900">新增文章</h1>
          <p className="mt-1 text-sm text-gray-500">
            可手動建立文章，或承接 AI 生成後自動帶入的內容。
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
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="例如：民間借款安全嗎？申請前必看重點整理"
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
                placeholder="例如：private-loan-safety-guide"
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
                placeholder="文章摘要，會用於列表頁與 SEO 描述輔助"
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
                placeholder="https://..."
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
                placeholder="請輸入文章內容，可使用 ##、### 作為段落標題"
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
                placeholder="建議 60 字內"
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
                placeholder="建議 160 字內"
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
                AI 生成的 FAQ 會自動帶入，你也可以手動調整後再儲存。
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
                        placeholder="例如：信用不好可以申請民間借款嗎？"
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
                        placeholder="請輸入 FAQ 答案"
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
                目前沒有 FAQ。可手動新增，或先從文章管理頁使用 AI 生成文章。
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
              儲存後立即發布
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-[#2f2a25] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "儲存中..." : "儲存文章"}
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