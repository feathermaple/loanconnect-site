import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

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

type FAQItem = {
  question?: string;
  answer?: string;
};

type ParsedArticle = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  faqs?: FAQItem[];
  faq?: FAQItem[];
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const keyword = String(body?.keyword || "").trim();

    if (!keyword) {
      return NextResponse.json({ error: "缺少 keyword" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "尚未設定 OPENAI_API_KEY" },
        { status: 500 }
      );
    }

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
10. seo_title 請適合搜尋結果顯示，長度自然
11. seo_description 請適合搜尋結果摘要，約 70～160 字
12. content 內文請使用 Markdown 標題格式，例如：
## 大標題
### 小標題
13. 不要捏造法規、不要保證過件、不要誇大不實
14. 如果主題涉及風險、利率、費用、條件，請提醒使用者仍需依實際店家、方案與審核結果為準
15. FAQ 請產生 3～5 組，內容要貼近真實搜尋意圖
16. FAQ 的問題要自然，像是使用者真的會搜尋的問題
17. FAQ 的答案要簡潔清楚，但不能過短
18. FAQ 請另外輸出成 JSON 陣列欄位 faqs，不要只寫在 content 裡

文章建議結構：
- 開頭前言
- ## 這個主題是什麼 / 基本觀念
- ## 適合哪些人
- ## 申請條件或常見流程
- ## 注意事項 / 風險提醒
- ## 如何提高申請成功率或判斷是否適合
- ## 結語
- FAQ

文章格式請嚴格輸出為 JSON，不能有多餘說明文字，格式如下：

{
  "title": "文章標題",
  "slug": "english-slug",
  "excerpt": "文章摘要",
  "content": "完整文章內容，請用段落與 H2/H3 形式，例如：## 標題、### 小標題",
  "seo_title": "SEO標題",
  "seo_description": "SEO描述",
  "faqs": [
    {
      "question": "問題1",
      "answer": "答案1"
    },
    {
      "question": "問題2",
      "answer": "答案2"
    }
  ]
}

不要輸出 markdown code block，不要加任何額外說明，不要加前言，不要說明你做了什麼，直接輸出 JSON。
`.trim();

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt,
    });

    const text = response.output_text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "AI 沒有回傳內容" },
        { status: 500 }
      );
    }

    let parsed: ParsedArticle;

    try {
      parsed = safeJsonParse(text);
    } catch {
      return NextResponse.json(
        {
          error: "AI 回傳格式不是有效 JSON",
          raw: text,
        },
        { status: 500 }
      );
    }

    const rawFaqs = Array.isArray(parsed.faqs)
      ? parsed.faqs
      : Array.isArray(parsed.faq)
      ? parsed.faq
      : [];

    const faqs = rawFaqs
      .map((item) => ({
        question: String(item?.question || "").trim(),
        answer: String(item?.answer || "").trim(),
      }))
      .filter((item) => item.question && item.answer)
      .slice(0, 5);

    const fallbackSlug = slugify(keyword) || `article-${Date.now()}`;

    const result = {
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
      faqs,
      faq: faqs,
    };

    return NextResponse.json({
      text,
      article: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "伺服器發生未知錯誤";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}