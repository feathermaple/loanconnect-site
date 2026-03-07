const steps = [
  {
    number: "01",
    title: "線上填表",
    description: "留下基本借款需求與聯絡方式，讓顧問能快速了解你的狀況。",
  },
  {
    number: "02",
    title: "專人聯繫",
    description: "由專人主動與你聯絡，確認借款用途、額度與可提供的條件。",
  },
  {
    number: "03",
    title: "條件評估",
    description: "依照你的條件進行初步評估，媒合較適合的借款方向與方案。",
  },
  {
    number: "04",
    title: "快速媒合",
    description: "確認方案後，協助進入後續媒合流程，提升處理效率。",
  },
];

const trustPoints = [
  "不收前期費用",
  "全程資料保密",
  "快速審核回覆",
  "依條件媒合方案",
];

export default function ProcessSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold tracking-wide text-brand">
            申辦流程
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink md:text-4xl">
            借款流程簡單透明，快速完成需求媒合
          </h2>
          <p className="mt-4 text-base leading-7 text-muted md:text-lg">
            從填寫需求到顧問聯繫，再到條件評估與媒合，流程清楚、步驟簡單，幫助使用者更安心了解下一步。
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-line bg-paper p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-sm font-bold tracking-widest text-brand/80">
                STEP {step.number}
              </div>
              <h3 className="mt-3 text-xl font-black text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-line bg-paper px-6 py-8 md:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustPoints.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-ink shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}