import type {
  IPaymentGateway,
  PaymentGatewayProvider,
  CreateOrderOptions,
  GatewayOrderResult,
  VerifyPaymentOptions,
  VerifyPaymentResult,
} from "./types";
import { MockPaymentGateway } from "./mock";

export class CashfreePaymentGateway implements IPaymentGateway {
  provider: PaymentGatewayProvider = "CASHFREE";
  private appId: string;
  private secretKey: string;
  private fallbackMock: MockPaymentGateway;

  constructor(appId?: string, secretKey?: string) {
    this.appId = appId || process.env.CASHFREE_APP_ID || "";
    this.secretKey = secretKey || process.env.CASHFREE_SECRET_KEY || "";
    this.fallbackMock = new MockPaymentGateway();
  }

  async createOrder(options: CreateOrderOptions): Promise<GatewayOrderResult> {
    if (!this.appId || !this.secretKey) {
      console.warn("⚠️ [CashfreePaymentGateway] BYOG credentials missing. Falling back to Mock Payment Gateway.");
      return this.fallbackMock.createOrder(options);
    }

    try {
      const response = await fetch("https://api.cashfree.com/pg/orders", {
        method: "POST",
        headers: {
          "x-api-version": "2023-08-01",
          "x-client-id": this.appId,
          "x-client-secret": this.secretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: `cf_${Date.now()}_${options.receiptNo.replace(/[^a-zA-Z0-9]/g, "")}`,
          order_amount: options.amount,
          order_currency: options.currency || "INR",
          customer_details: {
            customer_id: options.studentAdmissionNo,
            customer_name: options.studentName,
            customer_email: "parent@example.com",
            customer_phone: "9876543210",
          },
          order_meta: {
            return_url: `https://skooltech.in/api/payments/cashfree/return?order_id={order_id}`,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Cashfree Order Creation Failed:", err);
        return {
          success: false,
          orderId: "",
          amount: options.amount,
          currency: "INR",
          provider: "CASHFREE",
          error: err.message || "Cashfree order creation failed.",
        };
      }

      const data = await response.json();
      return {
        success: true,
        orderId: data.order_id,
        amount: options.amount,
        currency: "INR",
        provider: "CASHFREE",
        paymentUrl: data.payment_link,
      };
    } catch (error) {
      console.error("Cashfree Network Error:", error);
      return {
        success: false,
        orderId: "",
        amount: options.amount,
        currency: "INR",
        provider: "CASHFREE",
        error: "Network error connecting to Cashfree.",
      };
    }
  }

  async verifyPayment(options: VerifyPaymentOptions): Promise<VerifyPaymentResult> {
    if (!this.appId || !this.secretKey) {
      return this.fallbackMock.verifyPayment(options);
    }

    try {
      const response = await fetch(`https://api.cashfree.com/pg/orders/${options.orderId}`, {
        method: "GET",
        headers: {
          "x-api-version": "2023-08-01",
          "x-client-id": this.appId,
          "x-client-secret": this.secretKey,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          paymentId: options.paymentId,
          amount: 0,
          paymentMethod: "UPI",
          error: "Failed to fetch order status from Cashfree.",
        };
      }

      const orderData = await response.json();
      const isPaid = orderData.order_status === "PAID";

      return {
        success: isPaid,
        paymentId: options.paymentId || orderData.cf_order_id,
        amount: orderData.order_amount,
        utr: `CF-${orderData.order_id.slice(-8)}`,
        paymentMethod: "UPI",
        error: isPaid ? undefined : "Cashfree payment is not marked PAID.",
      };
    } catch (error) {
      console.error("Cashfree verification error:", error);
      return {
        success: false,
        paymentId: options.paymentId,
        amount: 0,
        paymentMethod: "UPI",
        error: "Cashfree verification network failure.",
      };
    }
  }
}
