/**
 * Helper to calculate dynamic daily late fee on read
 */
export function calculateDynamicLateFee(
  dueDate: Date | string,
  baseAmount: number,
  dailyRate: number = 25,
  lateFeeCap: number = 1000,
  graceDays: number = 5
) {
  const due = new Date(dueDate);
  const today = new Date();
  
  // Calculate difference in calendar days
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const overdueDays = Math.max(0, diffDays - graceDays);
  const lateFee = Math.min(overdueDays * dailyRate, lateFeeCap);
  const totalPayable = baseAmount + lateFee;

  return {
    overdueDays,
    lateFee,
    totalPayable,
    isOverdue: overdueDays > 0,
  };
}
