import type {
  INotificationService,
  EmailMessage,
  SmsMessage,
  NotificationResult,
} from "./types";

export interface LoggedNotification {
  id: string;
  type: "EMAIL" | "SMS";
  recipient: string;
  subjectOrSender?: string;
  content: string;
  timestamp: string;
}

// In-memory inspection log buffer for development
export const mockNotificationLog: LoggedNotification[] = [];

export class MockNotificationService implements INotificationService {
  name = "MockNotificationService";

  async sendEmail(message: EmailMessage): Promise<NotificationResult> {
    const id = `mock_email_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const logEntry: LoggedNotification = {
      id,
      type: "EMAIL",
      recipient: message.to,
      subjectOrSender: message.subject,
      content: message.textContent || message.htmlContent.replace(/<[^>]*>?/gm, ""),
      timestamp: new Date().toISOString(),
    };
    mockNotificationLog.unshift(logEntry);

    console.log(
      `📧 [MOCK EMAIL DISPATCH] To: ${message.to} | Subject: "${message.subject}" | ID: ${id}`
    );
    return { success: true, messageId: id };
  }

  async sendSms(message: SmsMessage): Promise<NotificationResult> {
    const id = `mock_sms_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const logEntry: LoggedNotification = {
      id,
      type: "SMS",
      recipient: message.phone,
      subjectOrSender: message.senderId || "SKOOLT",
      content: message.content,
      timestamp: new Date().toISOString(),
    };
    mockNotificationLog.unshift(logEntry);

    console.log(
      `📱 [MOCK SMS DISPATCH] To: ${message.phone} | Content: "${message.content}" | ID: ${id}`
    );
    return { success: true, messageId: id };
  }

  async sendFeeReceiptAlert(params: {
    parentEmail?: string;
    parentPhone?: string;
    studentName: string;
    admissionNo: string;
    receiptNo: string;
    amountPaid: number;
    paymentMethod: string;
  }): Promise<NotificationResult> {
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(params.amountPaid);

    if (params.parentEmail) {
      await this.sendEmail({
        to: params.parentEmail,
        subject: `Fee Payment Receipt ${params.receiptNo} - ${params.studentName}`,
        htmlContent: `<p>Dear Parent, we have received <strong>${formattedAmount}</strong> for student <strong>${params.studentName}</strong> (${params.admissionNo}) via ${params.paymentMethod}. Receipt Number: ${params.receiptNo}.</p>`,
        textContent: `Fee payment of ${formattedAmount} received for ${params.studentName} (${params.admissionNo}). Receipt No: ${params.receiptNo}.`,
      });
    }

    if (params.parentPhone) {
      await this.sendSms({
        phone: params.parentPhone,
        content: `Fee payment of ${formattedAmount} for ${params.studentName} received via ${params.paymentMethod}. Receipt: ${params.receiptNo}. - Skooltech`,
      });
    }

    return { success: true, messageId: `alert_fee_${params.receiptNo}` };
  }

  async sendAbsenceAlert(params: {
    parentPhone?: string;
    parentEmail?: string;
    studentName: string;
    className: string;
    date: string;
  }): Promise<NotificationResult> {
    const content = `Dear Parent, ${params.studentName} (${params.className}) has been marked ABSENT on ${params.date}. Please submit a leave application if unwell.`;

    if (params.parentPhone) {
      await this.sendSms({ phone: params.parentPhone, content });
    }

    if (params.parentEmail) {
      await this.sendEmail({
        to: params.parentEmail,
        subject: `Attendance Alert: ${params.studentName} marked absent on ${params.date}`,
        htmlContent: `<p>${content}</p>`,
      });
    }

    return { success: true, messageId: `alert_absent_${Date.now()}` };
  }
}
