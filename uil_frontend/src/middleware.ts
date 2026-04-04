// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { UserRole } from "./lib/enums";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Public redirect for missing tokens
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (token && pathname.startsWith("/dashboard")) {
    try {
      const payload = decodeJwt(token);
      const role = payload.role as UserRole;

      // 2. Role-based route guarding
      const rolePaths: Record<string, UserRole> = {
        "/dashboard/office": UserRole.ADMIN,
        "/dashboard/industry": UserRole.INDUSTRY,
        "/dashboard/staff": UserRole.USER,
      };

      for (const [path, requiredRole] of Object.entries(rolePaths)) {
        if (pathname.startsWith(path) && role !== requiredRole) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      }
    } catch (e: any) {
      console.error(e);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
