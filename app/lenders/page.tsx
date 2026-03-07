import { Metadata } from "next";

export const metadata: Metadata = {
  title: "貸款媒合平台｜合作放款機構",
  description:
    "LoanConnect 與多家貸款機構合作，提供信用貸款、整合負債與小額借款媒合服務。",
};

import SectionTitle from "@/components/SectionTitle";
import { lendersSeed } from "@/lib/data";

export default function LendersPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <SectionTitle badge="Lenders" title="服務據點" desc="模擬合作方列表頁，可延伸成各縣市獨立著陸頁與 SEO 結構。" />
      <div className="mt-8 flex flex-wrap gap-3">
        {["全部", "台北市", "新北市", "台中市", "高雄市"].map((city) => (
          <button key={city} className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-muted hover:bg-soft">
            {city}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {lendersSeed.map((item) => (
          <div key={item.id} className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xl font-bold text-ink">{item.name}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-soft px-3 py-1 text-muted">{item.city}</span>
                  <span className="rounded-full bg-soft px-3 py-1 text-muted">{item.type}</span>
                </div>
              </div>
              <button className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">查看詳情</button>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{item.desc}</p>
            <div className="mt-4 rounded-2xl border border-line bg-soft p-4 text-sm text-muted">費率 / 說明：{item.rate}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
