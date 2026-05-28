"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BorrowPost = {
  id: string;
  nickname?: string | null;
  phone?: string | null;
  line_id?: string | null;
  region?: string | null;
    amount?: string | number | null;
  purpose?: string | null;
  description?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export default function MyBorrowPostsPage() {
  const [posts, setPosts] = useState<BorrowPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function fetchPosts() {
    setLoading(true);

    try {
      const res = await fetch("/api/member/borrow-posts");
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "讀取失敗");
        return;
      }

      setPosts(result.posts || []);
    } catch (err) {
      console.error(err);
      alert("讀取失敗");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  function updateLocal(id: string, patch: Partial<BorrowPost>) {
    setPosts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  async function savePost(post: BorrowPost) {
    setSavingId(post.id);

    try {
      const res = await fetch("/api/member/borrow-posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "更新失敗");
        return;
      }

      alert("已更新借款需求");
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("更新失敗");
    } finally {
      setSavingId(null);
    }
  }

  async function closePost(post: BorrowPost) {
    setSavingId(post.id);

    try {
      const res = await fetch("/api/member/borrow-posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: post.id,
          status: "closed",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "關閉失敗");
        return;
      }

      alert("已關閉借款需求");
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("關閉失敗");
    } finally {
      setSavingId(null);
    }
  }

  async function deletePost(post: BorrowPost) {
    const ok = window.confirm("確定要刪除這筆借款需求嗎？刪除後無法復原。");
    if (!ok) return;

    setSavingId(post.id);

    try {
      const res = await fetch("/api/member/borrow-posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: post.id,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "刪除失敗");
        return;
      }

      alert("已刪除借款需求");
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("刪除失敗");
    } finally {
      setSavingId(null);
    }
  }

  function formatDate(value?: string | null) {
    if (!value) return "未設定";
    return new Date(value).toLocaleString("zh-TW");
  }

  return (
    <main className="min-h-screen bg-[#f6f2ec] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[32px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-[#8a8175]">Borrower Area</p>
              <h1 className="mt-2 text-3xl font-black text-[#2b2b2b]">
                我的借款需求
              </h1>
              <p className="mt-3 text-sm text-[#6b6258]">
                你可以在這裡查看、修改、關閉或刪除自己刊登的借款需求。
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
                href="/apply-loan"
                className="rounded-2xl bg-[#b31217] px-5 py-3 text-sm font-bold text-white"
              >
                新增借款需求
              </Link>
            </div>
          </div>
        </section>

        {loading && (
          <section className="rounded-[28px] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            載入中...
          </section>
        )}

        {!loading && posts.length === 0 && (
          <section className="rounded-[28px] border border-[#eadfce] bg-white p-8 text-center shadow-sm">
            目前沒有借款需求。
          </section>
        )}

        {!loading &&
          posts.map((post) => (
            <section
              key={post.id}
              className="rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8"
            >
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-[#8a8175]">
                    建立時間：{formatDate(post.created_at)}
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#2b2b2b]">
                    借款需求 #{post.id}
                  </h2>
                </div>

                <span className="rounded-full bg-[#f6f2ec] px-4 py-2 text-sm font-bold text-[#6b5840]">
                  狀態：{post.status || "未設定"}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={post.nickname || ""}
                  onChange={(e) =>
                    updateLocal(post.id, { nickname: e.target.value })
                  }
                  placeholder="暱稱"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={post.phone || ""}
                  onChange={(e) =>
                    updateLocal(post.id, { phone: e.target.value })
                  }
                  placeholder="手機"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={post.line_id || ""}
                  onChange={(e) =>
                    updateLocal(post.id, { line_id: e.target.value })
                  }
                  placeholder="LINE ID"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={post.amount || ""}
                  onChange={(e) =>
                    updateLocal(post.id, { amount: e.target.value })
                  }
                  placeholder="借款金額"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

                <input
                  value={post.region || ""}
                  onChange={(e) =>
                    updateLocal(post.id, { region: e.target.value })
                  }
                  placeholder="縣市"
                  className="rounded-xl border border-[#eadfce] px-4 py-3"
                />

            

                <input
                  value={post.purpose || ""}
                  onChange={(e) =>
                    updateLocal(post.id, { purpose: e.target.value })
                  }
                  placeholder="用途"
                  className="rounded-xl border border-[#eadfce] px-4 py-3 md:col-span-2"
                />

                <textarea
                  value={post.description || ""}
                  onChange={(e) =>
                    updateLocal(post.id, { description: e.target.value })
                  }
                  placeholder="需求描述"
                  rows={4}
                  className="rounded-xl border border-[#eadfce] px-4 py-3 md:col-span-2"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => savePost(post)}
                  disabled={savingId === post.id}
                  className="rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {savingId === post.id ? "處理中..." : "儲存修改"}
                </button>

                <button
                  onClick={() => closePost(post)}
                  disabled={savingId === post.id}
                  className="rounded-xl bg-[#6b5840] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  關閉刊登
                </button>

                <button
                  onClick={() => deletePost(post)}
                  disabled={savingId === post.id}
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