"use client";

import { useEffect, useMemo, useState } from "react";

type MemberRow = {
  id: string;
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
      (m.email || "").toLowerCase().includes(keyword)
    );
  }, [members, search]);

  function updateLocalMember(id: string, patch: Partial<EditableMember>) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }

  async function saveMember(member: EditableMember) {
    updateLocalMember(member.id, { saving: true });

    try {
      await fetch("/api/admin/members/update", {
        method: "POST",
        body: JSON.stringify({
          userId: member.id,
          membership_plan: member.membership_plan,
          membership_status: member.membership_status,
          membership_expires_at: member.membership_expires_at,
          admin_note: member.admin_note,
        }),
      });

      setMessage("已更新");
      fetchMembers();
    } catch (err) {
      console.error(err);
    } finally {
      updateLocalMember(member.id, { saving: false });
    }
  }

  // 🔥 一鍵開通 VIP
  async function quickActivate(userId: string, days: number) {
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(now.getDate() + days);

    try {
      await fetch("/api/admin/members/update", {
        method: "POST",
        body: JSON.stringify({
          userId,
          membership_plan: "vip",
          membership_status: "active",
          membership_expires_at: expires.toISOString(),
          admin_note: `開通 ${days} 天 VIP`,
        }),
      });

      alert(`已開通 ${days} 天 VIP`);
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">會員管理</h1>

      <input
        placeholder="搜尋 Email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {loading && <div>載入中...</div>}

      {!loading &&
        filteredMembers.map((member) => (
          <div key={member.id} className="border p-4 rounded space-y-3">
            <div>📧 {member.email}</div>
            <div>👤 角色：{member.role}</div>

            <select
              value={member.membership_plan || "free"}
              onChange={(e) =>
                updateLocalMember(member.id, {
                  membership_plan: e.target.value,
                })
              }
            >
              <option value="free">free</option>
              <option value="vip">vip</option>
            </select>

            <select
              value={member.membership_status || "inactive"}
              onChange={(e) =>
                updateLocalMember(member.id, {
                  membership_status: e.target.value,
                })
              }
            >
              <option value="inactive">inactive</option>
              <option value="active">active</option>
            </select>

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
                  membership_expires_at: new Date(
                    e.target.value
                  ).toISOString(),
                })
              }
            />

            <input
              placeholder="備註"
              value={member.admin_note || ""}
              onChange={(e) =>
                updateLocalMember(member.id, {
                  admin_note: e.target.value,
                })
              }
              className="border p-1 rounded w-full"
            />

            {/* 🔥 一鍵開通 */}
            <div className="flex gap-2">
              <button
                onClick={() => quickActivate(member.id, 7)}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                7天
              </button>

              <button
                onClick={() => quickActivate(member.id, 30)}
                className="bg-blue-600 text-white px-2 py-1 rounded"
              >
                30天
              </button>

              <button
                onClick={() => quickActivate(member.id, 90)}
                className="bg-purple-600 text-white px-2 py-1 rounded"
              >
                90天
              </button>
            </div>

            <button
              onClick={() => saveMember(member)}
              className="bg-black text-white px-3 py-1 rounded"
            >
              儲存
            </button>
          </div>
        ))}
    </div>
  );
}