import React from 'react';
import { useCms } from '../../context/CmsContext';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  ShieldCheck,
  Zap,
  Star,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ServiceDetailPageProps {
  slug: string;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug }) => {
  const { config, setActiveView, openOrderModal } = useCms();
  const { services, theme } = config;

  const service = (services || []).find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">SEO Service Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested service page does not exist or may have been unpublished.
        </p>
        <button
          onClick={() => setActiveView('services')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All SEO Services</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      {/* Breadcrumb & Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => setActiveView('services')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to SEO Services</span>
        </button>
      </div>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <DynamicIcon name={service.icon || 'Shield'} className="w-6 h-6" />
              </div>
              {service.badge && (
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
                  {service.badge}
                </span>
              )}
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight"
              style={{ color: theme.textColor }}
            >
              {service.title}
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-3xl"
              style={{ color: theme.textMutedColor }}
            >
              {service.shortDesc}
            </p>

            {/* In-depth description */}
            <div className="prose prose-slate max-w-none pt-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100">
              {service.fullDesc}
            </div>
          </div>

          {/* Right Sticky Order Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-5 sticky top-24">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Standard Retainer / Scope
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900">{service.price}</span>
                <span className="text-xs font-semibold text-slate-500">/ {service.duration}</span>
              </div>
            </div>

            <button
              onClick={() => openOrderModal(service)}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Send className="w-4 h-4" />
              <span>Order This SEO Service</span>
            </button>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% White-Hat Algorithmic Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Fast Intake & Dedicated Search Engineer</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Orders Saved Directly in Firebase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-200">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">
          Everything Included in This Service
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {service.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-2xs"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 leading-snug">{feat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Package Tiers Comparison Table */}
      {service.tiers && service.tiers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Transparent Investment
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Choose Your Implementation Tier
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Scalable tiers designed for growing businesses, commercial catalogs, and enterprise
              brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.tiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border transition flex flex-col justify-between relative shadow-xs hover:shadow-md ${
                  tier.popular
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{tier.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-3xl font-black text-slate-900">{tier.price}</span>
                    <span className="text-xs text-slate-500 font-medium ml-1.5">{tier.period}</span>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Tier Deliverables:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {tier.deliverables.map((del, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button
                    onClick={() => openOrderModal(service, tier.name)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      tier.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Order {tier.name}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
