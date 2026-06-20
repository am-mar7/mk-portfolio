import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Guard all /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const isLoginPath = pathname === "/admin/login";

    let session = null;
    if (sessionCookie) {
      session = await verifySession(sessionCookie);
    }

    if (!session) {
      // Unauthenticated -> redirect to /admin/login
      if (!isLoginPath) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      // Authenticated -> redirect to dashboard if hitting /admin/login
      if (isLoginPath) {
        const adminUrl = new URL("/admin", request.url);
        return NextResponse.redirect(adminUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
