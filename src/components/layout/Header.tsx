/**
 * Top Navigation Header with Brand Identity, Role Switcher & User Profile
 */
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../common/ToastContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import {
  Menu,
  RotateCcw,
  Activity,
  Server,
  Database,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    currentUser,
    resetAllData,
    backendStatus,
    backendLatency,
    backendUrl,
    backendStatusMessage,
    recheckBackendConnection,
  } = useApp();
  const { showToast } = useToast();
  const [showBackendModal, setShowBackendModal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleResetData = () => {
    resetAllData();
    showToast('Demo State Reset', 'Restored all inventory counts, orders, and invoices to initial state.', 'success');
  };

  const handleRefreshBackend = async () => {
    setIsRetrying(true);
    await recheckBackendConnection();
    setIsRetrying(false);
    showToast('Backend Connection Checked', backendStatusMessage, backendStatus === 'offline' ? 'warning' : 'success');
  };

  const isConnected = backendStatus === 'connected' || backendStatus === 'stub';

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-colors no-print">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={onToggleSidebar}
            aria-expanded={isSidebarOpen}
            aria-label="Toggle navigation drawer"
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Distributor Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-900 via-brand-800 to-brand-700 text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Activity className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                  MedFlow
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-900 tracking-wide uppercase">
                  B2B Distribution
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                CBD & Homeopathic Distribution System
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Render Backend Connection Indicator */}
          <button
            onClick={() => setShowBackendModal(true)}
            title="Inspect Render Backend & PostgreSQL status"
            aria-label="View backend database connection details"
            className={`hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100'
                : backendStatus === 'checking'
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100'
            }`}
          >
            <div className="relative flex items-center justify-center">
              {isConnected ? (
                <>
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </>
              ) : backendStatus === 'checking' ? (
                <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              )}
            </div>
            <Server className="w-3.5 h-3.5" />
            <span>
              {isConnected
                ? `Render Live ${backendLatency ? `(${backendLatency}ms)` : ''}`
                : backendStatus === 'checking'
                ? 'Probing Render...'
                : 'Local Cache Mode'}
            </span>
          </button>

          {/* Quick Prototype Data Reset */}
          <button
            onClick={handleResetData}
            title="Reset demonstration data"
            aria-label="Reset prototype data to default seed state"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Reset Data</span>
          </button>

          {/* Evaluation Role Switcher */}
          <RoleSwitcher />

          {/* Authenticated User Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-800 to-slateBlue-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {currentUser.avatarInitials}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5 truncate max-w-[140px]">
                {currentUser.title}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Render Backend Connection Diagnostic Modal */}
      {showBackendModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="backend-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-900 text-white flex items-center justify-center shadow-sm">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 id="backend-modal-title" className="text-base font-bold text-slate-900">
                    Render Cloud Backend & Database
                  </h3>
                  <p className="text-xs text-slate-500">
                    Production Infrastructure Architecture (Role 3 & Role 4)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBackendModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  isConnected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {isConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {isConnected ? 'Backend Active' : 'Offline / High-Fidelity Local Cache'}
                  </div>
                  <div className="text-xs mt-0.5 leading-relaxed">{backendStatusMessage}</div>
                </div>
              </div>

              {/* Infrastructure Endpoints */}
              <div className="space-y-2.5 bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">API Service:</span>
                  <a
                    href={`${backendUrl}/health`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-brand-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {backendUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">PostgreSQL Database:</span>
                  <span className="font-mono text-slate-800 font-semibold">medflow-db-wil26sc</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Database Engine:</span>
                  <span className="text-slate-800 font-semibold">PostgreSQL 16 (Render Managed)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">ORM / Schema:</span>
                  <span className="text-slate-800 font-semibold">Prisma 5.22 (Task 1 ERD)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Latency:</span>
                  <span className="font-semibold text-slate-800">
                    {backendLatency ? `${backendLatency} ms` : 'N/A'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Project MedFlow implements an offline-first architecture. All features—including bulk discount calculations, Section 11(e) tax deduction engine, inventory pool transfers, and audit trails—function seamlessly with automatic fallback if the Render free tier sleeps.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleRefreshBackend}
                disabled={isRetrying}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Pinging Render...' : 'Ping / Wake Up Backend'}
              </button>
              <button
                onClick={() => setShowBackendModal(false)}
                className="px-4 py-2 text-xs font-bold bg-brand-900 text-white rounded-xl hover:bg-brand-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
