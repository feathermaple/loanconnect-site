import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function updateStats(formData: FormData) {
  "use server";

  const applied = Number(formData.get("applied"));
  const members = Number(formData.get("members"));
  const closed = Number(formData.get("closed"));

  const supabase = createAdminClient();

  await supabase
    .from("site_stats")
    .update({
      applied_count: applied,
      member_count: members,
      closed_count: closed,
      updated_at: new Date().toISOString(),
    })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  revalidatePath("/");
}

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("site_stats")
    .select("*")
    .limit(1)
    .single();

  return (
    <div className="space-y-6 max-w-xl">

      <h1 className="text-3xl font-bold text-[#2f2a25]">
        首頁數據設定
      </h1>

      <form action={updateStats} className="space-y-4 bg-white p-6 rounded-xl border">

        <div>
          <label className="block text-sm mb-1">已申請人數</label>
          <input
            name="applied"
            defaultValue={data?.applied_count}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">會員人數</label>
          <input
            name="members"
            defaultValue={data?.member_count}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">成功媒合</label>
          <input
            name="closed"
            defaultValue={data?.closed_count}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button className="bg-[#4b433b] text-white px-6 py-3 rounded-xl">
          更新數據
        </button>

      </form>
    </div>
  );
}