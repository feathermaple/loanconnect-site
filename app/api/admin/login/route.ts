import { NextRequest, NextResponse } from "next/server";

const PASSWORD =
  process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!PASSWORD) {
      return NextResponse.json(
        { error: "尚未設定 ADMIN_PASSWORD 或 NEXT_PUBLIC_ADMIN_PASSWORD" },
        { status: 500 }
      );
    }

    if (password !== PASSWORD) {
      return NextResponse.json({ error: "密碼錯誤" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set("admin_auth", "ok", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "登入失敗" }, { status: 500 });
  }
}