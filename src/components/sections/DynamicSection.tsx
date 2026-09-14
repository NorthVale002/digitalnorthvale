import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { SectionBlock } from '../../types';
import { DynamicIcon } from '../common/DynamicIcon';
import { ServicesGridSection } from './ServicesGridSection';
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Quote,
  Calendar,
  Clock,
  Edit2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface DynamicSectionProps {
  section: SectionBlock;
}

export const DynamicSection: React.FC<DynamicSectionProps> = ({ section }) => {
  const { config, setActiveView, setIsAdminOpen, setAdminTab } = useCms();
  const { theme, posts } = config;
  const { type, data } = section;
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  if (!section.isVisible) return null;

  const openSectionEditor = () => {
    setAdminTab('sections');
    setIsAdminOpen(true);
  };

  // Helper for clicking buttons/links
  const handleAction = (link: string) => {
    if (!link) return;
    if (link === '#admin-open') {
      setIsAdminOpen(true);
    } else if (link === '/blog') {
      setActiveView('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link === '/services') {
      setActiveView('services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.startsWith('/service/')) {
      const serviceSlug = link.replace('/service/', '');
      setActiveView(`service:${serviceSlug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link === '/contact') {
      setActiveView('page:contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.startsWith('/p/')) {
      setActiveView(`page:${link.replace('/p/', '')}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.startsWith('/')) {
      const slug = link.replace('/', '');
      const matched = config.pages.find((p) => p.slug === slug);
      if (matched) {
        setActiveView(`page:${slug}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setActiveView('home');
      }
    } else {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  /* ------------------- 1. HERO SECTION ------------------- */
  if (type === 'hero') {
    const isSplit = data.alignment === 'split';
    const isCenter = data.alignment === 'center';

    return (
      <section
        id={section.id}
        className="py-16 sm:py-24 relative overflow-hidden transition-colors"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid items-center gap-12 ${
              isSplit ? 'lg:grid-cols-12' : 'grid-cols-1 max-w-4xl mx-auto'
            } ${isCenter ? 'text-center' : 'text-left'}`}
          >
            {/* Text column */}
            <div className={isSplit ? 'lg:col-span-7' : 'w-full'}>
              {data.badge && (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 border ${
                    isCenter ? 'mx-auto' : ''
                  }`}
                  style={{
                    backgroundColor: `${theme.primaryColor}10`,
                    borderColor: `${theme.primaryColor}30`,
                    color: theme.primaryColor,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{data.badge}</span>
                </div>
              )}

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
                style={{ color: theme.textColor }}
              >
                {data.headline}
              </h1>

              <p
                className="text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl font-normal"
                style={{
                  color: theme.textMutedColor,
                  margin: isCenter ? '0 auto 2rem auto' : '0 0 2rem 0',
                }}
              >
                {data.subheadline}
              </p>

              {/* Action Buttons */}
              <div
                className={`flex flex-wrap items-center gap-3.5 ${
                  isCenter ? 'justify-center' : 'justify-start'
                }`}
              >
                {data.primaryBtnText && (
                  <button
                    onClick={() => handleAction(data.primaryBtnLink)}
                    className="px-6 py-3 text-sm font-semibold rounded-lg text-white shadow-md hover:opacity-95 active:scale-98 transition flex items-center gap-2 cursor-pointer"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <span>{data.primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {data.secondaryBtnText && (
                  <button
                    onClick={() => handleAction(data.secondaryBtnLink)}
                    className="px-6 py-3 text-sm font-semibold rounded-lg border hover:bg-slate-50 transition cursor-pointer"
                    style={{
                      borderColor: theme.borderColor,
                      color: theme.textColor,
                      backgroundColor: theme.surfaceColor,
                    }}
                  >
                    <span>{data.secondaryBtnText}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visual / Image Column if split */}
            {isSplit && data.imageUrl && (
              <div className="lg:col-span-5 relative">
                <div
                  className="rounded-2xl overflow-hidden border shadow-xl relative aspect-[4/3] group"
                  style={{ borderColor: theme.borderColor }}
                >
                  <img
                    src={data.imageUrl}
                    alt={data.headline}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------- 2. FEATURES SECTION ------------------- */
  if (type === 'features') {
    const cols = data.columns || 3;
    const colClass =
      cols === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : cols === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 md:grid-cols-3';

    return (
      <section
        id={section.id}
        className="py-16 sm:py-20 border-t transition-colors"
        style={{
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            {data.sectionSubtitle && (
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: theme.primaryColor }}
              >
                {data.sectionSubtitle}
              </p>
            )}
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
              style={{ color: theme.textColor }}
            >
              {data.sectionTitle}
            </h2>
            {data.sectionDescription && (
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: theme.textMutedColor }}
              >
                {data.sectionDescription}
              </p>
            )}
          </div>

          <div className={`grid ${colClass} gap-8`}>
            {(data.features || []).map((feat: any) => (
              <div
                key={feat.id}
                className="p-6 sm:p-7 rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderColor: theme.borderColor,
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 text-white shadow-sm"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <DynamicIcon name={feat.icon || 'Star'} className="w-6 h-6" />
                </div>
                {feat.tag && (
                  <span
                    className="inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded mb-2"
                    style={{
                      backgroundColor: `${theme.primaryColor}15`,
                      color: theme.primaryColor,
                    }}
                  >
                    {feat.tag}
                  </span>
                )}
                <h3
                  className="text-xl font-bold tracking-tight mb-2"
                  style={{ color: theme.textColor }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: theme.textMutedColor }}
                >
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------- 3. CONTENT STORY SECTION ------------------- */
  if (type === 'contentStory') {
    const isImageLeft = data.imagePosition === 'left';

    return (
      <section
        id={section.id}
        className="py-16 sm:py-24 border-t transition-colors"
        style={{
          backgroundColor: theme.backgroundColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Image Column */}
            <div
              className={`lg:col-span-5 ${
                isImageLeft ? 'lg:order-1' : 'lg:order-2'
              }`}
            >
              <div
                className="rounded-2xl overflow-hidden border shadow-lg relative aspect-[4/3]"
                style={{ borderColor: theme.borderColor }}
              >
                <img
                  src={data.imageUrl}
                  alt={data.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {data.quote && (
                <div
                  className="mt-6 p-5 rounded-xl border flex items-start gap-3 shadow-xs"
                  style={{
                    backgroundColor: theme.surfaceColor,
                    borderColor: theme.borderColor,
                  }}
                >
                  <Quote
                    className="w-6 h-6 shrink-0 opacity-40 mt-1"
                    style={{ color: theme.primaryColor }}
                  />
                  <div>
                    <p
                      className="text-sm italic font-medium leading-snug"
                      style={{ color: theme.textColor }}
                    >
                      “{data.quote}”
                    </p>
                    {data.quoteAuthor && (
                      <p
                        className="text-xs font-bold mt-1.5"
                        style={{ color: theme.primaryColor }}
                      >
                        — {data.quoteAuthor}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Text Column */}
            <div
              className={`lg:col-span-7 ${
                isImageLeft ? 'lg:order-2' : 'lg:order-1'
              }`}
            >
              {data.subtitle && (
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: theme.primaryColor }}
                >
                  {data.subtitle}
                </p>
              )}
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-6"
                style={{ color: theme.textColor }}
              >
                {data.title}
              </h2>

              <p
                className="text-base sm:text-lg leading-relaxed mb-4"
                style={{ color: theme.textColor }}
              >
                {data.paragraph1}
              </p>

              {data.paragraph2 && (
                <p
                  className="text-sm sm:text-base leading-relaxed mb-6"
                  style={{ color: theme.textMutedColor }}
                >
                  {data.paragraph2}
                </p>
              )}

              {data.bulletPoints && data.bulletPoints.length > 0 && (
                <ul className="space-y-3 pt-2">
                  {data.bulletPoints.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle
                        className="w-5 h-5 shrink-0 mt-0.5"
                        style={{ color: theme.primaryColor }}
                      />
                      <span style={{ color: theme.textColor }}>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------- 4. BLOG GRID SECTION ------------------- */
  if (type === 'blogGrid') {
    const displayPosts = posts.filter((p) => p.published).slice(0, data.postCount || 3);

    return (
      <section
        id={section.id}
        className="py-16 sm:py-20 border-t transition-colors"
        style={{
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              {data.subtitle && (
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: theme.primaryColor }}
                >
                  {data.subtitle}
                </p>
              )}
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
                style={{ color: theme.textColor }}
              >
                {data.title}
              </h2>
              {data.description && (
                <p
                  className="text-base max-w-xl"
                  style={{ color: theme.textMutedColor }}
                >
                  {data.description}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setActiveView('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 font-semibold text-sm hover:underline underline-offset-4 cursor-pointer"
              style={{ color: theme.primaryColor }}
            >
              <span>View all articles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => {
                  setActiveView(`post:${post.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderColor: theme.borderColor,
                }}
              >
                {/* Thumbnail */}
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {post.category && (
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-md shadow-xs"
                      style={{
                        backgroundColor: theme.surfaceColor,
                        color: theme.textColor,
                      }}
                    >
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div
                      className="flex items-center gap-3 text-xs mb-3"
                      style={{ color: theme.textMutedColor }}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3
                      className="text-xl font-bold tracking-tight mb-2.5 group-hover:text-blue-600 transition"
                      style={{ color: theme.textColor }}
                    >
                      {post.title}
                    </h3>

                    <p
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ color: theme.textMutedColor }}
                    >
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t flex items-center justify-between" style={{ borderColor: theme.borderColor }}>
                    <span className="text-xs font-medium" style={{ color: theme.textColor }}>
                      By {post.author}
                    </span>
                    <span
                      className="text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition"
                      style={{ color: theme.primaryColor }}
                    >
                      Read story <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------- 5. TESTIMONIALS SECTION ------------------- */
  if (type === 'testimonials') {
    return (
      <section
        id={section.id}
        className="py-16 sm:py-20 border-t transition-colors"
        style={{
          backgroundColor: theme.backgroundColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            {data.subtitle && (
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: theme.primaryColor }}
              >
                {data.subtitle}
              </p>
            )}
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
              style={{ color: theme.textColor }}
            >
              {data.title}
            </h2>
            {data.description && (
              <p className="text-base" style={{ color: theme.textMutedColor }}>
                {data.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {(data.testimonials || []).map((t: any) => (
              <div
                key={t.id}
                className="p-7 rounded-xl border shadow-xs flex flex-col justify-between"
                style={{
                  backgroundColor: theme.surfaceColor,
                  borderColor: theme.borderColor,
                }}
              >
                <div>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p
                    className="text-base leading-relaxed italic mb-6"
                    style={{ color: theme.textColor }}
                  >
                    “{t.quote}”
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: theme.borderColor }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: theme.textColor }}>
                      {t.author}
                    </h4>
                    <p className="text-xs" style={{ color: theme.textMutedColor }}>
                      {t.role} • {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------- 6. CTA BANNER SECTION ------------------- */
  if (type === 'cta') {
    return (
      <section
        id={section.id}
        className="py-16 sm:py-20 border-t transition-colors"
        style={{
          backgroundColor: theme.surfaceColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl p-8 sm:p-12 text-center border relative overflow-hidden shadow-sm"
            style={{
              backgroundColor: `${theme.primaryColor}0a`,
              borderColor: `${theme.primaryColor}30`,
            }}
          >
            {data.badge && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border"
                style={{
                  backgroundColor: theme.surfaceColor,
                  borderColor: `${theme.primaryColor}40`,
                  color: theme.primaryColor,
                }}
              >
                {data.badge}
              </span>
            )}

            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 max-w-2xl mx-auto leading-tight"
              style={{ color: theme.textColor }}
            >
              {data.headline}
            </h2>

            <p
              className="text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed"
              style={{ color: theme.textMutedColor }}
            >
              {data.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => handleAction(data.buttonLink)}
                className="px-7 py-3.5 text-sm font-semibold rounded-lg text-white shadow-md hover:opacity-95 active:scale-98 transition flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <span>{data.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {data.secondaryText && (
              <p className="text-xs mt-4" style={{ color: theme.textMutedColor }}>
                {data.secondaryText}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------- 7. FAQ SECTION ------------------- */
  if (type === 'faq') {
    return (
      <section
        id={section.id}
        className="py-16 sm:py-20 border-t transition-colors"
        style={{
          backgroundColor: theme.backgroundColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {data.subtitle && (
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: theme.primaryColor }}
              >
                {data.subtitle}
              </p>
            )}
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
              style={{ color: theme.textColor }}
            >
              {data.title}
            </h2>
            {data.description && (
              <p className="text-base" style={{ color: theme.textMutedColor }}>
                {data.description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {(data.items || []).map((faq: any) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border overflow-hidden transition"
                  style={{
                    backgroundColor: theme.surfaceColor,
                    borderColor: theme.borderColor,
                  }}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-base transition"
                    style={{ color: theme.textColor }}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div
                      className="px-5 pb-5 text-sm leading-relaxed border-t pt-3"
                      style={{
                        borderColor: theme.borderColor,
                        color: theme.textMutedColor,
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------- 8. CUSTOM RICH TEXT SECTION ------------------- */
  if (type === 'customRichText') {
    return (
      <section
        id={section.id}
        className="py-16 sm:py-20 border-t transition-colors"
        style={{
          backgroundColor:
            data.backgroundColor === 'card'
              ? theme.surfaceColor
              : theme.backgroundColor,
          borderColor: theme.borderColor,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {data.subtitle && (
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: theme.primaryColor }}
            >
              {data.subtitle}
            </p>
          )}
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-6"
            style={{ color: theme.textColor }}
          >
            {data.title}
          </h2>

          <div
            className="prose prose-slate max-w-none text-base leading-relaxed whitespace-pre-line"
            style={{ color: theme.textColor }}
          >
            {data.htmlContent}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------- 9. SERVICES GRID SECTION ------------------- */
  if (type === 'servicesGrid') {
    return <ServicesGridSection data={data} />;
  }

  return null;
};
