import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "skooltech-super-secret-development-key-32chars";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
export const SESSION_COOKIE_NAME = "skooltech_session";

export type UserRoleType = 
  | "SUPER_ADMIN" 
  | "SCHOOL_ADMIN" 
  | "PRINCIPAL" 
  | "ACCOUNTS" 
  | "TEACHER" 
  | "STUDENT";

export interface SessionPayload {
  userId: string;
  schoolId: string;
  schoolCode: string;
  schoolName: string;
  username: string;
  role: UserRoleType;
  mustChangePassword: boolean;
}

/**
 * Sign a new JWT session token (valid for 7 days)
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verify and decode an incoming JWT session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Retrieve current user session from HTTP-only cookie in Server Components / Actions
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Set the authenticated session cookie
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Destroy the session cookie upon logout
 */
export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get the default landing path for a given role
 */
export function getRoleDashboardPath(role: UserRoleType): string {
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
