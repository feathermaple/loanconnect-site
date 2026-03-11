import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("AI 回傳內容不是合法 JSON");
  }
  return JSON.parse(match[0]);
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "缺少 OPENAI_API_KEY，請先設定環境變數" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const keyword = String(body?.keyword || "").trim();
    const city = String(body?.city || "").trim();
    const loanType = String(body?.loanType || "").trim();
    const audience = String(body?.audience || "").trim();

    if (!keyword) {
      return NextResponse.json(
        { error: "請提供 keyword" },
        { status: 400 }
      );
    }

    const topicText = [
      city ? `地區：${city}` : "",
      loanType ? `貸款類型：${loanType}` : "",
      audience ? `目標客群：${audience}` : "",
      `核心關鍵字：${keyword}`,
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `
你是一位熟悉台灣借款、貸款、融資、當鋪、汽機車借款、房屋二胎、信用貸款、民間借款 SEO 的內容編輯。

請根據以下需求，產出一篇適合網站知識專區 / SEO 文章使用的內容，並且只回傳 JSON，不要加上 Markdown，不要加註解，不要加前言。

需求如下：
${topicText}

請回傳以下 JSON 結構：
{
  "title": "文章標題",
  "slug": "英文或拼音短網址，可含連字號",
  "excerpt": "120字內摘要",
  "metaTitle": "60字內 SEO 標題",
  "metaDescription": "160字內 SEO 描述",
  "heroTitle": "頁面主標",
  "heroDescription": "頁面副標",
  "content": "完整 HTML 文章內容，需包含 h2、h3、p、ul、li，內容至少 1800 字，繁體中文，實用、可信、可讀性高，避免誇大違規承諾",
  "faq": [
    {
      "question": "問題1",
      "answer": "答案1"
    },
    {
      "question": "問題2",
      "answer": "答案2"
    },
    {
      "question": "問題3",
      "answer": "答案3"
    }
  ],
  "keywords": ["關鍵字1", "關鍵字2", "關鍵字3", "關鍵字4", "關鍵字5"]
}

內容要求：
1. 使用繁體中文
2. 風格專業、清楚、偏轉單導向，但不要太像廣告
3. 文章內自然帶入 SEO 關鍵字
4. FAQ 要貼近真實搜尋意圖
5. content 請直接輸出可放進頁面的 HTML 字串
6. 若有地區，請自然融入內容
7. 若有貸款類型，請聚焦該主題
8. slug 若模型沒有產好，仍請盡量給英文短網址
`;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: prompt,
    });

    const text = (response as any).output_text || "";
    const parsed = extractJson(text);

    const finalTitle = String(parsed.title || keyword).trim();
    const finalSlug =
      String(parsed.slug || "").trim() || slugify(finalTitle || keyword);

    return NextResponse.json({
      ok: true,
      article: {
        title: finalTitle,
        slug: finalSlug,
        excerpt: String(parsed.excerpt || "").trim(),
        metaTitle: String(parsed.metaTitle || finalTitle).trim(),
        metaDescription: String(parsed.metaDescription || "").trim(),
        heroTitle: String(parsed.heroTitle || finalTitle).trim(),
        heroDescription: String(parsed.heroDescription || "").trim(),
        content: String(parsed.content || "").trim(),
        faq: Array.isArray(parsed.faq) ? parsed.faq : [],
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      },
    });
  } catch (error: any) {
    console.error("AI generate article error:", error);

    return NextResponse.json(
      {
        error: error?.message || "AI 文章生成失敗",
      },
      { status: 500 }
    );
  }
}