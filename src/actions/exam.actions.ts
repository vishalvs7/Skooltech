"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { evaluateReportCard, type ReportCardEvaluation } from "@/lib/grading-calculator";

export interface ExamActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  examId?: string;
  count?: number;
}

export interface StudentReportCardData {
  studentName: string;
  admissionNo: string;
  rollNo: string;
  className: string;
  sectionName: string;
  schoolName: string;
  affiliationNo: string;
  academicYear: string;
  examName: string;
  examType: string;
  gradingScale: "PERCENTAGE" | "CGPA_10" | "CGPA_5";
  evaluation: ReportCardEvaluation;
  attendancePresent: number;
  attendanceTotal: number;
  attendancePercentage: number;
}

/**
 * STEP 7: Teacher or Admin creates a spontaneous or scheduled Exam
 */
export async function createExamAction(
  prevState: ExamActionResponse | null,
  formData: FormData
): Promise<ExamActionResponse> {
  const session = await getSession();
  if (!session || (session.role !== "TEACHER" && session.role !== "SCHOOL_ADMIN" && session.role !== "PRINCIPAL")) {
    return { success: false, error: "Unauthorized. Teacher, Principal, or Admin access required." };
  }

  const name = (formData.get("name") as string)?.trim();
  const examType = (formData.get("examType") as string)?.trim() || "UNIT_TEST";
  const startDateStr = (formData.get("startDate") as string)?.trim();

  if (!name || name.length < 3) {
    return { success: false, error: "Exam title must be at least 3 characters (e.g. 'Class Test - Algebra')." };
  }

  const allowedTypes = ["UNIT_TEST", "CLASS_TEST", "MID_TERM", "FINAL"];
  if (!allowedTypes.includes(examType)) {
    return { success: false, error: "Invalid exam category selected." };
  }

  const startDate = startDateStr ? new Date(startDateStr) : new Date();

  try {
    const exam = await prisma.exam.create({
      data: {
        schoolId: session.schoolId,
        name,
        examType,
        startDate,
        createdById: session.userId,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        schoolId: session.schoolId,
        userId: session.userId,
        userRole: session.role,
        action: "EXAM_CREATED",
        entityType: "exams",
        entityId: exam.id,
        newValues: { name, examType, startDate: startDate.toISOString() },
      },
    });

    revalidatePath("/dashboard/teacher");
    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/principal");

    return {
      success: true,
      examId: exam.id,
      message: `Exam "${name}" successfully registered and scheduled.`,
    };
  } catch (error) {
    console.error("Failed to create exam:", error);
    return { success: false, error: "Database error while creating exam." };
  }
}

/**
 * STEP 7: Teacher records or updates raw marks matrix for students in a class
 */
export async function recordBatchMarksAction(
  prevState: ExamActionResponse | null,
  formData: FormData
): Promise<ExamActionResponse> {
  const session = await getSession();
  if (!session || (session.role !== "TEACHER" && session.role !== "SCHOOL_ADMIN" && session.role !== "PRINCIPAL")) {
    return { success: false, error: "Unauthorized. Teacher access required." };
  }

  const examId = (formData.get("examId") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const totalMarks = parseFloat((formData.get("totalMarks") as string) || "0");
  const marksJsonStr = formData.get("marksData") as string;

  if (!examId || !subject || totalMarks <= 0) {
    return { success: false, error: "Valid Exam, Subject, and Total Marks (> 0) are required." };
  }

  if (!marksJsonStr) {
    return { success: false, error: "No marks entries provided." };
  }

  let marksEntries: Array<{ enrollmentId: string; obtainedMarks: number; remarks?: string }>;
  try {
    marksEntries = JSON.parse(marksJsonStr);
  } catch {
    return { success: false, error: "Invalid marks payload format." };
  }

  if (!Array.isArray(marksEntries) || marksEntries.length === 0) {
    return { success: false, error: "At least one student marks entry is required." };
  }

  try {
    let savedCount = 0;

    // Verify exam belongs to this school
    const exam = await prisma.exam.findFirst({
      where: { id: examId, schoolId: session.schoolId },
    });
    if (!exam) {
      return { success: false, error: "Exam not found in your school." };
    }

    // Verify all enrollmentIds belong to this school
    const enrollmentIds = marksEntries.map((e) => e.enrollmentId).filter(Boolean);
    const validEnrollments = await prisma.enrollment.findMany({
      where: {
        id: { in: enrollmentIds },
        student: { schoolId: session.schoolId },
      },
      select: { id: true },
    });
    const validIdSet = new Set(validEnrollments.map((e) => e.id));

    for (const entry of marksEntries) {
      if (!entry.enrollmentId || !validIdSet.has(entry.enrollmentId)) continue;
      const obtained = Math.min(Math.max(0, Number(entry.obtainedMarks) || 0), totalMarks);

      await prisma.examResult.upsert({
        where: {
          examId_enrollmentId_subject: {
            examId,
            enrollmentId: entry.enrollmentId,
            subject,
          },
        },
        create: {
          schoolId: session.schoolId,
          examId,
          enrollmentId: entry.enrollmentId,
          subject,
          totalMarks,
          obtainedMarks: obtained,
          remarks: entry.remarks || (obtained / totalMarks >= 0.8 ? "Good" : null),
        },
        update: {
          totalMarks,
          obtainedMarks: obtained,
          remarks: entry.remarks || (obtained / totalMarks >= 0.8 ? "Good" : null),
        },
      });

      savedCount++;
    }

    if (savedCount === 0) {
      return { success: false, error: "No valid student records found in your school for the provided enrollments." };
    }

    // Audit trail log
    await prisma.auditLog.create({
      data: {
        schoolId: session.schoolId,
        userId: session.userId,
        userRole: session.role,
        action: "EXAM_MARKS_RECORDED",
        entityType: "exam_results",
        entityId: examId,
        newValues: {
          subject,
          totalMarks,
          studentsEvaluated: savedCount,
        },
      },
    });

    revalidatePath("/dashboard/teacher");
    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/principal");

    return {
      success: true,
      count: savedCount,
      message: `Successfully saved marks for ${savedCount} student(s) in ${subject}.`,
    };
  } catch (error) {
    console.error("Failed to record marks:", error);
    return { success: false, error: "Database error while recording student marks." };
  }
}

/**
 * STEP 7: Fetch evaluated report card details for student/parent view
 */
export async function getStudentReportCardAction(
  targetAdmissionNo?: string,
  targetExamId?: string
): Promise<{ success: boolean; data?: StudentReportCardData; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Authentication required." };
  }

  // Role-based access: students can only view their own; staff can view any in their school
  let admissionNo: string;
  if (session.role === "STUDENT") {
    // Students can only view their own report card
    admissionNo = targetAdmissionNo || session.username;
    if (targetAdmissionNo && targetAdmissionNo !== session.username) {
      return { success: false, error: "You can only view your own report card." };
    }
  } else {
    admissionNo = targetAdmissionNo || session.username;
  }

  try {
    // 1. Fetch School settings (CBSE affiliation, gradingScale)
    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: {
        name: true,
        affiliationNo: true,
        gradingScale: true,
      },
    });

    // 2. Fetch Student details with active enrollment
    const student = await prisma.student.findFirst({
      where: {
        schoolId: session.schoolId,
        admissionNo,
      },
      include: {
        enrollments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            section: {
              include: {
                class: true,
              },
            },
            session: true,
          },
        },
      },
    });

    if (!student || student.enrollments.length === 0) {
      return { success: false, error: `Student profile ${admissionNo} not found.` };
    }

    const currentEnrollment = student.enrollments[0];

    // 3. Find Exam (or latest exam if not specified) — always scoped to school
    let exam;
    if (targetExamId) {
      exam = await prisma.exam.findFirst({
        where: { id: targetExamId, schoolId: session.schoolId },
      });
    } else {
      exam = await prisma.exam.findFirst({
        where: { schoolId: session.schoolId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!exam) {
      return { success: false, error: "No examination records found for this academic session." };
    }

    // 4. Fetch Exam Results
    const results = await prisma.examResult.findMany({
      where: {
        schoolId: session.schoolId,
        examId: exam.id,
        enrollmentId: currentEnrollment.id,
      },
      orderBy: { subject: "asc" },
    });

    // 5. Fetch Attendance summary for this enrollment
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        enrollmentId: currentEnrollment.id,
      },
    });

    const attendanceTotal = attendanceRecords.length;
    const attendancePresent = attendanceRecords.filter((a) => a.status === "PRESENT").length;
    const attendancePercentage = attendanceTotal > 0
      ? Math.round((attendancePresent / attendanceTotal) * 1000) / 10
      : 0;

    // 6. Map to grading calculator format
    const subjectInputs = results.map((r) => ({
      subject: r.subject,
      totalMarks: Number(r.totalMarks),
      obtainedMarks: Number(r.obtainedMarks),
      remarks: r.remarks,
    }));

    const gradingScale = (school?.gradingScale as "PERCENTAGE" | "CGPA_10" | "CGPA_5") || "PERCENTAGE";
    const evaluation = evaluateReportCard(subjectInputs, gradingScale);

    return {
      success: true,
      data: {
        studentName: student.fullName,
        admissionNo: student.admissionNo,
        rollNo: currentEnrollment.rollNo || "01",
        className: currentEnrollment.section.class.name,
        sectionName: currentEnrollment.section.name,
        schoolName: school?.name || "School Name Not Configured",
        affiliationNo: school?.affiliationNo || "Not Configured",
        academicYear: currentEnrollment.session.name,
        examName: exam.name,
        examType: exam.examType,
        gradingScale,
        evaluation,
        attendancePresent,
        attendanceTotal,
        attendancePercentage,
      },
    };
  } catch (error) {
    console.error("Failed to fetch report card:", error);
    return { success: false, error: "Error retrieving report card data." };
  }
}
