import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "我要借錢｜免費刊登借款需求｜秒貸通 MIAO DAI TONG",
  description:
    "秒貸通提供免費刊登借款需求服務，幫助有資金需求的用戶快速媒合合適方案。流程簡單、操作方便，讓借款評估更有效率。",
  keywords: [
    "我要借錢",
    "借款需求",
    "免費刊登借款需求",
    "資金媒合",
    "民間借款",
    "借錢平台",
    "借款評估",
  ],
  openGraph: {
    title: "我要借錢｜免費刊登借款需求｜秒貸通 MIAO DAI TONG",
    description:
      "免費刊登借款需求，讓資金更快找到你。流程簡單、操作方便、快速開始評估。",
    url: "https://miaodaitong.com/apply-loan",
    siteName: "秒貸通 MIAO DAI TONG",
    locale: "zh_TW",
    type: "website",
  },
};

const areaOptions = [
  "台北市",
  "新北市",
  "基隆市",
  "桃園市",
  "新竹市",
  "新竹縣",
  "苗栗縣",
  "台中市",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義市",
  "嘉義縣",
  "台南市",
  "高雄市",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "台東縣",
  "澎湖縣",
  "金門縣",
  "連江縣",
];

const strengthList = [
  "免費刊登借款需求",
  "流程簡單，幾分鐘即可完成",
  "可先刊登，再等待合適資金方聯繫",
];

const trustList = [
  "本平台提供資訊刊登與媒合服務",
  "不收取前期諮詢費、保證金或代辦費",
  "不會要求您提供證件正本",
  "送出資料前請先確認借款條件與自身還款能力",
];

const faqList = [
  {
    q: "刊登借款需求要收費嗎？",
    a: "目前提供免費刊登借款需求，讓有資金需求的用戶可先快速開始媒合。",
  },
  {
    q: "送出表單後會怎麼處理？",
    a: "您送出資料後，系統會建立借款需求，後續由平台流程或合適的資金方進一步查看與聯繫。",
  },
  {
    q: "一定會成功借到錢嗎？",
    a: "不一定。實際是否能媒合成功，仍需視條件、需求內容、聯繫狀況與雙方評估結果而定。",
  },
  {
    q: "個人資料會被公開嗎？",
    a: "建議只填寫必要聯絡資訊，資料將以平台用途處理，不建議提供過多敏感資訊。",
  },
];

export default function ApplyLoanPage() {
  return (
    <main className="min-h-screen bg-[#f6f2ec] text-[#2b2b2b]">
      <section className="border-b border-[#e7ddd0] bg-gradient-to-b from-[#f8f4ee] to-[#f3ede4]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex rounded-full border border-[#e6d4b2] bg-[#fff8ea] px-4 py-2 text-sm font-semibold text-[#9d6d1d]">
                我要借錢｜免費刊登借款需求
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight text-[#1f1f1f] md:text-5xl">
                快速刊登借款需求，
                <br className="hidden md:block" />
                讓資金更快找到你
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#61584d] md:text-lg">
                若您有資金需求，可先透過秒貸通免費刊登借款需求。
                流程簡單、填寫快速，幫助您更有效率開始評估適合的借款方向。
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {strengthList.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[#fff2d8] px-4 py-2 text-sm font-medium text-[#805a16]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
                  <div className="text-lg font-bold text-[#b8842c]">步驟簡單</div>
                  <p className="mt-1 text-sm leading-6 text-[#6c6257]">
                    填寫基本需求即可開始
                  </p>
                </div>
                <div className="rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
                  <div className="text-lg font-bold text-[#b8842c]">免費刊登</div>
                  <p className="mt-1 text-sm leading-6 text-[#6c6257]">
                    降低開始評估的門檻
                  </p>
                </div>
                <div className="rounded-2xl border border-[#eadfce] bg-white p-4 shadow-sm">
                  <div className="text-lg font-bold text-[#b8842c]">快速開始</div>
                  <p className="mt-1 text-sm leading-6 text-[#6c6257]">
                    現在就能送出需求
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
              <div className="mb-4 text-sm font-semibold text-[#b8842c]">
                借款前先看這裡
              </div>

              <div className="space-y-3">
                {trustList.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-[#faf6ef] px-4 py-3 text-sm leading-7 text-[#5e554a]"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[#f0e2c8] bg-[#fff8ec] p-4 text-sm leading-7 text-[#6a573d]">
                提醒您：若遇到要求先付款、押證件、保證核貸、來路不明聯絡方式等情形，請提高警覺並停止往來。
              </div>
            </div>
          </div>
        </div>
      </section>

     <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
  <div className="mx-auto mb-14 max-w-3xl text-center">
    <p className="text-sm font-semibold tracking-[0.35em] text-[#b8872b]">
      ABOUT PLATFORM
    </p>

    <h1 className="mt-4 text-4xl font-black tracking-tight text-[#1f1f1f] md:text-5xl">
      關於平台
    </h1>

    <p className="mt-5 text-[15px] leading-8 text-[#6f6257] md:text-base">
      我們致力打造簡單、安全、有效率的借貸媒合平台，
      讓有資金需求與放款服務的雙方，
      能更快速找到合適的媒合方式。
    </p>
  </div>

  <div className="mx-auto max-w-4xl space-y-8">
    {/* 刊登前說明 */}
    <div className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
      <p className="text-sm font-semibold tracking-wide text-[#c89b45]">
        刊登前說明
      </p>

      <h2 className="mt-3 text-2xl font-black leading-tight text-[#2a2422]">
        填寫幾項基本資料，就能開始刊登需求
      </h2>

      <p className="mt-4 text-[15px] leading-8 text-[#6f6257]">
        建議您填寫正確且方便聯繫的資料，
        這樣後續處理與媒合效率會比較好。
        若目前還不確定完整條件，
        也可以先填寫基本需求再進一步評估。
      </p>
    </div>

    {/* 流程 */}
    <div className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
      <p className="text-sm font-semibold tracking-wide text-[#c89b45]">
        送出後會怎麼進行
      </p>

      <div className="mt-5 space-y-4">
        <div className="rounded-2xl bg-[#f7f2eb] p-5">
          <h3 className="text-lg font-bold text-[#2a2422]">
            1. 建立借款需求
          </h3>

          <p className="mt-2 text-sm leading-7 text-[#6f6257]">
            您送出資料後，系統會建立需求資料。
          </p>
        </div>

        <div className="rounded-2xl bg-[#f7f2eb] p-5">
          <h3 className="text-lg font-bold text-[#2a2422]">
            2. 等待後續媒合
          </h3>

          <p className="mt-2 text-sm leading-7 text-[#6f6257]">
            後續依平台流程與需求內容進行媒合或查看。
          </p>
        </div>

        <div className="rounded-2xl bg-[#f7f2eb] p-5">
          <h3 className="text-lg font-bold text-[#2a2422]">
            3. 進一步評估條件
          </h3>

          <p className="mt-2 text-sm leading-7 text-[#6f6257]">
            實際借款條件、額度、利率與費用，
            仍以後續雙方洽談為準。
          </p>
        </div>
      </div>
    </div>

    {/* FAQ */}
    <div className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
      <p className="text-sm font-semibold tracking-wide text-[#c89b45]">
        常見問題
      </p>

      <div className="mt-5 space-y-5">
        {faqList.map((item) => (
          <div
            key={item.q}
            className="border-b border-[#f1e8db] pb-5 last:border-b-0 last:pb-0"
          >
            <h3 className="text-lg font-bold text-[#2a2422]">
              {item.q}
            </h3>

            <p className="mt-2 text-sm leading-7 text-[#6f6257]">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
</main>
  );
}