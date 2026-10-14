import crypto from "crypto";

export type BillingMode = "RAZORPAY" | "MOCK";

export interface BillingOrder {
  mode: BillingMode;
  orderId: string;
  amountInr: number;
  keyId: string | null;
}

export interface BillingVerifyInput {
  mode: BillingMode;
  orderId: string;
  paymentId: string;
  signature?: string;
}

function razorpayKeys(): { keyId: string; keySecret: string } | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

export function billingMode(): BillingMode {
  return razorpayKeys() ? "RAZORPAY" : "MOCK";
}

export async function createBillingOrder(
  amountInr: number,
  schoolCode: string,
  planId: string
): Promise<BillingOrder> {
  const mode = billingMode();

  if (mode === "MOCK") {
    const orderId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    console.log(
      `💳 [PLATFORM BILLING MOCK] ₹${amountInr} | School: ${schoolCode} | Plan: ${planId} | Order: ${orderId}`
    );
    return { mode, orderId, amountInr, keyId: "mock_key_sandbox_skooltech" };
  }

  const keys = razorpayKeys()!;
  const amountInPaise = Math.round(amountInr * 100);
  const authHeader = Buffer.from(`${keys.keyId}:${keys.keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt: `SUB-${schoolCode}-${Date.now()}`,
      notes: { schoolCode, planId, purpose: "platform_subscription" },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("Platform billing order failed:", err);
    throw new Error("Could not create billing order. Please try again.");
  }

  const data = await response.json();
  return { mode, orderId: data.id, amountInr, keyId: keys.keyId };
}

export function verifyBillingPayment(input: BillingVerifyInput): {
  success: boolean;
  error?: string;
} {
  if (input.mode === "MOCK") {
    if (!input.orderId || !input.paymentId) {
      return { success: false, error: "Missing mock payment reference." };
    }
    console.log(
      `✅ [PLATFORM BILLING MOCK VERIFY] Order: ${input.orderId} | Payment: ${input.paymentId}`
    );
    return { success: true };
  }

  const keys = razorpayKeys();
  if (!keys) {
    return { success: false, error: "Billing keys not configured." };
  }
  if (!input.signature) {
    return { success: false, error: "Missing payment signature." };
  }

  const generated = crypto
    .createHmac("sha256", keys.keySecret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");

  const expected = Buffer.from(generated, "hex");
  const provided = Buffer.from(input.signature, "hex");
  const match =
    expected.length === provided.length && crypto.timingSafeEqual(expected, provided);

  if (!match) {
    return { success: false, error: "Payment signature verification failed." };
  }
  return { success: true };
}
