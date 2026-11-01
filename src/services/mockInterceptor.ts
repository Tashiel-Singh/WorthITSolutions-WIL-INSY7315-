/**
 * MedFlow In-Browser Standalone Mock Service Interceptor
 * Intercepts all fetch & axios API calls to provide zero-dependency offline execution.
 */
import { GrowthEngineService, QuantitativeExecutionReport } from './GrowthEngineService';
import {
  initialProducts,
  initialOrders,
  initialInvoices,
  initialUsers,
} from '../data/mockData';

export function installMockInterceptor(): void {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = (init?.method || 'GET').toUpperCase();

    // Check if this is an API or health check request
    const isApiRequest =
      url.includes('/api/') ||
      url.includes('/health') ||
      url.includes('medflow-api-wil26sc.onrender.com') ||
      url.includes(':5000') ||
      url.includes(':4000');

    if (!isApiRequest) {
      try {
        return await originalFetch(input, init);
      } catch {
        // Fallback for static assets or relative routing if offline
        return new Response(JSON.stringify({ status: 'offline-safe' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Parse body if present
    let bodyObj: any = {};
    if (init?.body) {
      try {
        if (typeof init.body === 'string') {
          bodyObj = JSON.parse(init.body);
        }
      } catch {
        bodyObj = {};
      }
    }

    // 1. Health Probe
    if (url.includes('/health')) {
      return new Response(
        JSON.stringify({
          ok: true,
          status: 'ok',
          isStub: false,
          latencyMs: 1,
          mode: 'standalone-presentation-demo',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Growth Engine Stochastic Simulation (/api/v1/growth/simulate or /api/growth/simulate)
    if (url.includes('/growth/simulate')) {
      const initialWorkingCapital = Number(bodyObj.initialWorkingCapital) || 100000;
      const expectedReturnDrift = Number(bodyObj.expectedReturnDrift) || 0.12;
      const cashFlowVolatility = Number(bodyObj.cashFlowVolatility) || 0.18;

      const report: QuantitativeExecutionReport = GrowthEngineService.modelStochasticVelocity({
        initialWorkingCapital,
        expectedReturnDrift,
        cashFlowVolatility,
        riskFreeRate: Number(bodyObj.riskFreeRate) || 0.07,
        timeHorizonMonths: Number(bodyObj.timeHorizonMonths) || 12,
        numSimulations: Number(bodyObj.numSimulations) || 30,
      });

      return new Response(
        JSON.stringify({
          success: true,
          data: report,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Tax Deduction Calculation (/api/tax/calculate-deduction)
    if (url.includes('/tax/calculate-deduction')) {
      const assets = Array.isArray(bodyObj.assets) ? bodyObj.assets : [];
      const expenses = Array.isArray(bodyObj.expenses) ? bodyObj.expenses : [];
      const bulkRev = Number(bodyObj.bulkRevenue) || 0;

      const assetSum = assets.reduce(
        (sum: number, a: any) => sum + (a && a.depreciable !== false ? Number(a.cost || 0) : 0),
        0
      );
      const expenseSum = expenses.reduce(
        (sum: number, e: any) => sum + Number(e && e.amount ? e.amount : 0),
        0
      );

      const depreciationDeduction = Math.round(assetSum * 0.20 * 100) / 100;
      const expenseDeduction = Math.round(expenseSum * 0.15 * 100) / 100;
      const vatInputDeduction = Math.round(bulkRev * 0.05 * 100) / 100;
      const totalDeduction =
        Math.round((depreciationDeduction + expenseDeduction + vatInputDeduction) * 100) / 100;

      return new Response(
        JSON.stringify({
          inputs: {
            assetCount: assets.length,
            expenseCount: expenses.length,
            bulkRevenue: bulkRev,
          },
          depreciationDeduction,
          expenseDeduction,
          vatInputDeduction,
          totalDeduction,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. Bulk Order Processing (/api/orders/bulk-process)
    if (url.includes('/orders/bulk-process')) {
      const basePrice = Number(bodyObj.basePrice) || 500;
      const quantity = Number(bodyObj.quantity) || 24;

      let discountPercent = 0.10;
      let tierApplied = 'Tier 1 (10% Volume Discount: 12+ Units)';
      if (quantity >= 48) {
        discountPercent = 0.25;
        tierApplied = 'Tier 3 (25% Bulk Wholesale: 48+ Units)';
      } else if (quantity >= 24) {
        discountPercent = 0.15;
        tierApplied = 'Tier 2 (15% Pharmacy Volume: 24+ Units)';
      }

      const gross = basePrice * quantity;
      const savings = Math.round(gross * discountPercent * 100) / 100;
      const subtotalExVat = Math.round((gross - savings) * 100) / 100;
      const vatAmount = Math.round(subtotalExVat * 0.15 * 100) / 100;
      const totalIncVat = Math.round((subtotalExVat + vatAmount) * 100) / 100;

      return new Response(
        JSON.stringify({
          basePrice,
          quantity,
          tierApplied,
          discountPercent: discountPercent * 100,
          subtotalExVat,
          vatAmount,
          totalIncVat,
          savings,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 5. Orders (/api/orders)
    if (url.includes('/api/orders')) {
      if (method === 'POST') {
        const orderId = `ord-demo-${Date.now()}`;
        const orderNum = `ORD-${Math.floor(8100 + Math.random() * 899)}`;
        const invNum = `INV-2026-${Math.floor(120 + Math.random() * 899)}`;
        return new Response(
          JSON.stringify({
            order: {
              id: orderId,
              orderNumber: orderNum,
              status: 'CONFIRMED',
              channel: 'PHARMACY',
              createdAt: new Date().toISOString(),
            },
            invoice: {
              id: `inv-${Date.now()}`,
              invoiceNumber: invNum,
              status: 'SENT',
              vatAmount: 2450.5,
              totalAmount: 18787.5,
            },
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          data: initialOrders,
          page: 1,
          pageSize: 20,
          total: initialOrders.length,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Invoices (/api/invoices)
    if (url.includes('/api/invoices')) {
      if (method === 'POST') {
        return new Response(
          JSON.stringify({
            payment: { id: `pmt-${Date.now()}`, amount: bodyObj.amountPaid || 5000 },
            invoiceStatus: 'PAID',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          data: initialInvoices,
          page: 1,
          pageSize: 20,
          total: initialInvoices.length,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 7. Products (/api/products)
    if (url.includes('/api/products')) {
      return new Response(
        JSON.stringify({
          data: initialProducts,
          page: 1,
          pageSize: 54,
          total: initialProducts.length,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 8. Revenue Breakdown Analytics (/api/analytics/revenue-breakdown)
    if (url.includes('/analytics/revenue-breakdown')) {
      return new Response(
        JSON.stringify({
          from: null,
          to: null,
          recordCount: 120,
          patientRevenue: 284000,
          pharmacyRevenue: 650000,
          leisureRevenue: 142000,
          totalGrossRevenue: 1076000,
          bulkRevenue: 650000,
          bulkRevenuePercent: 60.4,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 9. Authentication (/api/auth/login or /api/auth/register)
    if (url.includes('/api/auth/')) {
      const user = initialUsers[0];
      return new Response(
        JSON.stringify({
          accessToken: 'demo-jwt-token-15m-valid-for-offline-presentation',
          expiresIn: 900,
          user: {
            id: user.id,
            email: user.email,
            role: 'OWNER',
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 10. Default catch-all for any other API endpoints
    return new Response(
      JSON.stringify({
        success: true,
        data: {},
        mode: 'standalone-demo',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  // Provide window.axios mock adapter if any third-party script expects axios
  (window as any).axios = {
    get: async (url: string) => {
      const res = await window.fetch(url);
      return { data: await res.json(), status: res.status };
    },
    post: async (url: string, data: any) => {
      const res = await window.fetch(url, { method: 'POST', body: JSON.stringify(data) });
      return { data: await res.json(), status: res.status };
    },
    patch: async (url: string, data: any) => {
      const res = await window.fetch(url, { method: 'PATCH', body: JSON.stringify(data) });
      return { data: await res.json(), status: res.status };
    },
    delete: async (url: string) => {
      const res = await window.fetch(url, { method: 'DELETE' });
      return { data: await res.json(), status: res.status };
    },
  };
}
