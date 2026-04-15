import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const adminCards = [
  {
    title: "儀表板",
    description: "查看網站整體數據與後台狀態",
    href: "/admin/dashboard",
  },
  {
    title: "名單管理",
    description: "查看與管理借款需求、放款廣告、各區金主名單",
    href: "/admin/leads",
  },
  {
    title: "文章管理",
    description: "管理 SEO 文章與內容發布",
    href: "/admin/articles",
  },
  {
    title: "會員管理",
    description: "手動調整會員方案、狀態、到期日",
    href: "/admin/members",
  },
  {
    title: "訂單紀錄",
    description: "查看會員付款、方案與訂單狀態",
    href: "/admin/orders",
  },
];

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/member");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">管理後台</h1>
          <p className="mt-2 text-sm text-slate-600">
            請選擇要進入的管理功能。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-lg font-bold text-slate-900">
                {card.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}