import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Sliders,
  Plus,
  LayoutDashboard,
  Eye,
  Settings,
  FileText,
  PenTool,
  RotateCcw,
  Palette,
  ExternalLink,
  Search,
  Briefcase,
  Inbox,
  CreditCard,
  Cloud,
  CloudOff,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const AdminBar: React.FC = () => {
  const {
    config,
    setIsAdminOpen,
    setAdminTab,
    visitorMode,
    setVisitorMode,
    setActiveView,
    resetToDefaults,
    pendingOrdersCount,
    cloudSyncStatus,
    saveConfigToCloud,
    lastCloudSyncTime,
  } = useCms();

  const [newDropdownOpen, setNewDropdownOpen] = useState(false);
  const [syncingFeedback, setSyncingFeedback] = useState(false);

  const handleManualCloudSync = async () => {
    setSyncingFeedback(true);
    await saveConfigToCloud();
    setTimeout(() => {
      setSyncingFeedback(false);
    }, 1500);
  };

  if (visitorMode) {
    return (
      <button
        id="cms-restore-admin-bar-btn"
        onClick={() => setVisitorMode(false)}
        className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs font-medium px-3.5 py-2 rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 transition flex items-center gap-2"
        title="Restore Admin Bar"
      >
        <Settings className="w-3.5 h-3.5 text-blue-400" />
        <span>Admin Mode</span>
      </button>
    );
  }

  const handleOpenAdminTab = (
    tab:
      | 'header'
      | 'sections'
      | 'services'
      | 'payments'
      | 'orders'
      | 'theme'
      | 'pages'
      | 'blog'
      | 'footer'
      | 'seo'
  ) => {
    setAdminTab(tab);
    setIsAdminOpen(true);
    setNewDropdownOpen(false);
  };

  return (
    <header
      id="cms-admin-bar"
      aria-label="CMS Administration Bar"
      className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 sticky top-0 z-50 select-none shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
        {/* Left: Brand & Quick Shortcuts */}
        <div className="flex items-center space-x-1 sm:space-x-2.5">
          <button
            id="cms-admin-brand-btn"
            onClick={() => setActiveView('home')}
            className="flex items-center space-x-1.5 font-semibold text-white hover:text-blue-400 transition px-2 py-1 rounded cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span className="hidden sm:inline">CMS Studio:</span>
            <span className="truncate max-w-[120px] font-medium text-slate-300">
              {config.header.siteTitle}
            </span>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Quick Services */}
          <button
            id="cms-quick-services-btn"
            onClick={() => handleOpenAdminTab('services')}
            className="flex items-center space-x-1 hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition text-slate-300 cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Services ({config.services?.length || 0})</span>
          </button>

          {/* Quick Payment Gateways */}
          <button
            id="cms-quick-payments-btn"
            onClick={() => handleOpenAdminTab('payments')}
            className="flex items-center space-x-1 hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition text-slate-300 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden md:inline">Payments</span>
          </button>

          {/* Quick Orders with Badge */}
          <button
            id="cms-quick-orders-btn"
            onClick={() => handleOpenAdminTab('orders')}
            className="flex items-center space-x-1 hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition text-slate-300 relative cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          {/* Quick Customize */}
          <button
            id="cms-quick-customize-btn"
            onClick={() => handleOpenAdminTab('theme')}
            className="flex items-center space-x-1 hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition text-slate-300 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Theme</span>
          </button>

          {/* SEO Control */}
          <button
            id="cms-quick-seo-btn"
            onClick={() => handleOpenAdminTab('seo')}
            className="flex items-center space-x-1 hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition text-slate-300 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">SEO</span>
          </button>

          {/* "+ New" Dropdown */}
          <div className="relative">
            <button
              id="cms-new-dropdown-toggle"
              onClick={() => setNewDropdownOpen(!newDropdownOpen)}
              className="flex items-center space-x-1 hover:text-white hover:bg-slate-800 px-2 py-1 rounded transition text-slate-300 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>New</span>
            </button>

            {newDropdownOpen && (
              <div
                className="absolute left-0 mt-1.5 w-44 bg-slate-800 rounded-md shadow-xl border border-slate-700 py-1 z-50 text-slate-200"
                onMouseLeave={() => setNewDropdownOpen(false)}
              >
                <button
                  onClick={() => handleOpenAdminTab('services')}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-700 flex items-center gap-2 text-xs cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>SEO Service</span>
                </button>
                <button
                  onClick={() => handleOpenAdminTab('pages')}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-700 flex items-center gap-2 text-xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Custom Page</span>
                </button>
                <button
                  onClick={() => handleOpenAdminTab('blog')}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-700 flex items-center gap-2 text-xs cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Blog Post</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Cloud Sync, Dashboard button, Visitor Mode toggle */}
        <div className="flex items-center space-x-2">
          {/* Cloud Sync to Netlify / Firestore */}
          <button
            id="cms-cloud-sync-btn"
            onClick={handleManualCloudSync}
            disabled={syncingFeedback || cloudSyncStatus === 'saving'}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px] font-medium border border-slate-700/80 cursor-pointer disabled:opacity-60"
            title={
              lastCloudSyncTime
                ? `Last synced to cloud at ${lastCloudSyncTime}. Content is live across Netlify and all domains.`
                : 'Sync live website content to Cloud (Netlify & all domains)'
            }
          >
            {syncingFeedback || cloudSyncStatus === 'saving' ? (
              <>
                <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                <span className="text-amber-300">Syncing...</span>
              </>
            ) : cloudSyncStatus === 'synced' ? (
              <>
                <Cloud className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-300">Cloud Synced</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3 h-3 text-slate-400" />
                <span className="hidden sm:inline text-slate-300">Sync to Cloud</span>
              </>
            )}
          </button>

          <button
            id="cms-toggle-visitor-mode-btn"
            onClick={() => setVisitorMode(true)}
            className="hidden sm:flex items-center space-x-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2 py-1 rounded transition"
            title="Hide Admin Bar to see exact visitor view"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>Visitor View</span>
          </button>

          <button
            id="cms-open-admin-dashboard-btn"
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium px-2.5 py-1 rounded transition shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin Panel</span>
          </button>

          <button
            id="cms-reset-defaults-btn"
            onClick={resetToDefaults}
            className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-slate-800 transition"
            title="Reset to initial default template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
