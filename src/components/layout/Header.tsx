/**
 * Top Navigation Header with Brand Identity, Role Switcher & User Profile
 */
import React from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../common/ToastContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { Menu, RotateCcw, Activity } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentUser, resetAllData } = useApp();
  const { showToast } = useToast();

  const handleResetData = () => {
    resetAllData();
    showToast('Demo State Reset', 'Restored all inventory counts, orders, and invoices to initial state.', 'success');
  };

  return (
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
      <div className="flex items-center gap-2.5 sm:gap-3">
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
  );
};
