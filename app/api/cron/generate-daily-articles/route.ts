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

const DAILY_GENERATE_COUNT = 5;
const RECENT_ARTICLE_LOOKBACK = 400;
const RELATED_ARTICLE_FETCH = 80;

const TOPIC_POOL = [
  // 汽車借款
  "汽車借款需要什麼資料",
  "汽車借款需要什麼條件",
  "汽車借款流程完整解析",
  "汽車借款多久會撥款",
  "汽車借款利率怎麼算",
  "汽車借款可以借多少",
  "汽車借款有風險嗎",
  "汽車借款會查聯徵嗎",
  "汽車借款沒繳會怎樣",
  "汽車借款一定要本人嗎",
  "汽車借款可以免留車嗎",
  "汽車借款可以增貸嗎",
  "中古車可以辦汽車借款嗎",
  "汽車借款適合哪些人",
  "汽車借款與信用貸款差在哪",
  "汽車借款與當鋪借款差在哪",
  "汽車借款和民間借款怎麼選",
  "台北汽車借款怎麼找比較安全",
  "新北汽車借款推薦怎麼挑",
  "桃園汽車借款常見問題整理",
  "台中汽車借款流程與條件",
  "台南汽車借款注意事項",
  "高雄汽車借款推薦重點",
  "汽車借款需要保人嗎",
  "汽車借款申請前要注意什麼",

  // 機車借款
  "機車借款需要什麼條件",
  "機車借款需要準備哪些資料",
  "機車借款流程怎麼跑",
  "機車借款利率多少合理",
  "機車借款可以借多少",
  "機車借款多久放款",
  "機車借款一定要有行照嗎",
  "機車借款一定要本人嗎",
  "機車借款會查聯徵嗎",
  "機車借款適合學生嗎",
  "機車借款適合上班族嗎",
  "機車借款風險有哪些",
  "機車借款沒繳會怎樣",
  "機車借款和小額借款哪個適合",
  "機車借款和信用貸款有什麼差別",
  "機車借款可以免留車嗎",
  "老車可以辦機車借款嗎",
  "台北機車借款怎麼挑安全店家",
  "台中機車借款常見問題",
  "高雄機車借款申請指南",
  "機車借款需要保人嗎",
  "機車借款審核重點有哪些",
  "機車借款適合短期周轉嗎",
  "機車借款會影響信用嗎",
  "機車借款前必知的陷阱",

  // 房屋二胎
  "房屋二胎是什麼",
  "房屋二胎貸款條件有哪些",
  "房屋二胎貸款流程完整解析",
  "房屋二胎利率多少合理",
  "房屋二胎可以貸多少",
  "房屋二胎多久撥款",
  "房屋二胎風險有哪些",
  "房屋二胎適合哪些族群",
  "房屋二胎會影響原房貸嗎",
  "房屋二胎需要保人嗎",
  "房屋二胎申請會查聯徵嗎",
  "房屋二胎與信用貸款怎麼選",
  "房屋二胎與民間借款差異",
  "房屋二胎被拒原因有哪些",
  "房屋二胎增貸怎麼評估",
  "台北房屋二胎申請注意事項",
  "台中房屋二胎推薦重點",
  "高雄房屋二胎流程整理",
  "房屋二胎適合債務整合嗎",
  "房屋二胎申請前必知重點",

  // 信用貸款 / 信用瑕疵
  "信用貸款利率怎麼算",
  "信用貸款條件有哪些",
  "信用貸款流程怎麼跑",
  "信用貸款多久撥款",
  "信用貸款適合哪些人",
  "信用不好可以借款嗎",
  "信用瑕疵借款有機會過件嗎",
  "信用不好借款方式有哪些",
  "信用不好借款前要注意什麼",
  "信用不好可以辦小額借款嗎",
  "信用不好可以辦汽車借款嗎",
  "信用不好可以辦房屋二胎嗎",
  "信用不好借款會被詐騙嗎",
  "信用貸款與汽車借款怎麼選",
  "信用貸款與民間借款差在哪",
  "聯徵分數不好還能貸款嗎",
  "有負債還可以借款嗎",
  "有卡債還能申請貸款嗎",
  "無薪轉可以申請信用貸款嗎",
  "信用貸款需要保人嗎",
  "信用貸款審核看什麼",
  "信用貸款常見拒件原因",

  // 民間借款
  "民間借款合法嗎",
  "民間借款安全嗎",
  "民間借款利率怎麼看",
  "民間借款條件有哪些",
  "民間借款流程解析",
  "民間借款多久會放款",
  "民間借款需要保人嗎",
  "民間借款會查聯徵嗎",
  "民間借款適合誰",
  "民間借款和銀行貸款差在哪",
  "民間借款和當鋪借款怎麼選",
  "民間借款會不會遇到高利貸",
  "民間借款風險有哪些",
  "民間借款詐騙怎麼分辨",
  "民間借款簽約前注意事項",
  "台北民間借款推薦怎麼挑",
  "台中民間借款安全重點",
  "高雄民間借款常見問題",
  "民間借款借據要注意什麼",
  "民間借款利息超過多少不合理",

  // 當鋪借款
  "當鋪借款安全嗎",
  "當鋪借款合法嗎",
  "當鋪借款利息怎麼算",
  "當鋪借款流程完整教學",
  "當鋪借款需要什麼條件",
  "當鋪借款需要哪些資料",
  "當鋪借款多久會放款",
  "當鋪借款適合哪些人",
  "當鋪借款可以借多少",
  "當鋪借款會留下紀錄嗎",
  "當鋪借款會查聯徵嗎",
  "當鋪借款和民間借款差在哪",
  "當鋪借款和汽車借款有什麼不同",
  "當鋪借款風險有哪些",
  "當鋪借款沒繳會怎樣",
  "當鋪借款贖回流程怎麼跑",
  "台北當鋪借款怎麼挑合法店家",
  "台中當鋪借款推薦注意事項",
  "高雄當鋪借款常見問題",
  "當鋪利息超過多少要小心",

  // 小額借款 / 手機借款 / 免留車
  "小額借款適合哪些人",
  "小額借款條件有哪些",
  "小額借款流程怎麼跑",
  "小額借款多久下款",
  "小額借款利率怎麼算",
  "小額借款風險有哪些",
  "小額借款該怎麼選平台",
  "小額借款和信用貸款差在哪",
  "手機借款安全嗎",
  "手機借款需要什麼條件",
  "手機借款流程完整解析",
  "手機借款利息怎麼看",
  "手機借款會不會有風險",
  "免留車借款是什麼",
  "免留車借款安全嗎",
  "免留車借款條件有哪些",
  "免留車借款流程怎麼跑",
  "免留車借款利率高嗎",
  "免留車借款適合短期周轉嗎",
  "免留車借款前注意事項",

  // 風險 / 問題型
  "借款前必知的陷阱與注意事項",
  "借款平台怎麼判斷是否安全",
  "怎麼分辨借款詐騙",
  "合法借款公司要怎麼挑",
  "高利貸和合法借款差在哪",
  "借款合約要看哪些重點",
  "借款利息怎麼算才合理",
  "借款前為什麼不能只看快速放款",
  "借款前該準備哪些文件",
  "借款會影響信用嗎",
  "借款會不會查聯徵",
  "借款多久會撥款",
  "借款被拒的原因有哪些",
  "借款需要保人嗎",
  "借款需要薪轉嗎",
  "借款需要工作證明嗎",
  "借款前如何評估自己還款能力",
  "借款前該怎麼比較方案",
  "借款過件後要注意什麼",
  "借款沒繳會面臨哪些風險",

  // 比較型
  "銀行貸款和民間借款怎麼選",
  "銀行貸款和當鋪借款差在哪",
  "信用貸款和汽車借款哪個適合",
  "信用貸款和小額借款怎麼比較",
  "機車借款和信用貸款差別整理",
  "房屋二胎和信用貸款哪個適合周轉",
  "當鋪借款和民間借款哪個比較快",
  "免留車借款和汽車借款差別解析",
  "小額借款和信用卡預借現金怎麼選",
  "短期周轉該選哪種借款方式",

  // 地區型
  "台北借款平台怎麼挑比較安全",
  "新北借款推薦前要注意哪些事",
  "桃園借款申請常見問題",
  "台中借款流程與條件整理",
  "台南借款平台安全判斷指南",
  "高雄借款推薦怎麼選",
  "基隆借款前注意事項",
  "新竹借款方案比較",
  "苗栗借款流程常見疑問",
  "彰化借款安全嗎",
  "南投借款平台怎麼判斷",
  "雲林借款推薦注意重點",
  "嘉義借款申請條件整理",
  "屏東借款流程與風險解析",
  "宜蘭借款平台如何挑選",
  "花蓮借款安全重點",
  "台東借款前必看指南",

  // 長尾型
  "沒有薪轉可以借款嗎",
  "沒有勞保可以貸款嗎",
  "學生可以申請借款嗎",
  "自由業可以借款嗎",
  "家庭主婦可以借款嗎",
  "臨時周轉怎麼找安全借款",
  "急用錢怎麼借比較安全",
  "負債比高還能借款嗎",
  "有遲繳紀錄還能借款嗎",
  "有車但信用不好可以借款嗎",
  "借款會不會影響房貸",
  "借款可以提前清償嗎",
  "借款違約金要注意什麼",
  "借款核准後多久拿到錢",
  "借款顧問是真的還是詐騙",
];

type ExistingArticleSignal = {
  title?: string | null;
  slug?: string | null;
  category?: string | null;
  tags?: string[] | null;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

function shuffleArray<T>(arr: T[]) {
  const cloned = [...arr];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function safeJsonParse(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

function getTopicKeywords(topic: string) {
  const rawKeywords = [
    "汽車借款",
    "機車借款",
    "房屋二胎",
    "信用貸款",
    "信用不好",
    "信用瑕疵",
    "民間借款",
    "當鋪借款",
    "小額借款",
    "手機借款",
    "免留車借款",
    "借款平台",
    "借款詐騙",
    "借款陷阱",
    "借款利率",
    "借款流程",
    "借款條件",
    "台北",
    "新北",
    "桃園",
    "台中",
    "台南",
    "高雄",
    "基隆",
    "新竹",
    "苗栗",
    "彰化",
    "南投",
    "雲林",
    "嘉義",
    "屏東",
    "宜蘭",
    "花蓮",
    "台東",
  ];

  return rawKeywords.filter((kw) => topic.includes(kw));
}

async function getRecentArticleSignals() {
  const { data, error } = await supabase
    .from("articles")
    .select("title, slug, category, tags")
    .order("created_at", { ascending: false })
    .limit(RECENT_ARTICLE_LOOKBACK);

  if (error) throw error;

  return (data ?? []) as ExistingArticleSignal[];
}

function isTopicTooSimilar(topic: string, existingArticles: ExistingArticleSignal[]) {
  const normalizedTopic = normalizeText(topic);
  const topicKeywords = getTopicKeywords(topic);

  for (const article of existingArticles) {
    const normalizedTitle = normalizeText(article.title || "");
    const normalizedSlug = normalizeText(article.slug || "");

    if (
      normalizedTitle.includes(normalizedTopic) ||
      normalizedTopic.includes(normalizedTitle) ||
      normalizedSlug.includes(normalizedTopic)
    ) {
      return true;
    }

    const articleText = `${article.title || ""} ${article.slug || ""} ${article.category || ""} ${(article.tags || []).join(" ")}`;
    const matchedKeywords = topicKeywords.filter((kw) => articleText.includes(kw));

    if (topicKeywords.length >= 2 && matchedKeywords.length >= 2) {
      return true;
    }
  }

  return false;
}

async function pickTopicsForToday(count: number) {
  const existingArticles = await getRecentArticleSignals();
  const shuffled = shuffleArray(TOPIC_POOL);
  const selected: string[] = [];

  for (const topic of shuffled) {
    if (selected.length >= count) break;

    const duplicatedInDb = isTopicTooSimilar(topic, existingArticles);
    const duplicatedInSelected = selected.some(
      (item) => normalizeText(item) === normalizeText(topic)
    );

    if (!duplicatedInDb && !duplicatedInSelected) {
      selected.push(topic);
    }
  }

  if (selected.length < count) {
    for (const topic of shuffled) {
      if (selected.length >= count) break;

      const duplicatedInSelected = selected.some(
        (item) => normalizeText(item) === normalizeText(topic)
      );

      if (!duplicatedInSelected) {
        selected.push(topic);
      }
    }
  }

  return selected.slice(0, count);
}

function buildPrompt(topic: string) {
  return `
你是一位熟悉台灣借款、當鋪、民間借貸、信用貸款與SEO內容策略的專業編輯。
請用繁體中文輸出 JSON，不要加任何前言、解釋、註解，也不要加 markdown code fence。

請嚴格輸出以下格式：
{
  "title": "文章標題",
  "excerpt": "120字內摘要",
  "seo_title": "30~60字，適合Google搜尋結果",
  "seo_description": "70~160字，適合Google搜尋結果",
  "category": "從以下分類擇一：汽車借款、機車借款、房屋二胎、信用貸款、民間借款、當鋪借款、小額借款、借款安全、借款流程、地區借款",
  "tags": ["標籤1", "標籤2", "標籤3", "標籤4"],
  "content": "完整 Markdown 文章內容",
  "faq": [
    { "question": "問題1", "answer": "答案1" },
    { "question": "問題2", "answer": "答案2" },
    { "question": "問題3", "answer": "答案3" },
    { "question": "問題4", "answer": "答案4" }
  ]
}

文章主題：${topic}

文章要求：
1. 內容必須符合台灣使用者搜尋習慣與用字。
2. 文章長度至少 2200 字。
3. 使用 Markdown 格式，必須包含：
   - 一段自然前言
   - 至少 5 個 H2
   - 至少 4 個 H3
   - 一段結論
   - 一段「風險提醒」
4. 文風要自然、專業、像真人撰寫，不要有 AI 腔。
5. 不要捏造精確法規條文、利率數字、保證過件、保證核貸等說法。
6. 可使用「通常」、「常見情況」、「實際仍以審核結果為準」這類較安全描述。
7. 文章中要自然帶入以下 SEO 語意：
   - 條件
   - 流程
   - 利率
   - 風險
   - 注意事項
8. 文章不要只有大綱，要有可讀性與資訊密度。
9. FAQ 必須和主題高度相關，答案具體但不要過度保證。
10. 標題要自然、有搜尋意圖，不要寫得太像廣告。
11. 內文結尾前加一段「如何挑選安全借款管道」或相近提醒段落。
12. 如果主題適合比較，請自然加入比較段落。
13. 如果主題含地區詞，內容要自然帶出台灣在地使用情境。
14. category 必須從指定分類中擇一。
15. tags 必須和主題高度相關，避免太空泛。
`;
}

async function getRelatedSlugs(category: string, tags: string[], currentSlug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("slug, category, tags, created_at")
    .order("created_at", { ascending: false })
    .limit(RELATED_ARTICLE_FETCH);

  if (error) {
    return [];
  }

  const scored = (data ?? [])
    .filter((article) => article.slug && article.slug !== currentSlug)
    .map((article) => {
      let score = 0;

      if (article.category && article.category === category) {
        score += 3;
      }

      const articleTags: string[] = Array.isArray(article.tags) ? article.tags : [];
      const overlap = articleTags.filter((tag) => tags.includes(tag)).length;
      score += overlap * 2;

      return {
        slug: article.slug as string,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.slug);

  return scored;
}

async function generateOneArticle(topic: string) {
  const prompt = buildPrompt(topic);

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
  });

  const raw = res.choices[0]?.message?.content ?? "";
  const parsed = safeJsonParse(raw);

  const finalTitle = parsed.title || topic;
  const slugBase = slugify(finalTitle);
  const slug = `${slugBase}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const category =
    typeof parsed.category === "string" && parsed.category.trim()
      ? parsed.category.trim()
      : "借款安全";

  const tags: string[] =
  Array.isArray(parsed.tags)
    ? parsed.tags
        .filter((tag: unknown): tag is string => typeof tag === "string" && tag.trim().length > 0)
        .map((tag: string) => tag.trim())
        .slice(0, 6)
    : [];

  const relatedSlugs = await getRelatedSlugs(category, tags, slug);

  const { error } = await supabase.from("articles").insert([
    {
      title: finalTitle,
      slug,
      excerpt: parsed.excerpt || "",
      content: parsed.content || "",
      seo_title: parsed.seo_title || finalTitle,
      seo_description: parsed.seo_description || parsed.excerpt || "",
      faq: Array.isArray(parsed.faq) ? parsed.faq : [],
      category,
      tags,
      related_slugs: relatedSlugs,
      published: true,
    },
  ]);

  if (error) {
    throw error;
  }

  return {
    topic,
    title: finalTitle,
    slug,
    category,
    tags,
    relatedSlugs,
  };
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const topics = await pickTopicsForToday(DAILY_GENERATE_COUNT);

    const results: Array<{
      topic: string;
      success: boolean;
      title?: string;
      slug?: string;
      category?: string;
      tags?: string[];
      relatedSlugs?: string[];
      error?: string;
    }> = [];

    for (const topic of topics) {
      try {
        const result = await generateOneArticle(topic);
        results.push({
          topic,
          success: true,
          title: result.title,
          slug: result.slug,
          category: result.category,
          tags: result.tags,
          relatedSlugs: result.relatedSlugs,
        });
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
      pickedTopics: topics,
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