import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "skooltech-super-secret-development-key-32chars";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const SESSION_COOKIE_NAME = "skooltech_session";

interface DecodedSession {
  userId: string;
  schoolId: string;
  schoolCode: string;
  schoolName: string;
  username: string;
  role: "SUPER_ADMIN" | "SCHOOL_ADMIN" | "PRINCIPAL" | "ACCOUNTS" | "TEACHER" | "STUDENT";
  mustChangePassword: boolean;
}

function getRoleHome(role: DecodedSession["role"]): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "SCHOOL_ADMIN":
      return "/dashboard/admin";
    case "PRINCIPAL":
      return "/dashboard/principal";
    case "ACCOUNTS":
      return "/dashboard/accounts";
    case "TEACHER":
      return "/dashboard/teacher";
    case "STUDENT":
      return "/dashboard/student";
    default:
      return "/dashboard/student";
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let session: DecodedSession | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as unknown as DecodedSession;
    } catch {
      session = null;
    }
  }

  // 1. Unauthenticated users trying to access dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Force password reset if flagged
    if (session.mustChangePassword) {
      return NextResponse.redirect(new URL("/reset-password", request.url));
    }

    // Role-based route gating
    const role = session.role;
    const isSuperOrAdmin = role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN";

    if (pathname.startsWith("/dashboard/admin") && !isSuperOrAdmin) {
      return NextResponse.redirect(new URL(getRoleHome(role), request.url));
    }
    if (pathname.startsWith("/dashboard/principal") && role !== "PRINCIPAL" && !isSuperOrAdmin) {
      return NextResponse.redirect(new URL(getRoleHome(role), request.url));
    }
    if (pathname.startsWith("/dashboard/accounts") && role !== "ACCOUNTS" && !isSuperOrAdmin) {
      return NextResponse.redirect(new URL(getRoleHome(role), request.url));
    }
    if (pathname.startsWith("/dashboard/teacher") && role !== "TEACHER" && !isSuperOrAdmin) {
      return NextResponse.redirect(new URL(getRoleHome(role), request.url));
    }
    if (pathname.startsWith("/dashboard/student") && role !== "STUDENT" && !isSuperOrAdmin) {
      return NextResponse.redirect(new URL(getRoleHome(role), request.url));
    }

    // Inject School Tenant ID into request headers for downstream Server Components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-school-id", session.schoolId);
    requestHeaders.set("x-user-role", session.role);
    requestHeaders.set("x-user-id", session.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. Redirect logged-in users away from /login
  if (pathname === "/login") {
    if (session) {
      if (session.mustChangePassword) {
        return NextResponse.redirect(new URL("/reset-password", request.url));
      }
      return NextResponse.redirect(new URL(getRoleHome(session.role), request.url));
    }
  }

  // 3. Prevent access to /reset-password if not authenticated or not required
  if (pathname === "/reset-password") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!session.mustChangePassword) {
      return NextResponse.redirect(new URL(getRoleHome(session.role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/reset-password",
  ],
};
