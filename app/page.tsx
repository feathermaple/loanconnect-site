import Link from "next/link";
import QuickApplyCard from "@/components/QuickApplyCard";
import SectionTitle from "@/components/SectionTitle";
import { channels, faq, features, stats, steps } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,228,218,0.9),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(250,246,240,0.95),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit rounded-full border border-line bg-paper/90 px-3 py-1 text-xs font-semibold text-muted shadow-sm">
              品牌化、高轉換、可直接延伸開發
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-ink md:text-6xl">
              不做舊式借貸站
              <span className="mt-1 block">直接做成更乾淨、更有信任感的網站</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
              整體風格往更現代的方向設計：畫面更簡潔、資訊層級更清楚、表單更像品牌服務頁，而不是傳統堆資料的頁面。更適合長期經營、投放與品牌化。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/borrow" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5">
                立即開始
              </Link>
              <Link href="/register" className="rounded-full border border-line bg-paper px-6 py-3 text-sm font-semibold text-muted hover:bg-soft">
                查看註冊頁
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-line bg-paper/80 p-4 shadow-soft">
                  <div className="text-2xl font-black text-ink">{value}</div>
                  <div className="mt-1 text-sm text-[#8a8178]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <QuickApplyCard />
        </div>
      </section>

      <section className="border-y border-line/80 bg-paper/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 pt-8 md:px-6">
          {[
            "SEO 文章佈局",
            "廣告著陸頁導流",
            "LINE 客服承接",
            "會員註冊轉換",
            "名單分流管理",
          ].map((item) => (
            <div key={item} className="rounded-full border border-line bg-paper px-4 py-2 text-xs font-semibold text-muted shadow-sm">
              {item}
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <SectionTitle
            badge="重新優化後的方向"
            title="這版不是照抄，而是往更高級的網站感做"
            desc="保留你需要的功能，但視覺邏輯改成更像現代 SaaS、品牌服務站、顧問型官網的呈現方式。"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map(([title, desc]) => (
              <div key={title} className="rounded-[28px] border border-line bg-gradient-to-b from-paper to-soft p-6 shadow-sm">
                <div className="text-lg font-bold text-ink">{title}</div>
                <p className="mt-3 text-sm leading-6 text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-14 rounded-[32px] border border-line bg-paper p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {channels.map(([title, desc]) => (
              <div key={title} className="rounded-[24px] border border-[#efe7de] bg-[#f9f6f1] p-5">
                <div className="text-base font-bold text-ink">{title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionTitle badge="設計邏輯" title="優化重點不是加很多東西，而是讓頁面更順" desc="包含資訊密度、視覺節奏、表單位置、按鈕層級、品牌感與閱讀路徑。" />
            <div className="mt-8 space-y-4">
              {[
                "首頁先建立信任，再導向填表，不讓使用者一進站就壓迫感太重。",
                "按鈕、卡片、表單與留白都改成比較現代的比例。",
                "保留可商業化的功能，但去掉過時、廉價感很重的版型語言。",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-line bg-paper p-4 text-sm leading-7 text-muted shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(([title, desc], i) => (
              <div key={title} className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-bold text-white shadow-md">{i + 1}</div>
                <div className="text-xl font-bold text-ink">{title}</div>
                <p className="mt-3 text-sm leading-6 text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:items-center">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-[#e8ddd1]">
              整站結構
            </div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">保留完整功能，但整體更像品牌網站</h2>
            <p className="mt-3 text-sm leading-7 text-[#ddd3c7] md:text-base">
              首頁、申請頁、註冊登入、據點列表、文章頁、後台預覽都還在，只是整體風格變得更乾淨。
            </p>
            <div className="mt-8 grid gap-3 text-sm text-[#f2e8dc] md:grid-cols-2">
              {["首頁", "申請頁", "服務據點", "知識專區", "註冊頁", "登入頁", "後台預覽"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">{item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl">
            <div className="text-sm text-[#ddd3c7]">目前這版的優化方向</div>
            <div className="mt-5 space-y-4">
              <div>
                <div className="text-lg font-semibold">視覺升級</div>
                <div className="text-sm text-[#ddd3c7]">更乾淨、更高級、更不像舊式流量站</div>
              </div>
              <div>
                <div className="text-lg font-semibold">轉換保留</div>
                <div className="text-sm text-[#ddd3c7]">表單還在核心位置，但不會顯得壓迫和廉價</div>
              </div>
              <div>
                <div className="text-lg font-semibold">開發友善</div>
                <div className="text-sm text-[#ddd3c7]">之後仍能繼續接後端、資料庫與會員系統</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <SectionTitle badge="FAQ" title="這樣的優化方向比較適合長期經營" desc="不只是好看，而是更適合後續品牌建立、廣告投放和使用者信任。" center />
        <div className="mt-10 space-y-4">
          {faq.map((item) => (
            <div key={item.q} className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
              <div className="text-lg font-semibold text-ink">{item.q}</div>
              <div className="mt-2 text-sm leading-6 text-muted">{item.a}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
