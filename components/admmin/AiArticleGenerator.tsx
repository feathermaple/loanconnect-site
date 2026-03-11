"use client";

import { useState } from "react";

type GeneratedArticle = {
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroDescription: string;
  content: string;
  faq: { question: string; answer: string }[];
  keywords: string[];
};

export default function AiArticleGenerator() {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [loanType, setLoanType] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedArticle | null>(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await fetch("/app/api/ai/generate-article".replace("/app", ""), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword,
          city,
          loanType,
          audience,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "生成失敗");
      }

      setResult(data.article);
    } catch (err: any) {
      setError(err?.message || "生成失敗");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("已複製");
    } catch {
      alert("複製失敗，請手動複製");
    }
  }

  function copyJson() {
    if (!result) return;
    copyText(JSON.stringify(result, null, 2));
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-neutral-900">
          🤖 AI 生成貸款 SEO 文章
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          輸入關鍵字後，會自動生成標題、slug、摘要、meta、FAQ 與完整文章內容。
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            核心關鍵字 *
          </label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例如：台中當鋪借款"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            地區
          </label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="例如：台中"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            貸款類型
          </label>
          <input
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            placeholder="例如：汽車借款、房屋二胎"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            目標客群
          </label>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="例如：信用瑕疵族群、急需周轉者"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-500"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !keyword.trim()}
          className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "AI 生成中..." : "生成文章"}
        </button>

        {result ? (
          <button
            type="button"
            onClick={copyJson}
            className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
          >
            複製 JSON 結果
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-neutral-200 p-4">
            <div className="mb-2 text-sm font-semibold text-neutral-500">標題</div>
            <div className="text-lg font-bold text-neutral-900">{result.title}</div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 p-4">
              <div className="mb-2 text-sm font-semibold text-neutral-500">Slug</div>
              <div className="break-all text-sm text-neutral-800">{result.slug}</div>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-4">
              <div className="mb-2 text-sm font-semibold text-neutral-500">關鍵字</div>
              <div className="text-sm text-neutral-800">
                {result.keywords?.join("、") || "—"}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-4">
            <div className="mb-2 text-sm font-semibold text-neutral-500">摘要</div>
            <div className="text-sm leading-7 text-neutral-800">{result.excerpt}</div>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-4">
            <div className="mb-2 text-sm font-semibold text-neutral-500">Meta Title</div>
            <div className="text-sm text-neutral-800">{result.metaTitle}</div>
            <div className="mb-2 mt-4 text-sm font-semibold text-neutral-500">
              Meta Description
            </div>
            <div className="text-sm leading-7 text-neutral-800">
              {result.metaDescription}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-4">
            <div className="mb-2 text-sm font-semibold text-neutral-500">FAQ</div>
            <div className="space-y-3">
              {result.faq?.length ? (
                result.faq.map((item, index) => (
                  <div key={index} className="rounded-xl bg-neutral-50 p-3">
                    <div className="font-semibold text-neutral-900">
                      Q：{item.question}
                    </div>
                    <div className="mt-1 text-sm leading-7 text-neutral-700">
                      A：{item.answer}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-neutral-500">沒有 FAQ</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-neutral-500">文章內容 HTML</div>
              <button
                type="button"
                onClick={() => copyText(result.content)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                複製內容
              </button>
            </div>

            <textarea
              value={result.content}
              readOnly
              className="min-h-[420px] w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm leading-7 text-neutral-800 outline-none"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}