import React, { useState } from 'react';
import {
  Building2,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  PlusCircle,
  Percent,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/common/ToastContext';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const PharmacistPortalView: React.FC = () => {
  const { referrals, createReferral, products, currentUser } = useApp();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('Willem de Klerk');
  const [patientContact, setPatientContact] = useState('+27 83 491 8201');
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.name || 'Full Spectrum CBD Oil 1000mg');
  const [orderAmount, setOrderAmount] = useState(1200);

  // Commission Metrics
  const commissionRate = currentUser.commissionRate || 0.085; // 8.5% standard pharmacist referral rate
  const totalCommissionEarned = referrals.reduce((sum, r) => sum + r.commissionEarned, 0);
  const settledCommission = referrals
    .filter((r) => r.status === 'Settled')
    .reduce((sum, r) => sum + r.commissionEarned, 0);
  const pendingCommission = referrals
    .filter((r) => r.status !== 'Settled')
    .reduce((sum, r) => sum + r.commissionEarned, 0);

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newRef = createReferral({
      pharmacistId: currentUser.id,
      pharmacistName: currentUser.name,
      pharmacistHpcsa: currentUser.hpcsaNumber || 'PH0284711',
      patientName,
      patientContact,
      prescribedTherapy: selectedProduct,
      orderAmount: Number(orderAmount),
      commissionRate,
      status: 'Approved',
    });

    setIsModalOpen(false);
    setPatientName('');
    setPatientContact('');

    addToast({
      type: 'success',
      title: 'Patient Referral Logged',
      message: `Referral ${newRef.referralCode} logged. R${newRef.commissionEarned.toFixed(2)} commission accrued at 8.5% rate.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Pharmacist Dispensary & Commission Portal</h1>
                <Badge variant="success" size="sm">8.5% Referral Program</Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Dispensary: <span className="text-slate-200 font-medium">{currentUser.organization || 'MedFlow Partner Dispensary'}</span> &bull; Pharmacist: {currentUser.name} (HPCSA: {currentUser.hpcsaNumber || 'PH0284711'})
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Log Patient Referral
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Commission Accrued</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                R{totalCommissionEarned.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Percent className="w-3 h-3 text-emerald-400" /> Active 8.5% wholesale rate
              </p>
            </div>
            <div className="p-3 bg-slate-800 text-emerald-400 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Referred Patients</p>
              <p className="text-2xl font-bold text-white mt-1">{referrals.length}</p>
              <p className="text-xs text-slate-400 mt-1">Direct natural therapy intakes</p>
            </div>
            <div className="p-3 bg-slate-800 text-sky-400 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Settled Payouts</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                R{settledCommission.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-cyan-400" /> Remitted to dispensary account
              </p>
            </div>
            <div className="p-3 bg-slate-800 text-cyan-400 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Pending Settlement</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">
                R{pendingCommission.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> End-of-month reconciliation
              </p>
            </div>
            <div className="p-3 bg-slate-800 text-amber-400 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Referral Ledger Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Patient Referrals & Commission Ledger</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every dispensed OTC and schedule referral earns an automated 8.5% recurring commission
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {referrals.length} referrals on record
            </span>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Referral Code</th>
                  <th className="py-3 px-4 font-semibold">Patient Name</th>
                  <th className="py-3 px-4 font-semibold">Patient Contact</th>
                  <th className="py-3 px-4 font-semibold">Prescribed Botanical Therapy</th>
                  <th className="py-3 px-4 font-semibold text-right">Order Value</th>
                  <th className="py-3 px-4 font-semibold text-right">Commission (8.5%)</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-emerald-400">
                      {ref.referralCode}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {ref.patientName}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {ref.patientContact}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-200">
                      {ref.prescribedTherapy}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      R{ref.orderAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      R{ref.commissionEarned.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant={
                          ref.status === 'Settled'
                            ? 'success'
                            : ref.status === 'Approved'
                            ? 'info'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {ref.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs font-mono text-slate-400">
                      {ref.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Submit Referral Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Log Patient Referral</h3>
                  <p className="text-xs text-slate-400">Accrue 8.5% Commission on MedFlow Botanical Order</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. David Nkosi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Patient Contact (Mobile or Email)
                </label>
                <input
                  type="text"
                  required
                  value={patientContact}
                  onChange={(e) => setPatientContact(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="+27 82 345 6789 or email@domain.co.za"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Prescribed Botanical Therapy
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {products.slice(0, 20).map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} &mdash; R{p.retailPrice}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Estimated Order Value (ZAR)
                </label>
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Commission Preview Card */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Calculated Commission (8.5%):</span>
                  <div className="text-xl font-bold text-emerald-400">
                    R{(orderAmount * commissionRate).toFixed(2)}
                  </div>
                </div>
                <Badge variant="success" size="sm">Standard Dispensary Split</Badge>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Confirm Referral & Record Commission
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
