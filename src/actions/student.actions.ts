"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export interface StudentActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    admissionNo?: string;
    status?: string;
  };
}

async function nextAdmissionNo(schoolId: string): Promise<string> {
  const rows = await prisma.student.findMany({
    where: { schoolId, admissionNo: { startsWith: "ADM-" } },
    select: { admissionNo: true },
  });
  let max = 1000;
  for (const r of rows) {
    const m = r.admissionNo.match(/(\d+)$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  return `ADM-${max + 1}`;
}

export async function createStudentDraftAction(
  prevState: StudentActionResponse | null,
  formData: FormData
): Promise<StudentActionResponse> {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "SCHOOL_ADMIN")) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  const admissionNoInput = (formData.get("admissionNo") as string)?.trim().toUpperCase();
  const fullName = (formData.get("fullName") as string)?.trim();
  const parentName = (formData.get("parentName") as string)?.trim();
  const parentPhone = (formData.get("parentPhone") as string)?.trim();
  const parentEmail = (formData.get("parentEmail") as string)?.trim();
  const gender = (formData.get("gender") as string)?.trim();
  const dobRaw = (formData.get("dob") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const sectionId = (formData.get("sectionId") as string)?.trim();
  const rollNo = (formData.get("rollNo") as string)?.trim();
  const tempPassword = (formData.get("tempPassword") as string)?.trim();

  if (!fullName || !parentPhone) {
    return { success: false, error: "Student Name and Parent Phone are required." };
  }
  if (parentPhone && !/^[0-9+\-\s()]{6,15}$/.test(parentPhone)) {
    return { success: false, error: "Please enter a valid parent phone number." };
  }
  if (parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
    return { success: false, error: "Please enter a valid parent email address." };
  }

  const autoAdmit = !admissionNoInput;
  let admissionNo = admissionNoInput;
  if (admissionNo) {
    if (admissionNo.length < 3 || admissionNo.length > 20) {
      return { success: false, error: "Admission number must be 3-20 characters." };
    }
  }

  let dob: Date | null = null;
  if (dobRaw) {
    const parsed = new Date(dobRaw);
    if (Number.isNaN(parsed.getTime())) {
      return { success: false, error: "Please enter a valid date of birth." };
    }
    dob = parsed;
  }

  // Resolve optional placement (section must belong to this school)
  let section: { id: string; classId: string; name: string; class: { name: string } } | null = null;
  if (sectionId) {
    section = await prisma.section.findFirst({
      where: { id: sectionId, class: { schoolId: session.schoolId } },
      select: { id: true, classId: true, name: true, class: { select: { name: true } } },
    });
    if (!section) {
      return { success: false, error: "Selected section not found in your school." };
    }
  }

  if (tempPassword && tempPassword.length < 8) {
    return { success: false, error: "Temporary password must be at least 8 characters." };
  }

  const password = tempPassword || "Student@123";
  const passwordHash = await bcrypt.hash(password, 10);

  // Auto-generate a collision-free admission number (retry on race)
  if (autoAdmit) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = await nextAdmissionNo(session.schoolId);
      const clash = await prisma.student.findUnique({
        where: { schoolId_admissionNo: { schoolId: session.schoolId, admissionNo: candidate } },
        select: { id: true },
      });
      if (!clash) {
        admissionNo = candidate;
        break;
      }
    }
    if (!admissionNo) {
      return { success: false, error: "Could not generate an admission number. Please try again." };
    }
  } else {
    const existing = await prisma.student.findUnique({
      where: { schoolId_admissionNo: { schoolId: session.schoolId, admissionNo } },
      select: { id: true },
    });
    if (existing) {
      return { success: false, error: `Admission number ${admissionNo} already exists in your school.` };
    }
  }

  try {
    let currentSessionId: string | null = null;
    if (section) {
      const currentSession = await prisma.academicSession.findFirst({
        where: { schoolId: session.schoolId, isCurrent: true },
        select: { id: true },
      });
      if (!currentSession) {
        return {
          success: false,
          error: "No active academic session found. Set a current session before placing a student.",
        };
      }
      currentSessionId = currentSession.id;
    }

    const username = admissionNo!;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          schoolId: session.schoolId,
          username,
          passwordHash,
          role: "STUDENT",
          email: parentEmail || null,
          phone: parentPhone,
          mustChangePassword: true,
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          schoolId: session.schoolId,
          admissionNo: admissionNo!,
          fullName,
          dob,
          gender: gender || null,
          address: address || null,
          parentName: parentName || null,
          parentPhone,
          parentEmail: parentEmail || null,
          status: section ? "PENDING_FEE" : "PENDING_ACADEMIC",
        },
      });

      if (section && currentSessionId) {
        await tx.enrollment.create({
          data: {
            studentId: student.id,
            sessionId: currentSessionId,
            sectionId: section.id,
            rollNo: rollNo || null,
          },
        });
      }

      return { user, student };
    });

    await recordAuditLog({
      schoolId: session.schoolId,
      userId: session.userId,
      userRole: session.role,
      action: "STUDENT_DRAFT_CREATED",
      entityType: "students",
      entityId: result.student.id,
      newValues: {
        admissionNo,
        fullName,
        parentPhone,
        dob: dob ? dob.toISOString().slice(0, 10) : null,
        ...(section
          ? { placedIn: `${section.class.name} - ${section.name}`, rollNo: rollNo || null }
          : {}),
      },
    });

    revalidatePath("/dashboard/admin");
    if (section) {
      return {
        success: true,
        message: `Admitted ${fullName} as ${admissionNo} into ${section.class.name} - ${section.name}. Passed to Accounts fee queue.`,
        data: { admissionNo, status: "PENDING_FEE" },
      };
    }
    return {
      success: true,
      message: `Student draft created with Admission No ${admissionNo}. Passed to Class Teacher queue.`,
      data: { admissionNo, status: "PENDING_ACADEMIC" },
    };
  } catch (error) {
    console.error("Failed to create student draft:", error);
    return { success: false, error: "Database error while creating student draft. Nothing was saved." };
  }
}

export async function assignAcademicPlacementAction(
  formData: FormData
): Promise<StudentActionResponse> {
  const session = await getSession();
  if (!session || (session.role !== "TEACHER" && session.role !== "SCHOOL_ADMIN")) {
    return { success: false, error: "Unauthorized. Class Teacher or Admin access required." };
  }

  const studentId = formData.get("studentId") as string;
  const sectionId = formData.get("sectionId") as string;
  const rollNo = (formData.get("rollNo") as string)?.trim();

  if (!studentId || !sectionId || !rollNo) {
    return { success: false, error: "Student, Section, and Roll Number are all required." };
  }

  try {
    // 1. Verify student belongs to this school
    const student = await prisma.student.findFirst({
      where: { id: studentId, schoolId: session.schoolId },
    });
    if (!student) {
      return { success: false, error: "Student not found in your school." };
    }

    if (student.status !== "PENDING_ACADEMIC") {
      return { success: false, error: `Student is already ${student.status.toLowerCase()}. Placement can only be assigned to PENDING_ACADEMIC students.` };
    }

    // 2. Verify section belongs to this school
    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        class: { schoolId: session.schoolId },
      },
      include: { class: true },
    });
    if (!section) {
      return { success: false, error: "Section not found in your school." };
    }

    // 3. Verify current session exists
    const currentSession = await prisma.academicSession.findFirst({
      where: { schoolId: session.schoolId, isCurrent: true },
    });
    if (!currentSession) {
      return { success: false, error: "No active academic session found. Set a current session first." };
    }

    // 4. Atomic: enrollment + status update
    await prisma.$transaction(async (tx) => {
      await tx.enrollment.create({
        data: {
          studentId,
          sessionId: currentSession.id,
          sectionId,
          rollNo,
        },
      });

      await tx.student.update({
        where: { id: studentId },
        data: { status: "PENDING_FEE" },
      });
    });

    await recordAuditLog({
      schoolId: session.schoolId,
      userId: session.userId,
      userRole: session.role,
      action: "STUDENT_PLACED",
      entityType: "enrollments",
      entityId: studentId,
      newValues: {
        studentAdmissionNo: student.admissionNo,
        className: section.class.name,
        sectionName: section.name,
        rollNo,
      },
    });

    revalidatePath("/dashboard/teacher");
    revalidatePath("/dashboard/admin");
    return { success: true, message: `Academic placement completed (Roll #${rollNo}). Student passed to Accounts fee queue.` };
  } catch (error) {
    console.error("Failed to assign academic placement:", error);
    return { success: false, error: "Database error while assigning placement. Nothing was saved." };
  }
}

export async function assignFeePackageAction(
  formData: FormData
): Promise<StudentActionResponse> {
  const session = await getSession();
  if (!session || (session.role !== "ACCOUNTS" && session.role !== "SCHOOL_ADMIN")) {
    return { success: false, error: "Unauthorized. Accounts or Admin access required." };
  }

  const studentId = formData.get("studentId") as string;
  const feeStructureId = formData.get("feeStructureId") as string;

  if (!studentId || !feeStructureId) {
    return { success: false, error: "Student and Fee Structure are both required." };
  }

  try {
    // 1. Verify student belongs to this school
    const student = await prisma.student.findFirst({
      where: { id: studentId, schoolId: session.schoolId },
    });
    if (!student) {
      return { success: false, error: "Student not found in your school." };
    }

    if (student.status !== "PENDING_FEE") {
      return { success: false, error: `Student is ${student.status.toLowerCase()}. Fee package can only be assigned to PENDING_FEE students.` };
    }

    // 2. Verify fee structure belongs to this school
    const feeStructure = await prisma.feeStructure.findFirst({
      where: { id: feeStructureId, schoolId: session.schoolId },
    });
    if (!feeStructure) {
      return { success: false, error: "Fee structure not found in your school." };
    }

    // 3. Atomic: invoice + status update
    await prisma.$transaction(async (tx) => {
      // Calculate first invoice due date (15 days from now as grace period)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);

      await tx.feeInvoice.create({
        data: {
          schoolId: session.schoolId,
          studentId,
          title: `${feeStructure.name} (${feeStructure.cycle === "QUARTERLY" ? "Term 1" : "Month 1"})`,
          baseAmount: feeStructure.amount,
          dueDate,
          isPaid: false,
        },
      });

      await tx.student.update({
        where: { id: studentId },
        data: { status: "ACTIVE" },
      });
    });

    await recordAuditLog({
      schoolId: session.schoolId,
      userId: session.userId,
      userRole: session.role,
      action: "FEE_PACKAGE_ASSIGNED",
      entityType: "fee_invoices",
      entityId: studentId,
      newValues: {
        studentAdmissionNo: student.admissionNo,
        feeStructureName: feeStructure.name,
        amount: Number(feeStructure.amount),
        cycle: feeStructure.cycle,
      },
    });

    revalidatePath("/dashboard/accounts");
    revalidatePath("/dashboard/admin");
    return { success: true, message: "Fee structure assigned. Student is now ACTIVE and enrolled." };
  } catch (error) {
    console.error("Failed to assign fee package:", error);
    return { success: false, error: "Database error while assigning fee package. Nothing was saved." };
  }
}

export async function promoteClassStudentsAction(
  prevState: StudentActionResponse | null,
  formData: FormData
): Promise<StudentActionResponse> {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "SCHOOL_ADMIN")) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  const fromClassId = formData.get("fromClassId") as string;
  const toClassId = formData.get("toClassId") as string;
  const nextSessionName = formData.get("nextSessionName") as string;
  const studentIdsJson = formData.get("studentIds") as string;

  if (!fromClassId || !toClassId || !nextSessionName) {
    return { success: false, error: "Source class, target class, and next session name are required." };
  }

  let studentIds: string[] = [];
  try {
    studentIds = JSON.parse(studentIdsJson || "[]");
  } catch {
    return { success: false, error: "Invalid student list format." };
  }

  if (studentIds.length === 0) {
    return { success: false, error: "Select at least one student to promote." };
  }

  try {
    // Verify both classes belong to this school
    const [fromClass, toClass] = await Promise.all([
      prisma.class.findFirst({ where: { id: fromClassId, schoolId: session.schoolId } }),
      prisma.class.findFirst({ where: { id: toClassId, schoolId: session.schoolId } }),
    ]);

    if (!fromClass || !toClass) {
      return { success: false, error: "One or both classes not found in your school." };
    }

    // Verify all students belong to this school
    const students = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
        schoolId: session.schoolId,
      },
      select: { id: true, admissionNo: true, fullName: true },
    });

    if (students.length !== studentIds.length) {
      return { success: false, error: "Some selected students not found in your school." };
    }

    // Find or create next session
    let nextSession = await prisma.academicSession.findFirst({
      where: { schoolId: session.schoolId, name: nextSessionName },
    });

    if (!nextSession) {
      const year = parseInt(nextSessionName.split("-")[0], 10) || new Date().getFullYear();
      nextSession = await prisma.academicSession.create({
        data: {
          schoolId: session.schoolId,
          name: nextSessionName,
          startDate: new Date(`${year}-04-01`),
          endDate: new Date(`${year + 1}-03-31`),
          isCurrent: false,
        },
      });
    }

    // Find target section (first section of target class)
    const targetSection = await prisma.section.findFirst({
      where: { classId: toClassId },
    });
    if (!targetSection) {
      return { success: false, error: `No sections found in ${toClass.name}. Create a section first.` };
    }

    // Get current session enrollments for these students
    const currentSession = await prisma.academicSession.findFirst({
      where: { schoolId: session.schoolId, isCurrent: true },
    });
    if (!currentSession) {
      return { success: false, error: "No active academic session found." };
    }

    const currentEnrollments = await prisma.enrollment.findMany({
      where: {
        studentId: { in: studentIds },
        sessionId: currentSession.id,
      },
      include: { student: true },
    });

    // Atomic bulk promotion
    let promotedCount = 0;
    await prisma.$transaction(async (tx) => {
      for (const enrollment of currentEnrollments) {
        // Create enrollment in next session
        await tx.enrollment.create({
          data: {
            studentId: enrollment.studentId,
            sessionId: nextSession.id,
            sectionId: targetSection.id,
            rollNo: enrollment.rollNo,
          },
        });
        promotedCount++;
      }
    });

    await recordAuditLog({
      schoolId: session.schoolId,
      userId: session.userId,
      userRole: session.role,
      action: "CLASS_ROLLOVER",
      entityType: "enrollments",
      entityId: fromClassId,
      newValues: {
        fromClass: fromClass.name,
        toClass: toClass.name,
        nextSession: nextSessionName,
        promotedCount,
      },
    });

    revalidatePath("/dashboard/admin");
    return {
      success: true,
      message: `Successfully promoted ${promotedCount} students from ${fromClass.name} to ${toClass.name} for Session ${nextSessionName}.`,
    };
  } catch (error) {
    console.error("Failed to promote students:", error);
    return { success: false, error: "Database error during promotion. Nothing was changed." };
  }
}
