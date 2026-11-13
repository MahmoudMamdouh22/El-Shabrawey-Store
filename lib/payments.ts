export const PAYMENT_METHODS = [
  "cash",
  "vodafone_cash",
  "etisalat_cash",
  "orange_cash",
  "instapay",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function isPaymentMethod(value: string): value is PaymentMethod {
  return (PAYMENT_METHODS as readonly string[]).includes(value);
}

export function needsPaymentProof(method: string): boolean {
  return method === "vodafone_cash" || method === "etisalat_cash" || method === "orange_cash" || method === "instapay";
}

export function paymentMethodLabel(method: string): string {
  const labels: Record<PaymentMethod, string> = {
    cash: "كاش عند الاستلام",
    vodafone_cash: "فودافون كاش",
    etisalat_cash: "اتصالات كاش",
    orange_cash: "أورنج كاش",
    instapay: "إنستاباي",
  };
  return labels[method as PaymentMethod] ?? method;
}
