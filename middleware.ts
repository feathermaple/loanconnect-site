import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminAuth = request.cookies.get("admin_auth")?.value;

  const isLoginPage = pathname === "/admin/login";

  // ✅ 已登入還進 login → 直接送去後台
  if (isLoginPage && adminAuth === "ok") {
    return NextResponse.redirect(new URL("/admin/leads", request.url));
  }

  // ✅ 保護後台
  if (pathname.startsWith("/admin") && !isLoginPage) {
    if (adminAuth !== "ok") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};