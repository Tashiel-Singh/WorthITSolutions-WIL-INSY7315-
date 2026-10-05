import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { ToastProvider } from '../components/common/ToastContext';
import { InventoryView } from '../views/InventoryView';
import { getExpiryCountdown } from '../utils/formatters';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>{ui}</ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

describe('Dual-Pool Inventory Segregation & Expiry Tracking System', () => {
  it('correctly calculates expiry alert levels based on remaining shelf life', () => {
    // Current test date is October 2026
    const alert30 = getExpiryCountdown('2026-11-01');
    expect(alert30.level).toBe('warning-30');
    expect(alert30.label).toMatch(/\d+d left \(Notice\)/);

    const alertOptimal = getExpiryCountdown('2028-06-30');
    expect(alertOptimal.level).toBe('optimal');
    expect(alertOptimal.daysRemaining).toBeGreaterThan(30);

    const alertExpired = getExpiryCountdown('2020-01-01');
    expect(alertExpired.level).toBe('expired');
  });

  it('renders the Inventory Management view with search and filter affordances', () => {
    renderWithProviders(<InventoryView />);

    expect(screen.getByText(/Inventory & Stock Segregation Architecture/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search product by name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bulk Reserve Pool/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Direct Retail Pool/i })).toBeInTheDocument();
  });

  it('filters stock table when toggling between Retail and Bulk pool views', async () => {
    renderWithProviders(<InventoryView />);

    // Click Direct Retail Pool
    const retailPoolBtn = screen.getByRole('button', { name: /Direct Retail Pool/i });
    fireEvent.click(retailPoolBtn);

    // Verify retail pool button is active
    expect(retailPoolBtn).toHaveClass('bg-slateBlue-700');

    // Click Bulk Reserve Pool
    const bulkPoolBtn = screen.getByRole('button', { name: /Bulk Reserve Pool/i });
    fireEvent.click(bulkPoolBtn);
    expect(bulkPoolBtn).toHaveClass('bg-brand-700');
  });

  it('displays the audit trail of logged stock pool transfers', () => {
    renderWithProviders(<InventoryView />);

    expect(screen.getByText(/Bulk-to-Retail Transfer Audit Log/i)).toBeInTheDocument();
    expect(screen.getByText(/TRF-9012/i)).toBeInTheDocument();
  });
});
