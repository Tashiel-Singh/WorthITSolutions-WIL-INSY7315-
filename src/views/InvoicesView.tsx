/**
 * Orders & Invoicing Management View (/invoices) with SARS 15% VAT Breakdown
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/common/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Invoice } from '../types';
import {
  Receipt,
  Search,
  Eye,
  Printer,
  ShieldCheck,
  X,
} from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const { orders, invoices, updateOrderStatus } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'invoices'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === 'all' || inv.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenInvoiceModal = (invId?: string, orderNumber?: string) => {
    let inv: Invoice | undefined;
    if (invId) {
      inv = invoices.find((i) => i.id === invId || i.invoiceNumber === invId);
    } else if (orderNumber) {
      inv = invoices.find((i) => i.orderNumber === orderNumber);
    }

    if (inv) {
      setSelectedInvoice(inv);
    } else {
      setSelectedInvoice(invoices[0]);
    }
  };

  const handlePrintPdf = () => {
    showToast('Exporting Document', 'Preparing high-resolution SARS tax invoice print-to-PDF...', 'info');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Orders & Automated Tax Invoicing
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time fulfillment tracking, SARS 15% VAT accounting, and 30-day EFT credit reconciliation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl border border-slate-300/80">
          <button
            onClick={() => {
              setActiveTab('orders');
              setSelectedStatus('all');
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'orders'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Fulfillment Orders ({orders.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('invoices');
              setSelectedStatus('all');
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'invoices'
                ? 'bg-slateBlue-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Tax Invoices ({invoices.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order #, invoice #, or pharmacy client..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-brand-700 transition-colors"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-brand-700"
            >
              <option value="all">All Statuses</option>
              {activeTab === 'orders' ? (
                <>
                  <option value="Pending">Pending Fulfillment</option>
                  <option value="Processing">Processing in Warehouse</option>
                  <option value="Shipped">Shipped in Transit</option>
                  <option value="Delivered">Delivered</option>
                </>
              ) : (
                <>
                  <option value="Paid">Paid & Cleared</option>
                  <option value="Sent">Sent (Awaiting Net 30)</option>
                  <option value="Overdue">Overdue Reminder Sent</option>
                </>
              )}
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Tab View */}
      {activeTab === 'orders' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Client Facility</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Line Items</th>
                  <th className="py-3 px-4 text-right">Total (Incl. 15% VAT)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No orders matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{ord.clientName}</div>
                        <div className="text-[11px] text-slate-500">{ord.clientType} • {ord.paymentTerms}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{formatDate(ord.orderDate)}</td>
                      <td className="py-3 px-4 text-slate-700">
                        {ord.items.length} Product Cases ({ord.items.reduce((s, it) => s + it.totalUnits, 0)} units)
                      </td>
                      <td className="py-3 px-4 text-right font-black text-brand-800 text-sm">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            ord.status === 'Delivered'
                              ? 'success'
                              : ord.status === 'Shipped'
                              ? 'info'
                              : ord.status === 'Processing'
                              ? 'teal'
                              : 'warning'
                          }
                          dot
                          size="sm"
                        >
                          {ord.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {ord.status !== 'Delivered' && (
                            <button
                              onClick={() => {
                                updateOrderStatus(ord.id, ord.status === 'Processing' ? 'Shipped' : 'Delivered');
                                showToast('Status Updated', `Order ${ord.orderNumber} marked as ${ord.status === 'Processing' ? 'Shipped' : 'Delivered'}.`, 'success');
                              }}
                              className="px-2.5 py-1 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white rounded-lg transition-colors shadow-sm"
                            >
                              {ord.status === 'Processing' ? 'Dispatch' : 'Mark Delivered'}
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenInvoiceModal(undefined, ord.orderNumber)}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                          >
                            <Receipt className="w-3.5 h-3.5 inline mr-1 text-brand-700" />
                            Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Invoices Tab View */}
      {activeTab === 'invoices' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Client Facility</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Net Subtotal</th>
                  <th className="py-3 px-4 text-right">15% VAT</th>
                  <th className="py-3 px-4 text-right">Total Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{inv.orderNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{inv.clientName}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{formatDate(inv.dueDate)}</div>
                      {inv.status === 'Overdue' && (
                        <span className="text-[10px] text-rose-600 font-bold">{inv.daysOverdue}d overdue</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 font-medium">
                      {formatCurrency(inv.netSubtotal)}
                    </td>
                    <td className="py-3 px-4 text-right text-brand-700 font-medium">
                      {formatCurrency(inv.vatAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900 text-sm">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          inv.status === 'Paid'
                            ? 'success'
                            : inv.status === 'Overdue'
                            ? 'danger'
                            : 'info'
                        }
                        dot
                        size="sm"
                      >
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1" />
                        View PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Interactive SARS Tax Invoice Modal */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="invoice-modal-title"
        >
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-elevated border border-slate-200 my-8 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Controls Bar (Hidden in print) */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50 no-print">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-brand-700" />
                <span id="invoice-modal-title" className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  SARS Compliant Tax Invoice Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={handlePrintPdf}
                >
                  Print / Save PDF
                </Button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
                  aria-label="Close invoice preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Tax Invoice Content */}
            <div className="p-8 sm:p-10 space-y-6 text-slate-800 text-xs">
              {/* Header: Distributor vs Client */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-800 text-white flex items-center justify-center font-bold text-sm">
                      MD
                    </div>
                    <span className="text-lg font-black text-slate-900">MedFlow Distribution (Pty) Ltd</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 space-y-0.5 leading-relaxed">
                    <div>122 Main Road, Stone Industrial Park, Cape Town, 8001</div>
                    <div>VAT Registration No: <strong>ZA4890219482</strong></div>
                    <div>Email: accounts@medflowdistribution.co.za • Tel: +27 (0)21 555 0192</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black px-2.5 py-1 rounded bg-slate-900 text-white uppercase tracking-wider">
                    TAX INVOICE
                  </span>
                  <div className="text-lg font-black text-slate-900 font-mono mt-2">
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Order Ref: <strong>{selectedInvoice.orderNumber}</strong>
                  </div>
                </div>
              </div>

              {/* Billed To Details & Dates */}
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Billed To Client (Purchaser)
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.clientName}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{selectedInvoice.clientAddress}</div>
                  <div className="text-[11px] text-slate-700 mt-1 font-semibold">
                    Client VAT Number: {selectedInvoice.clientVatNumber}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-right">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice Issue Date:</span>
                    <strong>{formatDate(selectedInvoice.issueDate)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Due Date:</span>
                    <strong className="text-brand-800">{formatDate(selectedInvoice.dueDate)} (30 Days)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Channel:</span>
                    <span>Electronic Funds Transfer (EFT)</span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase border-y border-slate-200">
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 text-center">Quantity</th>
                      <th className="py-2.5 px-3 text-right">Unit Price (Excl)</th>
                      <th className="py-2.5 px-3 text-right">Total (Excl)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{it.description}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">{formatCurrency(it.unitPrice)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatCurrency(it.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Banking Settlement & Tax Breakdown */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-slate-200">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Banking & Settlement Instructions</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed pt-1">
                    <div>Bank: <strong>Standard Bank South Africa</strong></div>
                    <div>Account Name: MedFlow Business Operations</div>
                    <div>Account No: <strong>0284910482</strong> • Branch Code: 051001</div>
                    <div className="text-brand-800 font-bold mt-1">Payment Reference: {selectedInvoice.invoiceNumber}</div>
                  </div>
                </div>

                <div className="space-y-2 text-right">
                  <div className="flex justify-between text-slate-600">
                    <span>Gross Subtotal:</span>
                    <span>{formatCurrency(selectedInvoice.grossSubtotal)}</span>
                  </div>
                  {selectedInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Volume Tier Discount:</span>
                      <span>-{formatCurrency(selectedInvoice.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-700 border-t border-slate-200 pt-1">
                    <span>Net Subtotal (Excl. VAT):</span>
                    <strong>{formatCurrency(selectedInvoice.netSubtotal)}</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-brand-50 text-brand-900 border border-brand-200 font-semibold">
                    <span>South African VAT Split (15%):</span>
                    <span>{formatCurrency(selectedInvoice.vatAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-300 pt-2">
                    <span>Total Amount Due:</span>
                    <span className="text-brand-800">{formatCurrency(selectedInvoice.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
