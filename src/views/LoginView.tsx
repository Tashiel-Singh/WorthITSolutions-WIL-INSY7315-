/**
 * Authentication Portal with Multi-Role Preview & Inline Form Validation
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/common/ToastContext';
import { Button } from '../components/common/Button';
import { UserRole } from '../types';
import { Activity, ShieldCheck, Building2, User, KeyRound, Mail, ArrowRight } from 'lucide-react';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useApp();
  const { showToast } = useToast();

  const [email, setEmail] = useState('thomas@medflowdistribution.co.za');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('distributor');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Institutional email or username is required.';
    } else if (!email.includes('@') && email.length < 3) {
      newErrors.email = 'Please provide a valid institutional email address.';
    }

    if (!password) {
      newErrors.password = 'Security password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      switchRole(selectedRole);
      setIsLoading(false);
      showToast('Authentication Successful', `Logged in as ${selectedRole.toUpperCase()} (Thomas / MedFlow)`, 'success');
      navigate(selectedRole === 'patient' ? '/patient-portal' : '/dashboard');
    }, 600);
  };

  const handleQuickRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'distributor') setEmail('thomas@medflowdistribution.co.za');
    if (role === 'pharmacy') setEmail('eleanor.scott@medcentre.co.za');
    if (role === 'patient') setEmail('sarah.meyer@wellnessmail.co.za');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-elevated border border-slate-100 overflow-hidden">
        {/* Brand Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slateBlue-700 p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 flex items-center justify-center shadow-lg mb-3">
              <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">MedFlow Distribution</h1>
            <p className="text-xs text-emerald-200 mt-1 font-medium tracking-wide uppercase">
              Integrated B2B CBD & Homeopathic Supply Portal
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Role Selection Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Stakeholder Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole('distributor')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'distributor'
                    ? 'border-brand-700 bg-brand-50 text-brand-950 shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-brand-700 mb-1" />
                <div className="font-bold text-xs">Distributor</div>
                <div className="text-[10px] text-slate-500">Thomas</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('pharmacy')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'pharmacy'
                    ? 'border-slateBlue-700 bg-sky-50 text-slateBlue-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Building2 className="w-5 h-5 text-slateBlue-700 mb-1" />
                <div className="font-bold text-xs">Pharmacy</div>
                <div className="text-[10px] text-slate-500">Sr. Eleanor</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('patient')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'patient'
                    ? 'border-teal-700 bg-teal-50 text-teal-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <User className="w-5 h-5 text-teal-700 mb-1" />
                <div className="font-bold text-xs">Patient</div>
                <div className="text-[10px] text-slate-500">Sarah M.</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                Institutional Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`block w-full pl-10 pr-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-sm transition-all focus:bg-white ${
                    errors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-brand-700 focus:ring-brand-200'
                  }`}
                  placeholder="name@organization.co.za"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`block w-full pl-10 pr-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-sm transition-all focus:bg-white ${
                    errors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-brand-700 focus:ring-brand-200'
                  }`}
                  placeholder="••••••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Access Distribution Portal
            </Button>
          </form>

          {/* Compliance Footer Note */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            Certified compliant with SAHPRA Schedule 4 & SARS Section 11(e) protocols.
          </div>
        </div>
      </div>
    </div>
  );
};
