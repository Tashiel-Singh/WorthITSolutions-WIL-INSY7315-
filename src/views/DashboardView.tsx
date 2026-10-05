/**
 * Distributor / Owner Executive Performance Dashboard (/dashboard)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatCurrency } from '../utils/formatters';
import { revenueSegregationSplits } from '../data/mockData';
import { calculateSection11eDepreciation } from '../utils/taxCalculations';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  ShieldCheck,
  Building2,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  ShoppingCart,
  Calculator,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { products, revenueData } = useApp();

  // Metrics calculation
  const totalRevenue = revenueData.reduce(
    (acc, curr) => acc + curr.retailRevenue + curr.bulkRevenue + curr.leisureRevenue,
    0
  );
  const lowStockCount = products.filter(
    (p) => p.activeStatus === 'Low Stock' || p.activeStatus === 'Out of Stock'
  ).length;

  // SARS Section 11(e) interactive model
  const [capitalAssets, setCapitalAssets] = useState(480000);
  const [opsExpenses, setOpsExpenses] = useState(310000);
  const [bulkTurnover, setBulkTurnover] = useState(650000);

  const taxModel = calculateSection11eDepreciation(capitalAssets, opsExpenses, bulkTurnover);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Distributor Executive Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time financial segregation, tax optimization, and B2B bulk transition monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Boxes className="w-4 h-4 text-slate-600" />}
            onClick={() => navigate('/inventory')}
          >
            Manage Pools
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<ShoppingCart className="w-4 h-4" />}
            onClick={() => navigate('/orders/new')}
          >
            New Bulk Order
          </Button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Revenue */}
        <Card variant="emeraldBorder" hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              6-Month Gross Revenue
            </span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+48% B2B Growth</span>
              <span className="text-slate-400 font-normal">vs May baseline</span>
            </div>
          </div>
        </Card>

        {/* KPI 2: Tax Shield Saved */}
        <Card variant="default" hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              SARS 11(e) Tax Deductions
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-brand-700 tracking-tight">
              {taxModel.taxLiabilityReducedPct}% Saved
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600">
              <span>{formatCurrency(taxModel.totalTaxShield)} total deductions</span>
            </div>
          </div>
        </Card>

        {/* KPI 3: Active Bulk Pharmacies */}
        <Card variant="tealBorder" hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Contracted Bulk Pharmacies
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-slateBlue-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              14 Facilities
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slateBlue-700 font-semibold">
              <span>62% Revenue Contribution</span>
            </div>
          </div>
        </Card>

        {/* KPI 4: Low Stock Alerts */}
        <Card variant="default" hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stock Reorder Warnings
            </span>
            <div className={`p-2 rounded-xl ${lowStockCount > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {lowStockCount} Products
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-700 font-semibold">
              <span>Cannibalization Shield: Active</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Charts: Revenue Segregation Pie Chart & Monthly Growth Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts Pie Chart (Revenue Segregation) */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Revenue Stream Segregation</h2>
                <p className="text-xs text-slate-500">Dual-channel breakdown isolating B2B Bulk supply</p>
              </div>
              <Badge variant="brand">Current Quarter</Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueSegregationSplits}
                    dataKey="amount"
                    nameKey="channel"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {revenueSegregationSplits.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 mt-4">
            <strong className="text-slate-900">Segregation Insight: </strong>
            B2B Bulk Pharmacy sales account for <strong>62%</strong> of turnover, eliminating single-unit retail dependency.
          </div>
        </Card>

        {/* Right: Recharts Bar Chart (6-Month Trajectory) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">6-Month Revenue Trajectory</h2>
                <p className="text-xs text-slate-500">Monthly progression demonstrating +48% bulk expansion</p>
              </div>
              <Badge variant="success">+48% Overall Growth</Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `R${val / 1000}k`}
                  />
                  <RechartsTooltip
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === 'bulkRevenue' ? 'B2B Bulk Supply' : name === 'retailRevenue' ? 'Retail OTC' : 'Leisure Wellness',
                    ]}
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="bulkRevenue" name="B2B Bulk Supply" fill="#047857" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="retailRevenue" name="Retail OTC" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="leisureRevenue" name="Leisure Wellness" fill="#0e7490" radius={[4, 4, 0, 0]} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
            <span>Historical Period: May - October 2026</span>
            <button
              onClick={() => navigate('/invoices')}
              className="text-brand-700 hover:text-brand-900 font-semibold inline-flex items-center gap-1"
            >
              <span>View Settled Invoices</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>

      {/* Interactive SARS Section 11(e) Tax Deduction Simulator */}
      <Card variant="default">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-100 text-brand-800">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Interactive SARS Section 11(e) Tax Optimization Engine
              </h2>
              <p className="text-xs text-slate-500">
                Simulate wear-and-tear depreciation write-offs (20%), qualifying operational overhead (15%), and bulk VAT input claims (5%).
              </p>
            </div>
          </div>
          <Badge variant="brand" size="md">
            SARS Section 11(e) Validated
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {/* Slider 1: Capital Assets */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-700">
              <label htmlFor="capital-assets-range">Qualified Capital Assets</label>
              <span className="text-brand-700">{formatCurrency(capitalAssets)}</span>
            </div>
            <input
              id="capital-assets-range"
              type="range"
              min="100000"
              max="1500000"
              step="25000"
              value={capitalAssets}
              onChange={(e) => setCapitalAssets(Number(e.target.value))}
              className="w-full accent-brand-700 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">Extraction apparatus, climate warehouses, logistics (20% p.a.).</p>
          </div>

          {/* Slider 2: Operational Expenses */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-700">
              <label htmlFor="ops-expenses-range">Qualifying Operational Overhead</label>
              <span className="text-brand-700">{formatCurrency(opsExpenses)}</span>
            </div>
            <input
              id="ops-expenses-range"
              type="range"
              min="50000"
              max="1000000"
              step="20000"
              value={opsExpenses}
              onChange={(e) => setOpsExpenses(Number(e.target.value))}
              className="w-full accent-brand-700 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">Compliance audits, ISO testing, facility rent, utilities (15% p.a.).</p>
          </div>

          {/* Slider 3: Bulk Turnover */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-bold text-slate-700">
              <label htmlFor="bulk-turnover-range">B2B Bulk Revenue Base</label>
              <span className="text-brand-700">{formatCurrency(bulkTurnover)}</span>
            </div>
            <input
              id="bulk-turnover-range"
              type="range"
              min="100000"
              max="2000000"
              step="50000"
              value={bulkTurnover}
              onChange={(e) => setBulkTurnover(Number(e.target.value))}
              className="w-full accent-brand-700 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">Generates 5% VAT input claim credit on wholesale intake.</p>
          </div>
        </div>

        {/* Engine Output Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 bg-slate-50/70 p-4 rounded-xl">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Wear & Tear (20% p.a.)</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {formatCurrency(taxModel.wearAndTearDeduction)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Operational Overhead (15%)</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {formatCurrency(taxModel.operationalDeduction)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">5% VAT Input Claim</div>
            <div className="text-sm font-bold text-brand-700 mt-0.5">
              {formatCurrency(taxModel.vatInputCredit)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Total Deduction Shield</div>
            <div className="text-base font-black text-emerald-700 mt-0.5">
              {formatCurrency(taxModel.totalDeduction)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
