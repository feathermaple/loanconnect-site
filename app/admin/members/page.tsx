"use client";

import { useEffect, useMemo, useState } from "react";

type MemberRow = {
  id: string;
  uid?: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  membership_plan: string | null;
  membership_status: string | null;
  membership_expires_at: string | null;
  admin_note: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type EditableMember = MemberRow & {
  saving?: boolean;
  deleting?: boolean;
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<EditableMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  async function fetchMembers() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/members/list");
      const result = await res.json();
      setMembers(result.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const keyword = search.toLowerCase();

    return members.filter((m) =>
      `${m.email || ""} ${m.id || ""} ${m.uid || ""} ${m.role || ""}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [members, search]);

  function getUserId(member: EditableMember) {
    return member.uid || member.id;
  }

  function updateLocalMember(id: string, patch: Partial<EditableMember>) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }

  async function saveMember(member: EditableMember) {
    updateLocalMember(member.id, { saving: true });

    try {
      const res = await fetch("/api/admin/members/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: getUserId(member),
          role: member.role,
          membership_plan: member.membership_plan,
          membership_status: member.membership_status,
          membership_expires_at: member.membership_expires_at,
          admin_note: member.admin_note,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "更新失敗");
        return;
      }

      setMessage("已更新會員資料");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("更新會員失敗");
    } finally {
      updateLocalMember(member.id, { saving: false });
    }
  }

  async function activatePlan(
    userId: string,
    plan: "monthly" | "yearly",
    days: number
  ) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);

    try {
      const res = await fetch("/api/admin/members/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          membership_plan: plan,
          membership_status: "active",
          membership_expires_at: expires.toISOString(),
          admin_note: plan === "monthly" ? "開通月費會員 30 天" : "開通年費會員 395 天",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "開通失敗");
        return;
      }

      alert(plan === "monthly" ? "已開通月費會員" : "已開通年費會員");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("開通失敗");
    }
  }

  async function cancelVip(userId: string) {
    try {
      const res = await fetch("/api/admin/members/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          membership_plan: "free",
          membership_status: "inactive",
          membership_expires_at: null,
          admin_note: "已取消 VIP",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "取消失敗");
        return;
      }

      alert("已取消 VIP");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("取消失敗");
    }
  }

  async function deleteMember(member: EditableMember) {
    const userId = getUserId(member);

    const ok = window.confirm(
      `確定要刪除這個會員嗎？\n\n${member.email || userId}\n\n刪除後會同步刪除 profiles 與 Authentication Users。`
    );

    if (!ok) return;

    updateLocalMember(member.id, { deleting: true });

    try {
      const res = await fetch("/api/admin/members/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "刪除會員失敗");
        return;
      }

      alert("會員已完整刪除");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("刪除會員失敗");
    } finally {
      updateLocalMember(member.id, { deleting: false });
    }
  }

  function formatDate(value: string | null) {
    if (!value) return "未設定";
    return new Date(value).toLocaleString("zh-TW");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">會員管理</h1>

      {message && (
        <div className="rounded bg-green-50 border border-green-200 text-green-700 px-3 py-2">
          {message}
        </div>
      )}

      <input
        placeholder="搜尋 Email / UID / 角色"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {loading && <div>載入中...</div>}

      {!loading &&
        filteredMembers.map((member) => {
          const userId = getUserId(member);

          return (
            <div key={member.id} className="border p-4 rounded space-y-3">
              <div className="font-semibold">📧 {member.email || "無 Email"}</div>

              <div className="text-xs text-gray-500 break-all">
                UID：{userId}
              </div>

              <div className="text-sm">
                VIP 到期：{formatDate(member.membership_expires_at)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select
                  value={member.role || "user"}
                  onChange={(e) =>
                    updateLocalMember(member.id, { role: e.target.value })
                  }
                  className="border p-2 rounded"
                >
                  <option value="user">一般會員</option>
                  <option value="borrower">借款會員</option>
                  <option value="lender">金主會員</option>
                  <option value="admin">管理員</option>
                </select>

                <select
                  value={member.membership_plan || "free"}
                  onChange={(e) =>
                    updateLocalMember(member.id, {
                      membership_plan: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                >
                  <option value="free">免費會員</option>
                  <option value="monthly">月費會員</option>
                  <option value="yearly">年費會員</option>
                  <option value="vip">VIP</option>
                </select>

                <select
                  value={member.membership_status || "inactive"}
                  onChange={(e) =>
                    updateLocalMember(member.id, {
                      membership_status: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                >
                  <option value="inactive">未啟用</option>
                  <option value="active">啟用中</option>
                  <option value="expired">已到期</option>
                  <option value="suspended">停權</option>
                </select>
              </div>

              <input
                type="datetime-local"
                value={
                  member.membership_expires_at
                    ? new Date(member.membership_expires_at)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  updateLocalMember(member.id, {
                    membership_expires_at: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
                className="border p-2 rounded w-full"
              />

              <input
                placeholder="管理員備註"
                value={member.admin_note || ""}
                onChange={(e) =>
                  updateLocalMember(member.id, {
                    admin_note: e.target.value,
                  })
                }
                className="border p-2 rounded w-full"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => activatePlan(userId, "monthly", 30)}
                  className="bg-blue-600 text-white px-3 py-2 rounded"
                >
                  開通月費會員 30天
                </button>

                <button
                  onClick={() => activatePlan(userId, "yearly", 395)}
                  className="bg-purple-600 text-white px-3 py-2 rounded"
                >
                  開通年費會員 395天
                </button>

                <button
                  onClick={() => cancelVip(userId)}
                  className="bg-gray-600 text-white px-3 py-2 rounded"
                >
                  取消 VIP
                </button>

                <button
                  onClick={() => saveMember(member)}
                  disabled={member.saving}
                  className="bg-black text-white px-3 py-2 rounded disabled:opacity-50"
                >
                  {member.saving ? "儲存中..." : "儲存修改"}
                </button>

                <button
                  onClick={() => deleteMember(member)}
                  disabled={member.deleting}
                  className="bg-red-600 text-white px-3 py-2 rounded disabled:opacity-50"
                >
                  {member.deleting ? "刪除中..." : "刪除會員"}
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}