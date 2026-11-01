import React, { useState } from 'react';
import {
  Stethoscope,
  FilePlus2,
  Activity,
  HeartPulse,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/common/ToastContext';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ConditionTag, Prescription } from '../types';

const CONDITION_TAGS: ConditionTag[] = [
  'Anxiety & Panic',
  'Chronic Neuropathic Pain',
  'Sleep Disorders & Insomnia',
  'Arthritic Inflammation',
  'Post-Traumatic Stress (PTSD)',
  'Digestive Dysbiosis',
  'Stress & Autonomic Fatigue',
];

export const PrescriberPortalView: React.FC = () => {
  const { prescriptions, createPrescription, products, currentUser } = useApp();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConditionFilter, setSelectedConditionFilter] = useState<string>('All');

  // New Rx form state
  const [patientName, setPatientName] = useState('Sarah Meyer');
  const [conditionTag, setConditionTag] = useState<ConditionTag>('Chronic Neuropathic Pain');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [dosage, setDosage] = useState('15 drops sublingually twice daily');
  const [instructions, setInstructions] = useState('Take 30 minutes after meals with a glass of water.');
  const [quantity, setQuantity] = useState(2);
  const [refills, setRefills] = useState(3);
  const [clinicalNotes, setClinicalNotes] = useState('Patient reporting 40% reduction in neuropathic flare-ups.');

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === selectedProductId) || products[0];

    const today = new Date().toISOString().split('T')[0];
    const refillDueDate = new Date();
    refillDueDate.setDate(refillDueDate.getDate() + 30);

    const newRx: Omit<Prescription, 'id'> = {
      prescriptionNumber: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: `pat-${Date.now()}`,
      patientName,
      prescribingDoctor: currentUser.name,
      prescriberHpcsa: currentUser.hpcsaNumber || 'MP0492819',
      clinicName: currentUser.organization || 'Cape Integrative Medical Practice',
      productName: product?.name || 'Full Spectrum CBD Oil 1000mg',
      productId: product?.id,
      conditionTag,
      dosage,
      instructions,
      prescribedQuantity: Number(quantity),
      refillsRemaining: Number(refills),
      issuedDate: today,
      refillDueDate: refillDueDate.toISOString().split('T')[0],
      status: 'Active',
      clinicalOutcomeNotes: clinicalNotes,
    };

    createPrescription(newRx);
    setIsModalOpen(false);
    addToast({
      type: 'success',
      title: 'Digital Prescription Issued',
      message: `Prescription ${newRx.prescriptionNumber} for ${patientName} successfully issued with condition tag [${conditionTag}].`,
    });
  };

  const filteredPrescriptions = selectedConditionFilter === 'All'
    ? prescriptions
    : prescriptions.filter((rx) => rx.conditionTag === selectedConditionFilter);

  const getConditionColor = (tag?: ConditionTag) => {
    switch (tag) {
      case 'Anxiety & Panic':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'Chronic Neuropathic Pain':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'Sleep Disorders & Insomnia':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'Arthritic Inflammation':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Post-Traumatic Stress (PTSD)':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'Digestive Dysbiosis':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Clinical Prescriber Portal</h1>
                <Badge variant="success" size="sm">HPCSA Certified</Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Practitioner: <span className="text-slate-200 font-medium">{currentUser.name}</span> &bull; {currentUser.title} &bull; Reg: {currentUser.hpcsaNumber || 'MP0492819'}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<FilePlus2 className="w-4 h-4" />}
          >
            Issue New Prescription
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Prescriptions</p>
              <p className="text-2xl font-bold text-white mt-1">{prescriptions.length}</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% digitally verified
              </p>
            </div>
            <div className="p-3 bg-slate-800 text-emerald-400 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Chronic Pain Cases</p>
              <p className="text-2xl font-bold text-rose-400 mt-1">
                {prescriptions.filter((r) => r.conditionTag === 'Chronic Neuropathic Pain').length}
              </p>
              <p className="text-xs text-slate-400 mt-1">High-potency CBD protocols</p>
            </div>
            <div className="p-3 bg-slate-800 text-rose-400 rounded-lg">
              <HeartPulse className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Anxiety & Sleep Cases</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">
                {prescriptions.filter((r) => r.conditionTag === 'Anxiety & Panic' || r.conditionTag === 'Sleep Disorders & Insomnia').length}
              </p>
              <p className="text-xs text-slate-400 mt-1">Full spectrum phytocannabinoids</p>
            </div>
            <div className="p-3 bg-slate-800 text-purple-400 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Refill Pipeline</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">
                {prescriptions.filter((r) => r.status === 'Refill Due' || r.refillsRemaining > 0).length}
              </p>
              <p className="text-xs text-slate-400 mt-1">Continuous therapy regimens</p>
            </div>
            <div className="p-3 bg-slate-800 text-amber-400 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filter by Condition Tag */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-1">Condition Filter:</span>
        <button
          onClick={() => setSelectedConditionFilter('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedConditionFilter === 'All'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          All Prescriptions ({prescriptions.length})
        </button>
        {CONDITION_TAGS.map((tag) => {
          const count = prescriptions.filter((r) => r.conditionTag === tag).length;
          return (
            <button
              key={tag}
              onClick={() => setSelectedConditionFilter(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedConditionFilter === tag
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tag} ({count})
            </button>
          );
        })}
      </div>

      {/* Prescriptions Roster */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Clinical Prescriptions & Outcome Ledger</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeted therapeutic regimens with patient outcome monitoring and authorized refills
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredPrescriptions.length} records
            </span>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Prescription #</th>
                  <th className="py-3 px-4 font-semibold">Patient</th>
                  <th className="py-3 px-4 font-semibold">Condition Tag</th>
                  <th className="py-3 px-4 font-semibold">Prescribed Product & Dosage</th>
                  <th className="py-3 px-4 font-semibold text-center">Refills Left</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold">Clinical Outcome Notes</th>
                  <th className="py-3 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredPrescriptions.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-emerald-400">
                      {rx.prescriptionNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{rx.patientName}</div>
                      <div className="text-xs text-slate-400">{rx.clinicName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {rx.conditionTag ? (
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${getConditionColor(rx.conditionTag)}`}>
                          {rx.conditionTag}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Unspecified</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-white">{rx.productName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{rx.dosage}</div>
                      <div className="text-xs text-slate-500 italic mt-0.5">{rx.instructions}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        rx.refillsRemaining > 1 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {rx.refillsRemaining}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                      {rx.refillDueDate}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-xs text-slate-300 bg-slate-800/80 p-2 rounded border border-slate-700/60 leading-relaxed">
                        {rx.clinicalOutcomeNotes || 'Regimen underway. Follow-up consultation scheduled.'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge
                        variant={rx.status === 'Active' ? 'success' : rx.status === 'Refill Due' ? 'warning' : 'neutral'}
                        size="sm"
                      >
                        {rx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* New Prescription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Issue Digital Prescription</h3>
                  <p className="text-xs text-slate-400">HPCSA Compliant Schedule 4 / Botanical Electronic Script</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="e.g. Sarah Meyer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Clinical Condition Tag
                  </label>
                  <select
                    value={conditionTag}
                    onChange={(e) => setConditionTag(e.target.value as ConditionTag)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {CONDITION_TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Formulary Botanical Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.sku} &mdash; {prod.name} (R{prod.retailPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Dosage & Frequency
                  </label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 10 drops sublingually twice daily"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Quantity & Refills
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Qty"
                    />
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={refills}
                      onChange={(e) => setRefills(Number(e.target.value))}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Refills"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Patient Instructions
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Administer after meals. Avoid driving within 2 hours."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Clinical Outcome Baseline / Monitoring Target
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Enter baseline patient metrics and expected therapeutic outcomes..."
                />
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
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  Authorize & Issue Prescription
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
