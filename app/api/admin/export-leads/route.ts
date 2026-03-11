import { createAdminClient } from "@/lib/supabase/admin";

function escapeCsvValue(value: unknown) {
  const str = String(value ?? "");

  if (
    str.includes('"') ||
    str.includes(",") ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("customer_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return new Response(`匯出失敗：${error.message}`, {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const rows = data ?? [];

    const headers = [
      "姓名",
      "電話",
      "LINE",
      "Email",
      "城市",
      "區域",
      "金額",
      "貸款類型",
      "需求",
      "狀態",
      "來源",
      "建立時間",
    ];

    const csvRows = rows.map((row: any) =>
      [
        row.name,
        row.phone,
        row.line_id,
        row.email,
        row.city,
        row.district,
        row.amount,
        row.loan_type,
        row.message,
        row.status,
        row.source,
        row.created_at,
      ]
        .map(escapeCsvValue)
        .join(",")
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const fileName = `leads-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response("\uFEFF" + csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    return new Response(`匯出失敗：${error?.message || "Unknown error"}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}