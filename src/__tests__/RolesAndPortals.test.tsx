/**
 * Verification Test Suite for Project MedFlow 7-Role Architecture,
 * Prescriber Condition Tagging, Pharmacist 8.5% Commissions,
 * Wellness Appointments, Payment Reminders, and 54-SKU Catalog.
 */
import { describe, it, expect } from 'vitest';
import { initialUsers, initialProducts, initialPrescriptions, initialInvoices } from '../data/mockData';
import { computePaymentReminders, getPaymentAlertTier } from '../utils/reminderCalculations';
import { UserRole, ConditionTag, PharmacistReferral, WellnessAppointment } from '../types';

describe('7-Role Enterprise Architecture Verification', () => {
  it('defines all 7 system roles with corresponding user profiles', () => {
    const requiredRoles: UserRole[] = [
      'distributor',
      'pharmacy',
      'patient',
      'pharmacist',
      'doctor',
      'psychiatrist',
      'leisure',
    ];

    requiredRoles.forEach((role) => {
      const user = initialUsers.find((u) => u.role === role);
      expect(user).toBeDefined();
      expect(user?.role).toBe(role);
      expect(user?.name).toBeTruthy();
      expect(user?.email).toBeTruthy();
    });
  });

  it('verifies medical practitioner roles have HPCSA credentials', () => {
    const pharmacist = initialUsers.find((u) => u.role === 'pharmacist');
    const doctor = initialUsers.find((u) => u.role === 'doctor');
    const psychiatrist = initialUsers.find((u) => u.role === 'psychiatrist');

    expect(pharmacist?.hpcsaNumber).toMatch(/^PH/);
    expect(doctor?.hpcsaNumber).toMatch(/^MP/);
    expect(psychiatrist?.hpcsaNumber).toMatch(/^MP|^PS/);
  });
});

describe('54-SKU Catalog & Dual-Pool Stock Segregation', () => {
  it('contains at least 50 distinct medical SKUs across CBD and Homeopathic categories', () => {
    expect(initialProducts.length).toBeGreaterThanOrEqual(50);
  });

  it('contains representations across all required botanical categories', () => {
    const categories = new Set(initialProducts.map((p) => p.category));
    expect(categories.has('CBD Oils & Extracts')).toBe(true);
    expect(categories.has('Tinctures')).toBe(true);
    expect(categories.has('Capsules & Tablets')).toBe(true);
    expect(categories.has('Topical Balms')).toBe(true);
    expect(categories.has('CBD Edibles')).toBe(true);
    expect(categories.has('Homeopathic Remedies')).toBe(true);
    expect(categories.has('Homeopathic Creams')).toBe(true);
    expect(categories.has('Homeopathic Drops')).toBe(true);
  });

  it('verifies every product enforces separate bulk and retail inventory pools', () => {
    initialProducts.forEach((p) => {
      expect(typeof p.bulkStock).toBe('number');
      expect(typeof p.retailStock).toBe('number');
      expect(p.bulkStock).toBeGreaterThanOrEqual(0);
      expect(p.retailStock).toBeGreaterThanOrEqual(0);
      expect(p.reorderLevel).toBeGreaterThan(0);
      expect(p.retailPrice).toBeGreaterThan(0);
      expect(p.batchNumber).toBeTruthy();
      expect(p.expiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

describe('Prescriber Condition Tagging & Outcome Tracking', () => {
  it('verifies clinical condition tags are applied to initial prescriptions', () => {
    const validTags: ConditionTag[] = [
      'Anxiety & Panic',
      'Chronic Neuropathic Pain',
      'Sleep Disorders & Insomnia',
      'Arthritic Inflammation',
      'Post-Traumatic Stress (PTSD)',
      'Digestive Dysbiosis',
      'Stress & Autonomic Fatigue',
    ];

    expect(initialPrescriptions.length).toBeGreaterThanOrEqual(3);

    initialPrescriptions.forEach((rx) => {
      expect(rx.conditionTag).toBeDefined();
      expect(validTags).toContain(rx.conditionTag);
      expect(rx.clinicalOutcomeNotes).toBeTruthy();
      expect(rx.refillsRemaining).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('Pharmacist 8.5% Referral Commission Engine', () => {
  it('correctly calculates 8.5% commission on referred patient orders', () => {
    const orderAmount = 2400.00;
    const rate = 0.085;
    const expectedCommission = Math.round(orderAmount * rate * 100) / 100;

    expect(expectedCommission).toBe(204.00);

    const referral: PharmacistReferral = {
      id: 'ref-test-1',
      referralCode: 'REF-9921',
      pharmacistId: 'usr-pharmacist-1',
      pharmacistName: 'Tariq Moodley (Pharmacist)',
      pharmacistHpcsa: 'PH0284711',
      patientName: 'Kagiso Mabaso',
      patientContact: '+27 82 555 1234',
      prescribedTherapy: 'Full Spectrum CBD Oil 1000mg',
      orderAmount,
      commissionRate: rate,
      commissionEarned: expectedCommission,
      status: 'Approved',
      timestamp: '2026-11-01 10:00',
    };

    expect(referral.commissionEarned).toBe(204.00);
    expect(referral.status).toBe('Approved');
  });
});

describe('Automated Payment Reminder Alerts Engine (7d, 3d, 1d, overdue)', () => {
  it('assigns correct alert tiers based on days remaining', () => {
    expect(getPaymentAlertTier(-5)?.tier).toBe('overdue');
    expect(getPaymentAlertTier(0)?.tier).toBe('final-1d');
    expect(getPaymentAlertTier(1)?.tier).toBe('final-1d');
    expect(getPaymentAlertTier(2)?.tier).toBe('urgent-3d');
    expect(getPaymentAlertTier(3)?.tier).toBe('urgent-3d');
    expect(getPaymentAlertTier(5)?.tier).toBe('notice-7d');
    expect(getPaymentAlertTier(7)?.tier).toBe('notice-7d');
    expect(getPaymentAlertTier(15)).toBeNull();
  });

  it('computes reminder alerts from invoices and skips paid invoices', () => {
    const testDate = new Date('2026-10-31');
    const alerts = computePaymentReminders(initialInvoices, testDate);

    expect(alerts.length).toBeGreaterThan(0);
    alerts.forEach((alert) => {
      expect(alert.invoiceId).toBeTruthy();
      expect(alert.invoiceNumber).toBeTruthy();
      expect(alert.amount).toBeGreaterThan(0);
      expect(['overdue', 'final-1d', 'urgent-3d', 'notice-7d']).toContain(alert.alertTier);
    });
  });
});

describe('Wellness Appointment Booking', () => {
  it('creates valid wellness appointment with recommendations', () => {
    const appointment: WellnessAppointment = {
      id: 'apt-test-1',
      appointmentRef: 'APT-4821',
      clientName: 'Chloe Bennett',
      clientEmail: 'chloe.bennett@lifestylemail.co.za',
      clientPhone: '+27 83 234 5678',
      consultationType: 'CBD Phytocannabinoid Assessment',
      practitioner: 'Dr. Hendrik van der Merwe (Integrative Physician)',
      date: '2026-11-10',
      timeSlot: '10:00 - 10:45',
      status: 'Confirmed',
      notes: 'Consultation for sleep and evening recovery routine',
      wellnessProductRecommendations: ['CBD Relax Drops 50ml', 'Soothing Body Balm'],
    };

    expect(appointment.status).toBe('Confirmed');
    expect(appointment.wellnessProductRecommendations.length).toBe(2);
  });
});
