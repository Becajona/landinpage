import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protege /admin excepto /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const has = req.cookies.get("admin_token")?.value;
    if (!has) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
