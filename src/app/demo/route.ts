import { NextResponse } from "next/server";
import { signSessionToken, SESSION_COOKIE_NAME, SessionPayload, UserRoleType } from "@/lib/auth";
import prisma from "@/lib/prisma";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const DEMO_USERNAMES: Record<string, string> = {
  admin: "admin_demo",
  teacher: "teacher_sharma",
  principal: "principal_demo",
  accounts: "accounts_demo",
  student: "ADM-1001",
};

// Dev-only convenience route for instant demo login. Disabled in production.
export async function GET(request: Request) {
  if (IS_PRODUCTION) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const roleParam = searchParams.get("role")?.toLowerCase() || "admin";
  const username = DEMO_USERNAMES[roleParam] || "admin_demo";

  // Look up the real user from the database
  const user = await prisma.user.findFirst({
    where: { username },
    include: { school: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: `Demo user '${username}' not found. Run 'npx prisma db seed' first.` },
      { status: 404 }
    );
  }

  const payload: SessionPayload = {
    userId: user.id,
    schoolId: user.schoolId,
    schoolCode: user.school.code,
    schoolName: user.school.name,
    username: user.username,
    role: user.role as UserRoleType,
    mustChangePassword: user.mustChangePassword,
  };

  const token = await signSessionToken(payload);
  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
