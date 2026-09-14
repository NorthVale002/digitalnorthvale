import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ServiceItem, ServicePackageTier } from '../../types';
import { DynamicIcon, AVAILABLE_ICONS } from '../common/DynamicIcon';
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Sparkles,
  DollarSign,
  Tag,
  Clock,
  Layers,
  Search,
  ExternalLink,
} from 'lucide-react';

export const ServicesTab: React.FC = () => {
  const { config, addService, updateService, deleteService, reorderServices, setActiveView, setAdminTab } =
    useCms();
  const { services, theme } = config;

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    title: '',
    slug: '',
    shortDesc: '',
    fullDesc: '',
    icon: 'Shield',
    price: '$990',
    duration: 'month',
    badge: 'Popular',
    published: true,
    features: ['100% White-Hat Methodology', 'Technical Search Audit', 'Monthly Reporting'],
    tiers: [
      {
        id: 'tier-starter',
        name: 'Starter Tier',
        price: '$990',
        period: '/mo',
        description: 'Ideal for local businesses or emerging niche catalogs.',
        deliverables: ['10 Target Keywords', 'On-Page Optimization', 'Bi-weekly Reports'],
      },
      {
        id: 'tier-growth',
        name: 'Growth Tier',
        price: '$1,850',
        period: '/mo',
        description: 'For expanding companies seeking aggressive search visibility.',
        popular: true,
        deliverables: ['30 Target Keywords', '4 High DR Backlinks', 'Weekly Technical Reviews'],
      },
      {
        id: 'tier-enterprise',
        name: 'Enterprise Tier',
        price: '$3,400',
        period: '/mo',
        description: 'Full-funnel search dominance with dedicated engineering.',
        deliverables: ['100+ Keywords', 'Digital PR Campaigns', 'Dedicated Search Architect'],
      },
    ],
  });

  const [newFeatureInput, setNewFeatureInput] = useState('');

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingServiceId(null);
    setFormData({
      title: '',
      slug: '',
      shortDesc: '',
      fullDesc: '',
      icon: 'Shield',
      price: '$990',
      duration: 'month',
      badge: 'High Impact',
      published: true,
      features: ['Technical crawl assessment', 'Anchor text strategy', 'Dedicated monthly reporting'],
      tiers: [
        {
          id: 'tier-1',
          name: 'Starter Package',
          price: '$990',
          period: '/mo',
          description: 'Solid entry for standard ranking optimization.',
          deliverables: ['Core optimizations', 'Monthly report', 'Email support'],
        },
        {
          id: 'tier-2',
          name: 'Scale Package',
          price: '$1,950',
          period: '/mo',
          popular: true,
          description: 'Accelerated growth with white-hat outreach.',
          deliverables: ['High-impact backlinks', 'Weekly sprint updates', 'Conversion tuning'],
        },
      ],
    });
  };

  const handleStartEdit = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setIsCreating(false);
    setFormData({ ...service });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const slug = (formData.slug || formData.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (isCreating) {
      addService({
        title: formData.title,
        slug,
        shortDesc: formData.shortDesc || '',
        fullDesc: formData.fullDesc || formData.shortDesc || '',
        icon: formData.icon || 'Shield',
        price: formData.price || '$990',
        duration: formData.duration || 'month',
        badge: formData.badge,
        published: formData.published !== false,
        features: formData.features || [],
        tiers: formData.tiers || [],
        order: (services?.length || 0) + 1,
      });
      setIsCreating(false);
    } else if (editingServiceId) {
      updateService(editingServiceId, {
        ...formData,
        slug,
      });
      setEditingServiceId(null);
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), newFeatureInput.trim()],
    }));
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }));
  };

  const handleTierChange = (index: number, patch: Partial<ServicePackageTier>) => {
    setFormData((prev) => {
      const currentTiers = [...(prev.tiers || [])];
      currentTiers[index] = { ...currentTiers[index], ...patch };
      return { ...prev, tiers: currentTiers };
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200/80 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>SEO Services & Client Packages</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {services.length} Total
            </span>
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Manage your service catalog, pricing tiers, deliverables, and SEO keywords. Clients can
            order these packages directly, and their orders will be saved to your Firebase Firestore.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New SEO Service</span>
        </button>
      </div>

      {/* Editor Modal or Inline Panel */}
      {(isCreating || editingServiceId) && (
        <form
          onSubmit={handleSave}
          className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-xl space-y-5 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{isCreating ? 'Create New SEO Service' : `Editing: ${formData.title}`}</span>
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingServiceId(null);
              }}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Technical SEO & Core Web Vitals"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Slug (/service/your-slug)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="technical-seo-audit"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Quoted Price
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. $1,450"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration / Period
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. month, one-time project"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Most Popular, High ROI"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white"
              >
                {AVAILABLE_ICONS.map((iconName) => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Description (For Cards & Archives)
            </label>
            <textarea
              rows={2}
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              placeholder="Brief overview explaining what ranking benefit this service provides..."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Detailed Description (For Single Service Page)
            </label>
            <textarea
              rows={4}
              value={formData.fullDesc}
              onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
              placeholder="Explain the full methodology, sprint timelines, white-hat principles, and deliverables..."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          {/* Key Deliverables Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Key Deliverables Checklist
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.features?.map((feat, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-100 text-slate-700 border border-slate-200"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Add deliverable (e.g. 15 High DR Guest Posts)..."
                className="text-xs px-3 py-1.5 flex-1 rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-xs font-medium text-slate-700">
              Published on Website & Ready for Client Orders
            </span>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingServiceId(null);
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              {isCreating ? 'Create Service' : 'Save Service Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Services List Table / Cards */}
      <div className="space-y-3">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-xs transition"
          >
            <div className="flex items-center gap-3">
              {/* Up / Down Reorder */}
              <div className="flex flex-col">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => reorderServices(index, index - 1)}
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-20 p-0.5"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === services.length - 1}
                  onClick={() => reorderServices(index, index + 1)}
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-20 p-0.5"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <DynamicIcon name={service.icon || 'Shield'} className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{service.title}</h4>
                  {service.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                      {service.badge}
                    </span>
                  )}
                  {!service.published && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                      Draft
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-slate-800">
                    {service.price} / {service.duration}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    /service/{service.slug}
                  </span>
                  <span>•</span>
                  <span>{service.features?.length || 0} deliverables</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => {
                  setActiveView(`service:${service.slug}`);
                }}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-medium transition"
                title="View live service page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">View</span>
              </button>

              <button
                type="button"
                onClick={() => handleStartEdit(service)}
                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-medium transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete service "${service.title}"?`)) {
                    deleteService(service.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete service"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
