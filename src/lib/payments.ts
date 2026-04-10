/**
 * Payments Service (YooKassa Stub)
 * Simulates the payment process for demonstration.
 */

export interface PaymentDetails {
  amount: number;
  description: string;
  type: "full_access" | "single_course";
  courseId?: string;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export async function createPayment({ amount, description, type, courseId, returnUrl, metadata }: PaymentDetails) {
  console.log(`[YooKassa Stub] Creating payment: ${type} for ${amount} RUB — ${description}`);

  const mockPaymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;

  const params = new URLSearchParams({
    paymentId: mockPaymentId,
    amount: String(amount),
    type,
  });
  if (courseId) params.set("courseId", courseId);
  if (returnUrl) params.set("returnUrl", returnUrl);

  const confirmation_url = `/premium/checkout?${params.toString()}`;

  return {
    id: mockPaymentId,
    status: "pending",
    confirmation_url,
  };
}

export async function confirmPayment(paymentId: string) {
  console.log(`[YooKassa Stub] Confirming payment ${paymentId}`);
  return true;
}
