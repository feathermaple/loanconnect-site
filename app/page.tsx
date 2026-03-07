import Link from "next/link";
import QuickApplyCard from "@/components/QuickApplyCard";
import SectionTitle from "@/components/SectionTitle";
import { channels, faq, features, stats, steps } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#fbf8f3]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-xs font-semibold text-[#7a7269]">
              LoanConnect 貸款媒合平台
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#2f2a25] md:text-5xl">
              快速評估貸款需求
              <span className="block">找到適合你的資金方案</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#6f675f] md:text-lg">
              LoanConnect 提供信用貸款、整合負債與資金週轉需求媒合服務，
              只需填寫簡單資料，即可快速評估貸款方案，
              專人協助聯繫，讓資金需求更安心、更透明。
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/borrow"
                className="rounded-full bg-[#3e3a34] px-7 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95"
              >
                立即免費評估
              </Link>

              <Link
                href="/loan-info"
                className="rounded-full border border-[#e6dfd5] bg-white px-7 py-3 text-sm font-semibold text-[#5f5750] hover:bg-[#f5f1eb]"
              >
                了解貸款條件
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 text-sm text-[#7a7269]">
              <div>
                <div className="text-xl font-bold text-[#2f2a25]">100+</div>
                <div>合作資金方案</div>
              </div>

              <div>
                <div className="text-xl font-bold text-[#2f2a25]">快速評估</div>
                <div>線上填表</div>
              </div>

              <div>
                <div className="text-xl font-bold text-[#2f2a25]">專人協助</div>
                <div>媒合方案</div>
              </div>
            </div>
          </div>

          <QuickApplyCard />
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y border-line/80 bg-paper/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 pt-8 md:px-6">
          {[
            "SEO 文章佈局",
            "廣告著陸頁導流",
            "LINE 客服承接",
            "會員註冊轉換",
            "名單分流管理",
          ].map((item) => (
            <div
              key={item}
              className="rounded-full border border-line bg-paper px-4 py-2 text-xs font-semibold text-muted shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <SectionTitle
            badge="平台特色"
            title="簡單填表，快速媒合貸款方案"
            desc="透過 LoanConnect，你可以快速提交需求，讓合適的貸款方案主動媒合。"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map(([title, desc]) => (
              <div
                key={title}
                className="rounded-[28px] border border-line bg-gradient-to-b from-paper to-soft p-6 shadow-sm"
              >
                <div className="text-lg font-bold text-ink">{title}</div>
                <p className="mt-3 text-sm leading-6 text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-14 rounded-[32px] border border-line bg-paper p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {channels.map(([title, desc]) => (
              <div
                key={title}
                className="rounded-[24px] border border-[#efe7de] bg-[#f9f6f1] p-5"
              >
                <div className="text-base font-bold text-ink">{title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionTitle
              badge="服務流程"
              title="三個步驟完成貸款評估"
              desc="簡單填表後，我們會協助你媒合適合的貸款方案。"
            />

            <div className="mt-8 space-y-4">
              {[
                "填寫貸款需求資料",
                "專人評估與媒合方案",
                "確認條件後安排申請流程",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-line bg-paper p-4 text-sm leading-7 text-muted shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(([title, desc], i) => (
              <div
                key={title}
                className="rounded-[28px] border border-line bg-paper p-6 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-bold text-white shadow-md">
                  {i + 1}
                </div>
                <div className="text-xl font-bold text-ink">{title}</div>
                <p className="mt-3 text-sm leading-6 text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <SectionTitle
          badge="FAQ"
          title="常見貸款問題"
          desc="以下整理一些常見問題，幫助你更了解貸款流程。"
          center
        />

        <div className="mt-10 space-y-4">
          {faq.map((item) => (
            <div
              key={item.q}
              className="rounded-[28px] border border-line bg-paper p-6 shadow-sm"
            >
              <div className="text-lg font-semibold text-ink">{item.q}</div>
              <div className="mt-2 text-sm leading-6 text-muted">{item.a}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}