import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { OrderRecord } from '../../types';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Trash2,
  Filter,
  Search,
  DollarSign,
  ShieldCheck,
  Send,
  Save,
  Tag,
  User,
  CreditCard,
  Building2,
  Wallet,
  Smartphone,
  Coins,
  Receipt,
  Copy,
  Check,
} from 'lucide-react';

export const OrdersTab: React.FC = () => {
  const {
    orders,
    pendingOrdersCount,
    updateOrderStatus,
    updateOrderPaymentStatus,
    deleteOrder,
    adminNotificationEmail,
    setAdminNotificationEmail,
  } = useCms();

  const [statusFilter, setStatusFilter] = useState<'all' | OrderRecord['status']>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending_verification' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailInput, setEmailInput] = useState(adminNotificationEmail);
  const [savedEmailNotice, setSavedEmailNotice] = useState(false);
  const [copiedTid, setCopiedTid] = useState<string | null>(null);

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setAdminNotificationEmail(emailInput.trim());
      setSavedEmailNotice(true);
      setTimeout(() => setSavedEmailNotice(false), 2500);
    }
  };

  const handleCopyTid = (tid: string) => {
    navigator.clipboard.writeText(tid);
    setCopiedTid(tid);
    setTimeout(() => setCopiedTid(null), 2000);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === 'all' || (order.paymentStatus || 'pending_verification') === paymentFilter;
    const matchesQuery =
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientWebsite.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.transactionId && order.transactionId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.paymentMethodName &&
        order.paymentMethodName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesPayment && matchesQuery;
  });

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Pending Intake</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>In Progress</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (pStatus?: OrderRecord['paymentStatus']) => {
    const status = pStatus || 'pending_verification';
    switch (status) {
      case 'paid':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Paid & Verified</span>
          </span>
        );
      case 'pending_verification':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Payment Verification Needed</span>
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Payment Failed</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
            <span>Refunded</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleEmailClient = (order: OrderRecord) => {
    const subject = encodeURIComponent(`Regarding Your SEO Order: ${order.serviceTitle}`);
    const body = encodeURIComponent(
      `Hi ${order.clientName},\n\nThank you for choosing our SEO agency for your website (${order.clientWebsite}). We have received your order for "${order.serviceTitle}" (${order.packageTier}).\n\nOur search team is reviewing your focus keywords and will follow up with your technical sprint schedule.\n\nBest regards,\nSEO Agency Lead`
    );
    window.open(`mailto:${order.clientEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleResendAgencyNotification = (order: OrderRecord) => {
    const subject = encodeURIComponent(
      `SEO Order Intake [${order.id}]: ${order.clientName} - ${order.serviceTitle}`
    );
    const body = encodeURIComponent(
      `AGENCY INTAKE NOTIFICATION\n============================\nOrder ID: ${order.id}\nDate: ${order.createdAt}\nStatus: ${order.status}\n\nCLIENT:\nName: ${order.clientName}\nEmail: ${order.clientEmail}\nPhone: ${order.clientPhone || 'N/A'}\nWebsite: ${order.clientWebsite}\n\nSERVICE & PRICING:\nService: ${order.serviceTitle}\nTier: ${order.packageTier}\nQuoted Price: ${order.price}\n\nREQUIREMENTS:\nKeywords: ${order.targetKeywords || 'N/A'}\nNotes: ${order.notes || 'N/A'}\n\nStored securely in Firebase Firestore.`
    );
    window.open(`mailto:${adminNotificationEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metrics */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>Firebase Firestore Orders & Leads</span>
                {pendingOrdersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 animate-pulse">
                    {pendingOrdersCount} New
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time collection of client SEO package bookings and inquiries.
              </p>
            </div>
          </div>

          {/* Target Notification Email Settings */}
          <form
            onSubmit={handleSaveEmail}
            className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 w-full md:w-auto"
          >
            <Mail className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Your email for notifications"
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-hidden px-2 py-1 font-mono w-full sm:w-56"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Email</span>
            </button>
          </form>
        </div>

        {savedEmailNotice && (
          <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Admin notification email updated to: {adminNotificationEmail}</span>
          </div>
        )}

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="text-2xl font-black text-white mt-0.5">{orders.length}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              Pending Review
            </span>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{pendingOrdersCount}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              In Progress
            </span>
            <div className="text-2xl font-black text-blue-400 mt-0.5">
              {orders.filter((o) => o.status === 'in_progress').length}
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Completed
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {orders.filter((o) => o.status === 'completed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client, service, TID, domain..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white"
          />
        </div>

        {/* Status and Payment Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Order Intake Status */}
          <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 p-1 rounded-xl">
            {(['all', 'pending', 'in_progress', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-1 bg-violet-50 border border-violet-200/60 p-1 rounded-xl">
            <button
              onClick={() => setPaymentFilter('all')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                paymentFilter === 'all'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-violet-700 hover:bg-violet-100/70'
              }`}
            >
              All Payments
            </button>
            <button
              onClick={() => setPaymentFilter('pending_verification')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                paymentFilter === 'pending_verification'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span>Verify Needed</span>
              <span className="px-1 py-0.2 rounded-full text-[9px] bg-amber-200 text-amber-950 font-bold">
                {
                  orders.filter(
                    (o) => (o.paymentStatus || 'pending_verification') === 'pending_verification'
                  ).length
                }
              </span>
            </button>
            <button
              onClick={() => setPaymentFilter('paid')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                paymentFilter === 'paid'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span>Paid</span>
              <span className="px-1 py-0.2 rounded-full text-[9px] bg-emerald-200 text-emerald-950 font-bold">
                {orders.filter((o) => o.paymentStatus === 'paid').length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Orders in this view</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When clients place orders via the website’s SEO Service packages, their requests will
            appear here instantly and sync directly with Firebase.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {order.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {order.clientName}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}

                  {/* Status Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as OrderRecord['status'])
                    }
                    className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => {
                      if (confirm(`Delete order record for ${order.clientName}?`)) {
                        deleteOrder(order.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete order"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Order Service & Pricing Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Service Package
                  </span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {order.serviceTitle}
                  </span>
                  <span className="text-slate-500 text-[11px]">{order.packageTier}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Agreed Investment
                  </span>
                  <span className="font-extrabold text-blue-600 text-sm block mt-0.5">
                    {order.price}
                  </span>
                  <span className="text-slate-400 text-[11px]">Quoted Rate</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Target Website
                  </span>
                  <a
                    href={order.clientWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-600 font-semibold hover:underline flex items-center gap-1 mt-0.5 truncate"
                  >
                    <Globe className="w-3 h-3 shrink-0" />
                    <span className="truncate">{order.clientWebsite}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Client Contact
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    <a
                      href={`mailto:${order.clientEmail}`}
                      className="text-slate-800 font-medium hover:text-blue-600 flex items-center gap-1 truncate"
                    >
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{order.clientEmail}</span>
                    </a>
                    {order.clientPhone && (
                      <span className="text-slate-600 flex items-center gap-1 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{order.clientPhone}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Status & Client Proof Verification Banner */}
              <div className="bg-violet-50/70 border border-violet-200/70 rounded-xl p-3.5 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-violet-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-violet-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Payment Method:
                    </span>
                    <span className="text-xs font-semibold text-violet-900 bg-violet-100 px-2.5 py-0.5 rounded-full border border-violet-200">
                      {order.paymentMethodName || order.paymentMethod || 'Direct Payment'}
                    </span>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>

                  {/* Payment Status Controls */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-500">
                      Change Payment Status:
                    </span>
                    <select
                      value={order.paymentStatus || 'pending_verification'}
                      onChange={(e) =>
                        updateOrderPaymentStatus(
                          order.id,
                          e.target.value as OrderRecord['paymentStatus']
                        )
                      }
                      className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-violet-300 bg-white text-slate-800 focus:outline-hidden"
                    >
                      <option value="pending_verification">Pending Verification</option>
                      <option value="paid">Paid & Verified</option>
                      <option value="failed">Failed / Declined</option>
                      <option value="refunded">Refunded</option>
                    </select>

                    {(order.paymentStatus || 'pending_verification') ===
                      'pending_verification' && (
                      <button
                        onClick={() => updateOrderPaymentStatus(order.id, 'paid')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center gap-1 transition cursor-pointer"
                        title="Confirm bank wire / transaction receipt and mark paid"
                      >
                        <Check className="w-3 h-3" />
                        <span>Verify & Mark Paid</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Client Transaction Proof & Reference */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700">
                  {order.transactionId ? (
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-mono text-[11px]">
                      <span className="text-slate-400 font-sans font-medium">TID / Ref:</span>
                      <strong className="text-violet-700 select-all">{order.transactionId}</strong>
                      <button
                        onClick={() => handleCopyTid(order.transactionId!)}
                        className="ml-1 text-slate-400 hover:text-slate-700"
                        title="Copy Transaction ID"
                      >
                        {copiedTid === order.transactionId ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">
                      No Transaction ID submitted yet
                    </span>
                  )}

                  {order.paymentProofNotes && (
                    <div className="text-[11px] text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <strong className="text-slate-700 font-medium">Client Proof Note:</strong>{' '}
                      {order.paymentProofNotes}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 ml-auto">
                    Amount Due: <strong className="text-slate-700">{order.price}</strong>
                  </span>
                </div>
              </div>

              {/* Keywords & Client Notes */}
              {(order.targetKeywords || order.notes) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  {order.targetKeywords && (
                    <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                        <Tag className="w-3 h-3 text-blue-500" />
                        <span>Target Keywords / Objectives</span>
                      </span>
                      <p className="text-slate-800 font-medium">{order.targetKeywords}</p>
                    </div>
                  )}

                  {order.notes && (
                    <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Special Notes from Client
                      </span>
                      <p className="text-slate-600 italic">{order.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-mono">ID: {order.id}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResendAgencyNotification(order)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                    title={`Send notification to ${adminNotificationEmail}`}
                  >
                    <Send className="w-3 h-3 text-blue-600" />
                    <span>Email Agency Dispatch</span>
                  </button>

                  <button
                    onClick={() => handleEmailClient(order)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Reply to Client</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
