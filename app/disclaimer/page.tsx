import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "費用與風險揭露",
  description:
    "了解貸款相關費用、利率計算方式與可能風險，本平台 提供透明資訊說明。",
};

export default function RiskPage() {
  return (
    <main className="bg-[#f8f5ef] text-[#2f2a25]">
      <section className="border-b border-[#e8e1d8] bg-[#fbf8f3]">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
          <div className="mb-4 inline-flex rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-xs font-semibold text-[#7a7269]">
            Risk Disclosure
          </div>

          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            費用與風險揭露
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#6f675f] md:text-lg">
            在申請貸款前，建議您充分了解貸款條件、利率計算方式與可能產生的費用與風險。
            本平台 提供資訊與需求媒合服務，實際貸款條件仍以審核結果為準。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <div className="space-y-10 rounded-[32px] border border-[#e8e1d8] bg-white p-8 shadow-sm md:p-10">

          <section>
            <h2 className="text-2xl font-black">一、利率說明</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              貸款利率會依申請人信用條件、收入狀況、負債比例與申請方案不同而有所差異。
              實際利率與貸款條件需依合作機構審核結果為準。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">二、可能產生的費用</h2>
            <ul className="mt-4 space-y-2 text-sm leading-8 text-[#6f675f] md:text-base">
              <li>• 開辦費或手續費</li>
              <li>• 帳戶管理費</li>
              <li>• 提前清償相關費用</li>
              <li>• 其他依貸款方案可能產生的費用</li>
            </ul>
            <p className="mt-3 text-sm text-[#6f675f]">
              實際費用內容會在申請流程或審核過程中提供完整說明。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">三、還款責任</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              申請貸款前，請確認自身還款能力並妥善規劃財務。
              若未能依約定時間償還貸款，可能會產生違約金、額外費用或影響個人信用紀錄。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">四、貸款風險提醒</h2>
            <ul className="mt-4 space-y-2 text-sm leading-8 text-[#6f675f] md:text-base">
              <li>• 借款前應審慎評估自身財務能力</li>
              <li>• 貸款條件可能依個人信用狀況而有所不同</li>
              <li>• 過度借貸可能造成財務負擔</li>
              <li>• 建議詳細閱讀所有貸款合約條款</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">五、媒合服務說明</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              本平台 為貸款需求資訊媒合平台，
              提供貸款資訊整理與需求評估服務，
              並非直接放款機構。最終貸款條件與審核結果，
              仍由合作機構或相關單位決定。
            </p>
          </section>

        </div>
      </section>
    </main>
  );
}