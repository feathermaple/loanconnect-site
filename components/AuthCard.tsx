type Props = {
  title: string;
  desc: string;
  primaryText: string;
  extraFields?: [string, string][];
};

export default function AuthCard({ title, desc, primaryText, extraFields = [] }: Props) {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_0.95fr] md:px-6 md:py-16">
      <div className="flex flex-col justify-center rounded-[32px] bg-ink p-8 text-white md:p-10">
        <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-[#ede2d6]">
          Auth Page
        </div>
        <h2 className="mt-5 text-4xl font-black leading-tight">{title}</h2>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[#ddd3c7] md:text-base">{desc}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">手機驗證</div>
            <div className="mt-2 text-sm text-[#ddd3c7]">後續可串接簡訊 OTP 驗證。</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Email 驗證</div>
            <div className="mt-2 text-sm text-[#ddd3c7]">可補強註冊真實性與通知流程。</div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-line bg-paper p-6 shadow-soft md:p-8">
        <div className="space-y-4">
          <Field label="手機號碼" placeholder="09xx-xxx-xxx" />
          <Field label="Email" placeholder="example@mail.com" />
          <Field label="密碼" placeholder="請輸入密碼" type="password" />
          {extraFields.map(([label, placeholder]) => (
            <Field key={label} label={label} placeholder={placeholder} />
          ))}
          <div>
            <label className="mb-2 block text-sm font-medium text-muted">手機驗證碼</label>
            <div className="flex gap-3">
              <input className="flex-1 rounded-2xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-ink" placeholder="請輸入驗證碼" />
              <button className="rounded-2xl border border-line px-4 py-3 text-sm font-medium text-muted hover:bg-soft">發送驗證碼</button>
            </div>
          </div>
          <button className="w-full rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 transition">{primaryText}</button>
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
