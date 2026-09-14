import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { PaymentMethodConfig, PaymentSettingsConfig } from '../../types';
import {
  CreditCard,
  Building2,
  Wallet,
  Smartphone,
  Coins,
  Receipt,
  DollarSign,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit3,
  Save,
  Check,
  HelpCircle,
  Eye,
  Sliders,
  ShieldCheck,
  Copy,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const ICON_OPTIONS = [
  { label: 'Bank / Wire', value: 'Building2', icon: Building2 },
  { label: 'Credit Card', value: 'CreditCard', icon: CreditCard },
  { label: 'PayPal / Wallet', value: 'Wallet', icon: Wallet },
  { label: 'Mobile Wallet', value: 'Smartphone', icon: Smartphone },
  { label: 'Cryptocurrency', value: 'Coins', icon: Coins },
  { label: 'Official Invoice', value: 'Receipt', icon: Receipt },
  { label: 'Dollar / Cash', value: 'DollarSign', icon: DollarSign },
];

const CURRENCY_PRESETS = [
  { code: 'USD', symbol: '$', label: 'US Dollar ($)', position: 'before' as const },
  { code: 'PKR', symbol: '₨', label: 'Pakistani Rupee (₨)', position: 'before' as const },
  { code: 'EUR', symbol: '€', label: 'Euro (€)', position: 'before' as const },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)', position: 'before' as const },
  { code: 'AED', symbol: 'AED ', label: 'UAE Dirham (AED)', position: 'before' as const },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar (CA$)', position: 'before' as const },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$)', position: 'before' as const },
];

export const PaymentsTab: React.FC = () => {
  const {
    config,
    updatePaymentSettings,
    updatePaymentMethod,
    togglePaymentMethod,
    addPaymentMethod,
    deletePaymentMethod,
  } = useCms();

  const paymentConfig = config.payment || {
    currency: 'USD',
    currencySymbol: '$',
    currencyPosition: 'before',
    allowClientTransactionProof: true,
    methods: [],
  };

  const [editingMethodId, setEditingMethodId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<PaymentMethodConfig | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  // New Custom Method Template
  const [newMethod, setNewMethod] = useState<Omit<PaymentMethodConfig, 'id'>>({
    name: 'Wise / TransferWise',
    code: 'custom',
    description: 'International borderless bank transfer via Wise with minimal conversion fees.',
    badge: 'Low Fees',
    icon: 'Building2',
    enabled: true,
    requiresTransactionId: true,
    instructions: 'Send transfer to our Wise Business IBAN or email. Enter your transfer confirmation code below.',
    accountTitle: 'Apex Digital Agency',
    accountNumber: 'wise-pay@agency.com',
  });

  const handleStartEdit = (method: PaymentMethodConfig) => {
    setEditingMethodId(method.id);
    setEditForm({ ...method });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editingMethodId) return;

    updatePaymentMethod(editingMethodId, editForm);
    setEditingMethodId(null);
    setEditForm(null);
    triggerSaveBanner();
  };

  const triggerSaveBanner = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethod.name.trim()) return;

    addPaymentMethod(newMethod);
    setShowAddModal(false);
    triggerSaveBanner();
    // Reset form
    setNewMethod({
      name: '',
      code: 'custom',
      description: '',
      badge: '',
      icon: 'CreditCard',
      enabled: true,
      requiresTransactionId: true,
      instructions: '',
    });
  };

  const renderIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className={className} />;
      case 'CreditCard':
        return <CreditCard className={className} />;
      case 'Wallet':
        return <Wallet className={className} />;
      case 'Smartphone':
        return <Smartphone className={className} />;
      case 'Coins':
        return <Coins className={className} />;
      case 'Receipt':
        return <Receipt className={className} />;
      case 'DollarSign':
      default:
        return <DollarSign className={className} />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Save Notification Banner */}
      {saveBanner && (
        <div className="fixed top-12 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Payment configuration saved successfully!</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>Payment Gateways & Checkout Control</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Full Admin Power
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage all checkout options available to clients (Direct Bank Transfer, Cards, PayPal, JazzCash/EasyPaisa, Crypto USDT, and Invoices).
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Method</span>
          </button>
        </div>

        {/* Live Status Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Gateways
            </span>
            <span className="text-xl font-black text-white mt-1 block">
              {paymentConfig.methods.filter((m) => m.enabled).length} / {paymentConfig.methods.length}
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Default Currency
            </span>
            <span className="text-xl font-black text-violet-400 mt-1 block">
              {paymentConfig.currency} ({paymentConfig.currencySymbol})
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Proof of Payment
            </span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">
              {paymentConfig.allowClientTransactionProof ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Client Checkout
            </span>
            <span className="text-xl font-black text-blue-400 mt-1 block">
              Live & Synced
            </span>
          </div>
        </div>
      </div>

      {/* Global Currency & Checkout Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-violet-600" />
          <span>General Currency & Payment Preferences</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Select Currency Preset
            </label>
            <select
              value={paymentConfig.currency}
              onChange={(e) => {
                const found = CURRENCY_PRESETS.find((p) => p.code === e.target.value);
                if (found) {
                  updatePaymentSettings({
                    currency: found.code,
                    currencySymbol: found.symbol,
                    currencyPosition: found.position,
                  });
                  triggerSaveBanner();
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
            >
              {CURRENCY_PRESETS.map((preset) => (
                <option key={preset.code} value={preset.code}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Custom Currency Symbol
            </label>
            <input
              type="text"
              value={paymentConfig.currencySymbol}
              onChange={(e) => updatePaymentSettings({ currencySymbol: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              placeholder="$ or ₨"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Symbol Position
            </label>
            <select
              value={paymentConfig.currencyPosition}
              onChange={(e) =>
                updatePaymentSettings({
                  currencyPosition: e.target.value as 'before' | 'after',
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
            >
              <option value="before">Before Amount (e.g. $1,250)</option>
              <option value="after">After Amount (e.g. 1,250 ₨)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={paymentConfig.allowClientTransactionProof}
              onChange={(e) => {
                updatePaymentSettings({ allowClientTransactionProof: e.target.checked });
                triggerSaveBanner();
              }}
              className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
            />
            <span>Allow Client Transaction ID / Receipt Proof submission in Checkout</span>
          </label>
          <span className="text-[11px] text-slate-500">
            Clients can input their Bank Wire TID, JazzCash SMS Ref, or PayPal Txn ID.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Checkout Success Message
            </label>
            <input
              type="text"
              value={paymentConfig.checkoutSuccessMessage || ''}
              onChange={(e) =>
                updatePaymentSettings({ checkoutSuccessMessage: e.target.value })
              }
              placeholder="Thank you for your order! Your payment details..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Invoice Footer / Terms Note
            </label>
            <input
              type="text"
              value={paymentConfig.invoiceNotes || ''}
              onChange={(e) => updatePaymentSettings({ invoiceNotes: e.target.value })}
              placeholder="Official invoice issued by SEO Studio. Sprints commence..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Payment Gateways List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Configured Payment Gateways</span>
            <span className="text-xs font-normal text-slate-500">
              ({paymentConfig.methods.length} methods configured)
            </span>
          </h4>
          <span className="text-xs text-slate-500">
            Click edit on any method to change bank info, phone numbers, or instructions.
          </span>
        </div>

        <div className="space-y-3">
          {paymentConfig.methods.map((method) => {
            const isEditing = editingMethodId === method.id;

            return (
              <div
                key={method.id}
                className={`bg-white rounded-2xl border transition shadow-xs overflow-hidden ${
                  method.enabled
                    ? 'border-slate-200'
                    : 'border-slate-200/60 opacity-75 bg-slate-50/50'
                }`}
              >
                {/* Gateway Card Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        method.enabled
                          ? 'bg-violet-50 text-violet-600 border border-violet-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {renderIcon(method.icon, 'w-5 h-5')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-slate-900 leading-tight">
                          {method.name}
                        </h5>
                        {method.badge && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800 border border-violet-200">
                            {method.badge}
                          </span>
                        )}
                        {method.testMode && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Sandbox / Test Mode
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                        {method.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Active toggle */}
                    <button
                      onClick={() => togglePaymentMethod(method.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        method.enabled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                      }`}
                      title={method.enabled ? 'Click to disable' : 'Click to enable'}
                    >
                      {method.enabled ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active in Checkout</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        isEditing ? setEditingMethodId(null) : handleStartEdit(method)
                      }
                      className="px-3 py-1 rounded-lg text-xs font-medium border border-slate-300 hover:bg-slate-50 text-slate-700 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isEditing ? 'Close' : 'Configure'}</span>
                    </button>

                    {/* Delete for custom methods */}
                    {method.id.startsWith('pm_') && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete payment method "${method.name}"?`)) {
                            deletePaymentMethod(method.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                        title="Delete custom method"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Gateway Detail Preview Snippet */}
                {!isEditing && (
                  <div className="px-5 pb-4 pt-1 flex flex-wrap items-center gap-4 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/40">
                    {method.bankName && (
                      <span className="flex items-center gap-1">
                        <strong className="text-slate-700">Bank:</strong> {method.bankName}
                      </span>
                    )}
                    {method.accountTitle && (
                      <span className="flex items-center gap-1">
                        <strong className="text-slate-700">Title:</strong> {method.accountTitle}
                      </span>
                    )}
                    {method.accountNumber && (
                      <span className="flex items-center gap-1">
                        <strong className="text-slate-700">A/C:</strong>{' '}
                        <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">
                          {method.accountNumber}
                        </code>
                      </span>
                    )}
                    {method.walletNumber && (
                      <span className="flex items-center gap-1">
                        <strong className="text-slate-700">Mobile No:</strong>{' '}
                        <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">
                          {method.walletNumber}
                        </code>
                      </span>
                    )}
                    {method.paypalEmailOrLink && (
                      <span className="flex items-center gap-1">
                        <strong className="text-slate-700">PayPal:</strong> {method.paypalEmailOrLink}
                      </span>
                    )}
                    {method.cryptoAddress && (
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <strong className="text-slate-700">Address:</strong>{' '}
                        <code className="font-mono text-[11px] truncate">
                          {method.cryptoAddress}
                        </code>
                      </span>
                    )}
                    <span className="text-slate-400 ml-auto text-[11px]">
                      {method.requiresTransactionId
                        ? 'Requires Client TID Ref'
                        : 'No TID Required'}
                    </span>
                  </div>
                )}

                {/* Inline Editing Form */}
                {isEditing && editForm && (
                  <form
                    onSubmit={handleSaveEdit}
                    className="p-5 border-t border-slate-200 bg-slate-50 space-y-4 animate-fade-in"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Configure Settings for: {method.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        Changes will instantly reflect in the live client checkout modal.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Badge / Tag (e.g. Recommended, Instant)
                        </label>
                        <input
                          type="text"
                          value={editForm.badge || ''}
                          onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          placeholder="Recommended"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Icon
                        </label>
                        <select
                          value={editForm.icon}
                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Short Customer Description
                      </label>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({ ...editForm, description: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        required
                      />
                    </div>

                    {/* Method-specific fields */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Account & Gateway Specific Credentials
                      </span>

                      {/* Direct Bank Fields */}
                      {(editForm.code === 'bank' || editForm.id === 'bank_transfer') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Bank Name
                            </label>
                            <input
                              type="text"
                              value={editForm.bankName || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, bankName: e.target.value })
                              }
                              placeholder="Standard Chartered / Chase"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Account Title / Beneficiary
                            </label>
                            <input
                              type="text"
                              value={editForm.accountTitle || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, accountTitle: e.target.value })
                              }
                              placeholder="Apex SEO Agency LLC"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Account / IBAN Number
                            </label>
                            <input
                              type="text"
                              value={editForm.accountNumber || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, accountNumber: e.target.value })
                              }
                              placeholder="0123-4567-8901"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              SWIFT / Branch Code
                            </label>
                            <input
                              type="text"
                              value={editForm.ibanOrSwift || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, ibanOrSwift: e.target.value })
                              }
                              placeholder="SCBLPKKHI"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* Card / Stripe Fields */}
                      {(editForm.code === 'card' || editForm.id === 'stripe_card') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Stripe Publishable Key
                            </label>
                            <input
                              type="text"
                              value={editForm.stripePublishableKey || ''}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  stripePublishableKey: e.target.value,
                                })
                              }
                              placeholder="pk_live_... or pk_test_..."
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 font-mono"
                            />
                          </div>

                          <div className="flex items-center gap-3 pt-4">
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editForm.testMode || false}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, testMode: e.target.checked })
                                }
                                className="rounded text-violet-600"
                              />
                              <span>Enable Test Sandbox Mode (Simulate Card Checkout)</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* PayPal Fields */}
                      {(editForm.code === 'paypal' || editForm.id === 'paypal') && (
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                            PayPal Email / PayPal.me Link
                          </label>
                          <input
                            type="text"
                            value={editForm.paypalEmailOrLink || ''}
                            onChange={(e) =>
                              setEditForm({ ...editForm, paypalEmailOrLink: e.target.value })
                            }
                            placeholder="payments@agency.com or paypal.me/apexagency"
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                          />
                        </div>
                      )}

                      {/* Mobile Wallet (JazzCash / EasyPaisa) Fields */}
                      {(editForm.code === 'wallet' || editForm.id === 'easypaisa_jazzcash') && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Wallet Provider
                            </label>
                            <input
                              type="text"
                              value={editForm.walletProvider || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, walletProvider: e.target.value })
                              }
                              placeholder="JazzCash / EasyPaisa / Raast"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Account Holder Name
                            </label>
                            <input
                              type="text"
                              value={editForm.accountTitle || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, accountTitle: e.target.value })
                              }
                              placeholder="Agency Director Name"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Mobile Number / Till ID
                            </label>
                            <input
                              type="text"
                              value={editForm.walletNumber || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, walletNumber: e.target.value })
                              }
                              placeholder="0300-1234567"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* Crypto USDT Fields */}
                      {(editForm.code === 'crypto' || editForm.id === 'crypto_usdt') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Network Protocol
                            </label>
                            <input
                              type="text"
                              value={editForm.cryptoNetwork || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, cryptoNetwork: e.target.value })
                              }
                              placeholder="USDT (TRC-20) or ERC-20"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Wallet Deposit Address
                            </label>
                            <input
                              type="text"
                              value={editForm.cryptoAddress || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, cryptoAddress: e.target.value })
                              }
                              placeholder="TYs9823hAkL20NqPd93kLq912kLqwP109k"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* Custom / Other Fields */}
                      {editForm.code === 'custom' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Account / Beneficiary Details
                            </label>
                            <input
                              type="text"
                              value={editForm.accountTitle || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, accountTitle: e.target.value })
                              }
                              placeholder="Account title or PO instructions"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                              Account Number or Email
                            </label>
                            <input
                              type="text"
                              value={editForm.accountNumber || ''}
                              onChange={(e) =>
                                setEditForm({ ...editForm, accountNumber: e.target.value })
                              }
                              placeholder="ID, IBAN, or recipient identifier"
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Client Instructions */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Instructions Shown to Client in Checkout
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.instructions}
                        onChange={(e) =>
                          setEditForm({ ...editForm, instructions: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        placeholder="Provide clear step-by-step payment directions..."
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.requiresTransactionId}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              requiresTransactionId: e.target.checked,
                            })
                          }
                          className="rounded text-violet-600"
                        />
                        <span>Require Client to enter Transaction / Reference ID (TID)</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingMethodId(null)}
                          className="px-4 py-1.5 rounded-lg text-xs font-medium border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-1.5 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Add New Payment Gateway
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Add any local bank, mobile wallet, or online checkout method.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Gateway Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMethod.name}
                    onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                    placeholder="e.g. Wise International / Raast Instant"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Gateway Type
                  </label>
                  <select
                    value={newMethod.code}
                    onChange={(e) =>
                      setNewMethod({
                        ...newMethod,
                        code: e.target.value as PaymentMethodConfig['code'],
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  >
                    <option value="bank">Direct Bank / Wire</option>
                    <option value="wallet">Mobile Wallet / Raast</option>
                    <option value="card">Credit / Debit Card</option>
                    <option value="paypal">PayPal / Online Link</option>
                    <option value="crypto">Crypto / Web3</option>
                    <option value="custom">Custom / Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={newMethod.badge || ''}
                    onChange={(e) => setNewMethod({ ...newMethod, badge: e.target.value })}
                    placeholder="e.g. 0% Fee / Instant"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={newMethod.icon}
                    onChange={(e) => setNewMethod({ ...newMethod, icon: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Customer Description
                </label>
                <input
                  type="text"
                  required
                  value={newMethod.description}
                  onChange={(e) => setNewMethod({ ...newMethod, description: e.target.value })}
                  placeholder="e.g. Pay via Wise borderless account with real exchange rates."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Account Title / Beneficiary
                  </label>
                  <input
                    type="text"
                    value={newMethod.accountTitle || ''}
                    onChange={(e) => setNewMethod({ ...newMethod, accountTitle: e.target.value })}
                    placeholder="Apex Agency Business"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Account Number / ID / Mobile
                  </label>
                  <input
                    type="text"
                    value={newMethod.accountNumber || ''}
                    onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                    placeholder="IBAN, Mobile, or Account ID"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Client Payment Instructions
                </label>
                <textarea
                  rows={2}
                  value={newMethod.instructions}
                  onChange={(e) => setNewMethod({ ...newMethod, instructions: e.target.value })}
                  placeholder="Instructions explaining how to complete payment and get verified..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMethod.requiresTransactionId}
                    onChange={(e) =>
                      setNewMethod({ ...newMethod, requiresTransactionId: e.target.checked })
                    }
                    className="rounded text-violet-600"
                  />
                  <span>Ask Client for Transaction ID / Ref</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-medium border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-md"
                  >
                    Add Gateway
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
