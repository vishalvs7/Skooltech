export type PaymentGatewayProvider = "MOCK" | "RAZORPAY" | "CASHFREE";

export interface CreateOrderOptions {
  amount: number; // In INR (₹)
  currency?: string; // Default: "INR"
  receiptNo: string;
  studentAdmissionNo: string;
  studentName: string;
  notes?: Record<string, string>;
}

export interface GatewayOrderResult {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  provider: PaymentGatewayProvider;
  keyId?: string;
  paymentUrl?: string;
  error?: string;
}

export interface VerifyPaymentOptions {
  orderId: string;
  paymentId: string;
  signature?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  paymentId: string;
  amount: number;
  utr?: string;
  paymentMethod: "UPI" | "CARD" | "NETBANKING" | "CASH";
  error?: string;
}

export interface IPaymentGateway {
  provider: PaymentGatewayProvider;
  createOrder(options: CreateOrderOptions): Promise<GatewayOrderResult>;
  verifyPayment(options: VerifyPaymentOptions): Promise<VerifyPaymentResult>;
}
