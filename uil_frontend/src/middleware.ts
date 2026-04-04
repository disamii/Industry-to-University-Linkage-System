import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { UserRole } from "./lib/enums";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const redirectToUnauthorized = NextResponse.redirect(
    new URL("/unauthorized", request.url),
  );

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (token && pathname.startsWith("/dashboard")) {
    try {
      const payload = decodeJwt(token);

      // Implemented later when refresh token is implemented
      // // Check token expiration
      // const now = Math.floor(Date.now() / 1000); // current time in seconds
      // if (payload.exp && payload.exp < now) {
      //   // Token expired
      //   return NextResponse.redirect(new URL("/signin", request.url));
      // }

      const role = payload.role as UserRole;

      // Role-based route guarding
      if (pathname.startsWith("/dashboard/office") && role !== UserRole.ADMIN)
        return redirectToUnauthorized;

      if (
        pathname.startsWith("/dashboard/industry") &&
        role !== UserRole.INDUSTRY
      )
        return redirectToUnauthorized;

      if (pathname.startsWith("/dashboard/staff") && role !== UserRole.USER)
        return redirectToUnauthorized;
    } catch (e) {
      // If token is malformed
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
