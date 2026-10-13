export interface EmailMessage {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  fromName?: string;
  fromEmail?: string;
}

export interface SmsMessage {
  phone: string;
  content: string;
  senderId?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface INotificationService {
  name: string;
  sendEmail(message: EmailMessage): Promise<NotificationResult>;
  sendSms(message: SmsMessage): Promise<NotificationResult>;
  sendFeeReceiptAlert(params: {
    parentEmail?: string;
    parentPhone?: string;
    studentName: string;
    admissionNo: string;
    receiptNo: string;
    amountPaid: number;
    paymentMethod: string;
  }): Promise<NotificationResult>;
  sendAbsenceAlert(params: {
    parentPhone?: string;
    parentEmail?: string;
    studentName: string;
    className: string;
    date: string;
  }): Promise<NotificationResult>;
}
