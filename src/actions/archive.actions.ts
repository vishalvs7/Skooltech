"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession, canAccessArchive } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export interface ArchiveActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const GENDERS = ["Male", "Female", "Other"];

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function updateStudentProfileAction(
  prevState: ArchiveActionResponse | null,
  formData: FormData
): Promise<ArchiveActionResponse> {
  const session = await getSession();
  if (!session || !canAccessArchive(session.role)) {
    return { success: false, error: "Unauthorized. Archive access requires Admin, Principal or Accounts role." };
  }

  const studentId = str(formData.get("studentId"));
  const fullName = str(formData.get("fullName"));
  const address = str(formData.get("address"));
  const gender = str(formData.get("gender"));
  const dobRaw = str(formData.get("dob"));
  const parentName = str(formData.get("parentName"));
  const parentPhone = str(formData.get("parentPhone"));
  const parentEmail = str(formData.get("parentEmail"));

  if (!studentId) {
    return { success: false, error: "Student reference is missing. Reload the page and try again." };
  }
  if (fullName.length < 2 || fullName.length > 100) {
    return { success: false, error: "Student name must be 2-100 characters." };
  }
  if (!parentPhone || !/^[+\d][\d\s-]{7,15}$/.test(parentPhone)) {
    return { success: false, error: "Guardian phone must be a valid 8-16 digit phone number." };
  }
  if (parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
    return { success: false, error: "Guardian email is not a valid email address." };
  }
  if (parentName.length > 100 || address.length > 250) {
    return { success: false, error: "Guardian name (100 chars) or address (250 chars) is too long." };
  }
  if (gender && !GENDERS.includes(gender)) {
    return { success: false, error: "Gender must be Male, Female or Other." };
  }

  let dob: Date | null = null;
  if (dobRaw) {
    const parsed = new Date(dobRaw);
    if (Number.isNaN(parsed.getTime())) {
      return { success: false, error: "Date of birth is not a valid date." };
    }
    if (parsed.getTime() > Date.now()) {
      return { success: false, error: "Date of birth cannot be in the future." };
    }
    dob = parsed;
  }

  try {
    const student = await prisma.student.findFirst({
      where: { id: studentId, schoolId: session.schoolId },
      select: {
        id: true,
        fullName: true,
        dob: true,
        gender: true,
        address: true,
        parentName: true,
        parentPhone: true,
        parentEmail: true,
        admissionNo: true,
      },
    });
    if (!student) {
      return { success: false, error: "Student not found in your school." };
    }

    const changes: Record<string, { from: unknown; to: unknown }> = {};
    const next = {
      fullName,
      address: address || null,
      gender: gender || null,
      dob,
      parentName: parentName || null,
      parentPhone,
      parentEmail: parentEmail || null,
    };
    (Object.keys(next) as (keyof typeof next)[]).forEach((key) => {
      const before = student[key];
      const after = next[key];
      const beforeNorm = before instanceof Date ? before.toISOString().slice(0, 10) : before;
      const afterNorm = after instanceof Date ? after.toISOString().slice(0, 10) : after;
      if (beforeNorm !== afterNorm) {
        changes[key] = { from: beforeNorm, to: afterNorm };
      }
    });

    if (Object.keys(changes).length === 0) {
      return { success: true, message: "No changes to save." };
    }

    await prisma.student.update({ where: { id: student.id }, data: next });

    await recordAuditLog({
      schoolId: session.schoolId,
      userId: session.userId,
      userRole: session.role,
      action: "ARCHIVE_PROFILE_UPDATED",
      entityType: "students",
      entityId: student.id,
      oldValues: Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v.from])),
      newValues: Object.fromEntries(Object.entries(changes).map(([k, v]) => [k, v.to])),
    });

    revalidatePath(`/dashboard/archive/${student.id}`);
    revalidatePath(`/dashboard/archive/${student.id}/profile`);
    return {
      success: true,
      message: `Profile updated for ${student.admissionNo}. ${Object.keys(changes).length} field(s) changed.`,
    };
  } catch (error) {
    console.error("Failed to update student profile from archive:", error);
    return { success: false, error: "Database error while saving profile. Nothing was changed." };
  }
}

export async function saveTransportDetailAction(
  prevState: ArchiveActionResponse | null,
  formData: FormData
): Promise<ArchiveActionResponse> {
  const session = await getSession();
  if (!session || !canAccessArchive(session.role)) {
    return { success: false, error: "Unauthorized. Archive access requires Admin, Principal or Accounts role." };
  }

  const studentId = str(formData.get("studentId"));
  const routeName = str(formData.get("routeName"));
  const vehicleNo = str(formData.get("vehicleNo"));
  const pickupPoint = str(formData.get("pickupPoint"));
  const dropPoint = str(formData.get("dropPoint"));
  const driverName = str(formData.get("driverName"));
  const driverPhone = str(formData.get("driverPhone"));
  const monthlyFeeRaw = str(formData.get("monthlyFee"));
  const isActive = formData.get("isActive") === "on";

  if (!studentId) {
    return { success: false, error: "Student reference is missing. Reload the page and try again." };
  }
  if (!routeName && !vehicleNo && !pickupPoint && !driverName) {
    return { success: false, error: "Provide at least one transport detail (route, vehicle, pickup point or driver)." };
  }
  if (driverPhone && !/^[+\d][\d\s-]{7,15}$/.test(driverPhone)) {
    return { success: false, error: "Driver phone must be a valid 8-16 digit phone number." };
  }

  let monthlyFee: number | null = null;
  if (monthlyFeeRaw) {
    const parsed = Number(monthlyFeeRaw);
    if (Number.isNaN(parsed) || parsed < 0) {
      return { success: false, error: "Monthly transport fee must be zero or a positive amount." };
    }
    if (parsed > 1000000) {
      return { success: false, error: "Monthly transport fee looks invalid (max 10,00,000)." };
    }
    monthlyFee = parsed;
  }

  try {
    const student = await prisma.student.findFirst({
      where: { id: studentId, schoolId: session.schoolId },
      select: { id: true, admissionNo: true },
    });
    if (!student) {
      return { success: false, error: "Student not found in your school." };
    }

    const existing = await prisma.transportDetail.findUnique({ where: { studentId: student.id } });

    const data = {
      schoolId: session.schoolId,
      routeName: routeName || null,
      vehicleNo: vehicleNo || null,
      pickupPoint: pickupPoint || null,
      dropPoint: dropPoint || null,
      driverName: driverName || null,
      driverPhone: driverPhone || null,
      monthlyFee,
      isActive,
    };

    if (existing) {
      await prisma.transportDetail.update({ where: { studentId: student.id }, data });
    } else {
      await prisma.transportDetail.create({ data: { ...data, studentId: student.id } });
    }

    await recordAuditLog({
      schoolId: session.schoolId,
      userId: session.userId,
      userRole: session.role,
      action: existing ? "ARCHIVE_TRANSPORT_UPDATED" : "ARCHIVE_TRANSPORT_CREATED",
      entityType: "transport_details",
      entityId: student.id,
      oldValues: existing
        ? {
            routeName: existing.routeName,
            vehicleNo: existing.vehicleNo,
            monthlyFee: existing.monthlyFee ? Number(existing.monthlyFee) : null,
          }
        : null,
      newValues: { ...data, monthlyFee },
    });

    revalidatePath(`/dashboard/archive/${student.id}`);
    revalidatePath(`/dashboard/archive/${student.id}/transport`);
    return {
      success: true,
      message: existing
        ? `Transport details updated for ${student.admissionNo}.`
        : `Transport details saved for ${student.admissionNo}.`,
    };
  } catch (error) {
    console.error("Failed to save transport detail from archive:", error);
    return { success: false, error: "Database error while saving transport details. Nothing was changed." };
  }
}
