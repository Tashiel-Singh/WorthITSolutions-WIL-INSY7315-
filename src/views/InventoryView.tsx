/**
 * Inventory Management View with Dual-Pool Stock Segregation & Expiry Tracking (/inventory)
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/common/ToastContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { getExpiryCountdown } from '../utils/formatters';
import { StockPool, Product } from '../types';
import {
  Boxes,
  Search,
  ArrowRightLeft,
  Clock,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    products,
    reorderStock,
    transferStock,
    stockTransfers,
    setActiveStockPool,
  } = useApp();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [poolFilter, setPoolFilter] = useState<'all' | 'retail' | 'bulk'>('all');

  // Transfer Modal State
  const [transferTargetProduct, setTransferTargetProduct] = useState<Product | null>(null);
  const [transferQuantity, setTransferQuantity] = useState<number>(24);
  const [transferReason, setTransferReason] = useState('Front desk retail shelf restock');
  const [transferNotes, setTransferNotes] = useState('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Reorder Modal State
  const [reorderProductTarget, setReorderProductTarget] = useState<Product | null>(null);
  const [reorderQuantity, setReorderQuantity] = useState<number>(50);
  const [reorderPool, setReorderPool] = useState<StockPool>('bulk');
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  // Categories list
  const categories = ['All', 'CBD Oils & Extracts', 'Tinctures', 'Capsules & Tablets', 'Topical Balms', 'Bulk Raw Compounds'];

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    let matchPool = true;
    if (poolFilter === 'retail') matchPool = p.retailStock > 0;
    if (poolFilter === 'bulk') matchPool = p.bulkStock > 0;

    return matchSearch && matchCat && matchPool;
  });

  const handleOpenTransfer = (prod: Product) => {
    setTransferTargetProduct(prod);
    setTransferQuantity(Math.min(24, Math.max(1, prod.bulkStock)));
    setIsTransferModalOpen(true);
  };

  const handleExecuteTransfer = () => {
    if (!transferTargetProduct) return;
    const res = transferStock(
      transferTargetProduct.id,
      transferQuantity,
      transferReason,
      transferNotes
    );
    if (res.success) {
      showToast('Stock Reallocation Logged', res.message, 'success');
      setIsTransferModalOpen(false);
    } else {
      showToast('Transfer Failed', res.message, 'error');
    }
  };

  const handleOpenReorder = (prod: Product) => {
    setReorderProductTarget(prod);
    setReorderQuantity(50);
    setReorderPool('bulk');
    setIsReorderModalOpen(true);
  };

  const handleExecuteReorder = () => {
    if (!reorderProductTarget) return;
    reorderStock(reorderProductTarget.id, reorderPool, reorderQuantity);
    showToast(
      'Stock Restocked',
      `Procured ${reorderQuantity} units for ${reorderProductTarget.name} (${reorderPool.toUpperCase()} Pool).`,
      'success'
    );
    setIsReorderModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Inventory & Stock Segregation Architecture
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Strict dual-pool segregation isolating retail stock from protected B2B pharmacy bulk reserves.
          </p>
        </div>

        {/* Segmented Stock Pool Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-2xl border border-slate-300/80">
          <button
            onClick={() => {
              setActiveStockPool('bulk');
              setPoolFilter('bulk');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              poolFilter === 'bulk'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            🔒 Bulk Reserve Pool
          </button>
          <button
            onClick={() => {
              setActiveStockPool('retail');
              setPoolFilter('retail');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              poolFilter === 'retail'
                ? 'bg-slateBlue-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Direct Retail Pool
          </button>
          <button
            onClick={() => setPoolFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              poolFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            All Pools
          </button>
        </div>
      </div>

      {/* Cannibalization Shield Active Banner */}
      <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-brand-950">
              Dual-Channel Cannibalization Shield Active
            </div>
            <div className="text-xs text-brand-800">
              Point-of-Sale retail sales are isolated from bulk clinic inventories. Stock transfers require explicit batch authorization.
            </div>
          </div>
        </div>
        <Badge variant="brand" size="md">
          Protection: 100% Enforced
        </Badge>
      </div>

      {/* Search & Category Filter Controls */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product by name, SKU (e.g., CBD-FS-1000) or potency..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-brand-700 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-brand-700 transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Real-Time Product Stock Segregation Table */}
      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-brand-700" />
            <h2 className="text-sm font-bold text-slate-900">Current Product Inventories</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Product & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Retail Pool</th>
                <th className="py-3 px-4 text-right">Bulk Reserve Pool</th>
                <th className="py-3 px-4">Expiry Countdown</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const expiry = getExpiryCountdown(p.expiryDate);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                          <span>{p.sku}</span>
                          <span>•</span>
                          <span>{p.potency}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-slate-600 font-medium">{p.category}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-slateBlue-700 text-sm">{p.retailStock}</span>
                        <span className="text-[11px] text-slate-400 ml-1">{p.unit}s</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-brand-700 text-sm">{p.bulkStock}</span>
                        <span className="text-[11px] text-slate-400 ml-1">{p.unit}s</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            expiry.level === 'critical-7'
                              ? 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
                              : expiry.level === 'warning-14'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : expiry.level === 'warning-30'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{expiry.label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            p.activeStatus === 'In Stock'
                              ? 'success'
                              : p.activeStatus === 'Low Stock'
                              ? 'warning'
                              : 'danger'
                          }
                          dot
                          size="sm"
                        >
                          {p.activeStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenTransfer(p)}
                            title="Transfer Bulk units to Retail Pool"
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-brand-50 hover:text-brand-900 text-slate-700 rounded-lg transition-colors border border-slate-200"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 inline mr-1" />
                            Transfer
                          </button>
                          <button
                            onClick={() => handleOpenReorder(p)}
                            title="Procure & Restock"
                            className="px-2.5 py-1 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white rounded-lg transition-colors shadow-sm"
                          >
                            <PlusCircle className="w-3.5 h-3.5 inline mr-1" />
                            Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stock Transfer Audit Trail Log */}
      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-slateBlue-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Bulk-to-Retail Transfer Audit Log
            </h2>
          </div>
          <Badge variant="teal" size="sm">
            {stockTransfers.length} Verified Transfers
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Ref #</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Product Description</th>
                <th className="py-2.5 px-4 text-right">Units Transferred</th>
                <th className="py-2.5 px-4">Pool Path</th>
                <th className="py-2.5 px-4">Authorized By</th>
                <th className="py-2.5 px-4">Reason / Notes</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockTransfers.map((trf) => (
                <tr key={trf.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{trf.transferRef}</td>
                  <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">{trf.timestamp}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{trf.productName}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-brand-700">
                    {trf.quantity} units
                  </td>
                  <td className="py-2.5 px-4 text-xs text-slate-600">
                    Bulk Reserve → <strong className="text-slateBlue-700">Retail</strong>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 font-medium">{trf.authorizedBy}</td>
                  <td className="py-2.5 px-4 text-slate-500 text-xs">{trf.reason}</td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Audited</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transfer Stock Modal */}
      {transferTargetProduct && (
        <ConfirmationModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          onConfirm={handleExecuteTransfer}
          title="Stock Segregation Transfer: Bulk → Retail"
          description={`Reallocate reserved bulk inventory into the retail point-of-sale pool for ${transferTargetProduct.name}.`}
          confirmText="Authorize & Transfer Units"
        >
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between text-xs">
              <div>
                <span className="text-slate-500">Available Bulk Reserve: </span>
                <strong className="text-brand-700">{transferTargetProduct.bulkStock} units</strong>
              </div>
              <div>
                <span className="text-slate-500">Current Retail Stock: </span>
                <strong className="text-slateBlue-700">{transferTargetProduct.retailStock} units</strong>
              </div>
            </div>

            <div>
              <label htmlFor="modal-transfer-qty-input" className="block text-xs font-bold text-slate-700 mb-1">
                Units to Transfer
              </label>
              <input
                id="modal-transfer-qty-input"
                type="number"
                min="1"
                max={transferTargetProduct.bulkStock}
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-brand-900 focus:bg-white focus:border-brand-700"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Maximum permissible units: {transferTargetProduct.bulkStock} units.
              </p>
            </div>

            <div>
              <label htmlFor="modal-transfer-reason-select" className="block text-xs font-bold text-slate-700 mb-1">
                Operational Reason
              </label>
              <select
                id="modal-transfer-reason-select"
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="Front desk retail shelf restock">Front desk retail shelf restock</option>
                <option value="Urgent walk-in OTC patient demand">Urgent walk-in OTC patient demand</option>
                <option value="Display / Showroom sample setup">Display / Showroom sample setup</option>
                <option value="Routine end-of-week inventory rebalancing">Routine end-of-week inventory rebalancing</option>
              </select>
            </div>

            <div>
              <label htmlFor="modal-transfer-notes-input" className="block text-xs font-bold text-slate-700 mb-1">
                Operator Notes (Optional)
              </label>
              <input
                id="modal-transfer-notes-input"
                type="text"
                placeholder="e.g., Authorized by Thomas for weekend peak"
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </ConfirmationModal>
      )}

      {/* Restock Reorder Modal */}
      {reorderProductTarget && (
        <ConfirmationModal
          isOpen={isReorderModalOpen}
          onClose={() => setIsReorderModalOpen(false)}
          onConfirm={handleExecuteReorder}
          title={`Procurement Restock: ${reorderProductTarget.name}`}
          description="Place inbound distributor replenishment order from verified manufacturing compounding lab."
          confirmText="Confirm Restock Inbound"
        >
          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="modal-reorder-pool-select" className="block text-xs font-bold text-slate-700 mb-1">
                Target Inventory Pool
              </label>
              <select
                id="modal-reorder-pool-select"
                value={reorderPool}
                onChange={(e) => setReorderPool(e.target.value as StockPool)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="bulk">Bulk Reserve Pool (Protected Clinic Inventory)</option>
                <option value="retail">Retail Point-of-Sale Pool</option>
              </select>
            </div>

            <div>
              <label htmlFor="modal-reorder-qty-input" className="block text-xs font-bold text-slate-700 mb-1">
                Quantity to Ingest (Units)
              </label>
              <input
                id="modal-reorder-qty-input"
                type="number"
                min="1"
                value={reorderQuantity}
                onChange={(e) => setReorderQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-700"
              />
            </div>
          </div>
        </ConfirmationModal>
      )}
    </div>
  );
};
