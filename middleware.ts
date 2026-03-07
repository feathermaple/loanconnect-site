import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {

    const adminAuth = request.cookies.get("admin_auth")?.value;

    if (adminAuth !== "ok") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};