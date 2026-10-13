"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export interface LeaveActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * STEP 8: Student or Parent submits a Leave Application
 */
export async function applyStudentLeaveAction(
  prevState: LeaveActionResponse | null,
  formData: FormData
): Promise<LeaveActionResponse> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized. Please log in to apply for leave." };
  }

  const startDateStr = (formData.get("startDate") as string)?.trim();
  const endDateStr = (formData.get("endDate") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || "MEDICAL";
  const reasonText = (formData.get("reason") as string)?.trim();
  const documentUrl = (formData.get("documentUrl") as string)?.trim();

  if (!startDateStr || !endDateStr || !reasonText) {
    return { success: false, error: "Start date, end date, and reason description are required." };
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (endDate < startDate) {
    return { success: false, error: "End date cannot be earlier than start date." };
  }

  try {
    // Locate student profile for current user
    let student = await prisma.student.findFirst({
      where: {
        schoolId: session.schoolId,
        userId: session.userId,
      },
    });

    // If session is an admin/parent submitting for demo student
    if (!student) {
      student = await prisma.student.findFirst({
        where: {
          schoolId: session.schoolId,
          admissionNo: session.username,
        },
      });
    }

    // Fallback to first student for sandbox demo if needed
    if (!student) {
      student = await prisma.student.findFirst({
        where: { schoolId: session.schoolId },
      });
    }

    if (!student) {
      return { success: false, error: "Active student profile not found." };
    }

    const fullReason = `[${category}] ${reasonText}`;

    const leave = await prisma.leaveApplication.create({
      data: {
        schoolId: session.schoolId,
        studentId: student.id,
        startDate,
        endDate,
        reason: fullReason,
        documentUrl: documentUrl || "/uploads/mock-medical-slip.pdf",
        status: "PENDING",
      },
    });

    // Audit log
    await recordAuditLog({
      schoolId: session.schoolId,
      userId: session.userId,
      userRole: session.role,
      action: "LEAVE_APPLIED",
      entityType: "leave_applications",
      entityId: leave.id,
      newValues: {
        studentAdmissionNo: student.admissionNo,
        category,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });

    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/teacher");

    return {
      success: true,
      message: `Leave application submitted from ${startDateStr} to ${endDateStr}. Sent to Class Teacher for approval.`,
    };
  } catch (error) {
    console.error("Failed to submit leave application:", error);
    return { success: false, error: "Database error while submitting leave application." };
  }
}

/**
 * STEP 8: Class Teacher or Principal Approves / Rejects a Leave Application
 */
export async function reviewLeaveAction(
  prevState: LeaveActionResponse | null,
  formData: FormData
): Promise<LeaveActionResponse> {
  const session = await getSession();
  if (
    !session ||
    (session.role !== "TEACHER" && session.role !== "PRINCIPAL" && session.role !== "SCHOOL_ADMIN")
  ) {
    return { success: false, error: "Unauthorized. Teacher or Principal access required." };
  }

  const leaveId = (formData.get("leaveId") as string)?.trim();
  const status = (formData.get("status") as string)?.trim() as "APPROVED" | "REJECTED";
  const teacherRemarks = (formData.get("remarks") as string)?.trim();

  if (!leaveId || !status || (status !== "APPROVED" && status !== "REJECTED")) {
    return { success: false, error: "Valid Leave ID and Decision (APPROVED / REJECTED) required." };
  }

  try {
    const existingLeave = await prisma.leaveApplication.findUnique({
      where: { id: leaveId },
      include: {
        student: true,
      },
    });

    if (!existingLeave) {
      return { success: false, error: "Leave application record not found." };
    }

    await prisma.leaveApplication.update({
      where: { id: leaveId },
      data: {
        status,
        reviewedById: session.userId,
      },
    });

    // Immutable Audit Log
    await recordAuditLog({
      schoolId: session.schoolId,
      userId: session.userId,
      userRole: session.role,
      action: "LEAVE_REVIEWED",
      entityType: "leave_applications",
      entityId: leaveId,
      oldValues: { status: existingLeave.status },
      newValues: {
        status,
        reviewedBy: session.username,
        studentAdmissionNo: existingLeave.student.admissionNo,
        teacherRemarks,
      },
    });

    revalidatePath("/dashboard/teacher");
    revalidatePath("/dashboard/student");

    return {
      success: true,
      message: `Leave application for ${existingLeave.student.fullName} has been ${status.toLowerCase()}.`,
    };
  } catch (error) {
    console.error("Failed to review leave application:", error);
    return { success: false, error: "Database error while updating leave status." };
  }
}
