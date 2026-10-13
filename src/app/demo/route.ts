import { NextResponse } from "next/server";
import { signSessionToken, SESSION_COOKIE_NAME, SessionPayload, UserRoleType } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roleParam = searchParams.get("role")?.toLowerCase();

  let targetRole: UserRoleType = "SCHOOL_ADMIN";
  let username = "admin_demo";
  let targetPath = "/dashboard/admin";

  if (roleParam === "teacher") {
    targetRole = "TEACHER";
    username = "teacher_sharma";
    targetPath = "/dashboard/teacher";
  } else if (roleParam === "principal") {
    targetRole = "PRINCIPAL";
    username = "principal_demo";
    targetPath = "/dashboard/principal";
  } else if (roleParam === "accounts") {
    targetRole = "ACCOUNTS";
    username = "accounts_demo";
    targetPath = "/dashboard/accounts";
  } else if (roleParam === "student") {
    targetRole = "STUDENT";
    username = "ADM-1001";
    targetPath = "/dashboard/student";
  }

  const payload: SessionPayload = {
    userId: `demo-user-${username}`,
    schoolId: "demo-school-greenwood-001",
    schoolCode: "DEMO01",
    schoolName: "Delhi Public Heritage School",
    username,
    role: targetRole,
    mustChangePassword: false,
  };

  const token = await signSessionToken(payload);
  const response = NextResponse.redirect(new URL(targetPath, request.url));

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
