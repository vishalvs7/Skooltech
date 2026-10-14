"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export interface FeePaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
  receiptData?: {
    receiptNo: string;
    studentName: string;
    admissionNo: string;
    className: string;
    rollNo: string;
    amountPaid: number;
    lateFeeCharged: number;
    paymentMethod: "CASH" | "UPI" | "BANK_DRAFT";
    referenceNo?: string;
    bankName?: string;
    date: string;
    cashierName: string;
  };
}

/**
 * Generate a collision-resistant receipt number using timestamp + random suffix.
 * In production, replace with a DB sequence or ULID generator.
 */
function generateReceiptNo(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 46656).toString(36).toUpperCase().padStart(3, "0");
  return `RCP-${year}-${timestamp}${random}`;
}

export async function collectCounterPaymentAction(
  prevState: FeePaymentResponse | null,
  formData: FormData
): Promise<FeePaymentResponse> {
  const session = await getSession();
  if (!session || (session.role !== "ACCOUNTS" && session.role !== "SCHOOL_ADMIN")) {
    return { success: false, error: "Unauthorized. Accounts or Admin access required." };
  }

  const studentAdmissionNo = (formData.get("admissionNo") as string)?.trim().toUpperCase();
  const amountPaid = parseFloat((formData.get("amountPaid") as string) || "0");
  const lateFeeCharged = parseFloat((formData.get("lateFeeCharged") as string) || "0");
  const paymentMethod = formData.get("paymentMethod") as "CASH" | "UPI" | "BANK_DRAFT";
  const referenceNo = (formData.get("referenceNo") as string)?.trim();
  const bankName = (formData.get("bankName") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim();

  if (!studentAdmissionNo || isNaN(amountPaid) || amountPaid <= 0) {
    return { success: false, error: "Valid Admission Number and positive payment amount are required." };
  }

  if (!["CASH", "UPI", "BANK_DRAFT"].includes(paymentMethod)) {
    return { success: false, error: "Invalid payment method." };
  }

  if (paymentMethod === "UPI" && (!referenceNo || referenceNo.length < 6)) {
    return { success: false, error: "Please enter a valid UPI UTR reference number (min 6 chars)." };
  }

  if (paymentMethod === "BANK_DRAFT" && (!referenceNo || !bankName)) {
    return { success: false, error: "Draft Number and Issuing Bank Name are required for Bank Drafts." };
  }

  try {
    // 1. Find student within this school only
    const student = await prisma.student.findUnique({
      where: {
        schoolId_admissionNo: {
          schoolId: session.schoolId,
          admissionNo: studentAdmissionNo,
        },
      },
      include: {
        enrollments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            section: { include: { class: true } },
          },
        },
        feeInvoices: {
          where: { isPaid: false },
          orderBy: { dueDate: "asc" },
          take: 1,
        },
      },
    });

    if (!student) {
      return { success: false, error: `Student with admission number ${studentAdmissionNo} not found in your school.` };
    }

    if (student.feeInvoices.length === 0) {
      return { success: false, error: `No pending fee invoices found for ${student.fullName} (${studentAdmissionNo}).` };
    }

    const invoice = student.feeInvoices[0];
    const invoiceBalance = Number(invoice.baseAmount) - Number(invoice.paidAmount);

    if (amountPaid > invoiceBalance + lateFeeCharged) {
      return {
        success: false,
        error: `Payment amount ₹${amountPaid.toLocaleString("en-IN")} exceeds outstanding balance of ₹${invoiceBalance.toLocaleString("en-IN")}.`,
      };
    }

    const receiptNo = generateReceiptNo();
    const totalDue = Number(invoice.baseAmount) + lateFeeCharged;
    const newPaidAmount = Number(invoice.paidAmount) + amountPaid;
    const fullyPaid = newPaidAmount >= totalDue;

    // 2. Atomic transaction: payment + invoice update + audit
    await prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.create({
        data: {
          schoolId: session.schoolId,
          invoiceId: invoice.id,
          receiptNo,
          amountPaid,
          lateFeeCharged,
          paymentMethod,
          referenceNo: referenceNo || null,
          bankName: bankName || null,
          collectedById: session.userId,
          notes: notes || "Collected at counter",
        },
      });

      await tx.feeInvoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount: { increment: amountPaid },
          isPaid: fullyPaid,
        },
      });

      await tx.auditLog.create({
        data: {
          schoolId: session.schoolId,
          userId: session.userId,
          userRole: session.role,
          action: "FEE_COLLECTED",
          entityType: "payment_transactions",
          entityId: receiptNo,
          newValues: {
            receiptNo,
            studentAdmissionNo,
            amountPaid,
            lateFeeCharged,
            paymentMethod,
            invoiceId: invoice.id,
            fullyPaid,
          },
        },
      });
    });

    revalidatePath("/dashboard/accounts");

    const currentEnrollment = student.enrollments[0];
    return {
      success: true,
      message: `Payment of ₹${amountPaid.toLocaleString("en-IN")} collected successfully. Receipt #${receiptNo} generated.${fullyPaid ? " Invoice fully paid." : ` ₹${(totalDue - newPaidAmount).toLocaleString("en-IN")} still outstanding.`}`,
      receiptData: {
        receiptNo,
        studentName: student.fullName,
        admissionNo: student.admissionNo,
        className: currentEnrollment
          ? `${currentEnrollment.section.class.name} - ${currentEnrollment.section.name}`
          : "N/A",
        rollNo: currentEnrollment?.rollNo || "N/A",
        amountPaid,
        lateFeeCharged,
        paymentMethod,
        referenceNo,
        bankName,
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        cashierName: session.username,
      },
    };
  } catch (error) {
    console.error("Failed to collect counter payment:", error);
    return { success: false, error: "Database error while processing payment. Nothing was saved." };
  }
}
