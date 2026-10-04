import React, { useState } from 'react';
import {
  Pill,
  Clock,
  ShieldCheck,
  RefreshCw,
  Phone,
  Hospital,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/common/ToastContext';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Prescription } from '../types';

export const PatientPortalView: React.FC = () => {
  const { prescriptions, requestPrescriptionRefill, currentUser } = useApp();
  const { addToast } = useToast();

  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'schedule' | 'clinic'>('prescriptions');

  // Filter prescriptions for Sarah Meyer or active patient
  const patientPrescriptions = prescriptions;

  const handleOpenRefillModal = (rx: Prescription) => {
    setSelectedRx(rx);
    setIsRefillModalOpen(true);
  };

  const handleConfirmRefill = async () => {
    if (!selectedRx) return;
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const success = requestPrescriptionRefill(selectedRx.id);

      if (success) {
        addToast({
          type: 'success',
          title: 'Refill Authorized',
          message: `Refill request submitted for ${selectedRx.productName}. Dispatched to ${selectedRx.clinicName}.`,
        });
      }
    } finally {
      setIsProcessing(false);
      setIsRefillModalOpen(false);
      setSelectedRx(null);
    }
  };

  const handleSimulateDownload = (rx: Prescription) => {
    addToast({
      type: 'info',
      title: 'Prescription Downloaded',
      message: `Prescription script ${rx.prescriptionNumber} saved as verified medical PDF.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Patient Profile Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-bold backdrop-blur-md shrink-0 shadow-inner">
              {currentUser.avatarInitials || 'SM'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Verified Patient Profile
                </span>
                <span className="text-xs text-emerald-200/80">ID: PT-9901</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">
                {currentUser.name}
              </h1>
              <p className="text-sm text-emerald-100/90 mt-0.5">
                Care Plan: Integrative Chronic Pain & Neurological Wellness Support
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
            <div className="px-3 py-1">
              <span className="text-xs text-emerald-200 block">Assigned Clinic</span>
              <span className="text-sm font-semibold text-white">St. Mary's Integrative</span>
            </div>
            <div className="w-px h-8 bg-white/20 hidden sm:block" />
            <div className="px-3 py-1">
              <span className="text-xs text-emerald-200 block">Attending Physician</span>
              <span className="text-sm font-semibold text-white">Dr. Thabo Naidoo</span>
            </div>
            <div className="w-px h-8 bg-white/20 hidden sm:block" />
            <div className="px-3 py-1">
              <span className="text-xs text-emerald-200 block">Active Prescriptions</span>
              <span className="text-sm font-semibold text-emerald-300">
                {patientPrescriptions.filter((p) => p.status !== 'Completed').length} Active
              </span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mt-6 border-t border-white/15 pt-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'prescriptions'
                ? 'bg-white text-emerald-950 font-bold shadow-md'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <Pill className="w-4 h-4" />
            My Prescriptions ({patientPrescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-white text-emerald-950 font-bold shadow-md'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            Dosage Schedule
          </button>
          <button
            onClick={() => setActiveTab('clinic')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'clinic'
                ? 'bg-white text-emerald-950 font-bold shadow-md'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <Hospital className="w-4 h-4" />
            Dispensary Contact
          </button>
        </div>
      </div>

      {/* Refill Due Action Alert */}
      {patientPrescriptions.some((p) => p.status === 'Refill Due') && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-900 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-amber-950">Action Recommended: Prescription Refill Due</h2>
              <p className="text-xs text-amber-800">
                Your Arnica Montana 30C Pellets prescription has 1 authorized refill remaining and is due for renewal.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="warning"
            onClick={() => {
              const dueRx = patientPrescriptions.find((p) => p.status === 'Refill Due');
              if (dueRx) handleOpenRefillModal(dueRx);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Order Refill Now
          </Button>
        </div>
      )}

      {/* Tab 1: Prescriptions List */}
      {activeTab === 'prescriptions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Current Doctor Prescriptions</h2>
              <span className="text-xs text-slate-500">Refreshed from MedFlow Clinic Registry</span>
            </div>

            {patientPrescriptions.map((rx) => {
              const isRefillDue = rx.status === 'Refill Due';
              const isCompleted = rx.status === 'Completed';

              return (
                <Card
                  key={rx.id}
                  className={`transition-all hover:shadow-md border-l-4 ${
                    isRefillDue
                      ? 'border-l-amber-500'
                      : isCompleted
                      ? 'border-l-slate-300 opacity-80'
                      : 'border-l-emerald-600'
                  }`}
                >
                  <CardBody className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {rx.prescriptionNumber}
                          </span>
                          <Badge
                            variant={
                              isRefillDue
                                ? 'warning'
                                : isCompleted
                                ? 'neutral'
                                : 'success'
                            }
                          >
                            {rx.status}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            Issued: {rx.issuedDate}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{rx.productName}</h3>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          Prescribed by {rx.prescribingDoctor} • {rx.clinicName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSimulateDownload(rx)}
                          title="Download verified medical script"
                        >
                          <Download className="w-4 h-4 text-slate-600" />
                        </Button>
                        {!isCompleted && (
                          <Button
                            size="sm"
                            variant={isRefillDue ? 'primary' : 'outline'}
                            onClick={() => handleOpenRefillModal(rx)}
                            disabled={rx.refillsRemaining <= 0}
                          >
                            <RefreshCw className="w-3.5 h-3.5 mr-1" />
                            Request Refill ({rx.refillsRemaining} Left)
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Dosage Box */}
                    <div className="mt-4 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
                      <div className="flex items-start gap-2">
                        <Pill className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="text-sm">
                          <span className="font-semibold text-slate-900">Dosage: </span>
                          <span className="text-slate-800 font-medium">{rx.dosage}</span>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            <span className="font-medium text-slate-700">Instructions: </span>
                            {rx.instructions}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-slate-600">Prescribed Qty: </span>
                          <span className="font-semibold text-slate-800">{rx.prescribedQuantity} Unit(s)</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Refill Due: </span>
                          <span
                            className={`font-semibold ${
                              isRefillDue ? 'text-amber-700 font-bold' : 'text-slate-800'
                            }`}
                          >
                            {rx.refillDueDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>SOP/SAHPRA Schedule 4 Batch Certified</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Right Rail: Patient Guidelines & Support */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Dispensary Compliance</h3>
                </div>
              </CardHeader>
              <CardBody className="p-4 space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/60 text-emerald-900">
                  <span className="font-bold block text-emerald-950 mb-0.5">Licensed CBD & Homeopathy</span>
                  All distributed compounds are extracted and formulated strictly under SAHPRA clinical guidelines with verified COA (Certificate of Analysis) test results.
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  <span className="font-bold block text-slate-900 mb-0.5">Emergency Refill Policy</span>
                  If your chronic medication has fewer than 48 hours remaining, contact the dispensary directly for urgent courier dispatch.
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Hospital className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Designated Pharmacy</h3>
                </div>
              </CardHeader>
              <CardBody className="p-4 space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">St. Mary's Integrative Care Unit</h4>
                  <p className="text-slate-600 mt-0.5">14 Chapel Road, Woodstock, Cape Town, 7925</p>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>+27 (021) 448-9100</span>
                </div>
                <div className="pt-2 border-t border-slate-100 text-slate-600">
                  Operating Hours: Mon - Fri 08:30 - 17:30
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Dosage Schedule */}
      {activeTab === 'schedule' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Daily Regimen & Timetable</h2>
              <p className="text-xs text-slate-500 mt-0.5">Recommended daily administration timeline for optimal bioavailability</p>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-6">
              {/* Morning */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                  08:00
                </div>
                <div className="flex-1 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Morning Dose</span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">Full Spectrum CBD Oil 1000mg</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    0.5ml sublingually after breakfast. Hold under tongue for 60 seconds before swallowing.
                  </p>
                </div>
              </div>

              {/* Afternoon */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                  14:00
                </div>
                <div className="flex-1 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Midday PRN (As Needed)</span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">Arnica Montana 30C Pellets</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    4 pellets under tongue if inflammation or physical tension arises. Avoid coffee/mint 15 mins before.
                  </p>
                </div>
              </div>

              {/* Evening */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm shrink-0">
                  21:30
                </div>
                <div className="flex-1 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Night-time Dose</span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">Full Spectrum CBD Oil 1000mg</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    0.5ml sublingually 30 minutes before sleep to support natural REM cycle and sleep architecture.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab 3: Dispensary Contact */}
      {activeTab === 'clinic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">Dispensary Logistics</h2>
            </CardHeader>
            <CardBody className="p-5 space-y-4 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-900 block">Fulfillment Center</span>
                <span>MedFlow Central Compound Depot, Epping Industrial 2, Cape Town</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Cold-Chain Delivery Partner</span>
                <span>Medical Courier Services (RSA Express Temperature Controlled)</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">Pharmacist On-Call</span>
                <span>Sr. L. Khumalo (Reg. P09418)</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">Patient Advisory Notes</h2>
            </CardHeader>
            <CardBody className="p-5 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Keep all CBD and homeopathic solutions in their amber glass containers out of direct heat and away from electronic microwave devices.
              </p>
              <p>
                Notify your doctor immediately if any unusual sensitivity develops. Regular 6-month clinical review is mandatory for chronic renewal.
              </p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Refill Confirmation Modal */}
      {selectedRx && (
        <ConfirmationModal
          isOpen={isRefillModalOpen}
          onClose={() => setIsRefillModalOpen(false)}
          onConfirm={handleConfirmRefill}
          title="Confirm Prescription Refill Request"
          message={`Are you sure you want to request a refill for ${selectedRx.productName}? This will deduct 1 refill from your remaining allowance (${selectedRx.refillsRemaining} remaining) and transmit the order to ${selectedRx.clinicName}.`}
          confirmLabel="Submit Refill Request"
          variant="primary"
          isLoading={isProcessing}
        />
      )}
    </div>
  );
};
