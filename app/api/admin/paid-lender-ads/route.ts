import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient();
    const formData = await req.formData();

    const title = String(formData.get("title") || "");
    const company_name = String(formData.get("company_name") || "");
    const contact_name = String(formData.get("contact_name") || "");
    const region = String(formData.get("region") || "");
    const loan_types = String(formData.get("loan_types") || "");
    const min_amount = String(formData.get("min_amount") || "");
    const max_amount = String(formData.get("max_amount") || "");
    const phone = String(formData.get("phone") || "");
    const line_id = String(formData.get("line_id") || "");
    const ad_content = String(formData.get("ad_content") || "");
    const is_active = formData.get("is_active") === "true";
    const is_top = formData.get("is_top") === "true";
    const image = formData.get("image") as File | null;

    if (!title.trim()) {
      return NextResponse.json({ error: "請填寫廣告標題" }, { status: 400 });
    }

    let image_url: string | null = null;

    if (image && image.size > 0) {
      const ext = image.name.split(".").pop() || "jpg";
      const filePath = `paid-ads/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("paid-ads")
        .upload(filePath, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: `圖片上傳失敗：${uploadError.message}` },
          { status: 400 }
        );
      }

      const { data } = supabase.storage.from("paid-ads").getPublicUrl(filePath);
      image_url = data.publicUrl;
    }

    const { error } = await supabase.from("paid_lender_ads").insert({
      title,
      company_name: company_name || null,
      contact_name: contact_name || null,
      region: region || null,
      loan_types: loan_types || null,
      min_amount: min_amount ? Number(min_amount) : null,
      max_amount: max_amount ? Number(max_amount) : null,
      phone: phone || null,
      line_id: line_id || null,
      ad_content: ad_content || null,
      image_url,
      is_active,
      is_top,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "新增圖文廣告失敗" },
      { status: 500 }
    );
  }
}