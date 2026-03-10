import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 放行 admin 登入頁，避免無限重導
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 只保護 /admin 後台其他頁面
  if (pathname.startsWith("/admin")) {
    const adminAuth = request.cookies.get("admin_auth")?.value;

    if (adminAuth !== "ok") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};