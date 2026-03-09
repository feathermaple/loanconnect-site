"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  title: string;
  desc: string;
  primaryText: string;
  extraFields?: [string, string][];
};

export default function AuthCard({ title, desc, primaryText, extraFields = [] }: Props) {

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lineId, setLineId] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleRegister() {
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone,
          line_id: lineId,
          company
        }
      }
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("註冊成功，請到信箱驗證 Email");
    }

    setLoading(false);
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_0.95fr] md:px-6 md:py-16">

      <div className="flex flex-col justify-center rounded-[32px] bg-ink p-8 text-white md:p-10">
        <h2 className="text-4xl font-black">{title}</h2>
        <p className="mt-4 text-sm text-[#ddd3c7]">{desc}</p>
      </div>

      <div className="rounded-[32px] border border-line bg-paper p-6 shadow-soft md:p-8 space-y-4">

        <Field label="手機號碼" value={phone} onChange={setPhone} />

        <Field label="Email" value={email} onChange={setEmail} />

        <Field label="密碼" type="password" value={password} onChange={setPassword} />

        <Field label="營業名稱 / 店家名稱" value={company} onChange={setCompany} />

        <Field label="LINE ID" value={lineId} onChange={setLineId} />

        <button
          onClick={handleRegister}
          className="w-full rounded-2xl bg-ink px-5 py-3 text-white"
        >
          {loading ? "註冊中..." : primaryText}
        </button>

        {msg && (
          <p className="text-sm text-center text-red-500">{msg}</p>
        )}

      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="mb-2 block text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line px-4 py-3"
      />
    </div>
  );
}