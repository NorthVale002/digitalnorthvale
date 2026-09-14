import React from 'react';
import { useCms } from '../../context/CmsContext';
import { DynamicIcon } from '../common/DynamicIcon';
import { CheckCircle2, ArrowRight, Sparkles, Send } from 'lucide-react';
import { ServicesGridSectionData } from '../../types';

interface ServicesGridSectionProps {
  data: ServicesGridSectionData;
}

export const ServicesGridSection: React.FC<ServicesGridSectionProps> = ({ data }) => {
  const { config, setActiveView, openOrderModal } = useCms();
  const { services, theme } = config;

  const count = data.serviceCount || 6;
  const publishedServices = (services || []).filter((s) => s.published).slice(0, count);

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {data.subtitle && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase"
              style={{
                backgroundColor: `${theme.primaryColor}15`,
                color: theme.primaryColor,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{data.subtitle}</span>
            </div>
          )}

          <h2
            className="text-2xl sm:text-4xl font-black tracking-tight"
            style={{ color: theme.textColor }}
          >
            {data.title || 'Engineered SEO Growth Services'}
          </h2>

          {data.description && (
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textMutedColor }}>
              {data.description}
            </p>
          )}
        </div>

        {/* Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition duration-200 p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <DynamicIcon name={service.icon || 'Shield'} className="w-6 h-6" />
                  </div>

                  {data.showBadge !== false && service.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
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
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {service.shortDesc}
                  </p>
                </div>

                {data.showPrice !== false && (
                  <div className="pt-2 border-t border-slate-100 flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-900">{service.price}</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      / {service.duration}
                    </span>
                  </div>
                )}

                {/* Features List */}
                <div className="space-y-1.5 pt-2">
                  {service.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => openOrderModal(service)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white shadow-2xs hover:opacity-90 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Order Now</span>
                </button>

                <button
                  onClick={() => setActiveView(`service:${service.slug}`)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Services Button */}
        {data.viewAllLink && (
          <div className="text-center pt-4">
            <button
              onClick={() => setActiveView('services')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            >
              <span>Explore All SEO Growth Services & Audits</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
