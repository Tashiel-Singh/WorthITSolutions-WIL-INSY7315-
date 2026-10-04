/**
 * Quick Demonstration Role Switcher Component
 */
import React from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from './ToastContext';
import { UserRole } from '../../types';
import { ShieldCheck, Building2, User, ChevronDown } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'distributor',
      label: 'Distributor / Owner',
      desc: 'Thomas (Executive KPIs & Bulk Management)',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    },
    {
      role: 'pharmacy',
      label: 'Pharmacy Manager',
      desc: 'Sr. Eleanor Scott (B2B Bulk Orders & Invoices)',
      icon: <Building2 className="w-4 h-4 text-slateBlue-600" />,
    },
    {
      role: 'patient',
      label: 'Chronic Patient',
      desc: 'Sarah Meyer (Prescriptions & Refills)',
      icon: <User className="w-4 h-4 text-brand-600" />,
    },
  ];

  const handleSelectRole = (r: UserRole) => {
    switchRole(r);
    setIsOpen(false);
    const target = roles.find((item) => item.role === r);
    showToast('Role Switched', `Active session switched to ${target?.label} (${target?.desc})`, 'info');
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Switch active demonstration user role"
        className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200/80 hover:bg-brand-100/70 text-brand-900 rounded-xl text-xs font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-700"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
        <span className="hidden sm:inline text-slate-500 font-normal">Active Role:</span>
        <span className="font-bold text-brand-950 capitalize">{currentUser.role}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-brand-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-elevated border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Evaluation Role Switcher
          </div>
          {roles.map((item) => {
            const isActive = currentUser.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => handleSelectRole(item.role)}
                className={`w-full text-left px-3 py-2 flex items-start gap-3 text-xs transition-colors ${
                  isActive ? 'bg-brand-50/70 text-brand-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
                role="menuitem"
              >
                <div className="p-1 rounded-lg bg-slate-100/80 mt-0.5">{item.icon}</div>
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    {item.label}
                    {isActive && (
                      <span className="text-[10px] bg-brand-200 text-brand-900 px-1.5 py-0.2 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
