import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { UserRole } from "./lib/enums";

export async function middleware(request: NextRequest) {
  // FIX: Using "access_token" to match the Server Action
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Protect all dashboard routes
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (token && pathname.startsWith("/dashboard")) {
    try {
      const payload = decodeJwt(token);
      const role = payload.role as UserRole;

      // 2. Role-Based Route Guarding
      if (pathname.startsWith("/dashboard/office") && role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (
        pathname.startsWith("/dashboard/industry") &&
        role !== UserRole.INDUSTRY
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (pathname.startsWith("/dashboard/staff") && role !== UserRole.USER) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (e) {
      // If token is malformed or expired
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
