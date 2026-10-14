"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma, { isDatabaseConfigured } from "@/lib/prisma";
import {
  BLOCKED_SLUGS,
  REGISTRATION_COOKIE_NAME,
  codePrefixFromName,
  normalizeSlug,
  signRegistrationToken,
  validateSchoolName,
  validateSlugFormat,
  verifyRegistrationToken,
} from "@/lib/registration";
import { recordAuditLog } from "@/lib/audit";
import { getSession } from "@/lib/auth";
import { resolvePlan } from "@/lib/plans";
import { createBillingOrder, verifyBillingPayment, BillingMode } from "@/lib/billing";

export interface RegistrationActionResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: {
    schoolId: string;
    slug: string;
    code: string;
    name: string;
    subdomain: string;
  };
  available?: boolean;
  reason?: string;
  adminUsername?: string;
  order?: {
    mode: BillingMode;
    orderId: string;
    amountInr: number;
    keyId: string | null;
    planId: string;
    planName: string;
  };
  activated?: {
    slug: string;
    code: string;
    name: string;
    subdomain: string;
    planName: string;
    currentPeriodEnd: string;
  };
}

function subdomainHost(slug: string): string {
  const root = process.env.ROOT_DOMAIN || "skooltech.com";
  return `${slug}.${root}`;
}

export async function checkUsernameAvailabilityAction(
  rawUsername: string
): Promise<RegistrationActionResponse> {
  if (!isDatabaseConfigured()) {
    return { success: false, available: false, reason: "Database not configured." };
  }

  const slug = normalizeSlug(rawUsername);

  if (slug.length < 3) {
    return { success: true, available: false, reason: "Too short — minimum 3 characters." };
  }

  const formatError = validateSlugFormat(slug);
  if (formatError) {
    return { success: true, available: false, reason: formatError };
  }

  if (BLOCKED_SLUGS.has(slug)) {
    return {
      success: true,
      available: false,
      reason: "This username is reserved. Please choose another.",
    };
  }

  const existing = await prisma.school.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existing) {
    return {
      success: true,
      available: false,
      reason: "This username is already taken.",
    };
  }

  return { success: true, available: true };
}

export async function registerSchoolIdentityAction(
  _prev: RegistrationActionResponse | null,
  formData: FormData
): Promise<RegistrationActionResponse> {
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Database not configured." };
  }

  const rawName = String(formData.get("schoolName") ?? "");
  const rawUsername = String(formData.get("username") ?? "");

  const nameError = validateSchoolName(rawName);
  if (nameError) {
    return { success: false, error: nameError };
  }

  const slug = normalizeSlug(rawUsername);
  const slugError = validateSlugFormat(slug);
  if (slugError) {
    return { success: false, error: slugError };
  }

  if (BLOCKED_SLUGS.has(slug)) {
    return {
      success: false,
      error: "This username is reserved. Please choose another.",
    };
  }

  const cookieStore = await cookies();
  const existingToken = cookieStore.get(REGISTRATION_COOKIE_NAME)?.value;
  const name = rawName.trim();

  if (existingToken) {
    const payload = await verifyRegistrationToken(existingToken);
    if (payload) {
      const school = await prisma.school.findUnique({
        where: { id: payload.schoolId },
        select: { id: true, status: true, name: true, slug: true, code: true },
      });

      if (school && school.status === "UNPAID") {
        if (school.slug === slug) {
          const updated =
            school.name === name
              ? school
              : await prisma.school.update({
                  where: { id: school.id },
                  data: { name },
                  select: { id: true, name: true, slug: true, code: true },
                });

          return {
            success: true,
            message: "Registration resumed.",
            data: {
              schoolId: updated.id,
              slug: updated.slug,
              code: updated.code,
              name: updated.name,
              subdomain: subdomainHost(updated.slug),
            },
          };
        }

        return {
          success: false,
          error: `A registration is already in progress for "${school.name}" (${school.slug}). Choose "Register a different school" to start over.`,
        };
      }

      cookieStore.delete(REGISTRATION_COOKIE_NAME);
    }
  }

  const slugTaken = await prisma.school.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (slugTaken) {
    return {
      success: false,
      error: "This username is already taken. Please choose another.",
    };
  }

  const prefix = codePrefixFromName(name);
  let code = "";
  for (let i = 1; i <= 99; i++) {
    const candidate = `${prefix}${String(i).padStart(2, "0")}`;
    const clash = await prisma.school.findUnique({
      where: { code: candidate },
      select: { id: true },
    });
    if (!clash) {
      code = candidate;
      break;
    }
  }
  if (!code) {
    return {
      success: false,
      error: "Could not generate a school code. Please contact support.",
    };
  }

  const school = await prisma.school.create({
    data: {
      code,
      slug,
      name,
      status: "UNPAID",
    },
    select: { id: true, name: true, slug: true, code: true },
  });

  await recordAuditLog({
    schoolId: school.id,
    action: "SCHOOL_REGISTERED",
    entityType: "School",
    entityId: school.id,
    newValues: { name: school.name, slug: school.slug, code: school.code, status: "UNPAID" },
  });

  const token = await signRegistrationToken({
    schoolId: school.id,
    slug: school.slug,
    code: school.code,
    name: school.name,
    step: 1,
  });

  cookieStore.set(REGISTRATION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return {
    success: true,
    message: "School identity reserved.",
    data: {
      schoolId: school.id,
      slug: school.slug,
      code: school.code,
      name: school.name,
      subdomain: subdomainHost(school.slug),
    },
  };
}

export async function startOverRegistrationAction(): Promise<RegistrationActionResponse> {
  const cookieStore = await cookies();
  cookieStore.delete(REGISTRATION_COOKIE_NAME);
  return { success: true, message: "Registration reset." };
}

interface RegistrationContext {
  schoolId: string;
  slug: string;
  code: string;
  name: string;
  step: number;
  id: string;
  status: "UNPAID" | "PAYMENT_PENDING" | "ACTIVE" | "SUSPENDED" | "EXPIRED";
  plan: string | null;
}

async function readRegistrationContext(): Promise<
  | { ok: true; payload: RegistrationContext }
  | { ok: false; error: string }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(REGISTRATION_COOKIE_NAME)?.value;
  if (!token) {
    return { ok: false, error: "Registration session expired. Please start over." };
  }
  const payload = await verifyRegistrationToken(token);
  if (!payload) {
    return { ok: false, error: "Registration session invalid. Please start over." };
  }
  const school = await prisma.school.findUnique({
    where: { id: payload.schoolId },
    select: { id: true, status: true, name: true, slug: true, code: true, plan: true },
  });
  if (!school) {
    return { ok: false, error: "Registered school not found. Please start over." };
  }
  return {
    ok: true,
    payload: {
      schoolId: school.id,
      slug: school.slug,
      code: school.code,
      name: school.name,
      step: payload.step,
      id: school.id,
      status: school.status,
      plan: school.plan,
    },
  };
}

export async function registerAdminAccountAction(
  _prev: RegistrationActionResponse | null,
  formData: FormData
): Promise<RegistrationActionResponse> {
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Database not configured." };
  }

  const ctx = await readRegistrationContext();
  if (!ctx.ok) return { success: false, error: ctx.error };
  const school = ctx.payload;

  const username = String(formData.get("adminUsername") ?? "").trim();
  const email = String(formData.get("adminEmail") ?? "").trim();
  const phone = String(formData.get("adminPhone") ?? "").trim();
  const password = String(formData.get("adminPassword") ?? "");
  const confirm = String(formData.get("adminConfirm") ?? "");

  if (username.length < 3 || username.length > 30) {
    return { success: false, error: "Admin username must be 3–30 characters." };
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return {
      success: false,
      error: "Admin username can only contain letters, numbers, dot, underscore and hyphen.",
    };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { success: false, error: "Passwords do not match." };
  }

  const clash = await prisma.user.findUnique({
    where: { schoolId_username: { schoolId: school.id, username } },
    select: { id: true },
  });
  if (clash) {
    return {
      success: false,
      error: "This admin username is already taken within your school.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      schoolId: school.id,
      username,
      passwordHash,
      role: "SCHOOL_ADMIN",
      email: email || null,
      phone: phone || null,
      mustChangePassword: false,
    },
    select: { id: true, username: true },
  });

  await recordAuditLog({
    schoolId: school.id,
    userId: user.id,
    userRole: "SCHOOL_ADMIN",
    action: "REGISTRATION_ADMIN_CREATED",
    entityType: "User",
    entityId: user.id,
    newValues: { username, email: email || null, role: "SCHOOL_ADMIN" },
  });

  const token = await signRegistrationToken({
    schoolId: school.id,
    slug: school.slug,
    code: school.code,
    name: school.name,
    step: 2,
  });
  const cookieStore = await cookies();
  cookieStore.set(REGISTRATION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return { success: true, message: "Admin account created.", adminUsername: username };
}

export async function createSubscriptionOrderAction(
  _prev: RegistrationActionResponse | null,
  formData: FormData
): Promise<RegistrationActionResponse> {
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Database not configured." };
  }

  const ctx = await readRegistrationContext();
  if (!ctx.ok) return { success: false, error: ctx.error };
  const school = ctx.payload;

  if (school.status === "ACTIVE") {
    return { success: false, error: "This school is already active." };
  }

  const planId = String(formData.get("planId") ?? "");
  const plan = resolvePlan(planId);
  if (!plan.selfServe) {
    return {
      success: false,
      error: "Enterprise plans are handled by our team. Please contact sales.",
    };
  }

  const order = await createBillingOrder(plan.amountInr, school.code, plan.id);

  await prisma.school.update({
    where: { id: school.id },
    data: { status: "PAYMENT_PENDING", plan: plan.id },
  });

  await recordAuditLog({
    schoolId: school.id,
    action: "SUBSCRIPTION_ORDER_CREATED",
    entityType: "School",
    entityId: school.id,
    newValues: {
      planId: plan.id,
      amountInr: plan.amountInr,
      orderId: order.orderId,
      mode: order.mode,
    },
  });

  return {
    success: true,
    order: {
      mode: order.mode,
      orderId: order.orderId,
      amountInr: order.amountInr,
      keyId: order.keyId,
      planId: plan.id,
      planName: plan.name,
    },
  };
}

export async function verifySubscriptionPaymentAction(
  _prev: RegistrationActionResponse | null,
  formData: FormData
): Promise<RegistrationActionResponse> {
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Database not configured." };
  }

  const ctx = await readRegistrationContext();
  if (!ctx.ok) return { success: false, error: ctx.error };
  const school = ctx.payload;

  const orderId = String(formData.get("orderId") ?? "");
  const paymentId = String(formData.get("paymentId") ?? "");
  const signature = String(formData.get("signature") ?? "") || undefined;
  const mode = (String(formData.get("mode") ?? "MOCK") as BillingMode) || "MOCK";

  if (!orderId || !paymentId) {
    return { success: false, error: "Missing payment reference." };
  }

  const verified = verifyBillingPayment({ mode, orderId, paymentId, signature });
  if (!verified.success) {
    return { success: false, error: verified.error || "Payment verification failed." };
  }

  const plan = resolvePlan(school.plan);
  const currentPeriodEnd = new Date();
  currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);

  await prisma.school.update({
    where: { id: school.id },
    data: { status: "ACTIVE", currentPeriodEnd },
  });

  await recordAuditLog({
    schoolId: school.id,
    action: "SCHOOL_ACTIVATED",
    entityType: "School",
    entityId: school.id,
    newValues: {
      orderId,
      paymentId,
      mode,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
    },
  });

  const cookieStore = await cookies();
  cookieStore.delete(REGISTRATION_COOKIE_NAME);

  return {
    success: true,
    message: "Payment verified. Your school is now active.",
    activated: {
      slug: school.slug,
      code: school.code,
      name: school.name,
      subdomain: subdomainHost(school.slug),
      planName: plan.name,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
    },
  };
}

export async function activateSchoolManualAction(
  _prev: RegistrationActionResponse | null,
  formData: FormData
): Promise<RegistrationActionResponse> {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only platform admins can manually activate a school." };
  }

  if (!isDatabaseConfigured()) {
    return { success: false, error: "Database not configured." };
  }

  const code = String(formData.get("schoolCode") ?? "").trim().toUpperCase();
  if (!code) {
    return { success: false, error: "Enter the school code." };
  }

  const school = await prisma.school.findUnique({
    where: { code },
    select: { id: true, status: true, name: true, slug: true, code: true },
  });
  if (!school) {
    return { success: false, error: "School not found." };
  }
  if (school.status === "ACTIVE") {
    return { success: false, error: "This school is already active." };
  }

  const currentPeriodEnd = new Date();
  currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);

  await prisma.school.update({
    where: { id: school.id },
    data: { status: "ACTIVE", currentPeriodEnd },
  });

  await recordAuditLog({
    schoolId: school.id,
    userId: session.userId,
    userRole: session.role,
    action: "SCHOOL_ACTIVATED_MANUAL",
    entityType: "School",
    entityId: school.id,
    newValues: { activatedBy: session.username, currentPeriodEnd: currentPeriodEnd.toISOString() },
  });

  return {
    success: true,
    message: `${school.name} activated manually.`,
    activated: {
      slug: school.slug,
      code: school.code,
      name: school.name,
      subdomain: subdomainHost(school.slug),
      planName: "Manual",
      currentPeriodEnd: currentPeriodEnd.toISOString(),
    },
  };
}

export async function releaseAbandonedRegistrationsAction(): Promise<{
  success: boolean;
  released: number;
}> {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, released: 0 };
  }

  if (!isDatabaseConfigured()) {
    return { success: false, released: 0 };
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  const stale = await prisma.school.findMany({
    where: {
      status: { in: ["UNPAID", "PAYMENT_PENDING"] },
      createdAt: { lt: cutoff },
    },
    select: { id: true, code: true },
  });

  if (stale.length === 0) {
    return { success: true, released: 0 };
  }

  const result = await prisma.school.deleteMany({
    where: { id: { in: stale.map((s) => s.id) } },
  });

  return { success: true, released: result.count };
}
