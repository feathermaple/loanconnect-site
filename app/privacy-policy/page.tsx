import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策",
  description:
    "了解 本平台 如何蒐集、使用與保護您的個人資料，以及貸款需求評估與媒合服務相關隱私權說明。",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#f8f5ef] text-[#2f2a25]">
      <section className="border-b border-[#e8e1d8] bg-[#fbf8f3]">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
          <div className="mb-4 inline-flex rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-xs font-semibold text-[#7a7269]">
            Privacy Policy
          </div>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            隱私權政策
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#6f675f] md:text-lg">
            本平台 重視您的個人資料與隱私保護。本頁說明本平台在提供貸款需求評估、
            申請表單填寫與相關資訊服務時，如何蒐集、處理、利用及保護您的資料。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <div className="space-y-10 rounded-[32px] border border-[#e8e1d8] bg-white p-8 shadow-sm md:p-10">
          <section>
            <h2 className="text-2xl font-black">一、資料蒐集範圍</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              當您使用本平台填寫貸款需求表單、聯絡我們或使用相關服務時，我們可能蒐集以下資訊：
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-8 text-[#6f675f] md:text-base">
              <li>• 姓名或稱呼</li>
              <li>• 聯絡電話</li>
              <li>• LINE ID 或其他聯繫方式</li>
              <li>• 居住地區、資金需求、申請相關資訊</li>
              <li>• 您主動提供的其他補充內容</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">二、資料使用目的</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              您提供的資料將用於貸款需求評估、聯繫回覆、方案媒合、服務優化、網站營運分析與
              必要之風險控管用途。我們僅在合理且必要的範圍內使用您的資料。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">三、資料保存與保護</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              我們將採取合理的技術與管理措施，保護您的個人資料免於未經授權的存取、竄改、
              洩漏或損毀。資料將依服務需求及法令要求保存於適當期間。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">四、第三方服務</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              本平台可能使用第三方服務進行網站部署、表單通知、資料儲存、流量分析或聯繫功能。
              相關資料處理可能受第三方服務供應商的隱私政策規範。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">五、Cookie 與分析工具</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              本平台可能使用 Cookie 或分析工具，以了解網站使用情形、改善內容體驗與進行流量分析。
              您可依瀏覽器設定管理 Cookie，但部分功能可能因此受到影響。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">六、資料更正與刪除</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              若您希望查詢、更正、刪除或停止使用您提供的個人資料，可透過網站聯絡方式與我們聯繫。
              我們將在合理範圍內協助處理。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">七、政策更新</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              本隱私權政策可能因法令或服務調整而更新，更新後將公布於本頁，不另行個別通知。
              建議您不定期查看以了解最新內容。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">八、聯絡我們</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              若您對本隱私權政策或個人資料使用有任何疑問，請透過網站提供之聯絡方式與我們聯繫。
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}