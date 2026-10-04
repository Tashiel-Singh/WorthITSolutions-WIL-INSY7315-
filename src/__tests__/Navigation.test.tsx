import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { ToastProvider } from '../components/common/ToastContext';
import { AppLayout } from '../components/layout/AppLayout';
import { RoleSwitcher } from '../components/common/RoleSwitcher';

const renderAppWithLayout = (children: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <AppLayout>{children}</AppLayout>
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

describe('Navigation, Layout Shell & Role-Based Access Control', () => {
  it('renders the WCAG accessible skip-to-content link', () => {
    renderAppWithLayout(<div>Page Content</div>);
    const skipLink = screen.getByText(/Skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders MedFlow brand banner with B2B distribution badge', () => {
    renderAppWithLayout(<div>Page Content</div>);
    const brandInstances = screen.getAllByText(/MedFlow/i);
    expect(brandInstances.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/B2B Distribution/i)).toBeInTheDocument();
  });

  it('renders primary navigation links on the sidebar', () => {
    renderAppWithLayout(<div>Page Content</div>);
    expect(screen.getByRole('link', { name: /Executive Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Inventory Management/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Pharmacy Bulk Order/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Orders & Invoices/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Patient Portal/i })).toBeInTheDocument();
  });

  it('allows switching evaluation roles seamlessly via RoleSwitcher', () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <ToastProvider>
            <RoleSwitcher />
          </ToastProvider>
        </AppProvider>
      </BrowserRouter>
    );

    const trigger = screen.getByLabelText(/Switch active demonstration user role/i);
    expect(trigger).toBeInTheDocument();
    fireEvent.click(trigger);

    const pharmacyButton = screen.getByRole('menuitem', { name: /Pharmacy Manager/i });
    expect(pharmacyButton).toBeInTheDocument();
    fireEvent.click(pharmacyButton);

    // Verify role switcher reflects the new role
    expect(screen.getAllByText(/pharmacy/i).length).toBeGreaterThanOrEqual(1);
  });
});
