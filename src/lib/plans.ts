export interface PlanDef {
  id: string;
  name: string;
  amountInr: number;
  period: string;
  selfServe: boolean;
}

export const PLANS: Record<string, PlanDef> = {
  starter: {
    id: "starter",
    name: "Standard Starter",
    amountInr: 24000,
    period: "year",
    selfServe: true,
  },
  pro: {
    id: "pro",
    name: "Campus Growth Pro",
    amountInr: 54000,
    period: "year",
    selfServe: true,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    amountInr: 120000,
    period: "year",
    selfServe: false,
  },
};

export const DEFAULT_PLAN_ID = "pro";

export function resolvePlan(planId?: string | null): PlanDef {
  const key = (planId || "").toLowerCase();
  return PLANS[key] ?? PLANS[DEFAULT_PLAN_ID];
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
