export const NAIRA_PER_WEIGHT_POINT = 1000;

export function weightToNaira(weight: number): number {
  return Math.round(weight * NAIRA_PER_WEIGHT_POINT);
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}
