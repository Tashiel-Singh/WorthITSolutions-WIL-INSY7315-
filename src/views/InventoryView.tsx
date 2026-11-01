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
import { StockPool, Product, ProductCategory } from '../types';
import {
  Search,
  ArrowRightLeft,
  Clock,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  PackagePlus,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    products,
    addProduct,
    reorderStock,
    transferStock,
    stockTransfers,
    setActiveStockPool,
    currentUser,
  } = useApp();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [poolFilter, setPoolFilter] = useState<'all' | 'retail' | 'bulk'>('all');

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('CBD Oils & Extracts');
  const [newPotency, setNewPotency] = useState('1000mg Full Spectrum');
  const [newPrice, setNewPrice] = useState(550);
  const [newRetailStock, setNewRetailStock] = useState(25);
  const [newBulkStock, setNewBulkStock] = useState(120);
  const [newReorder, setNewReorder] = useState(20);
  const [newBatch, setNewBatch] = useState('BT-2026-905');
  const [newExpiry, setNewExpiry] = useState('2028-12-31');
  const [newUnit, setNewUnit] = useState('Bottle');
  const [newDesc, setNewDesc] = useState('');

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
  const categories = [
    'All',
    'CBD Oils & Extracts',
    'Tinctures',
    'Capsules & Tablets',
    'Topical Balms',
    'CBD Edibles',
    'Homeopathic Remedies',
    'Homeopathic Creams',
    'Homeopathic Drops',
    'Bulk Raw Compounds',
  ];

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

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku || !newName) return;

    const newProd: Product = {
      id: `prd-custom-${Date.now()}`,
      name: newName,
      sku: newSku.toUpperCase(),
      category: newCategory,
      potency: newPotency,
      description: newDesc || `${newName} (${newPotency}) certified formulation`,
      retailPrice: Number(newPrice),
      bulkTierPrices: [
        { packSize: 12, unitPrice: Math.round(newPrice * 0.9), discountPercentage: 10 },
        { packSize: 24, unitPrice: Math.round(newPrice * 0.85), discountPercentage: 15 },
        { packSize: 48, unitPrice: Math.round(newPrice * 0.75), discountPercentage: 25 },
      ],
      retailStock: Number(newRetailStock),
      bulkStock: Number(newBulkStock),
      reorderLevel: Number(newReorder),
      expiryDate: newExpiry,
      batchNumber: newBatch,
      unit: newUnit,
      packagingUnit: `${newUnit} Container`,
      labCertified: true,
      activeStatus: 'In Stock',
    };

    addProduct(newProd);
    showToast('Product Catalog Updated', `SKU ${newProd.sku} (${newProd.name}) added to active inventory.`, 'success');
    setIsAddModalOpen(false);
    setNewSku('');
    setNewName('');
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

        <div className="flex flex-wrap items-center gap-3">
          {currentUser.role === 'distributor' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Add Product SKU</span>
            </button>
          )}

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
      </div>

      {/* Cannibalization Shield Active Banner */}
      <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-brand-950 uppercase tracking-wider flex items-center gap-2">
              <span>Cannibalization Prevention Logic Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-brand-800 mt-0.5">
              Bulk pharmacy orders draw exclusively from the Bulk Reserve Pool. Retail walk-ins draw from Direct Retail Pool.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="teal" size="sm">
            54 Segregated SKUs
          </Badge>
          <Badge variant="neutral" size="sm">
            Audit Enforced
          </Badge>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search product by name, SKU, or potency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-brand-700"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Inventory Master Table */}
      <Card className="p-0 overflow-hidden">
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

      {/* Add New SKU Modal for Distributor */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl p-6 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New Product SKU</h3>
                  <p className="text-xs text-slate-500">Register botanical formulation into dual-pool repository</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CBD-ISO-3000"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:border-brand-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-700"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Botanical CBD Isolate 3000mg"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-brand-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Potency / Dilution</label>
                  <input
                    type="text"
                    placeholder="e.g. 3000mg Isolate (99.8%)"
                    value={newPotency}
                    onChange={(e) => setNewPotency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-brand-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Direct Retail Price (ZAR)</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-brand-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bulk Reserve</label>
                  <input
                    type="number"
                    min="0"
                    value={newBulkStock}
                    onChange={(e) => setNewBulkStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Retail Pool</label>
                  <input
                    type="number"
                    min="0"
                    value={newRetailStock}
                    onChange={(e) => setNewRetailStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slateBlue-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="1"
                    value={newReorder}
                    onChange={(e) => setNewReorder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newBatch}
                    onChange={(e) => setNewBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    placeholder="e.g. Bottle, Box, Jar"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Notes / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Organic certified formulation"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Ingest SKU into Catalog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
