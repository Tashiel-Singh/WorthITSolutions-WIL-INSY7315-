/** All currency maths is done in integer cents to avoid floating point drift. */
export const toCents = (amount: number): number => Math.round((amount + Number.EPSILON) * 100);
export const fromCents = (cents: number): number => cents / 100;

export function assertMoney(value: number, label: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite number >= 0`);
  }
}
