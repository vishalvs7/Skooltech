import { MockPaymentGateway } from "./mock";
import { RazorpayPaymentGateway } from "./razorpay";
import { CashfreePaymentGateway } from "./cashfree";
import type { IPaymentGateway, PaymentGatewayProvider } from "./types";

export * from "./types";
export * from "./mock";
export * from "./razorpay";
export * from "./cashfree";

/**
 * BYOG (Bring Your Own Gateway) Factory
 * Dynamically resolves gateway instance based on school settings.
 * Defaults safely to MockPaymentGateway for local development and testing.
 */
export function getPaymentGateway(
  provider?: string | null,
  credentials?: { keyId?: string | null; secret?: string | null }
): IPaymentGateway {
  const normalizedProvider = (provider || "").toUpperCase() as PaymentGatewayProvider;

  if (normalizedProvider === "RAZORPAY") {
    return new RazorpayPaymentGateway(
      credentials?.keyId || undefined,
      credentials?.secret || undefined
    );
  }

  if (normalizedProvider === "CASHFREE") {
    return new CashfreePaymentGateway(
      credentials?.keyId || undefined,
      credentials?.secret || undefined
    );
  }

  // Default to zero-config Mock Gateway
  return new MockPaymentGateway();
}
