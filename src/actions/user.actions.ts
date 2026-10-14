"use server";

import bcrypt from "bcryptjs";
import prisma, { isDatabaseConfigured } from "@/lib/prisma";
import { getSession, UserRoleType } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export interface StaffActionResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: {
    id: string;
    username: string;
    fullName: string | null;
    role: UserRoleType;
  };
}

const ASSIGNABLE_STAFF_ROLES: UserRoleType[] = ["PRINCIPAL", "ACCOUNTS", "TEACHER"];

const ROLE_LABEL: Record<string, string> = {
  PRINCIPAL: "Principal",
  ACCOUNTS: "Accounts",
  TEACHER: "Teacher",
};

export async function createUserAction(
  _prev: StaffActionResponse | null,
  formData: FormData
): Promise<StaffActionResponse> {
  if (!isDatabaseConfigured()) {
    return { success: false, error: "Database not configured." };
  }

  const session = await getSession();
  if (!session) {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }
  if (session.role !== "SCHOOL_ADMIN" && session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only school administrators can create staff accounts." };
  }
  const schoolId = session.schoolId;
  if (!schoolId) {
    return { success: false, error: "No school is associated with your account." };
  }

  const rawRole = String(formData.get("role") ?? "").trim().toUpperCase();
  const role = ASSIGNABLE_STAFF_ROLES.includes(rawRole as UserRoleType)
    ? (rawRole as UserRoleType)
    : null;
  if (!role) {
    return { success: false, error: "Please select a valid role (Principal, Accounts or Teacher)." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const designation = String(formData.get("designation") ?? "").trim();

  if (fullName.length < 2 || fullName.length > 80) {
    return { success: false, error: "Full name must be 2–80 characters." };
  }
  if (username.length < 3 || username.length > 30) {
    return { success: false, error: "Username must be 3–30 characters." };
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return {
      success: false,
      error: "Username can only contain letters, numbers, dot, underscore and hyphen.",
    };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (phone && !/^[0-9+\-\s()]{6,15}$/.test(phone)) {
    return { success: false, error: "Please enter a valid phone number." };
  }
  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { success: false, error: "Passwords do not match." };
  }

  const clash = await prisma.user.findUnique({
    where: { schoolId_username: { schoolId, username } },
    select: { id: true },
  });
  if (clash) {
    return {
      success: false,
      error: "This username is already taken within your school. Please choose another.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        schoolId,
        username,
        fullName,
        passwordHash,
        role,
        email: email || null,
        phone: phone || null,
        mustChangePassword: true,
      },
      select: { id: true, username: true, fullName: true, role: true },
    });

    if (role === "TEACHER") {
      await tx.teacher.create({
        data: {
          userId: created.id,
          fullName,
          employeeId: employeeId || null,
          designation: designation || null,
        },
      });
    }

    return created;
  });

  await recordAuditLog({
    schoolId,
    userId: session.userId,
    userRole: session.role,
    action: "STAFF_ACCOUNT_CREATED",
    entityType: "User",
    entityId: user.id,
    newValues: {
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      email: email || null,
      phone: phone || null,
      mustChangePassword: true,
      ...(role === "TEACHER" ? { employeeId: employeeId || null, designation: designation || null } : {}),
    },
  });

  return {
    success: true,
    message: `${ROLE_LABEL[role]} account created. They must change their password on first sign-in.`,
    data: { id: user.id, username: user.username, fullName: user.fullName, role: user.role },
  };
}
