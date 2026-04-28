import Link from "next/link";
import { loanCities } from "@/lib/loanCities";

export const metadata = {
  title: "全台借錢媒合｜各縣市小額週轉與急用資金｜秒貸通",
  description:
    "秒貸通提供全台借錢媒合入口，包含台北、新北、桃園、新竹、台中、台南、高雄等地區小額週轉與急用資金需求。",
  alternates: {
    canonical: "https://www.miaodaitong.com/loan",
  },
};

export default function LoanIndexPage() {
  const grouped = loanCities.reduce<Record<string, typeof loanCities>>((acc, city) => {
    if (!acc[city.area]) acc[city.area] = [];
    acc[city.area].push(city);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#f6f2ec] px-4 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-10">
          <p className="mb-3 text-sm font-semibold text-[#9b6b32]">
            全台借款媒合入口
          </p>

          <h1 className="text-3xl font-bold text-[#2b2118] md:text-5xl">
            全台借錢媒合｜小額週轉、急用資金快速申請
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f5146] md:text-lg">
            秒貸通提供全台借錢媒合入口，協助有短期資金需求、急用錢、小額週轉、
            信用條件不足或收入不固定的使用者送出申請，由資金方自行評估是否適合承作。
          </p>

          <Link
            href="/apply-loan"
            className="mt-8 inline-flex rounded-full bg-[#8b5a2b] px-6 py-4 font-bold text-white transition hover:bg-[#6f4520]"
          >
            立即申請借款媒合
          </Link>
        </div>

        <div className="mt-8 space-y-8">
          {Object.entries(grouped).map(([area, cities]) => (
            <section
              key={area}
              className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8"
            >
              <h2 className="text-2xl font-bold text-[#2b2118]">
                {area}借錢地區
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/loan/${city.slug}`}
                    className="rounded-2xl border border-[#eadfce] bg-[#fbf7f1] px-4 py-4 text-center font-bold text-[#5a4030] transition hover:bg-[#f1e4d4]"
                  >
                    {city.name}借錢
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}