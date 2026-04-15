import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  const isLoginPage = pathname === "/login";
  const isMemberPage = pathname.startsWith("/member");
  const isAdminPage = pathname.startsWith("/admin");
  const isOldDashboardPage = pathname.startsWith("/dashboard");

  if (isOldDashboardPage) {
    return NextResponse.redirect(new URL("/member", request.url));
  }

  if (isMemberPage && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  }

  if (isLoginPage && user) {
    return NextResponse.redirect(new URL("/member", request.url));
  }

  if (isAdminPage) {
    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/member", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/login", "/member/:path*", "/dashboard/:path*", "/admin/:path*"],
};