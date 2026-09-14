import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Shield,
  KeyRound,
  Lock,
  User,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { hashPassword, generateSalt, verifyPassword } from '../../lib/adminAuth';

export const AdminSecurityTab: React.FC = () => {
  const { config, updateConfig, logoutAdmin, saveConfigToCloud } = useCms();
  const currentAuth = config.adminAuth || {
    secretSlug: 'secret-admin',
    username: 'admin',
    allowEmailLogin: true,
  };

  // State for slug & username
  const [secretSlug, setSecretSlug] = useState(currentAuth.secretSlug || 'secret-admin');
  const [username, setUsername] = useState(currentAuth.username || 'admin');
  const [allowEmailLogin, setAllowEmailLogin] = useState(currentAuth.allowEmailLogin ?? true);

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Feedback states
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [generalSuccessMsg, setGeneralSuccessMsg] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://your-domain.netlify.app';

  const fullSecretUrl = `${baseUrl}/${secretSlug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullSecretUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Save General Access Settings (Slug & Username)
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralSuccessMsg(null);
    setSavingGeneral(true);

    const cleanSlug = secretSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-');

    const cleanUsername = username.trim();

    updateConfig((prev) => ({
      ...prev,
      adminAuth: {
        ...(prev.adminAuth || {}),
        secretSlug: cleanSlug || 'secret-admin',
        username: cleanUsername || 'admin',
        allowEmailLogin,
      },
    }));

    await saveConfigToCloud();
    setSavingGeneral(false);
    setGeneralSuccessMsg('Admin URL slug & username successfully updated and synced to Cloud!');
    setTimeout(() => setGeneralSuccessMsg(null), 4000);
  };

  // Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password to authorize changes.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      // Verify current password
      const isCurrentValid = await verifyPassword(
        currentPassword,
        currentAuth.passwordHash,
        currentAuth.salt
      );

      if (!isCurrentValid) {
        setPasswordError('Current password is incorrect. Unable to update.');
        setSavingPassword(false);
        return;
      }

      // Generate new salt and hash
      const newSalt = generateSalt();
      const newHash = await hashPassword(newPassword, newSalt);

      updateConfig((prev) => ({
        ...prev,
        adminAuth: {
          ...(prev.adminAuth || {}),
          secretSlug: prev.adminAuth?.secretSlug || secretSlug,
          username: prev.adminAuth?.username || username,
          passwordHash: newHash,
          salt: newSalt,
          allowEmailLogin,
        },
      }));

      await saveConfigToCloud();

      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Password successfully updated and securely hashed! Keep your new password safe.');
      setTimeout(() => setPasswordSuccess(null), 6000);
    } catch (err) {
      setPasswordError('An unexpected error occurred while updating the password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Shield className="w-4 h-4" />
              <span>Admin Access & Security</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Secret URL & Administrator Credentials
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Public visitors on Netlify or custom domains cannot see the Admin Bar or CMS controls.
              Only users with this secret URL and password can access the studio.
            </p>
          </div>

          <button
            onClick={() => logoutAdmin()}
            className="px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Admin</span>
          </button>
        </div>
      </div>

      {/* Secret URL Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Your Secret Admin Portal URL</h3>
              <p className="text-xs text-slate-400">
                Bookmark this URL. Do not share it publicly on social media.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
            Active & Protected
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 bg-slate-950 px-4 py-3 rounded-xl border border-slate-700/80 font-mono text-xs text-indigo-300 flex items-center justify-between overflow-x-auto">
            <span>{fullSecretUrl}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer shrink-0 shadow-xs"
          >
            {copiedUrl ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Secret URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* General Settings: Change Secret Slug & Username */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <h3 className="text-base font-semibold text-white mb-1">
          Customize Secret Slug & Admin Username
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Change the secret path name or the username required to log in.
        </p>

        {generalSuccessMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{generalSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveGeneral} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Secret URL Slug */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Secret Path Slug (e.g. secret-admin)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-xs font-mono">
                  /
                </span>
                <input
                  type="text"
                  value={secretSlug}
                  onChange={(e) => setSecretSlug(e.target.value)}
                  placeholder="secret-admin"
                  className="w-full pl-7 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-hidden focus:border-indigo-500 font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Only letters, numbers, and hyphens (e.g. <code>my-admin-portal</code>)
              </p>
            </div>

            {/* Admin Username */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-hidden focus:border-indigo-500"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                You can also log in using your primary admin email: <code>digitalnorthvale@gmail.com</code>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={allowEmailLogin}
                onChange={(e) => setAllowEmailLogin(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/20"
              />
              <span>Allow login via administrator email address as fallback</span>
            </label>

            <button
              type="submit"
              disabled={savingGeneral}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {savingGeneral ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Access Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Password Management */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-white">Change Admin Password</h3>
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPasswords ? 'Hide' : 'Show'} Passwords</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Set a custom, high-security password for your CMS administration.
        </p>

        {passwordError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-hidden focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-hidden focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-hidden focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {savingPassword ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Encrypting & Updating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">Security Architecture Notes:</p>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
          <li>
            The public site on Netlify does not load any administrative editing UI for visitors.
          </li>
          <li>
            Passwords are encrypted using industry-standard SHA-256 with unique random cryptographic salts.
          </li>
          <li>
            If you ever forget your password, you can reset it by logging into Firebase Console directly under the <code>cms_config/site_config</code> document.
          </li>
        </ul>
      </div>
    </div>
  );
};
