"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function AnalyticsPage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const { count } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    setCount(count || 0);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">網站數據</h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <div className="text-gray-500 text-sm">總申請數</div>
          <div className="text-3xl font-bold mt-2">{count}</div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="text-gray-500 text-sm">今日申請</div>
          <div className="text-3xl font-bold mt-2">--</div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="text-gray-500 text-sm">成交率</div>
          <div className="text-3xl font-bold mt-2">--%</div>
        </div>

      </div>
    </div>
  );
}