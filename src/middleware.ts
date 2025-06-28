import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuth =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuth) {
    const payload = await verifyToken(token);
    if (payload?.role === "MANAGER") {
      return NextResponse.redirect(new URL("/dashboard/manager", request.url));
    }
    if (payload?.role === "DRIVER") {
      return NextResponse.redirect(new URL("/dashboard/driver", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
