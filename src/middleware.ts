import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected =
    pathname.startsWith("/manager") || pathname.startsWith("/driver");

  const isAuth = pathname === "/login" || pathname === "/register";

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuth) {
    try {
      const payload = await verifyToken(token);

      if (payload?.role === "MANAGER") {
        return NextResponse.redirect(new URL("/manager/orders", request.url));
      }

      if (payload?.role === "DRIVER") {
        return NextResponse.redirect(new URL("/driver/orders", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manager/:path*", "/driver/:path*", "/login", "/register"],
};
