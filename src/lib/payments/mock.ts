import type {
  IPaymentGateway,
  PaymentGatewayProvider,
  CreateOrderOptions,
  GatewayOrderResult,
  VerifyPaymentOptions,
  VerifyPaymentResult,
} from "./types";

export class MockPaymentGateway implements IPaymentGateway {
  provider: PaymentGatewayProvider = "MOCK";

  async createOrder(options: CreateOrderOptions): Promise<GatewayOrderResult> {
    const timestamp = Date.now();
    const mockOrderId = `order_mock_${timestamp}_${Math.floor(Math.random() * 1000)}`;

    console.log(
      `💳 [MOCK GATEWAY CREATE ORDER] Amount: ₹${options.amount} | Student: ${options.studentName} (${options.studentAdmissionNo}) | OrderId: ${mockOrderId}`
    );

    return {
      success: true,
      orderId: mockOrderId,
      amount: options.amount,
      currency: "INR",
      provider: "MOCK",
      keyId: "mock_key_sandbox_skooltech",
      paymentUrl: `/demo/mock-checkout?orderId=${mockOrderId}&amount=${options.amount}`,
    };
  }

  async verifyPayment(options: VerifyPaymentOptions): Promise<VerifyPaymentResult> {
    const timestamp = Date.now();
    const mockUtr = `UPI-UTR-${timestamp.toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;

    console.log(
      `✅ [MOCK GATEWAY VERIFY PAYMENT] OrderId: ${options.orderId} | PaymentId: ${options.paymentId} | Generated UTR: ${mockUtr}`
    );

    return {
      success: true,
      paymentId: options.paymentId || `pay_mock_${timestamp}`,
      amount: 13500,
      utr: mockUtr,
      paymentMethod: "UPI",
    };
  }
}
