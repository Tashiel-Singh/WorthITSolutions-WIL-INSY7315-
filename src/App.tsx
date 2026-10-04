import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './components/common/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { InventoryView } from './views/InventoryView';
import { BulkOrderView } from './views/BulkOrderView';
import { InvoicesView } from './views/InvoicesView';
import { PatientPortalView } from './views/PatientPortalView';
import { UserRole } from './types';
import { ShieldAlert } from 'lucide-react';
import { Button } from './components/common/Button';

// Role Guard Component
interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { currentUser, switchRole } = useApp();
  const location = useLocation();

  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-amber-950">Restricted Enterprise Access</h2>
        <p className="text-sm text-amber-800 mt-2 leading-relaxed">
          The view at <code className="bg-amber-100 px-2 py-0.5 rounded font-mono text-xs">{location.pathname}</code> is restricted to{' '}
          <strong className="font-semibold">{allowedRoles.join(', ')}</strong> roles.
          Your active profile is currently logged in as{' '}
          <span className="capitalize font-semibold text-amber-950">{currentUser.role}</span> ({currentUser.name}).
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => switchRole(allowedRoles[0])}
          >
            Switch to {allowedRoles[0].toUpperCase()} Role
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Standalone Authentication Screen */}
      <Route path="/login" element={<LoginView />} />

      {/* Authenticated Application Layout Views */}
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <RoleGuard allowedRoles={['distributor']}>
              <DashboardView />
            </RoleGuard>
          </AppLayout>
        }
      />

      <Route
        path="/inventory"
        element={
          <AppLayout>
            <RoleGuard allowedRoles={['distributor', 'pharmacy']}>
              <InventoryView />
            </RoleGuard>
          </AppLayout>
        }
      />

      <Route
        path="/orders/new"
        element={
          <AppLayout>
            <RoleGuard allowedRoles={['distributor', 'pharmacy']}>
              <BulkOrderView />
            </RoleGuard>
          </AppLayout>
        }
      />

      <Route
        path="/invoices"
        element={
          <AppLayout>
            <RoleGuard allowedRoles={['distributor', 'pharmacy']}>
              <InvoicesView />
            </RoleGuard>
          </AppLayout>
        }
      />

      <Route
        path="/patient-portal"
        element={
          <AppLayout>
            <RoleGuard allowedRoles={['distributor', 'patient']}>
              <PatientPortalView />
            </RoleGuard>
          </AppLayout>
        }
      />

      {/* Fallback & Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
