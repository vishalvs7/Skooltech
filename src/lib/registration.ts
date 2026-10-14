import { SignJWT, jwtVerify } from "jose";

let cachedSecret: Uint8Array | null = null;

function getJwtSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "JWT_SECRET environment variable is required in production. Set it to a strong random string (min 32 chars)."
      );
    }
    cachedSecret = new TextEncoder().encode("skooltech-super-secret-development-key-32chars");
    return cachedSecret;
  }
  cachedSecret = new TextEncoder().encode(secret);
  return cachedSecret;
}

export const REGISTRATION_COOKIE_NAME = "skooltech_registration";

export const BLOCKED_SLUGS = new Set([
  "www",
  "api",
  "admin",
  "app",
  "demo",
  "mail",
  "dashboard",
  "skooltech",
  "login",
  "register",
  "static",
  "assets",
  "cdn",
  "billing",
  "support",
  "help",
  "status",
  "docs",
  "blog",
  "careers",
  "legal",
  "privacy",
  "terms",
]);

export interface RegistrationPayload {
  schoolId: string;
  slug: string;
  code: string;
  name: string;
  step: number;
}

export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateSlugFormat(slug: string): string | null {
  if (slug.length < 3) return "Username must be at least 3 characters.";
  if (slug.length > 30) return "Username must be at most 30 characters.";
  if (!/^[a-z0-9]/.test(slug)) return "Username must start with a letter or number.";
  if (!/[a-z0-9]$/.test(slug)) return "Username must end with a letter or number.";
  if (!/^[a-z0-9-]+$/.test(slug))
    return "Username can only contain lowercase letters, numbers and hyphens.";
  if (slug.includes("--")) return "Username cannot contain consecutive hyphens.";
  return null;
}

export function validateSchoolName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 3) return "School name must be at least 3 characters.";
  if (trimmed.length > 100) return "School name must be at most 100 characters.";
  return null;
}

export function codePrefixFromName(name: string): string {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "");
  if (letters.length >= 5) return letters.slice(0, 5);
  if (letters.length >= 3) return letters;
  return (letters + "SCH").slice(0, 5);
}

export async function signRegistrationToken(
  payload: RegistrationPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getJwtSecret());
}

export async function verifyRegistrationToken(
  token: string
): Promise<RegistrationPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as RegistrationPayload;
  } catch {
    return null;
  }
}
