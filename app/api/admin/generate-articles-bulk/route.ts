import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeJsonParse(text: string) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("AI 回傳格式不是有效 JSON");
    }
    return JSON.parse(match[0]);
  }
}

type ParsedArticle = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  faq?: Array<{
    question?: string;
    answer?: string;
  }>;
};

async function generateSingleArticle(keyword: string) {
  const prompt = `
你是一位熟悉台灣貸款、借款、融資、當鋪、民間借款、汽機車借款、房屋二胎、信用貸款與 SEO 內容行銷的專業編輯。

請根據以下主題，產出一篇適合台灣貸款網站使用的高品質 SEO 文章：

主題：
${keyword}

請嚴格遵守以下要求：

1. 使用繁體中文
2. 文章長度約 1800～2200 字
3. 內容需符合台灣貸款市場語境，讓一般使用者也能看懂
4. 語氣專業、清楚、可信，不要空泛，不要太像廣告文
5. 文章需有完整 SEO 結構，適合知識型文章頁
6. 內容需包含實用資訊，例如申請條件、常見流程、注意事項、風險提醒、適合族群、常見問題
7. 標題要自然，像真實使用者會搜尋的主題
8. slug 請輸出英文或英文連字號格式，適合作為網址
9. excerpt 請控制在 60～120 字左右
10. seo_title 請適合搜尋結果顯示
11. seo_description 請適合搜尋結果摘要，約 70～160 字
12. content 內文請使用 Markdown 標題格式，例如：
## 大標題
### 小標題
13. 不要捏造法規、不要保證過件、不要誇大不實
14. 若提到利率、費用、額度或條件，需提醒仍以實際店家與審核結果為準
15. FAQ 請產生 3～5 組，內容貼近真實搜尋意圖

文章格式請嚴格輸出為 JSON，不能有多餘文字，格式如下：

{
  "title": "文章標題",
  "slug": "english-slug",
  "excerpt": "文章摘要",
  "content": "完整文章內容，請用段落與 H2/H3 形式",
  "seo_title": "SEO標題",
  "seo_description": "SEO描述",
  "faq": [
    {
      "question": "問題1",
      "answer": "答案1"
    }
  ]
}

不要輸出 markdown code block，不要加任何額外說明，直接輸出 JSON。
`.trim();

  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: prompt,
  });

  const text = response.output_text?.trim();

  if (!text) {
    throw new Error(`AI 沒有回傳內容：${keyword}`);
  }

  const parsed = safeJsonParse(text) as ParsedArticle;

  const faq = Array.isArray(parsed.faq)
    ? parsed.faq
        .map((item) => ({
          question: String(item?.question || "").trim(),
          answer: String(item?.answer || "").trim(),
        }))
        .filter((item) => item.question && item.answer)
        .slice(0, 5)
    : [];

  const fallbackSlug = slugify(keyword) || `article-${Date.now()}`;

  return {
    title: parsed.title?.trim() || keyword,
    slug: parsed.slug?.trim() || fallbackSlug,
    excerpt: parsed.excerpt?.trim() || `${keyword}重點整理與申請注意事項說明。`,
    content:
      parsed.content?.trim() ||
      `## ${keyword}\n\n目前暫時無法取得完整文章內容，請稍後再試。`,
    seo_title: parsed.seo_title?.trim() || parsed.title?.trim() || keyword,
    seo_description:
      parsed.seo_description?.trim() ||
      parsed.excerpt?.trim() ||
      `${keyword}相關重點整理，包含申請條件、流程、注意事項與常見問題。`,
    faq,
    published: false,
  };
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "尚未設定 OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "尚未設定 SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const keywords = Array.isArray(body?.keywords)
      ? body.keywords.map((item: unknown) => String(item || "").trim()).filter(Boolean)
      : [];

    if (!keywords.length) {
      return NextResponse.json({ error: "缺少 keywords" }, { status: 400 });
    }

    const results: Array<{
      keyword: string;
      success: boolean;
      article?: any;
      error?: string;
    }> = [];

    for (const keyword of keywords) {
      try {
        const article = await generateSingleArticle(keyword);

        const { data: existing } = await supabase
          .from("articles")
          .select("id")
          .eq("slug", article.slug)
          .maybeSingle();

        let finalSlug = article.slug;

        if (existing) {
          finalSlug = `${article.slug}-${Date.now()}`;
        }

        const insertPayload = {
          title: article.title,
          slug: finalSlug,
          excerpt: article.excerpt,
          content: article.content,
          seo_title: article.seo_title,
          seo_description: article.seo_description,
          published: false,
        };

        const { data: inserted, error: insertError } = await supabase
          .from("articles")
          .insert([insertPayload])
          .select("id, title, slug")
          .single();

        if (insertError) {
          throw new Error(insertError.message);
        }

        results.push({
          keyword,
          success: true,
          article: {
            ...inserted,
            faq: article.faq,
          },
        });
      } catch (error) {
        results.push({
          keyword,
          success: false,
          error: error instanceof Error ? error.message : "生成失敗",
        });
      }
    }

    return NextResponse.json({
      success: true,
      total: keywords.length,
      success_count: results.filter((item) => item.success).length,
      fail_count: results.filter((item) => !item.success).length,
      results,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "伺服器發生未知錯誤";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}