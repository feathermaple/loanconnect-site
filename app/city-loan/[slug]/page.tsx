import Link from "next/link";
import { notFound } from "next/navigation";
import { getLoanCity, loanCities } from "@/lib/loanCities";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return loanCities.map((city) => ({
    city: city.slug,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const city = getLoanCity(slug: string);

  if (!city) {
    return {
      title: "借錢媒合｜秒貸通",
    };
  }

  return {
    title: city.title,
    description: city.description,
    alternates: {
      canonical: `https://www.miaodaitong.com/loan/${city.slug}`,
    },
    openGraph: {
      title: city.title,
      description: city.description,
      url: `https://www.miaodaitong.com/loan/${city.slug}`,
      siteName: "秒貸通",
      type: "website",
    },
  };
}

export default function LoanCityPage({ params }: PageProps) {
  const city = getLoanCity(slug: string);

  if (!city) notFound();

  const otherCities = loanCities.filter((item) => item.slug !== city.slug).slice(0, 8);

  return (
    <main className="min-h-screen bg-[#f6f2ec] px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-10">
          <p className="mb-3 text-sm font-semibold text-[#9b6b32]">
            {city.area}借款媒合服務
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#2b2118] md:text-5xl">
            {city.name}借錢｜快速媒合資金｜小額週轉可評估
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f5146] md:text-lg">
            {city.intro}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/apply-loan"
              className="rounded-full bg-[#8b5a2b] px-6 py-4 text-center font-bold text-white shadow-sm transition hover:bg-[#6f4520]"
            >
              立即申請借款媒合
            </Link>

            <Link
              href="/loan"
              className="rounded-full border border-[#d8c7b2] bg-white px-6 py-4 text-center font-bold text-[#5a4030] transition hover:bg-[#f8f1e8]"
            >
              查看其他地區
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#2b2118]">
              {city.name}常見借款需求
            </h2>

            <ul className="mt-5 space-y-3">
              {city.needs.map((need) => (
                <li
                  key={need}
                  className="rounded-2xl bg-[#fbf7f1] px-4 py-3 text-[#5f5146]"
                >
                  {need}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#2b2118]">
              {city.name}服務地區
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {city.districts.map((district) => (
                <span
                  key={district}
                  className="rounded-full bg-[#f1e4d4] px-4 py-2 text-sm font-semibold text-[#6b4828]"
                >
                  {district}
                </span>
              ))}
            </div>

            <p className="mt-5 text-sm leading-7 text-[#6b625b]">
              以上地區皆可先線上送出需求，實際是否媒合成功、條件內容與後續流程，
              由申請人與資金方自行確認。
            </p>
          </section>
        </div>

        <section className="mt-8 rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-[#2b2118]">
            {city.name}借錢申請流程
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["1", "填寫申請資料", "留下需求金額、聯絡方式與基本條件。"],
              ["2", "平台協助媒合", "依照需求協助媒合可能合適的資金方。"],
              ["3", "雙方自行確認", "利率、期限、條件與合約內容需自行審慎確認。"],
            ].map(([num, title, text]) => (
              <div key={num} className="rounded-3xl bg-[#fbf7f1] p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#8b5a2b] font-bold text-white">
                  {num}
                </div>
                <h3 className="text-lg font-bold text-[#2b2118]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#6b625b]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-[#2b2118]">
            {city.name}借錢常見問題
          </h2>

          <div className="mt-6 space-y-4">
            {city.faq.map((item) => (
              <div key={item.q} className="rounded-3xl bg-[#fbf7f1] p-5">
                <h3 className="font-bold text-[#2b2118]">{item.q}</h3>
                <p className="mt-2 text-sm leading-7 text-[#6b625b]">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-[#eadfce] bg-[#2b2118] p-6 text-white shadow-sm md:p-8">
          <h2 className="text-2xl font-bold">
            有{city.name}借款需求？
          </h2>

          <p className="mt-3 leading-7 text-white/80">
            可先填寫申請資料，平台將協助媒合可能合適的資金方。
            本平台為資訊媒合性質，實際借貸條件請自行審慎確認。
          </p>

          <Link
            href="/apply-loan"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-4 font-bold text-[#2b2118] transition hover:bg-[#f1e4d4]"
          >
            立即填寫申請
          </Link>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-[#2b2118]">
            其他熱門地區
          </h2>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {otherCities.map((item) => (
              <Link
                key={item.slug}
                href={`/loan/${item.slug}`}
                className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-center font-semibold text-[#5a4030] transition hover:bg-[#f8f1e8]"
              >
                {item.name}借錢
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}