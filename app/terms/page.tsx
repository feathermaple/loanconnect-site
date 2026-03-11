import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "服務條款",
  description:
    "了解 本平台 網站使用規範、服務內容、責任限制與相關條款說明。",
};

export default function TermsPage() {
  return (
    <main className="bg-[#f8f5ef] text-[#2f2a25]">
      <section className="border-b border-[#e8e1d8] bg-[#fbf8f3]">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
          <div className="mb-4 inline-flex rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-xs font-semibold text-[#7a7269]">
            Terms of Service
          </div>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            服務條款
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#6f675f] md:text-lg">
            歡迎使用 本平台。本網站提供貸款需求評估、資訊整理與媒合相關服務。
            當您使用本網站時，即表示您已閱讀、了解並同意遵守以下條款。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <div className="space-y-10 rounded-[32px] border border-[#e8e1d8] bg-white p-8 shadow-sm md:p-10">
          <section>
            <h2 className="text-2xl font-black">一、服務內容</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              本平台 提供貸款需求評估、貸款資訊整理、線上表單填寫與媒合服務。
              本網站並非保證核貸之金融機構，實際貸款結果仍需依相關單位或合作方審核。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">二、使用者義務</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              使用者應提供真實、正確且完整的資料，不得冒用他人身分、提供虛假資訊、
              或進行任何違法、詐欺、干擾網站運作之行為。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">三、服務限制</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              本網站提供之資訊僅供一般參考，並不構成任何保證、承諾或金融建議。
              實際貸款額度、利率、期數、費用與核准結果，均應以最終審核內容為準。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">四、智慧財產權</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              本網站之文字、設計、版面、圖像與相關內容，除另有說明外，
              均受相關智慧財產權保護。未經授權，不得任意重製、修改、散布或作其他商業用途。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">五、責任限制</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              因網路環境、系統維護、第三方服務異常或其他不可抗力因素所造成之中斷、
              延遲或資料錯誤，本網站將盡力維持服務穩定，但不保證完全無中斷或無錯誤。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">六、條款修改</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              本網站有權視需求調整或更新本服務條款，更新後將公告於本頁。
              您於條款更新後持續使用本網站，即視為同意最新版本內容。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">七、聯絡方式</h2>
            <p className="mt-4 text-sm leading-8 text-[#6f675f] md:text-base">
              若您對本服務條款有任何疑問，請透過網站提供之聯絡方式與我們聯繫。
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}