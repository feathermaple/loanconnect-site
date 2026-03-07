import SectionTitle from "@/components/SectionTitle";

const cards = [
  ["今日新申請", "148"],
  ["待聯繫名單", "62"],
  ["合作店家", "320"],
  ["文章頁數", "84"],
] as const;

const leads = [
  ["王先生", "台北市", "10 - 30 萬", "待聯繫"],
  ["陳小姐", "新北市", "5 - 10 萬", "已分派"],
  ["林先生", "台中市", "30 - 100 萬", "審核中"],
  ["黃小姐", "高雄市", "1 - 5 萬", "已完成"],
] as const;

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <SectionTitle badge="Dashboard" title="後台預覽" desc="這裡是未來後台的大致樣子，方便你規劃下一步功能。" />
      <div className="mt-10 grid gap-5 md:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
            <div className="text-sm text-[#8a8178]">{label}</div>
            <div className="mt-3 text-3xl font-black text-ink">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
          <div className="mb-5 text-xl font-bold text-ink">最新申請名單</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[#8a8178]">
                  <th className="px-3 py-3 font-medium">姓名</th>
                  <th className="px-3 py-3 font-medium">地區</th>
                  <th className="px-3 py-3 font-medium">需求金額</th>
                  <th className="px-3 py-3 font-medium">狀態</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((row) => (
                  <tr key={row.join("-")} className="border-b border-[#f0e9df] last:border-b-0">
                    {row.map((cell) => (
                      <td key={cell} className="px-3 py-4 text-muted">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <InfoCard title="會員管理" desc="管理一般會員、合作店家與管理員權限。" />
          <InfoCard title="刊登管理" desc="控制店家上架、排序、方案狀態與到期日。" />
          <InfoCard title="客服追蹤" desc="整合聯絡狀態、指派與轉換率紀錄。" />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[28px] border border-line bg-paper p-6 shadow-sm">
      <div className="text-lg font-bold text-ink">{title}</div>
      <p className="mt-3 text-sm leading-6 text-muted">{desc}</p>
    </div>
  );
}
