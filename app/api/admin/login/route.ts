import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "請輸入密碼" }, { status: 400 });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "密碼錯誤" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_auth", "ok", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "server error" },
      { status: 500 }
    );
  }
}