import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "防詐騙宣導｜秒貸通",
  description:
    "秒貸通防詐騙宣導，提醒民眾留意假貸款、假代辦與非法要求，避免遭受詐騙。",
};

const fraudTips = [
  {
    title: "不會要求先匯款",
    desc: "平台與正常媒合流程，不會要求您先支付保證金、手續費、認證費或任何名目的匯款。",
  },
  {
    title: "不會索取提款卡與密碼",
    desc: "請勿提供提款卡、網銀帳號密碼、OTP 驗證碼等敏感資訊給任何人。",
  },
  {
    title: "不會要求操作 ATM",
    desc: "任何要求您操作 ATM、網銀解除設定、配合轉帳的行為，都有可能是詐騙。",
  },
  {
    title: "不保證百分之百核貸",
    desc: "所有借款與媒合仍須依實際條件評估，若有人宣稱一定過件，請提高警覺。",
  },
  {
    title: "保留對話與聯繫紀錄",
    desc: "若遇到疑似詐騙情況，建議保留 LINE、電話、簡訊與轉帳紀錄。",
  },
];

export default function AntiFraudPage() {
  return (
    <main className="min-h-screen bg-[#f6f2ec] text-[#2b2b2b]">
      <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-[#b8872b]">
            ANTI FRAUD
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            防詐騙宣導
          </h1>

          <p className="mt-5 text-[15px] leading-8 text-[#6b6257] md:text-base">
            為保障使用者安全，請留意常見貸款詐騙手法，
            提高警覺並妥善保護個人資料與金融資訊。
          </p>
        </div>

        <div className="mt-12 grid gap-6">
          {fraudTips.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-black text-[#2a2422]">
                {item.title}
              </h2>

              <p className="mt-3 text-[15px] leading-8 text-[#6f6257]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] border border-[#f3d7d7] bg-[#fff7f7] p-6">
          <h2 className="text-xl font-black text-[#b91c1c]">
            如遇疑似詐騙情況
          </h2>

          <p className="mt-3 text-[15px] leading-8 text-[#7a4b4b]">
            建議立即停止聯繫，勿再提供任何資料或轉帳，
            並可撥打 165 反詐騙專線尋求協助。
          </p>
        </div>
      </section>
    </main>
  );
}