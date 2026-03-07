import { Metadata } from "next";

export const metadata: Metadata = {
  title: "信用貸款申請｜快速貸款評估",
  description:
    "填寫 LoanConnect 貸款申請表，快速評估信用貸款、小額借款與整合負債方案，專人協助媒合適合的貸款方案。",
};

0:45 2026/3/8import { cityOptions } from "@/lib/data";
import SectionTitle from "@/components/SectionTitle";

export default function BorrowPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <SectionTitle badge="Borrow Page" title="立即申請" desc="這一頁可當正式送單頁，後續可加上驗證碼、OTP、地區分流與 CRM 串接。" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-line bg-paper p-6 shadow-soft md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="姓名" placeholder="請輸入姓名" />
            <Field label="手機號碼" placeholder="09xx-xxx-xxx" />
            <Field label="LINE ID" placeholder="請輸入 LINE ID" />
            <Field label="Email" placeholder="example@mail.com" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SelectField label="地區" options={cityOptions} />
            <SelectField label="借款類型" options={["小額周轉", "信用需求", "汽機車周轉", "企業周轉"]} />
            <SelectField label="需求金額" options={["1 - 5 萬", "5 - 10 萬", "10 - 30 萬", "30 - 100 萬", "100 萬以上"]} />
            <SelectField label="方便聯繫時段" options={["上午", "下午", "晚上", "都可以"]} />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-muted">需求補充</label>
            <textarea rows={5} className="w-full rounded-2xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-ink" placeholder="請補充你的需求內容" />
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-soft p-4 text-sm text-muted">
            <input type="checkbox" className="mt-1 h-4 w-4" />
            <span>我已閱讀並同意平台服務條款、隱私權政策與資料使用說明。</span>
          </div>
          <button className="mt-6 w-full rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 transition">送出申請</button>
        </div>

        <div className="space-y-5">
          <InfoCard title="頁面用途" desc="適合用在廣告導流後的正式申請頁，讓首頁與送單頁分工更清楚。" />
          <InfoCard title="下一步可串接" desc="Google Sheets、CRM、Email 通知、LINE Notify、簡訊 OTP、資料庫 API。" />
          <InfoCard title="建議補件" desc="品牌真實資訊、風險揭露、費用揭露、客服資料、法務頁面。" />
        </div>
      </div>
    </section>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted">{label}</label>
      <input type={type} className="w-full rounded-2xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-ink" placeholder={placeholder} />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted">{label}</label>
      <select className="w-full rounded-2xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-ink">
        <option>請選擇</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
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
