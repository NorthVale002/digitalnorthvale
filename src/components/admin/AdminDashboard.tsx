import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { THEME_PRESETS } from '../../data/defaultConfig';
import { SectionBlock, SectionType, BlogPost, PageItem, NavigationItem } from '../../types';
import { DynamicIcon, AVAILABLE_ICONS } from '../common/DynamicIcon';
import {
  X,
  Layout,
  Palette,
  FileText,
  PenTool,
  Sliders,
  Maximize2,
  Minimize2,
  Check,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  ExternalLink,
  Edit3,
  RotateCcw,
  Download,
  Upload,
  Layers,
  ArrowRight,
  Shield,
  Zap,
  Search,
  Briefcase,
  Inbox,
  CreditCard,
} from 'lucide-react';
import { SeoTab } from './SeoTab';
import { ServicesTab } from './ServicesTab';
import { OrdersTab } from './OrdersTab';
import { PaymentsTab } from './PaymentsTab';

export const AdminDashboard: React.FC = () => {
  const {
    config,
    updateHeader,
    updateFooter,
    updateTheme,
    applyThemePreset,
    updateSection,
    reorderSections,
    toggleSectionVisibility,
    deleteSection,
    addSection,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addPage,
    updatePage,
    deletePage,
    isAdminOpen,
    setIsAdminOpen,
    adminTab,
    setAdminTab,
    setActiveView,
    resetToDefaults,
    exportConfigJson,
    importConfigJson,
    pendingOrdersCount,
  } = useCms();

  // Section editing state
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // Blog editing state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postForm, setPostForm] = useState<Partial<BlogPost>>({
    title: '',
    category: 'Design',
    excerpt: '',
    content: '',
    author: 'Admin',
    authorRole: 'Editor',
    date: 'March 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
    published: true,
  });

  // Page editing state
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [pageForm, setPageForm] = useState<Partial<PageItem>>({
    title: '',
    slug: '',
    subtitle: '',
    content: '',
    showInNav: true,
    published: true,
  });

  // JSON Import Modal
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isAdminOpen) return null;

  /* Helper to close modal */
  const handleClose = () => {
    setIsAdminOpen(false);
  };

  /* Save blog post */
  const handleSaveBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title?.trim()) return;

    if (isCreatingPost) {
      addBlogPost(postForm as any);
      setIsCreatingPost(false);
    } else if (editingPostId) {
      updateBlogPost(editingPostId, postForm);
      setEditingPostId(null);
    }
  };

  /* Save custom page */
  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.title?.trim()) return;

    const slug = (pageForm.slug || pageForm.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (isCreatingPage) {
      addPage({
        title: pageForm.title,
        slug,
        subtitle: pageForm.subtitle || '',
        content: pageForm.content || 'Start adding your custom page content here.',
        showInNav: !!pageForm.showInNav,
        published: pageForm.published !== false,
        lastUpdated: 'Today',
      });
      setIsCreatingPage(false);
    } else if (editingPageId) {
      updatePage(editingPageId, {
        ...pageForm,
        slug,
        lastUpdated: 'Today',
      });
      setEditingPageId(null);
    }
  };

  /* Navigation Item helpers */
  const handleAddNavItem = () => {
    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      link: '/',
    };
    updateHeader({
      navItems: [...config.header.navItems, newItem],
    });
  };

  const handleUpdateNavItem = (id: string, patch: Partial<NavigationItem>) => {
    updateHeader({
      navItems: config.header.navItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    });
  };

  const handleDeleteNavItem = (id: string) => {
    updateHeader({
      navItems: config.header.navItems.filter((item) => item.id !== id),
    });
  };

  /* JSON Backup helpers */
  const handleExport = () => {
    const data = exportConfigJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cms-site-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const success = importConfigJson(jsonInput);
    if (success) {
      setImportStatus('Site configuration imported successfully!');
      setTimeout(() => {
        setShowJsonModal(false);
        setImportStatus(null);
        setJsonInput('');
      }, 1200);
    } else {
      setImportStatus('Invalid JSON configuration. Please check format.');
    }
  };

  return (
    <div
      id="cms-admin-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div
        id="cms-admin-dashboard"
        className="bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              W
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">CMS Site Studio & Admin</h2>
              <p className="text-xs text-slate-400">Full control over Header, Content Blocks, Footer & Styling</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
              title="Download backup JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            <button
              onClick={() => setShowJsonModal(true)}
              className="text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
              title="Import configuration JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restore</span>
            </button>

            <button
              id="cms-admin-close-btn"
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition ml-2"
              aria-label="Close Admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center space-x-1 overflow-x-auto text-xs font-semibold py-2">
          <button
            onClick={() => setAdminTab('header')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              adminTab === 'header'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>1. Header & Nav</span>
          </button>

          <button
            onClick={() => setAdminTab('sections')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              adminTab === 'sections'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. Home Blocks ({config.sections.length})</span>
          </button>

          <button
            id="cms-admin-tab-services-btn"
            onClick={() => setAdminTab('services')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              adminTab === 'services'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>3. SEO Services ({config.services?.length || 0})</span>
          </button>

          <button
            id="cms-admin-tab-payments-btn"
            onClick={() => setAdminTab('payments')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              adminTab === 'payments'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-violet-500" />
            <span>
              4. Payment Gateways (
              {(config.payment?.methods || []).filter((m) => m.enabled).length} active)
            </span>
          </button>

          <button
            id="cms-admin-tab-orders-btn"
            onClick={() => setAdminTab('orders')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap relative cursor-pointer ${
              adminTab === 'orders'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>5. Firebase Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 ml-0.5">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('theme')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              adminTab === 'theme'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>6. Theme & Colors</span>
          </button>

          <button
            onClick={() => setAdminTab('pages')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              adminTab === 'pages'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>7. Custom Pages ({config.pages.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('blog')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              adminTab === 'blog'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>8. Blog / Journal ({config.posts.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('footer')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              adminTab === 'footer'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>9. Footer Area</span>
          </button>

          <button
            id="cms-admin-tab-seo-btn"
            onClick={() => setAdminTab('seo')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
              adminTab === 'seo'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>10. Every-Page SEO</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* ======================= TAB 1: HEADER & NAVIGATION ======================= */}
          {adminTab === 'header' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Header Configuration</h3>
                <p className="text-xs text-slate-500">
                  Control site title, tagline, logo display, announcement banner, and top menu links.
                </p>
              </div>

              {/* Site Identity */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Site Identity & Logo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Site Title</label>
                    <input
                      type="text"
                      value={config.header.siteTitle}
                      onChange={(e) => updateHeader({ siteTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      placeholder="My Website"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={config.header.tagline}
                      onChange={(e) => updateHeader({ tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      placeholder="Design & Publishing"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Logo Style</label>
                    <select
                      value={config.header.logoType}
                      onChange={(e) => updateHeader({ logoType: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="text">Clean Text Only</option>
                      <option value="icon">Icon + Text</option>
                      <option value="image">Custom Image URL</option>
                    </select>
                  </div>

                  {config.header.logoType === 'icon' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Select Icon</label>
                      <div className="flex items-center gap-2">
                        <select
                          value={config.header.logoIcon}
                          onChange={(e) => updateHeader({ logoIcon: e.target.value })}
                          className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          {AVAILABLE_ICONS.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                        <div className="p-2 rounded bg-blue-50 border border-blue-200 text-blue-600">
                          <DynamicIcon name={config.header.logoIcon} className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  )}

                  {config.header.logoType === 'image' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Logo Image URL</label>
                      <input
                        type="text"
                        value={config.header.logoUrl || ''}
                        onChange={(e) => updateHeader({ logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 pt-3 border-t border-slate-200">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.header.isSticky}
                      onChange={(e) => updateHeader({ isSticky: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Make Header Sticky on Scroll</span>
                  </label>
                </div>
              </div>

              {/* Top Announcement Bar */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Top Announcement Strip
                  </h4>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.header.showAnnouncement}
                      onChange={(e) => updateHeader({ showAnnouncement: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Show Announcement</span>
                  </label>
                </div>

                {config.header.showAnnouncement && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Text</label>
                      <input
                        type="text"
                        value={config.header.announcementText}
                        onChange={(e) => updateHeader({ announcementText: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        placeholder="Special update or notice here..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Link Destination</label>
                      <input
                        type="text"
                        value={config.header.announcementLink}
                        onChange={(e) => updateHeader({ announcementLink: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        placeholder="/blog or /contact"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Menu Items */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Header Navigation Menu
                    </h4>
                    <p className="text-xs text-slate-500">Add, rename, or redirect top navigation links.</p>
                  </div>
                  <button
                    onClick={handleAddNavItem}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg flex items-center gap-1.5 shadow-xs hover:bg-blue-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {config.header.navItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-3"
                    >
                      <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                      <div className="flex-1 w-full sm:w-auto">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => handleUpdateNavItem(item.id, { label: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300"
                          placeholder="Menu Label (e.g. Home)"
                        />
                      </div>
                      <div className="flex-1 w-full sm:w-auto">
                        <input
                          type="text"
                          value={item.link}
                          onChange={(e) => handleUpdateNavItem(item.id, { link: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 font-mono"
                          placeholder="Link (/about, /blog, etc.)"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteNavItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete Link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button in Header */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Header Call to Action Button
                  </h4>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.header.ctaButton.show}
                      onChange={(e) =>
                        updateHeader({
                          ctaButton: { ...config.header.ctaButton, show: e.target.checked },
                        })
                      }
                      className="rounded text-blue-600"
                    />
                    <span>Enable Button</span>
                  </label>
                </div>

                {config.header.ctaButton.show && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={config.header.ctaButton.text}
                        onChange={(e) =>
                          updateHeader({
                            ctaButton: { ...config.header.ctaButton, text: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Button Target Link</label>
                      <input
                        type="text"
                        value={config.header.ctaButton.link}
                        onChange={(e) =>
                          updateHeader({
                            ctaButton: { ...config.header.ctaButton, link: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================= TAB 2: CONTENT BLOCKS ======================= */}
          {adminTab === 'sections' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Home Page Content Blocks</h3>
                  <p className="text-xs text-slate-500">
                    Reorder, toggle visibility, customize content, or add new sections to your home page.
                  </p>
                </div>

                {/* Add New Section dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    id="cms-add-section-select"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addSection(e.target.value as SectionType);
                        e.target.value = '';
                      }
                    }}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white cursor-pointer shadow-xs"
                  >
                    <option value="" disabled>
                      + Add New Section...
                    </option>
                    <option value="hero">Hero Header Banner</option>
                    <option value="features">Features / Services Grid</option>
                    <option value="contentStory">Story / About Block</option>
                    <option value="blogGrid">Blog / Journal Feed</option>
                    <option value="testimonials">Client Testimonials</option>
                    <option value="cta">Call to Action Strip</option>
                    <option value="faq">FAQ Accordion</option>
                    <option value="customRichText">Custom Rich Text Block</option>
                  </select>
                </div>
              </div>

              {/* Sections List */}
              <div className="space-y-3">
                {config.sections.map((section, index) => {
                  const isEditing = editingSectionId === section.id;

                  return (
                    <div
                      key={section.id}
                      className={`rounded-xl border transition-all ${
                        isEditing
                          ? 'border-blue-500 ring-2 ring-blue-100 bg-white shadow-md'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
                      }`}
                    >
                      {/* Section Item Row */}
                      <div className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          {/* Reorder arrows */}
                          <div className="flex flex-col space-y-0.5">
                            <button
                              disabled={index === 0}
                              onClick={() => reorderSections(index, index - 1)}
                              className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-25 hover:bg-slate-200"
                              title="Move up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={index === config.sections.length - 1}
                              onClick={() => reorderSections(index, index + 1)}
                              className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-25 hover:bg-slate-200"
                              title="Move down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Badge & Title */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase font-semibold">
                                {section.type}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900">{section.title}</h4>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {section.isVisible ? (
                                <span className="text-emerald-600 font-medium">● Visible on Home Page</span>
                              ) : (
                                <span className="text-slate-400">○ Hidden from visitors</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Actions: Toggle Visibility, Edit, Delete */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleSectionVisibility(section.id)}
                            className={`p-2 rounded-lg text-xs transition ${
                              section.isVisible
                                ? 'text-slate-600 hover:bg-slate-200'
                                : 'text-slate-400 bg-slate-200/50'
                            }`}
                            title={section.isVisible ? 'Hide Section' : 'Show Section'}
                          >
                            {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => setEditingSectionId(isEditing ? null : section.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              isEditing
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{isEditing ? 'Done' : 'Edit Content'}</span>
                          </button>

                          <button
                            onClick={() => deleteSection(section.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Section Editor Panel */}
                      {isEditing && (
                        <div className="p-5 border-t border-slate-200 bg-slate-50/50 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Section Admin Label
                              </label>
                              <input
                                type="text"
                                value={section.title}
                                onChange={(e) =>
                                  updateSection(section.id, {
                                    // updates root section.title
                                  })
                                }
                                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                              />
                            </div>
                          </div>

                          {/* Specific Fields per Section Type */}
                          {section.type === 'hero' && (
                            <div className="space-y-3 pt-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Badge</label>
                                  <input
                                    type="text"
                                    value={section.data.badge || ''}
                                    onChange={(e) => updateSection(section.id, { badge: e.target.value })}
                                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Layout</label>
                                  <select
                                    value={section.data.alignment || 'split'}
                                    onChange={(e) => updateSection(section.id, { alignment: e.target.value })}
                                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                  >
                                    <option value="split">Split (Text + Image Side-by-Side)</option>
                                    <option value="center">Centered Headline</option>
                                    <option value="left">Left Aligned</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                                <input
                                  type="text"
                                  value={section.data.headline || ''}
                                  onChange={(e) => updateSection(section.id, { headline: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Subheadline</label>
                                <textarea
                                  rows={2}
                                  value={section.data.subheadline || ''}
                                  onChange={(e) => updateSection(section.id, { subheadline: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Primary Button Text
                                  </label>
                                  <input
                                    type="text"
                                    value={section.data.primaryBtnText || ''}
                                    onChange={(e) => updateSection(section.id, { primaryBtnText: e.target.value })}
                                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Primary Button Link
                                  </label>
                                  <input
                                    type="text"
                                    value={section.data.primaryBtnLink || ''}
                                    onChange={(e) => updateSection(section.id, { primaryBtnLink: e.target.value })}
                                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Image URL</label>
                                <input
                                  type="text"
                                  value={section.data.imageUrl || ''}
                                  onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>
                            </div>
                          )}

                          {section.type === 'features' && (
                            <div className="space-y-3 pt-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section Subtitle</label>
                                  <input
                                    type="text"
                                    value={section.data.sectionSubtitle || ''}
                                    onChange={(e) => updateSection(section.id, { sectionSubtitle: e.target.value })}
                                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section Title</label>
                                  <input
                                    type="text"
                                    value={section.data.sectionTitle || ''}
                                    onChange={(e) => updateSection(section.id, { sectionTitle: e.target.value })}
                                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                                <textarea
                                  rows={2}
                                  value={section.data.sectionDescription || ''}
                                  onChange={(e) => updateSection(section.id, { sectionDescription: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>
                            </div>
                          )}

                          {section.type === 'contentStory' && (
                            <div className="space-y-3 pt-2">
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Story Title</label>
                                <input
                                  type="text"
                                  value={section.data.title || ''}
                                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Paragraph</label>
                                <textarea
                                  rows={2}
                                  value={section.data.paragraph1 || ''}
                                  onChange={(e) => updateSection(section.id, { paragraph1: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                                <input
                                  type="text"
                                  value={section.data.imageUrl || ''}
                                  onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>
                            </div>
                          )}

                          {section.type === 'cta' && (
                            <div className="space-y-3 pt-2">
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                                <input
                                  type="text"
                                  value={section.data.headline || ''}
                                  onChange={(e) => updateSection(section.id, { headline: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                                <textarea
                                  rows={2}
                                  value={section.data.description || ''}
                                  onChange={(e) => updateSection(section.id, { description: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Button Text</label>
                                  <input
                                    type="text"
                                    value={section.data.buttonText || ''}
                                    onChange={(e) => updateSection(section.id, { buttonText: e.target.value })}
                                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Button Link</label>
                                  <input
                                    type="text"
                                    value={section.data.buttonLink || ''}
                                    onChange={(e) => updateSection(section.id, { buttonLink: e.target.value })}
                                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {section.type === 'customRichText' && (
                            <div className="space-y-3 pt-2">
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Section Title</label>
                                <input
                                  type="text"
                                  value={section.data.title || ''}
                                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Content Body</label>
                                <textarea
                                  rows={5}
                                  value={section.data.htmlContent || ''}
                                  onChange={(e) => updateSection(section.id, { htmlContent: e.target.value })}
                                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white font-mono"
                                  placeholder="Type any custom text or paragraphs here..."
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= TAB 3: THEME & STYLING ======================= */}
          {adminTab === 'theme' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">WordPress-Style Theme Customizer</h3>
                <p className="text-xs text-slate-500">
                  Switch curated presets or fine-tune color palettes, typography, and container roundings.
                </p>
              </div>

              {/* Theme Presets */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Preset Theme Styles</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                    const isSelected = config.theme.presetName === preset.presetName;
                    return (
                      <button
                        key={key}
                        onClick={() => applyThemePreset(key)}
                        className={`p-4 rounded-xl border text-left transition relative cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-100 bg-white shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                        <h5 className="font-bold text-xs text-slate-900 mb-1">{preset.presetName}</h5>
                        {/* Swatches */}
                        <div className="flex items-center space-x-1.5 my-2">
                          <span
                            className="w-5 h-5 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.primaryColor }}
                            title="Primary Brand"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.backgroundColor }}
                            title="Background"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.textColor }}
                            title="Text Color"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10"
                            style={{ backgroundColor: preset.accentColor }}
                            title="Accent"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 capitalize">
                          {preset.fontFamily} • {preset.borderRadius} radius
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Custom Colors</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.theme.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Page Canvas Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.theme.backgroundColor}
                        onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.backgroundColor}
                        onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                        className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Surface / Card Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.theme.surfaceColor}
                        onChange={(e) => updateTheme({ surfaceColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.surfaceColor}
                        onChange={(e) => updateTheme({ surfaceColor: e.target.value })}
                        className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Main Heading & Body Text
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.theme.textColor}
                        onChange={(e) => updateTheme({ textColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.textColor}
                        onChange={(e) => updateTheme({ textColor: e.target.value })}
                        className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Muted Subtitle Text
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.theme.textMutedColor}
                        onChange={(e) => updateTheme({ textMutedColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.textMutedColor}
                        onChange={(e) => updateTheme({ textMutedColor: e.target.value })}
                        className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Border Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.theme.borderColor}
                        onChange={(e) => updateTheme({ borderColor: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.borderColor}
                        onChange={(e) => updateTheme({ borderColor: e.target.value })}
                        className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography & Geometry */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Typography & Geometry</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Font Family Style</label>
                    <select
                      value={config.theme.fontFamily}
                      onChange={(e) => updateTheme({ fontFamily: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="sans">Modern Geometric Sans (Clean, Legible)</option>
                      <option value="serif">Classical Editorial Serif (Elegant, Bookish)</option>
                      <option value="mono">Technical Minimalist Mono</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Button & Card Border Radius
                    </label>
                    <select
                      value={config.theme.borderRadius}
                      onChange={(e) => updateTheme({ borderRadius: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="none">Sharp / Architectural (0px)</option>
                      <option value="sm">Subtle Rounded (4px)</option>
                      <option value="md">Refined Medium (8px)</option>
                      <option value="lg">Soft Rounded (16px)</option>
                      <option value="full">Pill Buttons (Full)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 4: CUSTOM PAGES ======================= */}
          {adminTab === 'pages' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Page Manager</h3>
                  <p className="text-xs text-slate-500">
                    "Page mae khud se banau ga jo bhi ho xyz" — Create, edit, and publish any custom pages.
                  </p>
                </div>

                {!isCreatingPage && !editingPageId && (
                  <button
                    onClick={() => {
                      setPageForm({
                        title: '',
                        slug: '',
                        subtitle: '',
                        content: '',
                        showInNav: true,
                        published: true,
                      });
                      setIsCreatingPage(true);
                    }}
                    className="px-3.5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg flex items-center gap-1.5 shadow-xs hover:bg-blue-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Page (xyz)</span>
                  </button>
                )}
              </div>

              {/* Create or Edit Page Form */}
              {(isCreatingPage || editingPageId) && (
                <form
                  onSubmit={handleSavePage}
                  className="bg-slate-50 p-6 rounded-xl border border-blue-200 ring-2 ring-blue-50 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      {isCreatingPage ? 'Create New Page' : 'Edit Page'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingPage(false);
                        setEditingPageId(null);
                      }}
                      className="text-slate-400 hover:text-slate-700 text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Page Title (e.g. "Services", "About", "XYZ")
                      </label>
                      <input
                        type="text"
                        required
                        value={pageForm.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPageForm({
                            ...pageForm,
                            title: val,
                            slug: pageForm.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                          });
                        }}
                        placeholder="XYZ Project"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        URL Slug (e.g. /xyz)
                      </label>
                      <div className="flex items-center">
                        <span className="px-2.5 py-2 text-xs bg-slate-200 text-slate-600 rounded-l-lg border border-r-0 border-slate-300">
                          /
                        </span>
                        <input
                          type="text"
                          required
                          value={pageForm.slug}
                          onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                          placeholder="xyz"
                          className="w-full px-3 py-2 text-xs rounded-r-lg border border-slate-300 bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subtitle / Summary</label>
                    <input
                      type="text"
                      value={pageForm.subtitle}
                      onChange={(e) => setPageForm({ ...pageForm, subtitle: e.target.value })}
                      placeholder="A short descriptive subheading for this page"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Page Content (Supports multiple paragraphs & ### headings)
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={pageForm.content}
                      onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                      placeholder="### Section Heading&#10;&#10;Write the narrative content for this page here...&#10;&#10;- Key point 1&#10;- Key point 2"
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pageForm.showInNav}
                        onChange={(e) => setPageForm({ ...pageForm, showInNav: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Automatically add this page to Top Header Navigation</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingPage(false);
                          setEditingPageId(null);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                      >
                        {isCreatingPage ? 'Publish Page' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Pages Table / Cards */}
              <div className="space-y-3">
                {config.pages.map((page) => (
                  <div
                    key={page.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{page.title}</h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          /{page.slug}
                        </span>
                        {page.showInNav && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                            In Menu
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{page.subtitle || page.content}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          setActiveView(`page:${page.slug}`);
                          setIsAdminOpen(false);
                        }}
                        className="px-2.5 py-1.5 text-xs rounded border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 flex items-center gap-1"
                        title="View Page on Site"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => {
                          setPageForm(page);
                          setEditingPageId(page.id);
                          setIsCreatingPage(false);
                        }}
                        className="px-2.5 py-1.5 text-xs rounded border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => deletePage(page.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= TAB 5: BLOG MANAGER ======================= */}
          {adminTab === 'blog' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Blog & Journal Manager</h3>
                  <p className="text-xs text-slate-500">
                    Publish articles, essays, and stories that appear in the Journal section.
                  </p>
                </div>

                {!isCreatingPost && !editingPostId && (
                  <button
                    onClick={() => {
                      setPostForm({
                        title: '',
                        category: 'Design',
                        excerpt: '',
                        content: '',
                        author: 'Admin',
                        authorRole: 'Author',
                        date: 'March 2026',
                        readTime: '4 min read',
                        coverImage:
                          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
                        published: true,
                      });
                      setIsCreatingPost(true);
                    }}
                    className="px-3.5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg flex items-center gap-1.5 shadow-xs hover:bg-blue-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Write New Article</span>
                  </button>
                )}
              </div>

              {/* Create or Edit Post Form */}
              {(isCreatingPost || editingPostId) && (
                <form
                  onSubmit={handleSaveBlogPost}
                  className="bg-slate-50 p-6 rounded-xl border border-blue-200 ring-2 ring-blue-50 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      {isCreatingPost ? 'New Article' : 'Edit Article'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingPost(false);
                        setEditingPostId(null);
                      }}
                      className="text-slate-400 hover:text-slate-700 text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Article Title</label>
                      <input
                        type="text"
                        required
                        value={postForm.title}
                        onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                        placeholder="e.g. Modern Design Principles"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={postForm.category}
                        onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                        placeholder="Design, Tech, News"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Author Name</label>
                      <input
                        type="text"
                        value={postForm.author}
                        onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Author Role</label>
                      <input
                        type="text"
                        value={postForm.authorRole}
                        onChange={(e) => setPostForm({ ...postForm, authorRole: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Read Time</label>
                      <input
                        type="text"
                        value={postForm.readTime}
                        onChange={(e) => setPostForm({ ...postForm, readTime: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
                    <input
                      type="text"
                      value={postForm.coverImage}
                      onChange={(e) => setPostForm({ ...postForm, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Short Excerpt</label>
                    <textarea
                      rows={2}
                      value={postForm.excerpt}
                      onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                      placeholder="A short summary of what the article is about..."
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Article Content</label>
                    <textarea
                      rows={8}
                      required
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      placeholder="### Subheading&#10;&#10;Write the body paragraphs here..."
                      className="w-full px-3.5 py-2.5 text-xs rounded border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postForm.published}
                        onChange={(e) => setPostForm({ ...postForm, published: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <span>Publish Immediately</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingPost(false);
                          setEditingPostId(null);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                      >
                        {isCreatingPost ? 'Publish Article' : 'Update Article'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Posts Table */}
              <div className="space-y-3">
                {config.posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {post.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{post.title}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          By {post.author} • {post.date} • {post.readTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          setActiveView(`post:${post.slug}`);
                          setIsAdminOpen(false);
                        }}
                        className="px-2.5 py-1.5 text-xs rounded border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => {
                          setPostForm(post);
                          setEditingPostId(post.id);
                          setIsCreatingPost(false);
                        }}
                        className="px-2.5 py-1.5 text-xs rounded border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => deleteBlogPost(post.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= TAB 6: FOOTER ======================= */}
          {adminTab === 'footer' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Footer Configuration</h3>
                <p className="text-xs text-slate-500">
                  Control the footer bio, newsletter subscription banner, column links, and copyright text.
                </p>
              </div>

              {/* Bio & Copyright */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Bio & Copyright</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Site Bio / Description</label>
                  <textarea
                    rows={2}
                    value={config.footer.siteBio}
                    onChange={(e) => updateFooter({ siteBio: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Copyright Notice</label>
                  <input
                    type="text"
                    value={config.footer.copyrightText}
                    onChange={(e) => updateFooter({ copyrightText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* Newsletter Banner */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Newsletter Subscription Strip
                  </h4>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.footer.showNewsletter}
                      onChange={(e) => updateFooter({ showNewsletter: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Show Newsletter Box</span>
                  </label>
                </div>

                {config.footer.showNewsletter && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Heading</label>
                      <input
                        type="text"
                        value={config.footer.newsletterHeading}
                        onChange={(e) => updateFooter({ newsletterHeading: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subtext</label>
                      <input
                        type="text"
                        value={config.footer.newsletterText}
                        onChange={(e) => updateFooter({ newsletterText: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Social Media Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Twitter / X URL</label>
                    <input
                      type="text"
                      value={config.footer.socialLinks.twitter || ''}
                      onChange={(e) =>
                        updateFooter({
                          socialLinks: { ...config.footer.socialLinks, twitter: e.target.value },
                        })
                      }
                      placeholder="https://x.com/..."
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={config.footer.socialLinks.linkedin || ''}
                      onChange={(e) =>
                        updateFooter({
                          socialLinks: { ...config.footer.socialLinks, linkedin: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/..."
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={config.footer.socialLinks.github || ''}
                      onChange={(e) =>
                        updateFooter({
                          socialLinks: { ...config.footer.socialLinks, github: e.target.value },
                        })
                      }
                      placeholder="https://github.com/..."
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={config.footer.socialLinks.instagram || ''}
                      onChange={(e) =>
                        updateFooter({
                          socialLinks: { ...config.footer.socialLinks, instagram: e.target.value },
                        })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                    <input
                      type="text"
                      value={config.footer.socialLinks.email || ''}
                      onChange={(e) =>
                        updateFooter({
                          socialLinks: { ...config.footer.socialLinks, email: e.target.value },
                        })
                      }
                      placeholder="hello@domain.com"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 3: SERVICES & PACKAGES ======================= */}
          {adminTab === 'services' && <ServicesTab />}

          {/* ======================= TAB 4: PAYMENT GATEWAYS CONTROL ======================= */}
          {adminTab === 'payments' && <PaymentsTab />}

          {/* ======================= TAB 5: FIREBASE CLIENT ORDERS ======================= */}
          {adminTab === 'orders' && <OrdersTab />}

          {/* ======================= TAB 9: EVERY-PAGE SEO & DISCOVERABILITY ======================= */}
          {adminTab === 'seo' && <SeoTab />}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="text-xs text-slate-600 font-medium">All changes autosaved to browser storage</span>
          </div>

          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
          >
            Done & Return to Site
          </button>
        </div>
      </div>

      {/* Restore / Import JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">Restore Site Configuration</h4>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Paste previously exported JSON configuration to restore your entire custom website setup:
            </p>
            <textarea
              rows={8}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON here..."
              className="w-full px-3 py-2 text-xs font-mono rounded border border-slate-300 bg-slate-50"
            />
            {importStatus && (
              <p
                className={`text-xs font-medium ${
                  importStatus.includes('success') ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {importStatus}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-3 py-1.5 text-xs rounded border text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-blue-600 text-white"
              >
                Apply Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
