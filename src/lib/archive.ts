import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession, getRoleDashboardPath, canAccessArchive } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";

export interface ArchiveContext {
  schoolId: string;
  userId: string;
  role: string;
}

export async function archiveContext(): Promise<
  { session: ArchiveContext; dbReady: true } | { session: null; dbReady: false }
> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessArchive(session.role)) redirect(getRoleDashboardPath(session.role));

  if (!isDatabaseConfigured()) {
    return { session: null, dbReady: false };
  }

  return {
    session: { schoolId: session.schoolId, userId: session.userId, role: session.role },
    dbReady: true,
  };
}

export async function getArchiveStudent(schoolId: string, studentId: string) {
  return prisma.student.findFirst({
    where: { id: studentId, schoolId },
    include: {
      transport: true,
      enrollments: {
        orderBy: { session: { startDate: "desc" } },
        include: {
          session: true,
          section: { include: { class: true } },
        },
      },
    },
  });
}

export async function requireArchiveStudent(schoolId: string, studentId: string) {
  const student = await getArchiveStudent(schoolId, studentId);
  if (!student) notFound();
  return student;
}

export function studentPlacement(student: {
  status: string;
  enrollments: {
    session: { name: string; isCurrent: boolean };
    section: { name: string; class: { name: string } };
  }[];
}): string {
  if (student.status === "ALUMNI") return "ALUMNI";
  if (student.status === "WITHDRAWN") return "WITHDRAWN";
  const latest = student.enrollments[0];
  if (!latest) return "NOT ENROLLED";
  return `${latest.section.class.name} - ${latest.section.name}`;
}

export function attendancePercent(counts: {
  PRESENT: number;
  ABSENT: number;
  LATE: number;
  EXCUSED: number;
}): number | null {
  const total = counts.PRESENT + counts.ABSENT + counts.LATE + counts.EXCUSED;
  if (total === 0) return null;
  return Math.round(((counts.PRESENT + counts.LATE) / total) * 1000) / 10;
}

export function emptyAttendanceCounts() {
  return { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0 } as {
    PRESENT: number;
    ABSENT: number;
    LATE: number;
    EXCUSED: number;
  };
}

export function gradeForPercent(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "E";
}

export const STATUS_BADGE: Record<string, "success" | "warning" | "danger" | "secondary" | "default"> = {
  ACTIVE: "success",
  PENDING_ACADEMIC: "warning",
  PENDING_FEE: "warning",
  ALUMNI: "secondary",
  WITHDRAWN: "danger",
};
