export const PLATFORM_FEE_PERCENT = 0.12;

export function calculateFees(budgetCents: number) {
  const platformFee = Math.round(budgetCents * PLATFORM_FEE_PERCENT);
  const workerPayout = budgetCents - platformFee;
  return { platformFee, workerPayout, total: budgetCents };
}
