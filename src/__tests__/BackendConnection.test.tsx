import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { medflowApi, API_BASE_URL } from '../services/api';
import { AppProvider } from '../context/AppContext';
import { ToastProvider } from '../components/common/ToastContext';
import { Header } from '../components/layout/Header';

describe('Render Cloud Backend & Database Connection Service', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    medflowApi.logout();
    vi.clearAllMocks();
  });

  it('configures the target Render backend API URL and PostgreSQL database reference', () => {
    expect(medflowApi.getBaseUrl()).toBe(API_BASE_URL);
    expect(API_BASE_URL).toContain('medflow-api-wil26sc.onrender.com');
  });

  it('performs health check probing and returns connection diagnostics', async () => {
    const health = await medflowApi.checkHealth();
    expect(health.ok).toBe(true);
    expect(health.status).toBe('ok');
    expect(typeof health.latencyMs).toBe('number');
  });

  it('manages JWT authentication tokens securely in session storage', () => {
    expect(medflowApi.getToken()).toBeNull();
    const dummyJwt = 'mock-jwt-token-xyz123';
    medflowApi.setToken(dummyJwt);
    expect(medflowApi.getToken()).toBe(dummyJwt);
    expect(sessionStorage.getItem('medflow_auth_token')).toBe(dummyJwt);

    medflowApi.logout();
    expect(medflowApi.getToken()).toBeNull();
    expect(sessionStorage.getItem('medflow_auth_token')).toBeNull();
  });

  it('handles offline or network failure with graceful fallback diagnostics', async () => {
    vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.reject(new Error('Network disconnected'))
    );

    const health = await medflowApi.checkHealth(1000);
    expect(health.ok).toBe(false);
    expect(health.status).toBe('offline');
    expect(health.error).toContain('Network disconnected');
  });

  it('renders backend status indicator in Header and opens the infrastructure dialog', async () => {
    render(
      <ToastProvider>
        <AppProvider>
          <Header onToggleSidebar={() => {}} isSidebarOpen={false} />
        </AppProvider>
      </ToastProvider>
    );

    // Verify presence of Render backend indicator button
    const backendBtn = await screen.findByRole('button', { name: /View backend database connection details/i });
    expect(backendBtn).toBeInTheDocument();

    // Click to open backend infrastructure diagnostic modal
    fireEvent.click(backendBtn);

    // Verify modal content
    expect(screen.getByText('Render Cloud Backend & Database')).toBeInTheDocument();
    expect(screen.getByText('medflow-db-wil26sc')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL 16 (Render Managed)')).toBeInTheDocument();
    expect(screen.getByText('Prisma 5.22 (Task 1 ERD)')).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('medflow-db-wil26sc')).not.toBeInTheDocument();
    });
  });
});
