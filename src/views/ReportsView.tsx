import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Filter,
  DollarSign,
  Boxes,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

/**
 * Encodes an array of rows into RFC 4180 compliant CSV string.
 */
function toRfc4180Csv(headers: string[], rows: (string | number)[][]): string {
  const escapeCell = (cell: string | number): string => {
    const str = String(cell ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = rows.map((r) => r.map(escapeCell).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

/**
 * Triggers a browser download of a CSV file.
 */
function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const ReportsView: React.FC = () => {
  const { orders, stockTransfers, prescriptions, products } = useApp();

  const [activeLedger, setActiveLedger] = useState<'financial' | 'inventory' | 'prescriptions'>('financial');
  const [dateRange, setDateRange] = useState<'all' | '7d' | '30d' | 'quarter'>('all');

  // KPI calculations
  const totalB2BRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalTransferredUnits = stockTransfers.reduce((sum, t) => sum + t.quantity, 0);
  const totalPrescriptionsIssued = prescriptions.length;
  const totalVatCollected = orders.reduce((sum, o) => sum + o.vatAmount, 0);

  // Financial CSV export handler
  const handleExportFinancialCsv = () => {
    const headers = [
      'Order Number',
      'Client Name',
      'Client Type',
      'Order Date',
      'Gross Subtotal (ZAR)',
      'Discount (ZAR)',
      'Net Subtotal (ZAR)',
      'VAT 15% (ZAR)',
      'Total Amount (ZAR)',
      'Order Status',
      'Invoice Reference',
    ];

    const rows = orders.map((o) => [
      o.orderNumber,
      o.clientName,
      o.clientType,
      o.orderDate,
      o.grossSubtotal.toFixed(2),
      o.discountAmount.toFixed(2),
      o.netSubtotal.toFixed(2),
      o.vatAmount.toFixed(2),
      o.totalAmount.toFixed(2),
      o.status,
      o.invoiceId || '',
    ]);

    const csvContent = toRfc4180Csv(headers, rows);
    downloadCsv(`MedFlow_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  // Inventory CSV export handler
  const handleExportInventoryCsv = () => {
    const headers = [
      'SKU',
      'Product Name',
      'Category',
      'Active Bulk Stock',
      'Active Retail Stock',
      'Total Combined Stock',
      'Reorder Threshold',
      'Unit Price (ZAR)',
      'Batch Number',
      'Expiry Date',
      'Stock Status',
    ];

    const rows = products.map((p) => [
      p.sku,
      p.name,
      p.category,
      p.bulkStock,
      p.retailStock,
      p.bulkStock + p.retailStock,
      p.reorderLevel,
      p.retailPrice.toFixed(2),
      p.batchNumber,
      p.expiryDate,
      p.activeStatus,
    ]);

    const csvContent = toRfc4180Csv(headers, rows);
    downloadCsv(`MedFlow_Inventory_Audit_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  // Clinical Prescriptions CSV export handler
  const handleExportClinicalCsv = () => {
    const headers = [
      'Prescription #',
      'Patient Name',
      'Condition Tag',
      'Prescribed Therapy',
      'Dosage',
      'Prescribing Doctor',
      'HPCSA Registration',
      'Refills Remaining',
      'Issue Date',
      'Refill Due Date',
      'Regimen Status',
      'Clinical Outcome Notes',
    ];

    const rows = prescriptions.map((r) => [
      r.prescriptionNumber,
      r.patientName,
      r.conditionTag || 'Unspecified',
      r.productName,
      r.dosage,
      r.prescribingDoctor,
      r.prescriberHpcsa || '',
      r.refillsRemaining,
      r.issuedDate,
      r.refillDueDate,
      r.status,
      r.clinicalOutcomeNotes || '',
    ]);

    const csvContent = toRfc4180Csv(headers, rows);
    downloadCsv(`MedFlow_Prescription_Ledger_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  const handleActiveExport = () => {
    if (activeLedger === 'financial') handleExportFinancialCsv();
    else if (activeLedger === 'inventory') handleExportInventoryCsv();
    else handleExportClinicalCsv();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Executive Compliance & Audit Reports</h1>
                <Badge variant="success" size="sm">RFC 4180 Compliant</Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Centralized financial ledger, dual-pool inventory audits, and patient dispensing records for Thomas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print / PDF
            </Button>
            <Button
              variant="primary"
              onClick={handleActiveExport}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV ({activeLedger.toUpperCase()})
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Audited B2B Revenue</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                R{totalB2BRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-1">Gross order pipeline</p>
            </div>
            <div className="p-3 bg-slate-800 text-emerald-400 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Output VAT (15%)</p>
              <p className="text-2xl font-bold text-white mt-1">
                R{totalVatCollected.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-1">SARS South Africa statutory</p>
            </div>
            <div className="p-3 bg-slate-800 text-sky-400 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Stock Transferred</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">
                {totalTransferredUnits.toLocaleString()} units
              </p>
              <p className="text-xs text-slate-400 mt-1">Bulk to retail reallocations</p>
            </div>
            <div className="p-3 bg-slate-800 text-amber-400 rounded-lg">
              <Boxes className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Prescriptions Logged</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{totalPrescriptionsIssued}</p>
              <p className="text-xs text-slate-400 mt-1">Condition-tagged protocols</p>
            </div>
            <div className="p-3 bg-slate-800 text-purple-400 rounded-lg">
              <Stethoscope className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveLedger('financial')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLedger === 'financial'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Financial & B2B Orders Ledger
          </button>
          <button
            onClick={() => setActiveLedger('inventory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLedger === 'inventory'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Dual-Pool Stock Audits ({products.length} SKUs)
          </button>
          <button
            onClick={() => setActiveLedger('prescriptions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLedger === 'prescriptions'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Clinical Prescriptions ({prescriptions.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Date Filter:
          </span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Dates</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="quarter">This Quarter (Q4 2026)</option>
          </select>
        </div>
      </div>

      {/* Ledger Table 1: Financial & Orders */}
      {activeLedger === 'financial' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">B2B Bulk Orders & Tax Invoices</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete line-item financials with 15% RSA VAT breakdowns
                </p>
              </div>
              <span className="text-xs text-slate-400">{orders.length} orders recorded</span>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-800/60 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Order #</th>
                    <th className="py-3 px-4 font-semibold">Client Name</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold text-right">Gross Subtotal</th>
                    <th className="py-3 px-4 font-semibold text-right">Discount</th>
                    <th className="py-3 px-4 font-semibold text-right">15% VAT</th>
                    <th className="py-3 px-4 font-semibold text-right">Total Net</th>
                    <th className="py-3 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-emerald-400">
                        {o.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{o.clientName}</div>
                        <div className="text-xs text-slate-400">{o.clientType}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                        {o.orderDate}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        R{o.grossSubtotal.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                        -R{o.discountAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-sky-400">
                        R{o.vatAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                        R{o.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge
                          variant={
                            o.status === 'Delivered'
                              ? 'success'
                              : o.status === 'Processing'
                              ? 'info'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {o.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Ledger Table 2: Stock Inventory & Transfers */}
      {activeLedger === 'inventory' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Dual-Pool Stock Inventory (54 SKUs)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time segregated bulk reserve vs. OTC retail balances
                </p>
              </div>
              <span className="text-xs text-slate-400">{products.length} products listed</span>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-800/60 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">SKU</th>
                    <th className="py-3 px-4 font-semibold">Product Name</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold text-center">Bulk Reserve</th>
                    <th className="py-3 px-4 font-semibold text-center">Retail Pool</th>
                    <th className="py-3 px-4 font-semibold text-center">Total Units</th>
                    <th className="py-3 px-4 font-semibold text-right">Wholesale Price</th>
                    <th className="py-3 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-emerald-400 text-xs">
                        {p.sku}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-xs text-slate-400">Batch: {p.batchNumber} &bull; Exp: {p.expiryDate}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-300">
                        {p.category}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-cyan-400">
                        {p.bulkStock}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                        {p.retailStock}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-white font-semibold">
                        {p.bulkStock + p.retailStock}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-200">
                        R{p.retailPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          variant={
                            p.activeStatus === 'In Stock'
                              ? 'success'
                              : p.activeStatus === 'Low Stock'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {p.activeStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Ledger Table 3: Prescriptions */}
      {activeLedger === 'prescriptions' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Prescriptions & Clinical Outcome Ledger</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Doctor & psychiatrist condition-tagged botanical scripts
                </p>
              </div>
              <span className="text-xs text-slate-400">{prescriptions.length} prescriptions</span>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-800/60 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Script #</th>
                    <th className="py-3 px-4 font-semibold">Patient</th>
                    <th className="py-3 px-4 font-semibold">Condition Tag</th>
                    <th className="py-3 px-4 font-semibold">Therapy</th>
                    <th className="py-3 px-4 font-semibold">Prescriber</th>
                    <th className="py-3 px-4 font-semibold text-center">Refills</th>
                    <th className="py-3 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {prescriptions.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-purple-400 text-xs">
                        {r.prescriptionNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {r.patientName}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                          {r.conditionTag || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-200">
                        {r.productName} ({r.dosage})
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {r.prescribingDoctor}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-300">
                        {r.refillsRemaining}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge
                          variant={r.status === 'Active' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
