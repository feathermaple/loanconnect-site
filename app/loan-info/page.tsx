import Link from "next/link";

export default function LoanInfoPage() {
  return (
    <main className="bg-[#f8f5ef] text-[#2f2a25]">
      <section className="border-b border-[#e8e1d8] bg-[#fbf8f3]">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <div className="mb-4 inline-flex rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-xs font-semibold text-[#7a7269]">
            貸款條件說明
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#2f2a25] md:text-5xl">
            貸款利率、期數與申請條件說明
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#6f675f] md:text-lg">
            LoanConnect 提供信用貸款、整合負債與資金需求媒合服務。
            實際核准額度、利率與費用，會依個人信用條件、收入狀況與負債比而有所不同。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm">
            <div className="text-sm text-[#8a8178]">貸款金額</div>
            <div className="mt-2 text-2xl font-black text-[#2f2a25]">
              3 萬 ～ 100 萬
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6f675f]">
              實際額度依信用條件、收入證明與審核結果為準。
            </p>
          </div>

          <div className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm">
            <div className="text-sm text-[#8a8178]">還款期數</div>
            <div className="mt-2 text-2xl font-black text-[#2f2a25]">
              3 期 ～ 60 期
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6f675f]">
              可依借款方案與個人財務規劃選擇適合期數。
            </p>
          </div>

          <div className="rounded-[28px] border border-[#e8e1d8] bg-white p-6 shadow-sm">
            <div className="text-sm text-[#8a8178]">利率範圍</div>
            <div className="mt-2 text-2xl font-black text-[#2f2a25]">
              依方案評估
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6f675f]">
              實際利率會依申請人條件、方案內容與貸款機構審核結果而定。
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e8e1d8] bg-[#fcfaf7]">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-[32px] border border-[#e8e1d8] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black text-[#2f2a25]">
                常見申請條件
              </h2>

              <ul className="mt-6 space-y-4 text-sm leading-7 text-[#6f675f]">
                <li>• 年滿法定年齡，具完全行為能力</li>
                <li>• 具穩定收入來源或基本還款能力</li>
                <li>• 需提供基本聯絡資料與申請資訊</li>
                <li>• 實際是否核准仍依審核結果為準</li>
              </ul>
            </div>

            <div className="rounded-[32px] border border-[#e8e1d8] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black text-[#2f2a25]">
                相關費用說明
              </h2>

              <ul className="mt-6 space-y-4 text-sm leading-7 text-[#6f675f]">
                <li>• 可能依方案收取開辦或相關行政費用</li>
                <li>• 提前清償條件依方案內容而定</li>
                <li>• 實際總費用年百分率請以最終核貸內容為準</li>
                <li>• 若有額外費用，會於申請與審核流程中清楚說明</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="rounded-[32px] border border-[#e8e1d8] bg-white p-8 shadow-sm md:p-10">
          <h2 className="text-2xl font-black text-[#2f2a25]">
            申請流程
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            <div className="rounded-[24px] border border-[#efe7de] bg-[#faf7f2] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#3e3a34] text-sm font-bold text-white">
                1
              </div>
              <div className="text-base font-bold text-[#2f2a25]">填寫需求</div>
              <p className="mt-2 text-sm leading-6 text-[#6f675f]">
                線上填寫姓名、電話、地區、資金需求等基本資訊。
              </p>
            </div>

            <div className="rounded-[24px] border border-[#efe7de] bg-[#faf7f2] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#3e3a34] text-sm font-bold text-white">
                2
              </div>
              <div className="text-base font-bold text-[#2f2a25]">專人聯繫</div>
              <p className="mt-2 text-sm leading-6 text-[#6f675f]">
                專人了解需求與基本條件，協助初步評估可行方案。
              </p>
            </div>

            <div className="rounded-[24px] border border-[#efe7de] bg-[#faf7f2] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#3e3a34] text-sm font-bold text-white">
                3
              </div>
              <div className="text-base font-bold text-[#2f2a25]">方案媒合</div>
              <p className="mt-2 text-sm leading-6 text-[#6f675f]">
                依條件媒合合適的貸款方向與申請方式。
              </p>
            </div>

            <div className="rounded-[24px] border border-[#efe7de] bg-[#faf7f2] p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#3e3a34] text-sm font-bold text-white">
                4
              </div>
              <div className="text-base font-bold text-[#2f2a25]">安排申請</div>
              <p className="mt-2 text-sm leading-6 text-[#6f675f]">
                確認內容後進入申請與後續審核流程。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="rounded-[32px] bg-[#3e3a34] px-8 py-10 text-center text-white shadow-xl">
            <h2 className="text-2xl font-black md:text-3xl">
              想了解自己適合哪一種貸款方案？
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#e7ddd2] md:text-base">
              立即填寫需求資料，讓 LoanConnect 協助你快速評估。
            </p>

            <div className="mt-6">
              <Link
                href="/apply-loan"
                className="inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#3e3a34]"
              >
                前往貸款申請
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}