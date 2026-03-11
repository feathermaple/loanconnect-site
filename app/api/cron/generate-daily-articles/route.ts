import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_TOPICS = [
  "汽車借款需要什麼資料",
  "汽車借款安全嗎",
  "機車借款條件有哪些",
  "機車借款流程怎麼跑",
  "房屋二胎貸款是什麼",
  "房屋二胎貸款風險有哪些",
  "民間借款合法嗎",
  "民間借款安全嗎",
  "當鋪借款利息怎麼算",
  "當鋪借款需要什麼條件",
  "信用貸款利率怎麼算",
  "信用不好可以借款嗎",
  "小額借款適合哪些人",
  "小額借款申請會看什麼",
  "手機借款安全嗎",
  "免留車借款是什麼",
  "汽車借款沒繳會怎樣",
  "機車借款一定要本人嗎",
  "借款前要注意哪些陷阱",
  "借款平台怎麼判斷是否安全",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function pickFiveTopics() {
  const shuffled = [...BASE_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

async function generateOneArticle(topic: string) {
  const prompt = `
你是台灣貸款與當鋪SEO內容專家。
請用繁體中文輸出 JSON，不要加任何說明文字，不要加 markdown code fence。

欄位格式：
{
  "title": "文章標題",
  "excerpt": "120字內摘要",
  "seo_title": "適合Google搜尋的標題，30~60字",
  "seo_description": "適合Google搜尋的描述，70~160字",
  "content": "完整文章內容，使用 Markdown，至少 1800 字，需有清楚 H2/H3 結構",
  "faq": [
    { "question": "問題1", "answer": "答案1" },
    { "question": "問題2", "answer": "答案2" },
    { "question": "問題3", "answer": "答案3" }
  ]
}

文章主題：${topic}

要求：
1. 內容要符合台灣使用者搜尋習慣
2. 不要亂寫法規數字，避免過度保證
3. 文章要自然、像真人寫的
4. 文末加一段風險提醒
5. FAQ 要和主題高度相關
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  const raw = res.choices[0]?.message?.content ?? "";

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  const slugBase = slugify(parsed.title || topic);
  const slug = `${slugBase}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const { error } = await supabase.from("articles").insert([
    {
      title: parsed.title || topic,
      slug,
      excerpt: parsed.excerpt || "",
      content: parsed.content || "",
      seo_title: parsed.seo_title || parsed.title || topic,
      seo_description: parsed.seo_description || parsed.excerpt || "",
      faq: parsed.faq || [],
      published: true,
    },
  ]);

  if (error) {
    throw error;
  }

  return {
    title: parsed.title || topic,
    slug,
  };
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const topics = pickFiveTopics();
    const results = [];

    for (const topic of topics) {
      try {
        const result = await generateOneArticle(topic);
        results.push({ topic, success: true, ...result });
      } catch (error) {
        results.push({
          topic,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      generatedCount: results.filter((r) => r.success).length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}