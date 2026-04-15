import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: {
      persistSession: true,   // ✅ 關鍵
      autoRefreshToken: true, // ✅ 建議
      detectSessionInUrl: true, // ✅ 防 redirect 問題
    },
  }
);