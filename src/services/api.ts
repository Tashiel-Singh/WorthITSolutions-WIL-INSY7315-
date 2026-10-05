/// <reference types="vite/client" />
/**
 * MedFlow API Client Service
 * Connects React frontend to Render-hosted Node.js / PostgreSQL backend
 * Target API: https://medflow-api-wil26sc.onrender.com
 * Database: PostgreSQL on Render (medflow-db-wil26sc)
 */

export interface HealthCheckResult {
  ok: boolean;
  status: string;
  latencyMs: number;
  isStub?: boolean;
  error?: string;
  timestamp: string;
}

export interface AuthSession {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface BulkCalculationResult {
  basePrice: number;
  quantity: number;
  tierApplied: string;
  discountPercent: number;
  subtotalExVat: number;
  vatAmount: number;
  totalIncVat: number;
  savings: number;
}

export interface TaxDeductionApiResult {
  inputs: {
    assetCount: number;
    expenseCount: number;
    bulkRevenue: number;
  };
  depreciationDeduction: number;
  expenseDeduction: number;
  vatInputDeduction: number;
  totalDeduction: number;
}

export interface RevenueBreakdownApiResult {
  from: string | null;
  to: string | null;
  recordCount: number;
  patientRevenue: number;
  pharmacyRevenue: number;
  leisureRevenue: number;
  totalGrossRevenue: number;
  bulkRevenue: number;
  bulkRevenuePercent: number;
}

export const API_BASE_URL: string = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'https://medflow-api-wil26sc.onrender.com'
).replace(/\/$/, '');

const STORAGE_KEY_TOKEN = 'medflow_auth_token';
const STORAGE_KEY_USER = 'medflow_auth_user';

class MedFlowApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem(STORAGE_KEY_TOKEN) || localStorage.getItem(STORAGE_KEY_TOKEN);
    }
  }

  public getBaseUrl(): string {
    return API_BASE_URL;
  }

  public getToken(): string | null {
    return this.token;
  }

  public setToken(token: string | null, persist: boolean = true): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem(STORAGE_KEY_TOKEN, token);
        if (persist) localStorage.setItem(STORAGE_KEY_TOKEN, token);
      } else {
        sessionStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        sessionStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    }
  }

  /**
   * Health Check & Latency Diagnostic
   * Tests connectivity to Render web service & DB
   */
  public async checkHealth(timeoutMs: number = 8000): Promise<HealthCheckResult> {
    const start = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timer);
      const latencyMs = Math.round(performance.now() - start);

      if (!response.ok) {
        return {
          ok: false,
          status: `HTTP ${response.status}`,
          latencyMs,
          error: `Backend responded with error code ${response.status}`,
          timestamp: new Date().toISOString(),
        };
      }

      const text = await response.text();
      let statusStr = 'ok';
      let isStub = false;

      try {
        const json = JSON.parse(text);
        statusStr = json.status || 'ok';
      } catch {
        if (text.includes('stub') || text.includes('MedFlow')) {
          statusStr = 'stub-active';
          isStub = true;
        }
      }

      return {
        ok: true,
        status: statusStr,
        latencyMs,
        isStub,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      clearTimeout(timer);
      const latencyMs = Math.round(performance.now() - start);
      const isTimeout = err.name === 'AbortError';

      return {
        ok: false,
        status: isTimeout ? 'timeout' : 'offline',
        latencyMs,
        error: isTimeout
          ? 'Backend connection timed out (Render free tier may be cold-starting)'
          : err.message || 'Cannot reach Render backend',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Base Fetch wrapper with JSON serialization, JWT auth headers, and timeout
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs: number = 10000
  ): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
      }
      return data as T;
    } catch (err: any) {
      clearTimeout(timer);
      throw err;
    }
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATION & SESSIONS
  // --------------------------------------------------------------------------

  public async login(email: string, password: string): Promise<AuthSession> {
    const result = await this.request<AuthSession>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result.accessToken) {
      this.setToken(result.accessToken);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(result.user));
      }
    }
    return result;
  }

  public async register(payload: {
    email: string;
    password: string;
    name: string;
    role: 'PATIENT' | 'LEISURE_CLIENT';
    dateOfBirth?: string;
    contactNumber?: string;
    consentToDataStorage: boolean;
    consentToReminders?: boolean;
  }): Promise<{ id: string; email: string; role: string }> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public logout(): void {
    this.setToken(null);
  }

  // --------------------------------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------------------------------

  public async getProducts(params?: {
    search?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: any[]; page: number; pageSize: number; total: number }> {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.category) q.append('category', params.category);
    if (params?.page) q.append('page', params.page.toString());
    if (params?.pageSize) q.append('pageSize', params.pageSize.toString());

    const qs = q.toString();
    return this.request(`/api/products${qs ? `?${qs}` : ''}`);
  }

  public async getProductById(id: string): Promise<any> {
    return this.request(`/api/products/${id}`);
  }

  // --------------------------------------------------------------------------
  // ORDERS & BULK PROCESSING
  // --------------------------------------------------------------------------

  public async calculateBulkOrder(
    basePrice: number,
    quantity: number
  ): Promise<BulkCalculationResult> {
    return this.request<BulkCalculationResult>('/api/orders/bulk-process', {
      method: 'POST',
      body: JSON.stringify({ basePrice, quantity }),
    });
  }

  public async getOrders(params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: any[]; page: number; pageSize: number; total: number }> {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.page) q.append('page', params.page.toString());
    if (params?.pageSize) q.append('pageSize', params.pageSize.toString());
    const qs = q.toString();
    return this.request(`/api/orders${qs ? `?${qs}` : ''}`);
  }

  public async createOrder(orderPayload: {
    pharmacyId?: string;
    items: { productId: string; quantity: number }[];
  }): Promise<{ order: any; invoice: any }> {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
  }

  public async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  public async cancelOrder(orderId: string): Promise<any> {
    return this.request(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  }

  // --------------------------------------------------------------------------
  // INVOICES & PAYMENTS
  // --------------------------------------------------------------------------

  public async getInvoices(params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: any[]; page: number; pageSize: number; total: number }> {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.page) q.append('page', params.page.toString());
    if (params?.pageSize) q.append('pageSize', params.pageSize.toString());
    const qs = q.toString();
    return this.request(`/api/invoices${qs ? `?${qs}` : ''}`);
  }

  public async recordPayment(
    invoiceId: string,
    amountPaid: number,
    method: string
  ): Promise<{ payment: any; invoiceStatus: string }> {
    return this.request(`/api/invoices/${invoiceId}/payments`, {
      method: 'POST',
      body: JSON.stringify({ amountPaid, method }),
    });
  }

  // --------------------------------------------------------------------------
  // FORMAL TAX DEDUCTION (Section 11(e) RSA Tax Act)
  // --------------------------------------------------------------------------

  public async calculateTaxDeduction(payload: {
    assets?: { cost: number; depreciable?: boolean }[];
    expenses?: { amount: number }[];
    bulkRevenue?: number;
  }): Promise<TaxDeductionApiResult> {
    return this.request<TaxDeductionApiResult>('/api/tax/calculate-deduction', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --------------------------------------------------------------------------
  // REVENUE SEGREGATION & FINANCIAL ANALYTICS
  // --------------------------------------------------------------------------

  public async getRevenueBreakdown(
    from?: string,
    to?: string
  ): Promise<RevenueBreakdownApiResult> {
    const q = new URLSearchParams();
    if (from) q.append('from', from);
    if (to) q.append('to', to);
    const qs = q.toString();
    return this.request<RevenueBreakdownApiResult>(
      `/api/analytics/revenue-breakdown${qs ? `?${qs}` : ''}`
    );
  }

  // --------------------------------------------------------------------------
  // PATIENTS & POPIA COMPLIANCE
  // --------------------------------------------------------------------------

  public async getPatients(): Promise<any[]> {
    return this.request<any[]>('/api/patients');
  }

  public async anonymisePatient(patientId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/api/patients/${patientId}/anonymise`,
      { method: 'POST' }
    );
  }
}

export const medflowApi = new MedFlowApiService();
