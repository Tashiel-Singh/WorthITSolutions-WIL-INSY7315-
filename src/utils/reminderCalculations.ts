import { Invoice, PaymentReminderAlert } from '../types';

/**
 * Calculates days remaining until the given due date string (YYYY-MM-DD).
 */
export function calculateDaysRemaining(dueDate: string, referenceDate?: Date): number {
  const ref = referenceDate ? new Date(referenceDate) : new Date();
  ref.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - ref.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Maps days remaining to the defined reminder tier or null if not yet due for reminder.
 */
export function getPaymentAlertTier(
  daysRemaining: number
): { tier: PaymentReminderAlert['alertTier']; label: string } | null {
  if (daysRemaining < 0) {
    return {
      tier: 'overdue',
      label: `${Math.abs(daysRemaining)} Days Overdue - Credit Hold Pending`,
    };
  }
  if (daysRemaining <= 1) {
    return {
      tier: 'final-1d',
      label: 'URGENT: 24-Hour Final Payment Warning',
    };
  }
  if (daysRemaining <= 3) {
    return {
      tier: 'urgent-3d',
      label: 'Urgent Payment Due (3 Days Remaining)',
    };
  }
  if (daysRemaining <= 7) {
    return {
      tier: 'notice-7d',
      label: 'Advance Payment Notice (7 Days Left)',
    };
  }
  return null;
}

/**
 * Generates automated payment reminder alerts for unpaid invoices.
 */
export function computePaymentReminders(
  invoices: Invoice[],
  referenceDate?: Date
): PaymentReminderAlert[] {
  const alerts: PaymentReminderAlert[] = [];

  for (const inv of invoices) {
    if (inv.status === 'Paid') continue;

    const daysRemaining = calculateDaysRemaining(inv.dueDate, referenceDate);
    const tierInfo = getPaymentAlertTier(daysRemaining);

    if (tierInfo) {
      alerts.push({
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber,
        clientName: inv.clientName,
        dueDate: inv.dueDate,
        daysRemaining,
        alertTier: tierInfo.tier,
        amount: inv.totalAmount,
        badgeLabel: tierInfo.label,
        dispatchedNotice: false,
      });
    }
  }

  // Sort: overdue first, then lowest days remaining
  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
