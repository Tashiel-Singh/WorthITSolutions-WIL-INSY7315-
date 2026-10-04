/**
 * Formatting utilities for South African currency, dates, and expiry countdowns
 */
import { ExpiryAlertLevel } from '../types';

/**
 * Format numeric value to South African Rand (ZAR) string
 * e.g. 15420.5 -> "R 15,420.50"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('ZAR', 'R');
}

/**
 * Format ISO date string to human-readable date
 * e.g. "2026-10-04" -> "04 Oct 2026"
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculates remaining days until expiry and returns alert level
 */
export function getExpiryCountdown(expiryDateStr: string): {
  daysRemaining: number;
  level: ExpiryAlertLevel;
  label: string;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return { daysRemaining, level: 'expired', label: 'Expired' };
  }
  if (daysRemaining <= 7) {
    return { daysRemaining, level: 'critical-7', label: `${daysRemaining}d left (Critical)` };
  }
  if (daysRemaining <= 14) {
    return { daysRemaining, level: 'warning-14', label: `${daysRemaining}d left (Warning)` };
  }
  if (daysRemaining <= 30) {
    return { daysRemaining, level: 'warning-30', label: `${daysRemaining}d left (Notice)` };
  }
  return { daysRemaining, level: 'optimal', label: `${daysRemaining}d (Optimal)` };
}
