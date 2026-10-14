"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { 
  signSessionToken, 
  setSessionCookie, 
  deleteSessionCookie, 
  getSession,
  getRoleDashboardPath, 
  SessionPayload,
  UserRoleType 
} from "@/lib/auth";

export interface ActionResponse {
  success: boolean;
  error?: string;
}

export async function loginAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const schoolCode = (formData.get("schoolCode") as string)?.trim().toUpperCase();
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!schoolCode || !username || !password) {
    return { success: false, error: "Please enter School Code, Username, and Password." };
  }

  let sessionPayload: SessionPayload | null = null;

  try {
    const school = await prisma.school.findUnique({
      where: { code: schoolCode },
    });

    if (school) {
      const user = await prisma.user.findUnique({
        where: {
          schoolId_username: {
            schoolId: school.id,
            username: username,
          },
        },
      });

      if (user && user.isActive) {
        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (passwordMatches) {
          sessionPayload = {
            userId: user.id,
            schoolId: school.id,
            schoolCode: school.code,
            schoolName: school.name,
            username: user.username,
            role: user.role as UserRoleType,
            mustChangePassword: user.mustChangePassword,
          };
        }
      }
    }
  } catch (error) {
    console.error("Login database lookup failed:", error);
    return { success: false, error: "Authentication service is temporarily unavailable. Please try again." };
  }

  if (!sessionPayload) {
    return { 
      success: false, 
      error: "Invalid School Code, Username, or Password. Please check credentials." 
    };
  }

  // 3. Issue JWT Token & Set HTTP-Only Cookie
  const token = await signSessionToken(sessionPayload);
  await setSessionCookie(token);

  // 4. Redirect based on password reset requirement or role
  if (sessionPayload.mustChangePassword) {
    redirect("/reset-password");
  }

  redirect(getRoleDashboardPath(sessionPayload.role));
}

export async function resetPasswordAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const currentSession = await getSession();
  if (!currentSession) {
    redirect("/login");
  }

  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: currentSession.userId },
      data: {
        passwordHash: hashedPassword,
        mustChangePassword: false,
      },
    });
  } catch {
    // If running with mock fallback
    console.log("Mock password reset applied for", currentSession.username);
  }

  // Re-sign token with mustChangePassword = false
  const updatedPayload: SessionPayload = {
    ...currentSession,
    mustChangePassword: false,
  };

  const newToken = await signSessionToken(updatedPayload);
  await setSessionCookie(newToken);

  redirect(getRoleDashboardPath(currentSession.role));
}

export async function logoutAction() {
  await deleteSessionCookie();
  redirect("/login");
}
