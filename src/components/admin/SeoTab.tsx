import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { SinglePageSeo } from '../../types';
import {
  Search,
  Globe,
  Share2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Laptop,
  Smartphone,
  Tag,
  Plus,
  X,
  ShieldCheck,
  Info,
  Layers,
  FileText,
  RotateCcw,
  Wand2,
} from 'lucide-react';

export const SeoTab: React.FC = () => {
  const { config, updateSeo, updatePageSeo } = useCms();
  const { seo, header, pages, posts, services } = config;

  // Mode: 'perPage' | 'global'
  const [seoMode, setSeoMode] = useState<'perPage' | 'global'>('perPage');

  // Selected Page for Per-Page SEO:
  // e.g. 'home' | 'services' | 'blog' | 'about' | 'service:technical-seo' | 'post:slug'
  const [selectedPageKey, setSelectedPageKey] = useState<string>('home');

  // SERP preview mode: 'desktop' | 'mobile'
  const [serpView, setSerpView] = useState<'desktop' | 'mobile'>('desktop');

  // Keyword input state
  const [newKeywordInput, setNewKeywordInput] = useState('');

  // Sample curated OG image presets
  const sampleOgImages = [
    {
      label: 'SEO Dashboard & Analytics',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Search Strategy & Rankings',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Editorial & Content Architecture',
      url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Modern Tech Workspace',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // All available site targets for the page dropdown
  const allPageTargets: Array<{ key: string; label: string; group: string; path: string }> = [
    { key: 'home', label: 'Home Page', group: 'Standard Pages', path: '/' },
    { key: 'services', label: 'SEO Services Archive', group: 'Standard Pages', path: '/services' },
    { key: 'blog', label: 'Blog & Articles Journal', group: 'Standard Pages', path: '/blog' },
    // Custom user pages
    ...pages.map((p) => ({
      key: `page:${p.slug}`,
      label: p.title,
      group: 'Custom Pages',
      path: `/${p.slug}`,
    })),
    // Specific SEO Services
    ...(services || []).map((s) => ({
      key: `service:${s.slug}`,
      label: s.title,
      group: 'SEO Service Packages',
      path: `/service/${s.slug}`,
    })),
    // Blog Posts
    ...posts.map((post) => ({
      key: `post:${post.slug}`,
      label: post.title,
      group: 'Journal Articles',
      path: `/blog/${post.slug}`,
    })),
  ];

  const currentPageTarget =
    allPageTargets.find((t) => t.key === selectedPageKey) || allPageTargets[0];

  // Current per-page SEO data
  const pageSeoMap = seo.pageSeo || {};
  const currentSpecificSeo: SinglePageSeo = pageSeoMap[selectedPageKey] || {};

  // Calculate fallbacks for the currently selected page
  let fallbackTitle = seo.metaTitle || `${header.siteTitle} — ${header.tagline}`;
  let fallbackDesc = seo.metaDescription || header.tagline;
  let fallbackKeywords = seo.metaKeywords || '';

  if (selectedPageKey === 'services') {
    fallbackTitle = `SEO Services & Strategic Growth Packages — ${header.siteTitle}`;
    fallbackDesc =
      'Explore high-performance technical SEO, link building, Core Web Vitals, and organic growth services.';
    fallbackKeywords = 'SEO services, link building packages, core web vitals, local SEO';
  } else if (selectedPageKey.startsWith('service:')) {
    const slug = selectedPageKey.replace('service:', '');
    const s = services.find((srv) => srv.slug === slug);
    if (s) {
      fallbackTitle = `${s.title} — ${header.siteTitle}`;
      fallbackDesc = s.shortDesc;
      fallbackKeywords = `${s.title}, SEO service, search marketing`;
    }
  } else if (selectedPageKey === 'blog') {
    fallbackTitle = `Journal & Search Insights — ${header.siteTitle}`;
    fallbackDesc = `Read the latest insights, algorithm breakdowns, and SEO strategies from ${header.siteTitle}.`;
    fallbackKeywords = 'SEO blog, algorithm research, organic search';
  } else if (selectedPageKey.startsWith('page:')) {
    const slug = selectedPageKey.replace('page:', '');
    const p = pages.find((pg) => pg.slug === slug);
    if (p) {
      fallbackTitle = `${p.title} — ${header.siteTitle}`;
      fallbackDesc = p.subtitle || fallbackDesc;
    }
  } else if (selectedPageKey.startsWith('post:')) {
    const slug = selectedPageKey.replace('post:', '');
    const post = posts.find((pst) => pst.slug === slug);
    if (post) {
      fallbackTitle = `${post.title} — ${header.siteTitle}`;
      fallbackDesc = post.excerpt || fallbackDesc;
      fallbackKeywords = post.category || '';
    }
  }

  // Active values for the selected page
  const activeTitle = currentSpecificSeo.metaTitle ?? fallbackTitle;
  const activeDesc = currentSpecificSeo.metaDescription ?? fallbackDesc;
  const activeKeywords = currentSpecificSeo.metaKeywords ?? fallbackKeywords;
  const activeOgImage = currentSpecificSeo.ogImage || seo.ogImage;
  const activeNoIndex = currentSpecificSeo.noIndex ?? false;

  const currentKeywordsList = (activeKeywords || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  const handleAddKeyword = (kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed) return;
    if (currentKeywordsList.some((k) => k.toLowerCase() === trimmed.toLowerCase())) {
      setNewKeywordInput('');
      return;
    }
    const updated = [...currentKeywordsList, trimmed].join(', ');
    if (seoMode === 'perPage') {
      updatePageSeo(selectedPageKey, { metaKeywords: updated });
    } else {
      updateSeo({ metaKeywords: updated });
    }
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = (kw: string) => {
    const updated = currentKeywordsList
      .filter((k) => k.toLowerCase() !== kw.toLowerCase())
      .join(', ');
    if (seoMode === 'perPage') {
      updatePageSeo(selectedPageKey, { metaKeywords: updated });
    } else {
      updateSeo({ metaKeywords: updated });
    }
  };

  const handleAutoFillPageSeo = () => {
    updatePageSeo(selectedPageKey, {
      metaTitle: fallbackTitle,
      metaDescription: fallbackDesc,
      metaKeywords: fallbackKeywords,
      canonicalUrl: `${seo.canonicalUrl || 'https://example.com'}${currentPageTarget.path}`,
    });
  };

  const handleResetPageSeo = () => {
    updatePageSeo(selectedPageKey, {
      metaTitle: undefined,
      metaDescription: undefined,
      metaKeywords: undefined,
      ogImage: undefined,
      canonicalUrl: undefined,
      noIndex: false,
    });
  };

  // SEO Health Audit
  const titleLength = (activeTitle || '').length;
  const descLength = (activeDesc || '').length;
  let score = 0;
  if (titleLength >= 35 && titleLength <= 65) score += 30;
  else if (titleLength > 10) score += 15;

  if (descLength >= 100 && descLength <= 165) score += 30;
  else if (descLength > 30) score += 15;

  if (currentKeywordsList.length >= 3) score += 15;
  else if (currentKeywordsList.length > 0) score += 10;

  if (activeOgImage) score += 15;
  if (!activeNoIndex) score += 10;

  const scoreColor =
    score >= 80 ? 'text-emerald-600' : score >= 55 ? 'text-amber-600' : 'text-rose-600';
  const scoreBg =
    score >= 80 ? 'bg-emerald-500' : score >= 55 ? 'bg-amber-500' : 'bg-rose-500';

  const domainClean = (seo.canonicalUrl || 'https://example.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  return (
    <div className="space-y-6" id="cms-seo-tab-container">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs mt-0.5">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Granular SEO & Per-Page Search Optimization</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Live Meta Sync
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Configure tailored Google Meta Titles, Descriptions, Keywords, and OpenGraph social
              cards for <strong>every individual page</strong> on your site (Home, Services,
              Individual Packages, Custom Pages, and Blog Articles).
            </p>
          </div>
        </div>

        {/* Live Score Badge */}
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs shrink-0">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
              Page SEO Health
            </div>
            <div className={`text-lg font-extrabold ${scoreColor}`}>
              {score} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${scoreBg} transition-all duration-300`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub Tabs: Per-Page SEO vs Global Defaults */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSeoMode('perPage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              seoMode === 'perPage'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Every-Page SEO Manager</span>
          </button>

          <button
            onClick={() => setSeoMode('global')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              seoMode === 'global'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>2. Global Site-Wide Defaults</span>
          </button>
        </div>

        {seoMode === 'perPage' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFillPageSeo}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Auto-fill recommended title and description"
            >
              <Wand2 className="w-3 h-3 text-blue-600" />
              <span className="hidden sm:inline">Auto-Generate</span>
            </button>
            <button
              onClick={handleResetPageSeo}
              className="text-xs px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Reset to site default"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Per-Page Target Selector Dropdown (When in Per-Page Mode) */}
      {seoMode === 'perPage' && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
              Target Page to Optimize:
            </span>
            <select
              value={selectedPageKey}
              onChange={(e) => setSelectedPageKey(e.target.value)}
              className="text-xs font-bold py-2 px-3 rounded-lg border-2 border-blue-500 bg-blue-50/50 text-blue-900 focus:outline-hidden cursor-pointer"
            >
              <optgroup label="Standard Pages">
                <option value="home">Home Page (/)</option>
                <option value="services">All SEO Services (/services)</option>
                <option value="blog">Blog & Journal (/blog)</option>
              </optgroup>

              {pages.length > 0 && (
                <optgroup label="Custom User Pages">
                  {pages.map((p) => (
                    <option key={p.id} value={`page:${p.slug}`}>
                      Page: {p.title} (/{p.slug})
                    </option>
                  ))}
                </optgroup>
              )}

              {services.length > 0 && (
                <optgroup label="SEO Service Packages">
                  {services.map((s) => (
                    <option key={s.id} value={`service:${s.slug}`}>
                      Service: {s.title} (/service/{s.slug})
                    </option>
                  ))}
                </optgroup>
              )}

              {posts.length > 0 && (
                <optgroup label="Blog Posts & Articles">
                  {posts.map((post) => (
                    <option key={post.id} value={`post:${post.slug}`}>
                      Article: {post.title} (/blog/{post.slug})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 truncate">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {domainClean}
              {currentPageTarget.path}
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Form on Left, Live SERP & Social Previews on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Core Search Metadata */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>
                  {seoMode === 'perPage'
                    ? `Page Meta Tags: ${currentPageTarget.label}`
                    : 'Global Default Meta Tags'}
                </span>
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {seoMode === 'perPage' ? currentPageTarget.path : 'Global fallback'}
              </span>
            </div>

            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span>
                    {seoMode === 'perPage' ? 'Page Meta Title' : 'Site Meta Title (Default)'}
                  </span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span
                    className={`font-mono font-medium ${
                      titleLength >= 35 && titleLength <= 65
                        ? 'text-emerald-600 font-semibold'
                        : titleLength > 65
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {titleLength} / 65 chars
                  </span>
                  {titleLength >= 35 && titleLength <= 65 && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                      Optimal
                    </span>
                  )}
                  {titleLength > 65 && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                      May Truncate
                    </span>
                  )}
                </div>
              </div>

              <input
                type="text"
                value={
                  seoMode === 'perPage'
                    ? currentSpecificSeo.metaTitle ?? ''
                    : seo.metaTitle || ''
                }
                onChange={(e) => {
                  if (seoMode === 'perPage') {
                    updatePageSeo(selectedPageKey, { metaTitle: e.target.value });
                  } else {
                    updateSeo({ metaTitle: e.target.value });
                  }
                }}
                placeholder={fallbackTitle}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white font-medium"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Headline displayed in Google search results and browser tabs.
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <span>Meta Description</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span
                    className={`font-mono font-medium ${
                      descLength >= 100 && descLength <= 165
                        ? 'text-emerald-600 font-semibold'
                        : descLength > 165
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {descLength} / 165 chars
                  </span>
                  {descLength >= 100 && descLength <= 165 && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                      Optimal
                    </span>
                  )}
                </div>
              </div>

              <textarea
                rows={3}
                value={
                  seoMode === 'perPage'
                    ? currentSpecificSeo.metaDescription ?? ''
                    : seo.metaDescription || ''
                }
                onChange={(e) => {
                  if (seoMode === 'perPage') {
                    updatePageSeo(selectedPageKey, { metaDescription: e.target.value });
                  } else {
                    updateSeo({ metaDescription: e.target.value });
                  }
                }}
                placeholder={fallbackDesc}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-white leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Concise, click-worthy summary that drives search click-through rate (CTR).
              </p>
            </div>

            {/* Target Keywords for this Page */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                {seoMode === 'perPage' ? `Focus Keywords for ${currentPageTarget.label}` : 'Site Keywords'}
              </label>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {currentKeywordsList.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                  >
                    <Tag className="w-3 h-3 text-blue-500" />
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-slate-400 hover:text-red-600 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword(newKeywordInput);
                    }
                  }}
                  placeholder="Add target keyword and press Enter..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => handleAddKeyword(newKeywordInput)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 shrink-0"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Robots Directive / NoIndex toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Search Engine Indexation
                </span>
                <span className="text-[11px] text-slate-500">
                  {activeNoIndex
                    ? 'NoIndex set: Google is asked NOT to show this page in search results.'
                    : 'Index & Follow: Google is encouraged to crawl and index this page.'}
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!activeNoIndex}
                  onChange={(e) => {
                    const willIndex = e.target.checked;
                    if (seoMode === 'perPage') {
                      updatePageSeo(selectedPageKey, { noIndex: !willIndex });
                    } else {
                      updateSeo({ allowIndexing: willIndex });
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Card 2: Social Media (OpenGraph) Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>Social Media & OpenGraph Image</span>
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Social Share Image (og:image) URL
              </label>
              <input
                type="url"
                value={
                  seoMode === 'perPage'
                    ? currentSpecificSeo.ogImage ?? ''
                    : seo.ogImage || ''
                }
                onChange={(e) => {
                  if (seoMode === 'perPage') {
                    updatePageSeo(selectedPageKey, { ogImage: e.target.value });
                  } else {
                    updateSeo({ ogImage: e.target.value });
                  }
                }}
                placeholder={seo.ogImage || 'https://images.unsplash.com/...'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600 font-mono"
              />
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Or pick a curated banner:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sampleOgImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (seoMode === 'perPage') {
                        updatePageSeo(selectedPageKey, { ogImage: img.url });
                      } else {
                        updateSeo({ ogImage: img.url });
                      }
                    }}
                    className="group cursor-pointer rounded-lg overflow-hidden border border-slate-200 hover:border-blue-500 transition relative"
                  >
                    <img src={img.url} alt={img.label} className="w-full h-14 object-cover" />
                    <span className="block text-[9px] font-semibold text-slate-700 p-1 truncate bg-white">
                      {img.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live SERP Preview */}
        <div className="lg:col-span-5 space-y-5 sticky top-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Live Google Search Snippet</span>
              </h4>

              {/* Desktop / Mobile Switcher */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSerpView('desktop')}
                  className={`px-2 py-1 rounded-md transition flex items-center gap-1 ${
                    serpView === 'desktop'
                      ? 'bg-white shadow-2xs font-bold text-slate-800'
                      : 'text-slate-500'
                  }`}
                >
                  <Laptop className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpView('mobile')}
                  className={`px-2 py-1 rounded-md transition flex items-center gap-1 ${
                    serpView === 'mobile'
                      ? 'bg-white shadow-2xs font-bold text-slate-800'
                      : 'text-slate-500'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Google Result Card */}
            <div
              className={`border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-1.5 ${
                serpView === 'mobile' ? 'max-w-xs mx-auto text-sm' : 'text-xs'
              }`}
            >
              {/* Google URL Line */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                  G
                </div>
                <div className="truncate font-sans">
                  <span className="text-slate-900 font-medium">{domainClean}</span>
                  <span className="text-slate-400 ml-1 truncate">
                    {currentPageTarget.path === '/' ? '' : `› ${currentPageTarget.path.replace('/', '')}`}
                  </span>
                </div>
              </div>

              {/* Google Clickable Blue Title */}
              <h5 className="text-[#1a0dab] font-medium text-base hover:underline leading-snug cursor-pointer line-clamp-2">
                {activeTitle}
              </h5>

              {/* Google Snippet Description */}
              <p className="text-[#4d5156] text-xs leading-relaxed line-clamp-3">
                {activeDesc}
              </p>
            </div>

            {/* Social Share Card Preview */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Social Card (Facebook / LinkedIn / X)
              </span>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-2xs">
                {activeOgImage ? (
                  <img
                    src={activeOgImage}
                    alt="Social preview"
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                    No image configured
                  </div>
                )}
                <div className="p-3 bg-white space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {domainClean}
                  </span>
                  <div className="text-xs font-bold text-slate-900 truncate">{activeTitle}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{activeDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
