"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export interface AttendanceRecordInput {
  enrollmentId: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remarks?: string;
}

export interface AttendanceActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  presentCount?: number;
  absentCount?: number;
  lateCount?: number;
}

export async function saveDailyAttendanceAction(
  dateStr: string,
  records: AttendanceRecordInput[]
): Promise<AttendanceActionResponse> {
  const session = await getSession();
  if (!session || (session.role !== "TEACHER" && session.role !== "SCHOOL_ADMIN")) {
    return { success: false, error: "Unauthorized. Class Teacher or Admin access required." };
  }

  if (!records || records.length === 0) {
    return { success: false, error: "No student records provided for attendance." };
  }

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;

  try {
    const attendanceDate = new Date(dateStr);

    // 1. Verify all enrollmentIds belong to this school (tenant isolation)
    const enrollmentIds = records.map((r) => r.enrollmentId);
    const validEnrollments = await prisma.enrollment.findMany({
      where: {
        id: { in: enrollmentIds },
        student: { schoolId: session.schoolId },
      },
      select: { id: true },
    });

    const validIdSet = new Set(validEnrollments.map((e) => e.id));
    const invalidIds = enrollmentIds.filter((id) => !validIdSet.has(id));

    if (invalidIds.length > 0) {
      return {
        success: false,
        error: `Unauthorized: ${invalidIds.length} enrollment(s) do not belong to your school. Attendance not saved.`,
      };
    }

    // 2. Atomically upsert all attendance records
    await prisma.$transaction(
      records.map((record) =>
        prisma.attendance.upsert({
          where: {
            enrollmentId_date: {
              enrollmentId: record.enrollmentId,
              date: attendanceDate,
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks || null,
            markedById: session.userId,
          },
          create: {
            schoolId: session.schoolId,
            enrollmentId: record.enrollmentId,
            date: attendanceDate,
            status: record.status,
            remarks: record.remarks || null,
            markedById: session.userId,
          },
        })
      )
    );

    revalidatePath("/dashboard/teacher");
    revalidatePath("/dashboard/principal");

    return {
      success: true,
      message: `Attendance saved for ${dateStr}: ${presentCount} Present, ${absentCount} Absent, ${lateCount} Late.`,
      presentCount,
      absentCount,
      lateCount,
    };
  } catch (error) {
    console.error("Failed to save attendance:", error);
    return { success: false, error: "Database error while saving attendance. Nothing was persisted." };
  }
}
