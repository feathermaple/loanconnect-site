"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type PackCode = "unlock_1" | "unlock_5" | "unlock_10";

const packs: {
  code: PackCode;
  title: string;
  price: string;
  amount: number;
  credits: number;
  desc: string;
}[] = [
  {
    code: "unlock_1",
    title: "單筆解鎖 1 筆",
    price: "NT$99",
    amount: 99,
    credits: 1,
    desc: "適合只想先看 1 筆需求的會員",
  },
  {
    code: "unlock_5",
    title: "單筆解鎖 5 筆",
    price: "NT$399",
    amount: 399,
    credits: 5,
    desc: "平均單筆更便宜，適合偶爾使用者",
  },
  {
    code: "unlock_10",
    title: "單筆解鎖 10 筆",
    price: "NT$699",
    amount: 699,
    credits: 10,
    desc: "最划算，適合常查看需求但暫不買 VIP",
  },
];

export default function UnlockPackPage() {
  const router = useRouter();
  const [loadingCode, setLoadingCode] = useState<PackCode | null>(null);

  const handleBuy = async (packCode: PackCode) => {
    try {
      setLoadingCode(packCode);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("請先登入會員");
        router.push("/login?redirect=/unlock-pack");
        return;
      }

      const res = await fetch("/api/unlock-pack/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          packCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "購買失敗");
        return;
      }

      alert(`購買成功，已加入 ${data.added_credits} 筆解鎖點數`);
      router.push("/member");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("系統發生錯誤，請稍後再試");
    } finally {
      setLoadingCode(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-[#d8c7a5] bg-[#fffaf2] px-4 py-1 text-sm font-medium text-[#a67c2d]">
            單筆解鎖方案
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#2f2a25] md:text-5xl">
            不想訂 VIP，也可以單筆購買解鎖
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#6b6257] md:text-base">
            適合只想查看少量需求的會員。購買後會獲得解鎖點數，每查看 1 筆完整需求會扣 1 點。
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {packs.map((pack) => (
            <div
              key={pack.code}
              className="rounded-[28px] border border-[#e8dfd3] bg-white p-7 shadow-sm md:p-8"
            >
              <h2 className="text-2xl font-bold text-[#2f2a25]">{pack.title}</h2>
              <p className="mt-2 text-sm text-[#6b6257]">{pack.desc}</p>

              <div className="mt-7 flex items-end gap-2">
                <span className="text-5xl font-bold tracking-tight text-[#2f2a25]">
                  {pack.price}
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f8f5ef] px-4 py-4 text-sm text-[#5f5750]">
                可解鎖完整需求 <span className="font-bold">{pack.credits}</span> 筆
              </div>

              <button
                type="button"
                onClick={() => handleBuy(pack.code)}
                disabled={loadingCode !== null}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#3e3a34] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingCode === pack.code ? "處理中..." : `購買 ${pack.title}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}