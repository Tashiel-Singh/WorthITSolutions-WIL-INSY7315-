/**
 * Pharmacy Bulk Order Portal (/orders/new) with Tiered Volume Discounts & 15% VAT
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/common/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { formatCurrency } from '../utils/formatters';
import { calculateBulkTierDiscount, calculateVat } from '../utils/taxCalculations';
import { BulkOrderItem } from '../types';
import {
  ShoppingCart,
  Building2,
  CheckCircle2,
  Receipt,
  Plus,
  Minus,
  ArrowRight,
} from 'lucide-react';

export const BulkOrderView: React.FC = () => {
  const navigate = useNavigate();
  const { products, createOrder } = useApp();
  const { showToast } = useToast();

  const [selectedClient, setSelectedClient] = useState<{
    id: string;
    name: string;
    type: 'Pharmacy' | 'Clinic' | 'Hospital' | 'Retail';
    vatNumber: string;
  }>({
    id: 'CLI-002',
    name: 'MedCentre Health Group (Sandton)',
    type: 'Pharmacy',
    vatNumber: 'ZA491029481',
  });

  // Track order quantities: { [productId]: { packSize: 12 | 24 | 48, packCount: number } }
  const [orderPacks, setOrderPacks] = useState<Record<string, { packSize: 12 | 24 | 48; packCount: number }>>({
    'PRD-CBD-001': { packSize: 24, packCount: 2 }, // 48 units
    'PRD-HOM-001': { packSize: 24, packCount: 1 }, // 24 units
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderRef, setPlacedOrderRef] = useState<string | null>(null);

  // Compute live cart items
  const cartItems: BulkOrderItem[] = [];
  let grossSubtotal = 0;
  let totalDiscount = 0;

  Object.entries(orderPacks).forEach(([prodId, { packSize, packCount }]) => {
    if (packCount > 0) {
      const prod = products.find((p) => p.id === prodId);
      if (prod) {
        const tier = prod.bulkTierPrices.find((t) => t.packSize === packSize) || prod.bulkTierPrices[0];
        const calc = calculateBulkTierDiscount(tier.unitPrice, packSize, packCount);

        grossSubtotal += calc.grossAmount;
        totalDiscount += calc.discountAmount;

        cartItems.push({
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          packSize,
          packCount,
          totalUnits: calc.totalUnits,
          unitPrice: tier.unitPrice,
          grossTotal: calc.grossAmount,
          discountAmount: calc.discountAmount,
          netTotal: calc.netAmount,
        });
      }
    }
  });

  const netSubtotal = grossSubtotal - totalDiscount;
  const { vatAmount, totalWithVat } = calculateVat(netSubtotal);

  const handleUpdatePackCount = (productId: string, delta: number) => {
    setOrderPacks((prev) => {
      const current = prev[productId] || { packSize: 24, packCount: 0 };
      const newCount = Math.max(0, current.packCount + delta);
      return {
        ...prev,
        [productId]: { ...current, packCount: newCount },
      };
    });
  };

  const handleUpdatePackSize = (productId: string, packSize: 12 | 24 | 48) => {
    setOrderPacks((prev) => {
      const current = prev[productId] || { packSize: 24, packCount: 1 };
      return {
        ...prev,
        [productId]: { ...current, packSize },
      };
    });
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder = createOrder({
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientType: selectedClient.type,
        items: cartItems,
        grossSubtotal,
        discountAmount: totalDiscount,
        netSubtotal,
        vatAmount,
        totalAmount: totalWithVat,
        paymentTerms: 'Contracted Net 30 Account',
      });

      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
      setPlacedOrderRef(newOrder.orderNumber);
      showToast(
        'Bulk Order Placed Successfully',
        `Generated order ${newOrder.orderNumber} and automated Tax Invoice ${newOrder.invoiceId}`,
        'success'
      );
    }, 500);
  };

  if (placedOrderRef) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <Badge variant="brand" size="md">
            Order Dispatched to Warehouse
          </Badge>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Order #{placedOrderRef} Successfully Created
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Your bulk pharmaceutical order has been ingested into fulfillment with Net 30 credit settlement terms.
          </p>
        </div>

        <Card className="p-5 max-w-md mx-auto text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Purchasing Client:</span>
            <strong className="text-slate-900">{selectedClient.name}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Units Reserved:</span>
            <strong className="text-brand-700">
              {cartItems.reduce((acc, it) => acc + it.totalUnits, 0)} Units
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Charged (Incl. 15% VAT):</span>
            <strong className="text-slate-900 text-sm font-black">{formatCurrency(totalWithVat)}</strong>
          </div>
        </Card>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setPlacedOrderRef(null);
              setOrderPacks({});
            }}
          >
            Create Another Order
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Receipt className="w-4 h-4" />}
            onClick={() => navigate('/invoices')}
          >
            View Tax Invoices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pharmacy B2B Bulk Order Portal
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Select tier-discounted wholesale cases for contracted health clinics and dispensing pharmacies.
          </p>
        </div>

        <Badge variant="teal" size="md">
          Automatic 10% - 25% Volume Tiers
        </Badge>
      </div>

      {/* Client Selector Bar */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slateBlue-50 text-slateBlue-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <label htmlFor="client-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Purchasing Pharmacy / Clinic Facility
              </label>
              <select
                id="client-select"
                value={selectedClient.name}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.includes('MedCentre')) {
                    setSelectedClient({ id: 'CLI-002', name: 'MedCentre Health Group (Sandton)', type: 'Pharmacy', vatNumber: 'ZA491029481' });
                  } else if (val.includes('Mary')) {
                    setSelectedClient({ id: 'CLI-001', name: "St. Mary's Community Health Clinic", type: 'Clinic', vatNumber: 'ZA419082910' });
                  } else {
                    setSelectedClient({ id: 'CLI-003', name: 'Cape Wellness & Integrative Care', type: 'Pharmacy', vatNumber: 'ZA402910482' });
                  }
                }}
                className="mt-0.5 font-bold text-slate-900 text-sm bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
              >
                <option value="MedCentre Health Group (Sandton)">MedCentre Health Group (Sandton) • VAT: ZA491029481</option>
                <option value="St. Mary's Community Health Clinic">St. Mary's Community Health Clinic • VAT: ZA419082910</option>
                <option value="Cape Wellness & Integrative Care">Cape Wellness & Integrative Care • VAT: ZA402910482</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-500 sm:text-right">
            <div>Contracted Terms: <strong className="text-brand-700 font-bold">Net 30 Account</strong></div>
            <div>Approved Credit Limit: <strong>R 150,000.00</strong></div>
          </div>
        </div>
      </Card>

      {/* Main Grid: Catalog vs Sticky Checkout Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Product Wholesale Catalog Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Wholesale Bulk Catalog</h2>
            <span className="text-xs text-slate-500">Tier volume pricing per package</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {products.map((prod) => {
              const currentPack = orderPacks[prod.id] || { packSize: 24, packCount: 0 };
              const currentTier = prod.bulkTierPrices.find((t) => t.packSize === currentPack.packSize) || prod.bulkTierPrices[0];
              const discountRatio = Math.round(((prod.retailPrice - currentTier.unitPrice) / prod.retailPrice) * 100);

              return (
                <Card key={prod.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{prod.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {prod.sku}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{prod.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-slate-400">Retail: <s className="text-slate-400">{formatCurrency(prod.retailPrice)}</s></span>
                      <span className="text-brand-700 font-extrabold text-sm">{formatCurrency(currentTier.unitPrice)}/unit</span>
                      <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {discountRatio}% Volume Savings
                      </span>
                    </div>
                  </div>

                  {/* Tier Pack Selector & Quantity Control */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Pack Size Buttons */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      {prod.bulkTierPrices.map((tier) => (
                        <button
                          key={tier.packSize}
                          type="button"
                          onClick={() => handleUpdatePackSize(prod.id, tier.packSize)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                            currentPack.packSize === tier.packSize
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {tier.packSize}pk
                        </button>
                      ))}
                    </div>

                    {/* Quantity Counter */}
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1 bg-white">
                      <button
                        type="button"
                        onClick={() => handleUpdatePackCount(prod.id, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-900">
                        {currentPack.packCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdatePackCount(prod.id, 1)}
                        className="w-7 h-7 rounded-lg bg-brand-700 hover:bg-brand-800 text-white flex items-center justify-center transition-colors shadow-sm"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right: Sticky Checkout Order Summary Panel */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-brand-700" />
                <span>Bulk Order Summary</span>
              </h2>
              <Badge variant="brand">{cartItems.length} Products</Badge>
            </div>

            {/* Cart Line Items */}
            <div className="py-3 space-y-2.5 max-h-60 overflow-y-auto divide-y divide-slate-100">
              {cartItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Select cases above using + to add wholesale items.
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.productId} className="pt-2 first:pt-0 flex justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.productName}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.packCount} case(s) of {item.packSize} ({item.totalUnits} units)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{formatCurrency(item.netTotal)}</div>
                      <div className="text-[10px] text-emerald-700">-{formatCurrency(item.discountAmount)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Wholesale Gross:</span>
                <span>{formatCurrency(grossSubtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Bulk Tier Discount:</span>
                <span>-{formatCurrency(totalDiscount)}</span>
              </div>
              <div className="flex justify-between text-slate-600 border-t border-slate-100 pt-1.5">
                <span>Net Subtotal (Excl. VAT):</span>
                <strong className="text-slate-900 font-bold">{formatCurrency(netSubtotal)}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>South African VAT (15%):</span>
                <span>{formatCurrency(vatAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t-2 border-slate-200 pt-2">
                <span>Total Credit Due:</span>
                <span className="text-brand-800 text-base">{formatCurrency(totalWithVat)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4"
              disabled={cartItems.length === 0}
              onClick={() => setIsConfirmModalOpen(true)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Confirm Bulk Order & Invoice
            </Button>

            <div className="text-[11px] text-slate-400 text-center mt-2">
              Automated SARS-compliant tax invoice will be generated instantaneously.
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handlePlaceOrder}
        isLoading={isSubmitting}
        title="Authorize B2B Bulk Order"
        description={`Confirm wholesale placement of ${cartItems.reduce((acc, it) => acc + it.totalUnits, 0)} units for ${selectedClient.name}?`}
        confirmText="Authorize & Generate Invoice"
      >
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 mt-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Gross Total:</span>
            <span>{formatCurrency(grossSubtotal)}</span>
          </div>
          <div className="flex justify-between text-emerald-700 font-bold">
            <span>Tier Savings:</span>
            <span>-{formatCurrency(totalDiscount)}</span>
          </div>
          <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
            <span>Payable Amount (15% VAT):</span>
            <span className="text-brand-800">{formatCurrency(totalWithVat)}</span>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
};
