"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LenderAd = {
  id: string;
  title?: string | null;
  company_name?: string | null;
  contact_name?: string | null;
  region?: string | null;
  loan_types?: string | null;
  min_amount?: number | string | null;
  max_amount?: number | string | null;
  phone?: string | null;
  line_id?: string | null;
  ad_content?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
};

export default function MyLenderAdsPage() {
  const [ads, setAds] = useState<LenderAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function fetchAds() {
    setLoading(true);

    try {
      const res = await fetch("/api/member/lender-ads");
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "讀取失敗");
        return;
      }

      setAds(result.ads || []);
    } catch (err) {
      console.error(err);
      alert("讀取失敗");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAds();
  }, []);

  function updateLocal(id: string, patch: Partial<LenderAd>) {
    setAds((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  async function saveAd(ad: LenderAd) {
    setSavingId(ad.id);

    try {
      const res = await fetch("/api/member/lender-ads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ad),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "更新失敗");
        return;
      }

      alert("已更新放款廣告");
      fetchAds();
    } catch (err) {
      console.error(err);
      alert("更新失敗");
    } finally {
      setSavingId(null);
    }
  }

  async function closeAd(ad: LenderAd) {
    setSavingId(ad.id);

    try {
      const res = await fetch("/api/member/lender-ads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ad.id,
          is_active: false,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "關閉失敗");
        return;
      }

      alert("已關閉放款廣告");
      fetchAds();
    } catch (err) {
      console.error(err);
      alert("關閉失敗");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteAd(ad: LenderAd) {
    const ok = window.confirm("確定要刪除這筆放款廣告嗎？刪除後無法復原。");
    if (!ok) return;

    setSavingId(ad.id);

    try {
      const res = await fetch("/api/member/lender-ads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ad.id }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "刪除失敗");
        return;
      }

      alert("已刪除放款廣告");
      fetchAds();
    } catch (err) {
      console.error(err);
      alert("刪除失敗");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f2ec] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-[#8a8175]">Lender Area</p>
              <h1 className="mt-2 text-3xl font-black text-[#2b2b2b]">
                我的放款廣告
              </h1>
              <p className="mt-3 text-sm text-[#6b6258]">
                你可以在這裡查看、修改、關閉或刪除自己刊登的放款廣告。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/member"
                className="rounded-2xl border border-[#d7c8b4] px-5 py-3 text-sm font-semibold text-[#6b5840]"
              >
                返回會員中心
              </Link>

              <Link
                href="/post-lender"
                className="rounded-2xl bg-[#1d4ed8] px-5 py-3 text-sm font-bold text-white"
              >
                新增放款廣告
              </Link>
            </div>
          </div>
        </section>

        {loading && (
          <section className="rounded-[28px] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            載入中...
          </section>
        )}

        {!loading && ads.length === 0 && (
          <section className="rounded-[28px] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            目前沒有放款廣告。
          </section>
        )}

        {!loading &&
          ads.map((ad) => (
            <section
              key={ad.id}
              className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8"
            >
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-[#8a8175]">
                    建立時間：
                    {ad.created_at
                      ? new Date(ad.created_at).toLocaleString("zh-TW")
                      : "未設定"}
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#2b2b2b]">
                    {ad.title || "未命名廣告"}
                  </h2>
                </div>

                <span className="rounded-full bg-[#f6f2ec] px-4 py-2 text-sm font-bold text-[#6b5840]">
                  狀態：{ad.is_active ? "刊登中" : "已關閉"}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={ad.title || ""}
                  onChange={(e) => updateLocal(ad.id, { title: e.target.value })}
                  placeholder="廣告標題"
                  className="rounded-xl border border-[#eadfce] px-4 py-3 md:col-span-2"
                />

                <input
                  value={ad.company_name || ""}
                  onChange={(e) =>
                    updateLocal(ad.id, { company_name: e.target.value })
                  }
                  placeholder="公司 / 店家名稱"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={ad.contact_name || ""}
                  onChange={(e) =>
                    updateLocal(ad.id, { contact_name: e.target.value })
                  }
                  placeholder="聯絡人"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={ad.region || ""}
                  onChange={(e) =>
                    updateLocal(ad.id, { region: e.target.value })
                  }
                  placeholder="服務區域"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={ad.loan_types || ""}
                  onChange={(e) =>
                    updateLocal(ad.id, { loan_types: e.target.value })
                  }
                  placeholder="服務項目"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={ad.min_amount || ""}
                  onChange={(e) =>
                    updateLocal(ad.id, { min_amount: e.target.value })
                  }
                  placeholder="最低金額"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={ad.max_amount || ""}
                  onChange={(e) =>
                    updateLocal(ad.id, { max_amount: e.target.value })
                  }
                  placeholder="最高金額"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={ad.phone || ""}
                  onChange={(e) => updateLocal(ad.id, { phone: e.target.value })}
                  placeholder="電話"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={ad.line_id || ""}
                  onChange={(e) =>
                    updateLocal(ad.id, { line_id: e.target.value })
                  }
                  placeholder="LINE ID"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <textarea
                  value={ad.ad_content || ""}
                  onChange={(e) =>
                    updateLocal(ad.id, { ad_content: e.target.value })
                  }
                  placeholder="廣告內容"
                  rows={4}
                  className="rounded-xl border border-[#eadfce] px-4 py-3 md:col-span-2"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => saveAd(ad)}
                  disabled={savingId === ad.id}
                  className="rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {savingId === ad.id ? "處理中..." : "儲存修改"}
                </button>

                <button
                  onClick={() => closeAd(ad)}
                  disabled={savingId === ad.id}
                  className="rounded-xl bg-[#6b5840] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  關閉刊登
                </button>

                <button
                  onClick={() => deleteAd(ad)}
                  disabled={savingId === ad.id}
                  className="rounded-xl bg-[#b31217] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  刪除
                </button>
              </div>
            </section>
          ))}
      </div>
    </main>
  );
}