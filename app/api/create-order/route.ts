import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return NextResponse.json({ error: "無效的方案" }, { status: 400 });
    }

    return NextResponse.json({
      paymentUrl: `/fake-payment?plan=${plan}`,
    });
  } catch (error) {
    console.error("create-order error:", error);
    return NextResponse.json({ error: "建立訂單失敗" }, { status: 500 });
  }
}