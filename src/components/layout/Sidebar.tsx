/**
 * Ergonomic Sidebar Navigation with Desktop Sticky & Mobile Drawer Modes
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Receipt,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { products, invoices, currentUser } = useApp();

  const lowStockCount = products.filter((p) => p.activeStatus === 'Low Stock' || p.activeStatus === 'Out of Stock').length;
  const overdueCount = invoices.filter((i) => i.status === 'Overdue').length;

  const navItems = [
    {
      to: '/dashboard',
      label: 'Executive Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      allowedRoles: ['distributor'],
      description: 'KPIs & Revenue Segregation',
    },
    {
      to: '/inventory',
      label: 'Inventory Management',
      icon: <Boxes className="w-4 h-4" />,
      allowedRoles: ['distributor', 'pharmacy'],
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      description: 'Retail vs Bulk Stock Pools',
    },
    {
      to: '/orders/new',
      label: 'Pharmacy Bulk Order',
      icon: <ShoppingCart className="w-4 h-4" />,
      allowedRoles: ['distributor', 'pharmacy'],
      description: 'B2B Tiered Volume Ordering',
    },
    {
      to: '/invoices',
      label: 'Orders & Invoices',
      icon: <Receipt className="w-4 h-4" />,
      allowedRoles: ['distributor', 'pharmacy'],
      badge: overdueCount > 0 ? `${overdueCount} Overdue` : undefined,
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
      description: 'SARS 15% VAT Invoicing',
    },
    {
      to: '/patient-portal',
      label: 'Patient Portal',
      icon: <UserCheck className="w-4 h-4" />,
      allowedRoles: ['distributor', 'patient'],
      description: 'Prescriptions & Refill Triggers',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto no-print ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        aria-label="Main Navigation Sidebar"
      >
        {/* Brand Sidebar Banner */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
              MD
            </div>
            <div>
              <div className="text-sm font-extrabold text-white tracking-tight">MedFlow Hub</div>
              <div className="text-[10px] text-emerald-400 font-medium tracking-wide">CBD & Homeopathic</div>
            </div>
          </div>
        </div>

        {/* Role Identity Card */}
        <div className="mx-3 my-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Current Role View</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
          <div className="text-[11px] text-slate-400 truncate">{currentUser.organization}</div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto" aria-label="Portal Navigation">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Core Portals
          </div>

          {navItems.map((item) => {
            const isRoleAuthorized = item.allowedRoles.includes(currentUser.role);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : isRoleAuthorized
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 opacity-70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Audit Status */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SARS Section 11(e)</span>
            </span>
            <span className="text-emerald-400 font-bold">Compliant</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <span>Version 2.0 (WIL Task 2)</span>
            <span>Tashiel Singh</span>
          </div>
        </div>
      </aside>
    </>
  );
};
