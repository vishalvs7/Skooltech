"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export interface NoticeActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * STEP 8: School Admin or Principal publishes an institutional notice
 */
export async function createNoticeAction(
  prevState: NoticeActionResponse | null,
  formData: FormData
): Promise<NoticeActionResponse> {
  const session = await getSession();
  if (!session || (session.role !== "SCHOOL_ADMIN" && session.role !== "PRINCIPAL")) {
    return { success: false, error: "Unauthorized. Admin or Principal privileges required." };
  }

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const targetRole = (formData.get("targetRole") as string)?.trim() || "ALL";

  if (!title || title.length < 4 || !content || content.length < 10) {
    return { success: false, error: "Notice title (min 4 chars) and content (min 10 chars) are required." };
  }

  const validRoles = ["ALL", "TEACHER", "STUDENT"];
  if (!validRoles.includes(targetRole)) {
    return { success: false, error: "Invalid target audience selected." };
  }

  try {
    const notice = await prisma.notice.create({
      data: {
        schoolId: session.schoolId,
        title,
        content,
        targetRole,
        createdById: session.userId,
      },
    });

    // Record Immutable Audit Log
    await recordAuditLog({
      schoolId: session.schoolId,
      userId: session.userId,
      userRole: session.role,
      action: "NOTICE_PUBLISHED",
      entityType: "notices",
      entityId: notice.id,
      newValues: {
        title,
        targetRole,
        author: session.username,
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/principal");
    revalidatePath("/dashboard/teacher");
    revalidatePath("/dashboard/student");

    return {
      success: true,
      message: `Announcement "${title}" successfully published to audience: ${targetRole}.`,
    };
  } catch (error) {
    console.error("Failed to publish notice:", error);
    return { success: false, error: "Database error while broadcasting notice." };
  }
}
