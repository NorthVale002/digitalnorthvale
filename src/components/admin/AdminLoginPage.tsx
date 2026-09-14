import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, setActiveView, config } = useCms();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCredentialsHint, setShowCredentialsHint] = useState(true);

  const secretSlug = config.adminAuth?.secretSlug || 'secret-admin';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both your Admin Username and Password.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await loginAdmin(username.trim(), password, rememberMe);
      if (!success) {
        setErrorMsg('Invalid Username or Password. Please check your credentials and try again.');
      } else {
        // Success - redirect to home and open dashboard
        if (typeof window !== 'undefined') {
          // Clean up URL to standard root or hash
          window.history.replaceState(null, '', window.location.pathname.includes(secretSlug) ? '/' : window.location.pathname);
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDefaults = () => {
    setUsername(config.adminAuth?.username || 'admin');
    setPassword('Northvale@2026!');
    setErrorMsg(null);
  };

  const handleReturnHome = () => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
    }
    setActiveView('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-900/30 via-violet-800/20 to-emerald-900/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-900 border border-indigo-400/30 shadow-xl shadow-indigo-950/60 mb-4 ring-4 ring-indigo-500/10">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Secure Admin Gateway
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 flex items-center justify-center gap-1.5">
            <span>Restricted Access</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
            <span className="font-mono text-xs text-indigo-300">/{secretSlug}</span>
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username-input"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-500">Encrypted</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="admin-submit-login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition duration-150 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Access Admin Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Credentials Info Box */}
          {showCredentialsHint && (
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Default Administrator Credentials
                  </span>
                  <button
                    type="button"
                    onClick={handleFillDefaults}
                    className="text-[11px] text-indigo-400 hover:text-indigo-200 underline cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Username:</span>
                    <span className="text-slate-200 font-bold">{config.adminAuth?.username || 'admin'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Password:</span>
                    <span className="text-slate-200 font-bold">Northvale@2026!</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  You can change this username, password, and the secret URL slug inside the{' '}
                  <strong className="text-slate-200">Admin Security Settings</strong> anytime.
                </p>
              </div>
            </div>
          )}

          {/* Back to Public Site */}
          <div className="mt-5 text-center">
            <button
              onClick={handleReturnHome}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>

        {/* Security watermark */}
        <p className="text-center text-[11px] text-slate-600 mt-6">
          Protected by atelier CMS Secure Session Guard • Zero public exposure
        </p>
      </div>
    </div>
  );
};
