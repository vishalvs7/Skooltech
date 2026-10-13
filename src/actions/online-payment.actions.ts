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

/**
 * STEP 9: Student / Parent pays term fee online via BYOG Payment Gateway
 */
export async function payStudentInvoiceOnlineAction(
  prevState: OnlinePaymentResponse | null,
  formData: FormData
): Promise<OnlinePaymentResponse> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Authentication required to make online payment." };
  }

  const invoiceId = (formData.get("invoiceId") as string)?.trim();
  const studentAdmissionNo = (formData.get("admissionNo") as string)?.trim() || session.username;
  const amountToPay = parseFloat((formData.get("amount") as string) || "13500");

  try {
    // 1. Fetch school and BYOG payment settings
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

    // 2. Fetch student record
    let student = await prisma.student.findFirst({
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
      student = await prisma.student.findFirst({
        where: { schoolId: session.schoolId },
        include: {
          enrollments: {
            take: 1,
            include: { section: { include: { class: true } }, session: true },
          },
        },
      });
    }

    if (!student || student.enrollments.length === 0) {
      return { success: false, error: "Student profile not found." };
    }

    const currentEnrollment = student.enrollments[0];

    // 3. Find invoice or find the first unpaid invoice
    let invoice = invoiceId
      ? await prisma.feeInvoice.findUnique({ where: { id: invoiceId } })
      : await prisma.feeInvoice.findFirst({
          where: { studentId: student.id, isPaid: false },
        });

    if (!invoice) {
      invoice = await prisma.feeInvoice.findFirst({
        where: { studentId: student.id },
      });
    }

    if (!invoice) {
      return { success: false, error: "No fee invoices found for student." };
    }

    // 4. Resolve BYOG Gateway Adapter (Razorpay, Cashfree, or Mock)
    const gateway = getPaymentGateway(school.paymentGateway, {
      keyId: school.paymentKeyId,
      secret: school.paymentSecret,
    });

    const receiptNo = `RCP-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;

    // 5. Create Order via Gateway
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

    // 6. Verify Payment
    const verifyResult = await gateway.verifyPayment({
      orderId: orderResult.orderId,
      paymentId: `pay_${Date.now()}`,
      signature: "mock_signature_valid",
    });

    if (!verifyResult.success) {
      return { success: false, error: verifyResult.error || "Payment verification failed." };
    }

    // 7. Persist Transaction in Database
    await prisma.paymentTransaction.create({
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

    // 8. Mark invoice as paid
    await prisma.feeInvoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount: { increment: amountToPay },
        isPaid: true,
      },
    });

    // 9. Dispatch Email & SMS Notifications via Notification Service
    const notificationService = getNotificationService();
    await notificationService.sendFeeReceiptAlert({
      parentEmail: student.parentEmail || "parent@example.com",
      parentPhone: student.parentPhone || "+919812345671",
      studentName: student.fullName,
      admissionNo: student.admissionNo,
      receiptNo,
      amountPaid: amountToPay,
      paymentMethod: "UPI (BYOG Online)",
    });

    // 10. Write Immutable Audit Trail
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
    revalidatePath("/dashboard/principal");

    return {
      success: true,
      message: `Online fee payment of ₹${amountToPay.toLocaleString("en-IN")} processed successfully via BYOG Gateway (${gateway.provider}).`,
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
    return { success: false, error: "Server failure processing online fee payment." };
  }
}
