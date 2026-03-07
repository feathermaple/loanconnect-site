import Link from "next/link";

const points = [
  "不收前期費用",
  "專人快速協助",
  "依條件媒合方案",
  "全程資料保密",
];

export default function CtaSection() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] border border-[#e8dfd4] bg-[#f6efe7] shadow-sm">
          <div className="grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-[#ddcfc0] bg-white/70 px-3 py-1 text-xs font-semibold text-[#7b6f63]">
                免費貸款評估
              </div>

              <h2 className="mt-4 text-3xl font-black leading-tight text-[#2f2a25] md:text-4xl">
                還在找合適的貸款方案？
                <span className="block">現在就開始免費評估</span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e655d] md:text-base">
                不論是信用貸款、整合負債、資金週轉，或其他借款需求，
                都可以先透過簡單填表進行初步評估，
                由專人協助媒合更適合的資金方案。
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {points.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-[#e2d6c9] bg-white px-4 py-2 text-xs font-semibold text-[#5f5750] shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="text-lg font-bold text-[#2f2a25]">
                立即開始評估流程
              </div>

              <p className="mt-3 text-sm leading-6 text-[#6f675f]">
                填寫基本需求後，將由專人盡快與你聯繫，協助了解條件與可評估方向。
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/borrow"
                  className="block rounded-full bg-[#3e3a34] px-6 py-3 text-center text-sm font-semibold text-white shadow-md hover:opacity-95"
                >
                  立即免費評估
                </Link>

                <Link
                  href="/loan-info"
                  className="block rounded-full border border-[#ddd2c6] bg-white px-6 py-3 text-center text-sm font-semibold text-[#5f5750] hover:bg-[#f8f3ed]"
                >
                  了解貸款條件
                </Link>
              </div>

              <div className="mt-5 text-xs leading-6 text-[#8a8178]">
                提醒：實際媒合結果將依個人條件、資料完整度與方案內容而定。
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}