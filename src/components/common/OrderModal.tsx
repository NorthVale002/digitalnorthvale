import React, { useState, useEffect } from 'react';
import { useCms } from '../../context/CmsContext';
import { PaymentMethodConfig } from '../../types';
import {
  X,
  CheckCircle2,
  Send,
  Sparkles,
  Globe,
  Mail,
  User,
  Phone,
  Tag,
  FileText,
  ShieldCheck,
  ExternalLink,
  CreditCard,
  Building2,
  Wallet,
  Smartphone,
  Coins,
  Receipt,
  DollarSign,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';

export const OrderModal: React.FC = () => {
  const {
    orderModalOpen,
    closeOrderModal,
    selectedServiceForOrder,
    selectedTierForOrder,
    placeOrder,
    adminNotificationEmail,
    config,
  } = useCms();

  const { theme } = config;
  const paymentConfig = config.payment;
  const activeMethods: PaymentMethodConfig[] = (paymentConfig?.methods || []).filter(
    (m) => m.enabled
  );

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientWebsite, setClientWebsite] = useState('');
  const [selectedTierName, setSelectedTierName] = useState<string>('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Selection State
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentProofNotes, setPaymentProofNotes] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Card Simulation State (if Card method selected)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
  const [orderSuccessDetails, setOrderSuccessDetails] = useState<{
    methodName: string;
    status: string;
    tid?: string;
  } | null>(null);

  // Set default tier & default payment method when modal opens
  useEffect(() => {
    if (selectedServiceForOrder) {
      if (selectedTierForOrder) {
        setSelectedTierName(selectedTierForOrder);
      } else if (selectedServiceForOrder.tiers && selectedServiceForOrder.tiers.length > 0) {
        const popularTier = selectedServiceForOrder.tiers.find((t) => t.popular);
        setSelectedTierName(popularTier ? popularTier.name : selectedServiceForOrder.tiers[0].name);
      } else {
        setSelectedTierName('Standard Package');
      }

      // Default active payment method
      if (activeMethods.length > 0 && !selectedPaymentMethodId) {
        setSelectedPaymentMethodId(activeMethods[0].id);
      }
    }
  }, [selectedServiceForOrder, selectedTierForOrder, activeMethods.length]);

  if (!orderModalOpen || !selectedServiceForOrder) return null;

  const currentTier = selectedServiceForOrder.tiers?.find((t) => t.name === selectedTierName);
  const displayPrice = currentTier?.price || selectedServiceForOrder.price || 'Custom';
  const displayPeriod = currentTier?.period || selectedServiceForOrder.duration || '';

  const selectedMethod = activeMethods.find((m) => m.id === selectedPaymentMethodId);

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderPaymentIcon = (iconName: string, className: string = 'w-4 h-4') => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientWebsite.trim()) {
      alert('Please provide your name, business email, and website URL.');
      return;
    }

    if (selectedMethod?.requiresTransactionId && !transactionId.trim()) {
      alert(`Please enter your Transaction Reference / ID for ${selectedMethod.name}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const isCardInstant = selectedMethod?.code === 'card';
      const determinedPaymentStatus = isCardInstant ? 'paid' : 'pending_verification';

      const tidToRecord =
        transactionId.trim() ||
        (isCardInstant ? `CARD-${Date.now().toString().slice(-6)}` : undefined);

      const orderId = await placeOrder({
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim() || undefined,
        clientWebsite: clientWebsite.trim(),
        serviceId: selectedServiceForOrder.id,
        serviceTitle: selectedServiceForOrder.title,
        packageTier: selectedTierName,
        price: `${displayPrice} ${displayPeriod}`.trim(),
        targetKeywords: targetKeywords.trim() || undefined,
        notes: notes.trim() || undefined,
        adminEmail: adminNotificationEmail,
        paymentMethod: selectedMethod?.id || 'bank_transfer',
        paymentMethodName: selectedMethod?.name || 'Direct Bank Transfer',
        paymentStatus: determinedPaymentStatus,
        transactionId: tidToRecord,
        paymentProofNotes: paymentProofNotes.trim() || undefined,
      });

      setOrderSuccessId(orderId);
      setOrderSuccessDetails({
        methodName: selectedMethod?.name || 'Bank Transfer',
        status: determinedPaymentStatus,
        tid: tidToRecord,
      });
    } catch (err) {
      console.error('Order placement error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmailNotification = () => {
    const subject = encodeURIComponent(
      `New SEO Order [${orderSuccessId}]: ${selectedServiceForOrder.title} (${selectedTierName})`
    );
    const body = encodeURIComponent(
      `NEW SEO SERVICE ORDER DETAILS:
------------------------------------------
Order Reference ID: ${orderSuccessId}
Service: ${selectedServiceForOrder.title}
Package Tier: ${selectedTierName}
Quoted Price: ${displayPrice} ${displayPeriod}

PAYMENT DETAILS:
Payment Method: ${orderSuccessDetails?.methodName}
Payment Status: ${orderSuccessDetails?.status}
Transaction ID / Ref: ${orderSuccessDetails?.tid || 'N/A'}
Notes: ${paymentProofNotes || 'None'}

CLIENT INFORMATION:
Client Name: ${clientName}
Client Email: ${clientEmail}
Client Phone: ${clientPhone || 'N/A'}
Client Website: ${clientWebsite}

PROJECT SCOPE & GOALS:
Target Focus Keywords: ${targetKeywords || 'N/A'}
Client Notes / Requirements: ${notes || 'N/A'}

Recorded into Firebase Firestore Database.
Admin Recipient: ${adminNotificationEmail}
------------------------------------------`
    );

    window.open(`mailto:${adminNotificationEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleClose = () => {
    setOrderSuccessId(null);
    setOrderSuccessDetails(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientWebsite('');
    setTargetKeywords('');
    setNotes('');
    setTransactionId('');
    setPaymentProofNotes('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    closeOrderModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b text-white shrink-0"
          style={{ backgroundColor: theme.secondaryColor || '#0f172a' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <DynamicIcon name={selectedServiceForOrder.icon || 'Shield'} className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Secure SEO Checkout & Intake
              </span>
              <h3 className="text-base font-bold leading-tight truncate max-w-xs sm:max-w-md">
                {selectedServiceForOrder.title}
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close Order Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {orderSuccessId ? (
          /* Success Receipt View */
          <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900">
                {orderSuccessDetails?.status === 'paid'
                  ? 'Payment Verified & Order Confirmed!'
                  : 'Order Placed & Payment Intake Logged!'}
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your order has been recorded into the live{' '}
                <strong className="text-slate-800">Firebase Firestore</strong> database and our SEO team has been notified.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs space-y-2.5 max-w-lg mx-auto">
              <div className="flex justify-between pb-2 border-b border-slate-200 text-slate-500">
                <span>Order Reference:</span>
                <span className="font-mono font-bold text-slate-900 select-all">{orderSuccessId}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Package:</span>
                <span className="font-semibold text-slate-900">
                  {selectedServiceForOrder.title} ({selectedTierName})
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Quoted:</span>
                <span className="font-extrabold text-blue-600 text-sm">
                  {displayPrice} {displayPeriod}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Gateway:</span>
                <span className="font-semibold text-slate-800">
                  {orderSuccessDetails?.methodName}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 items-center">
                <span>Payment Status:</span>
                {orderSuccessDetails?.status === 'paid' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Paid & Verified</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Pending Verification</span>
                  </span>
                )}
              </div>
              {orderSuccessDetails?.tid && (
                <div className="flex justify-between text-slate-600 font-mono text-[11px] pt-1 border-t border-slate-200">
                  <span>Transaction ID:</span>
                  <span className="font-bold text-violet-700">{orderSuccessDetails.tid}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                <span>Target Website:</span>
                <span className="font-mono text-slate-800 truncate max-w-[200px]">
                  {clientWebsite}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Client Email:</span>
                <span className="font-medium text-slate-800">{clientEmail}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSendEmailNotification}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs text-white shadow-sm flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Mail className="w-4 h-4" />
                <span>Send Email Receipt ({adminNotificationEmail})</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                Done & Return to Site
              </button>
            </div>
          </div>
        ) : (
          /* Order Placement Form with Payment Selection */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto">
            {/* 1. Package Tier Selector */}
            {selectedServiceForOrder.tiers && selectedServiceForOrder.tiers.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Select Package Tier & Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedServiceForOrder.tiers.map((tier) => {
                    const isSelected = selectedTierName === tier.name;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierName(tier.name)}
                        className={`p-3 rounded-xl border cursor-pointer transition relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600/30'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        {tier.popular && (
                          <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-600 text-white shadow-xs">
                            Popular
                          </span>
                        )}
                        <div>
                          <div className="font-bold text-xs text-slate-900 leading-tight">
                            {tier.name}
                          </div>
                          <div className="text-sm font-extrabold text-blue-600 mt-0.5">
                            {tier.price}{' '}
                            <span className="text-[10px] font-normal text-slate-500">
                              {tier.period}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            {tier.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Current Selected Deliverables Preview */}
            {currentTier && currentTier.deliverables && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Included Deliverables:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                  {currentTier.deliverables.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Client Input Information */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>2. Client & Website Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Website URL to Optimize <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      required
                      value={clientWebsite}
                      onChange={(e) => setClientWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Target Search Keywords & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Target Search Keywords / Competitors
                  </label>
                  <div className="relative">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={targetKeywords}
                      onChange={(e) => setTargetKeywords(e.target.value)}
                      placeholder="e.g. ecommerce seo, local dental keywords"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Specific Technical Instructions
                  </label>
                  <div className="relative">
                    <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Migration from WordPress to Next.js"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selection & Instructions */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-violet-600" />
                  <span>3. Select Payment Method</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  {activeMethods.length} payment options available
                </span>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {activeMethods.map((method) => {
                  const isSelected = selectedPaymentMethodId === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPaymentMethodId(method.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition relative flex flex-col justify-between text-left ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50/70 shadow-xs ring-1 ring-violet-600/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {method.badge && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-violet-600 text-white shadow-xs">
                          {method.badge}
                        </span>
                      )}

                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {renderPaymentIcon(method.icon, 'w-3.5 h-3.5')}
                        </div>
                        <span className="font-bold text-xs text-slate-900 leading-tight">
                          {method.name}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 line-clamp-2">
                        {method.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Selected Payment Method Details & Instructions Box */}
              {selectedMethod && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      {renderPaymentIcon(selectedMethod.icon, 'w-3.5 h-3.5 text-violet-600')}
                      <span>Payment Instructions: {selectedMethod.name}</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                      Direct Agency Checkout
                    </span>
                  </div>

                  {/* Bank Wire Details */}
                  {(selectedMethod.code === 'bank' || selectedMethod.id === 'bank_transfer') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-lg border border-slate-200">
                      {selectedMethod.bankName && (
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">
                            Bank Name:
                          </span>
                          <strong className="text-slate-800">{selectedMethod.bankName}</strong>
                        </div>
                      )}
                      {selectedMethod.accountTitle && (
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">
                            Account Title / Beneficiary:
                          </span>
                          <strong className="text-slate-800">{selectedMethod.accountTitle}</strong>
                        </div>
                      )}
                      {selectedMethod.accountNumber && (
                        <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded border border-slate-200 sm:col-span-2">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">
                              Account / IBAN Number:
                            </span>
                            <code className="font-mono text-xs font-bold text-violet-700">
                              {selectedMethod.accountNumber}
                            </code>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(selectedMethod.accountNumber!, 'bank-account')
                            }
                            className="px-2 py-1 text-[10px] font-semibold rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                          >
                            {copiedField === 'bank-account' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      {selectedMethod.ibanOrSwift && (
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">
                            SWIFT / Branch Code:
                          </span>
                          <code className="font-mono font-bold text-slate-800">
                            {selectedMethod.ibanOrSwift}
                          </code>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Credit Card / Stripe simulation fields */}
                  {(selectedMethod.code === 'card' || selectedMethod.id === 'stripe_card') && (
                    <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Credit / Debit Card Details
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="4242 •••• •••• 4242"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 font-mono"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-1/2 px-2 py-1.5 text-xs rounded border border-slate-300 text-center font-mono"
                          />
                          <input
                            type="password"
                            placeholder="CVC"
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-1/2 px-2 py-1.5 text-xs rounded border border-slate-300 text-center font-mono"
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Instant 256-bit encrypted card processing.</span>
                      </span>
                    </div>
                  )}

                  {/* PayPal Email / Link */}
                  {(selectedMethod.code === 'paypal' || selectedMethod.id === 'paypal') && (
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                          Agency PayPal Recipient:
                        </span>
                        <strong className="text-slate-800 font-mono">
                          {selectedMethod.paypalEmailOrLink || 'payments@agency.com'}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            selectedMethod.paypalEmailOrLink || 'payments@agency.com',
                            'paypal-email'
                          )
                        }
                        className="px-2 py-1 text-[10px] font-semibold rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                      >
                        {copiedField === 'paypal-email' ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy Email</span>
                      </button>
                    </div>
                  )}

                  {/* Mobile Wallet (JazzCash / EasyPaisa) */}
                  {(selectedMethod.code === 'wallet' ||
                    selectedMethod.id === 'easypaisa_jazzcash') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                          Provider:
                        </span>
                        <strong className="text-slate-800">
                          {selectedMethod.walletProvider || 'JazzCash / EasyPaisa'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                          Account Title:
                        </span>
                        <strong className="text-slate-800">{selectedMethod.accountTitle}</strong>
                      </div>
                      {selectedMethod.walletNumber && (
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200 sm:col-span-2">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">
                              Mobile Number / Till ID:
                            </span>
                            <code className="font-mono text-xs font-bold text-violet-700">
                              {selectedMethod.walletNumber}
                            </code>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(selectedMethod.walletNumber!, 'wallet-num')
                            }
                            className="px-2 py-1 text-[10px] font-semibold rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                          >
                            {copiedField === 'wallet-num' ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Copy Number</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Crypto USDT Deposit */}
                  {(selectedMethod.code === 'crypto' || selectedMethod.id === 'crypto_usdt') && (
                    <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">
                          Protocol:
                        </span>
                        <span className="font-bold text-violet-700">
                          {selectedMethod.cryptoNetwork || 'USDT (TRC-20)'}
                        </span>
                      </div>
                      {selectedMethod.cryptoAddress && (
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                          <div className="truncate pr-2">
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">
                              Deposit Address:
                            </span>
                            <code className="font-mono text-[11px] font-bold text-slate-800 truncate block">
                              {selectedMethod.cryptoAddress}
                            </code>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(selectedMethod.cryptoAddress!, 'crypto-addr')
                            }
                            className="shrink-0 px-2 py-1 text-[10px] font-semibold rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                          >
                            {copiedField === 'crypto-addr' ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Copy</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Custom method account fields */}
                  {selectedMethod.code === 'custom' && selectedMethod.accountNumber && (
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                          Account / ID:
                        </span>
                        <strong className="text-slate-800 font-mono">
                          {selectedMethod.accountNumber}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(selectedMethod.accountNumber!, 'custom-account')
                        }
                        className="px-2 py-1 text-[10px] font-semibold rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                      >
                        {copiedField === 'custom-account' ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy</span>
                      </button>
                    </div>
                  )}

                  {/* Method Instructions Text */}
                  {selectedMethod.instructions && (
                    <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                      {selectedMethod.instructions}
                    </p>
                  )}

                  {/* Transaction ID / Receipt Proof input */}
                  {(selectedMethod.requiresTransactionId ||
                    paymentConfig?.allowClientTransactionProof) && (
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-800 mb-1">
                            Transaction / Reference ID (TID){' '}
                            {selectedMethod.requiresTransactionId && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <input
                            type="text"
                            required={selectedMethod.requiresTransactionId}
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="e.g. TID-9082347 or Bank Wire Ref"
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 font-mono bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Sender Name / Account Notes (Optional)
                          </label>
                          <input
                            type="text"
                            value={paymentProofNotes}
                            onChange={(e) => setPaymentProofNotes(e.target.value)}
                            placeholder="e.g. Transferred from Chase Business"
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Our billing department will match this transaction reference to approve your intake sprint instantly.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Price & Submit */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs">
                  Investment Total:{' '}
                  <strong className="text-slate-900 text-sm">
                    {displayPrice} {displayPeriod}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-1/2 sm:w-auto px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {isSubmitting ? (
                    <span>Submitting Order...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm & Place SEO Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
