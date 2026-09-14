import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
  Search,
  Sliders,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { ServiceItem } from '../../types';

export const ServicesCatalogPage: React.FC = () => {
  const { config, setActiveView, openOrderModal } = useCms();
  const { services, theme } = config;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const publishedServices = (services || []).filter((s) => s.published);

  const filteredServices = publishedServices.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'technical') return s.slug.includes('tech') || s.slug.includes('audit');
    if (activeFilter === 'content') return s.slug.includes('page') || s.slug.includes('content');
    if (activeFilter === 'authority') return s.slug.includes('link');
    if (activeFilter === 'local') return s.slug.includes('local');
    if (activeFilter === 'ecommerce') return s.slug.includes('ecom');
    return true;
  });

  return (
    <div className="w-full pb-20">
      {/* Hero Header */}
      <section
        className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b"
        style={{
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-2xs"
            style={{
              backgroundColor: `${theme.primaryColor}15`,
              color: theme.primaryColor,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ROI-Driven Organic Search Strategy</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
            style={{ color: theme.textColor }}
          >
            SEO Services & Growth Packages
          </h1>

          <p
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: theme.textMutedColor }}
          >
            We engineer sustainable search engine dominance. No vanity metrics or shady PBNs—only
            white-hat technical audits, high-authority editorial links, and semantic content
            architectures that generate actual revenue.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5 items-center">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SEO capabilities (e.g. Core Web Vitals, links, local)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white shadow-2xs"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'technical', label: 'Technical & Audits' },
              { id: 'content', label: 'On-Page & Content' },
              { id: 'authority', label: 'Link Building & PR' },
              { id: 'local', label: 'Local & Maps' },
              { id: 'ecommerce', label: 'E-Commerce' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No matching services found</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for different keywords or reset filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-3 text-xs font-semibold text-blue-600 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Section */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <DynamicIcon name={service.icon || 'Shield'} className="w-6 h-6" />
                    </div>

                    {service.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3
                      onClick={() => setActiveView(`service:${service.slug}`)}
                      className="text-lg font-bold text-slate-900 leading-snug hover:text-blue-600 transition cursor-pointer"
                    >
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Pricing Badge */}
                  <div className="pt-2 border-t border-slate-100 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-slate-900">
                      {service.price}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      / {service.duration}
                    </span>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Key Deliverables:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {service.features.slice(0, 4).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => openOrderModal(service)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-90 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <span>Order Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveView(`service:${service.slug}`)}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Free Audit Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div
          className="rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden"
          style={{ backgroundColor: theme.secondaryColor || '#0f172a' }}
        >
          <div className="space-y-3 max-w-xl text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-blue-300">
              Complimentary Search Assessment
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              Unsure which SEO service matches your current ranking bottlenecks?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Book our Comprehensive SEO Audit or place an intake order today. Our search architects
              will crawl your website, identify penalties, and prepare a custom organic roadmap.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                const auditService = services.find((s) => s.slug === 'seo-audit') || services[0];
                openOrderModal(auditService);
              }}
              className="px-6 py-3 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Request Fast-Track SEO Audit</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
