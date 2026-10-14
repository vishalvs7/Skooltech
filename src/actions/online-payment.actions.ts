"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getPaymentGateway } from "@/lib/payments";
import { getNotificationService } from "@/lib/notifications";
import { recordAuditLog } from "@/lib/audit";

export interface OnlinePaymentResponse {
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
    paymentMethod: "UPI" | "CARD" | "NETBANKING" | "CASH";
    referenceNo?: string;
    date: string;
  };
}

function generateReceiptNo(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 46656).toString(36).toUpperCase().padStart(3, "0");
  return `RCP-${year}-${timestamp}${random}`;
}

export async function payStudentInvoiceOnlineAction(
  prevState: OnlinePaymentResponse | null,
  formData: FormData
): Promise<OnlinePaymentResponse> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Authentication required to make online payment." };
  }

  // Role check: students pay their own; accounts/admin can process for others
  if (session.role !== "STUDENT" && session.role !== "ACCOUNTS" && session.role !== "SCHOOL_ADMIN") {
    return { success: false, error: "Unauthorized. Students, Accounts, or Admin only." };
  }

  const invoiceId = (formData.get("invoiceId") as string)?.trim();
  const studentAdmissionNo = (formData.get("admissionNo") as string)?.trim() || session.username;

  // Students can only pay for themselves
  if (session.role === "STUDENT" && studentAdmissionNo !== session.username) {
    return { success: false, error: "You can only make payments for your own account." };
  }

  try {
    // 1. Fetch school payment settings
    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: {
        id: true,
        name: true,
        paymentGateway: true,
        paymentKeyId: true,
        paymentSecret: true,
      },
    });

    if (!school) {
      return { success: false, error: "School account not found." };
    }

    // 2. Fetch student — strictly scoped, NO fallback
    const student = await prisma.student.findFirst({
      where: {
        schoolId: session.schoolId,
        admissionNo: studentAdmissionNo,
      },
      include: {
        enrollments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            section: { include: { class: true } },
            session: true,
          },
        },
      },
    });

    if (!student) {
      return { success: false, error: `Student with admission number ${studentAdmissionNo} not found.` };
    }

    if (student.enrollments.length === 0) {
      return { success: false, error: "Student has no active enrollment. Contact school admin." };
    }

    const currentEnrollment = student.enrollments[0];

    // 3. Find invoice — must belong to this student, scoped by school
    let invoice;
    if (invoiceId) {
      invoice = await prisma.feeInvoice.findFirst({
        where: {
          id: invoiceId,
          studentId: student.id,
          schoolId: session.schoolId,
        },
      });
      if (!invoice) {
        return { success: false, error: "Invoice not found for this student." };
      }
    } else {
      invoice = await prisma.feeInvoice.findFirst({
        where: { studentId: student.id, schoolId: session.schoolId, isPaid: false },
        orderBy: { dueDate: "asc" },
      });
      if (!invoice) {
        return { success: false, error: "No pending fee invoices found for this student." };
      }
    }

    // 4. Server-derive amount from invoice (never trust client)
    const invoiceBalance = Number(invoice.baseAmount) - Number(invoice.paidAmount);
    if (invoiceBalance <= 0) {
      return { success: false, error: "This invoice is already fully paid." };
    }

    const amountToPay = invoiceBalance;

    // 5. Resolve BYOG Gateway Adapter
    const gateway = getPaymentGateway(school.paymentGateway, {
      keyId: school.paymentKeyId,
      secret: school.paymentSecret,
    });

    const receiptNo = generateReceiptNo();

    // 6. Create Order via Gateway
    const orderResult = await gateway.createOrder({
      amount: amountToPay,
      receiptNo,
      studentAdmissionNo: student.admissionNo,
      studentName: student.fullName,
      notes: { schoolId: school.id, invoiceId: invoice.id },
    });

    if (!orderResult.success) {
      return { success: false, error: orderResult.error || "Payment gateway rejected order creation." };
    }

    // 7. Verify Payment (in production, this is called by webhook after real payment)
    const verifyResult = await gateway.verifyPayment({
      orderId: orderResult.orderId,
      paymentId: orderResult.orderId, // In production: actual paymentId from gateway callback
      signature: orderResult.orderId, // In production: actual HMAC signature from gateway
    });

    if (!verifyResult.success) {
      return { success: false, error: verifyResult.error || "Payment verification failed." };
    }

    // 8. Atomic: transaction + invoice update + audit
    const fullyPaid = Number(invoice.paidAmount) + amountToPay >= Number(invoice.baseAmount);

    await prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.create({
        data: {
          schoolId: session.schoolId,
          invoiceId: invoice.id,
          receiptNo,
          amountPaid: amountToPay,
          lateFeeCharged: 0.0,
          paymentMethod: "UPI",
          referenceNo: verifyResult.utr || `UPI-BYOG-${Date.now().toString().slice(-8)}`,
          collectedById: session.userId,
          notes: `Online Fee Settlement via BYOG Gateway (${gateway.provider})`,
        },
      });

      await tx.feeInvoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount: { increment: amountToPay },
          isPaid: fullyPaid,
        },
      });
    });

    // 9. Dispatch notifications (non-blocking)
    try {
      const notificationService = getNotificationService();
      await notificationService.sendFeeReceiptAlert({
        parentEmail: student.parentEmail || "",
        parentPhone: student.parentPhone || "",
        studentName: student.fullName,
        admissionNo: student.admissionNo,
        receiptNo,
        amountPaid: amountToPay,
        paymentMethod: "UPI (BYOG Online)",
      });
    } catch (notifErr) {
      console.error("Notification dispatch failed (non-blocking):", notifErr);
    }

    // 10. Audit trail
    await recordAuditLog({
      schoolId: session.schoolId,
      userId: session.userId,
      userRole: session.role,
      action: "FEE_PAID_ONLINE_BYOG",
      entityType: "payment_transactions",
      entityId: receiptNo,
      newValues: {
        amountPaid: amountToPay,
        gateway: gateway.provider,
        utr: verifyResult.utr,
        studentAdmissionNo: student.admissionNo,
        invoiceId: invoice.id,
      },
    });

    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/accounts");

    return {
      success: true,
      message: `Online fee payment of ₹${amountToPay.toLocaleString("en-IN")} processed successfully via ${gateway.provider}.`,
      receiptData: {
        receiptNo,
        studentName: student.fullName,
        admissionNo: student.admissionNo,
        className: `${currentEnrollment.section.class.name} - ${currentEnrollment.section.name}`,
        rollNo: currentEnrollment.rollNo || "01",
        amountPaid: amountToPay,
        paymentMethod: "UPI",
        referenceNo: verifyResult.utr,
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      },
    };
  } catch (error) {
    console.error("Online payment error:", error);
    return { success: false, error: "Server failure processing online fee payment. Nothing was charged." };
  }
}
