import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SiteConfig,
  HeaderConfig,
  FooterConfig,
  ThemeConfig,
  SectionBlock,
  SectionType,
  BlogPost,
  PageItem,
  SeoConfig,
  SinglePageSeo,
  ServiceItem,
  OrderRecord,
  ServicesGridSectionData,
  PaymentMethodConfig,
  PaymentSettingsConfig,
} from '../types';
import { DEFAULT_SITE_CONFIG, THEME_PRESETS } from '../data/defaultConfig';
import {
  db,
  collection,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from '../lib/firebase';

const STORAGE_KEY = 'atelier_cms_site_config_v2';
const ADMIN_EMAIL_STORAGE_KEY = 'apex_cms_admin_email';

export type AdminTabType =
  | 'header'
  | 'sections'
  | 'services'
  | 'payments'
  | 'orders'
  | 'theme'
  | 'pages'
  | 'blog'
  | 'footer'
  | 'seo';

export type CloudSyncStatusType = 'synced' | 'saving' | 'local_only' | 'error';

interface CmsContextType {
  config: SiteConfig;
  updateConfig: (updater: (prev: SiteConfig) => SiteConfig) => void;
  updateHeader: (header: Partial<HeaderConfig>) => void;
  updateFooter: (footer: Partial<FooterConfig>) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateSeo: (seo: Partial<SeoConfig>) => void;
  updatePageSeo: (pageKey: string, seoPatch: Partial<SinglePageSeo>) => void;
  applyThemePreset: (presetKey: string) => void;
  updateSection: (sectionId: string, updatedData: any) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  reorderSections: (dragIndex: number, hoverIndex: number) => void;
  deleteSection: (sectionId: string) => void;
  addSection: (type: SectionType, title?: string) => void;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'slug'>) => string;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  addPage: (page: Omit<PageItem, 'id'>) => string;
  updatePage: (id: string, page: Partial<PageItem>) => void;
  deletePage: (id: string) => void;
  // Services operations
  addService: (service: Omit<ServiceItem, 'id'>) => string;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  reorderServices: (dragIndex: number, hoverIndex: number) => void;
  // Payment methods operations
  updatePaymentSettings: (settings: Partial<PaymentSettingsConfig>) => void;
  updatePaymentMethod: (id: string, methodPatch: Partial<PaymentMethodConfig>) => void;
  togglePaymentMethod: (id: string) => void;
  addPaymentMethod: (method: Omit<PaymentMethodConfig, 'id'>) => string;
  deletePaymentMethod: (id: string) => void;
  // Orders & Firebase Firestore
  orders: OrderRecord[];
  pendingOrdersCount: number;
  placeOrder: (orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => Promise<void>;
  updateOrderPaymentStatus: (
    orderId: string,
    paymentStatus: OrderRecord['paymentStatus'],
    transactionId?: string
  ) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  adminNotificationEmail: string;
  setAdminNotificationEmail: (email: string) => void;
  // Cloud Sync for Multi-Domain / Netlify
  cloudSyncStatus: CloudSyncStatusType;
  lastCloudSyncTime: string | null;
  saveConfigToCloud: () => Promise<boolean>;
  // Order Modal interaction
  orderModalOpen: boolean;
  setOrderModalOpen: (open: boolean) => void;
  selectedServiceForOrder: ServiceItem | null;
  selectedTierForOrder: string | null;
  openOrderModal: (service?: ServiceItem, tierName?: string) => void;
  closeOrderModal: () => void;
  // Navigation & Views
  activeView: string; // 'home' | 'services' | 'service:slug' | 'blog' | 'post:slug' | 'page:slug' | 'admin'
  setActiveView: (view: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminTab: AdminTabType;
  setAdminTab: (tab: AdminTabType) => void;
  visitorMode: boolean;
  setVisitorMode: (v: boolean) => void;
  resetToDefaults: () => void;
  exportConfigJson: () => string;
  importConfigJson: (json: string) => boolean;
}

const CmsContext = createContext<CmsContextType | null>(null);

export const CmsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          header: { ...DEFAULT_SITE_CONFIG.header, ...parsed.header },
          footer: { ...DEFAULT_SITE_CONFIG.footer, ...parsed.footer },
          theme: { ...DEFAULT_SITE_CONFIG.theme, ...parsed.theme },
          services:
            parsed.services && Array.isArray(parsed.services) && parsed.services.length > 0
              ? parsed.services
              : DEFAULT_SITE_CONFIG.services,
          seo: {
            ...DEFAULT_SITE_CONFIG.seo,
            ...(parsed.seo || {}),
            pageSeo: {
              ...(DEFAULT_SITE_CONFIG.seo.pageSeo || {}),
              ...(parsed.seo?.pageSeo || {}),
            },
          },
          sections: parsed.sections || DEFAULT_SITE_CONFIG.sections,
          posts: parsed.posts || DEFAULT_SITE_CONFIG.posts,
          pages: parsed.pages || DEFAULT_SITE_CONFIG.pages,
          payment: {
            ...DEFAULT_SITE_CONFIG.payment,
            ...(parsed.payment || {}),
            methods:
              parsed.payment?.methods &&
              Array.isArray(parsed.payment.methods) &&
              parsed.payment.methods.length > 0
                ? parsed.payment.methods
                : DEFAULT_SITE_CONFIG.payment.methods,
          },
        };
      }
    } catch (e) {
      console.error('Failed to load CMS state from localStorage:', e);
    }
    return DEFAULT_SITE_CONFIG;
  });

  const [activeView, setActiveView] = useState<string>('home');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<AdminTabType>('header');
  const [visitorMode, setVisitorMode] = useState<boolean>(false);

  // Admin Notification Email
  const [adminNotificationEmail, setAdminNotificationEmailState] = useState<string>(() => {
    return localStorage.getItem(ADMIN_EMAIL_STORAGE_KEY) || 'digitalnorthvale@gmail.com';
  });

  const setAdminNotificationEmail = (email: string) => {
    setAdminNotificationEmailState(email);
    localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, email);
  };

  // Orders State (Firestore synced)
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Cloud Sync State
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatusType>('synced');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);

  // Sync CMS Site Config from Firestore (so Netlify, custom domain, and preview share exact data)
  useEffect(() => {
    if (!db) {
      setCloudSyncStatus('local_only');
      return;
    }
    try {
      const configDocRef = doc(db, 'cms_config', 'site_config');
      const unsubscribe = onSnapshot(
        configDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const remoteConfig = docSnap.data() as SiteConfig;
            setConfig((prev) => ({
              ...DEFAULT_SITE_CONFIG,
              ...remoteConfig,
              header: { ...DEFAULT_SITE_CONFIG.header, ...(remoteConfig.header || {}) },
              footer: { ...DEFAULT_SITE_CONFIG.footer, ...(remoteConfig.footer || {}) },
              theme: { ...DEFAULT_SITE_CONFIG.theme, ...(remoteConfig.theme || {}) },
              services:
                remoteConfig.services && Array.isArray(remoteConfig.services) && remoteConfig.services.length > 0
                  ? remoteConfig.services
                  : prev.services,
              payment: {
                ...DEFAULT_SITE_CONFIG.payment,
                ...(remoteConfig.payment || {}),
                methods:
                  remoteConfig.payment?.methods &&
                  Array.isArray(remoteConfig.payment.methods) &&
                  remoteConfig.payment.methods.length > 0
                    ? remoteConfig.payment.methods
                    : prev.payment.methods,
              },
              sections: remoteConfig.sections || prev.sections,
              posts: remoteConfig.posts || prev.posts,
              pages: remoteConfig.pages || prev.pages,
              seo: {
                ...DEFAULT_SITE_CONFIG.seo,
                ...(remoteConfig.seo || {}),
                pageSeo: {
                  ...(DEFAULT_SITE_CONFIG.seo.pageSeo || {}),
                  ...(remoteConfig.seo?.pageSeo || {}),
                },
              },
            }));
            setCloudSyncStatus('synced');
            setLastCloudSyncTime(new Date().toLocaleTimeString());
          }
        },
        (err) => {
          console.warn('Firestore CMS config snapshot listener error:', err);
          setCloudSyncStatus('local_only');
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore config listener init notice:', e);
    }
  }, []);

  // Save Config to Firestore Cloud
  const saveConfigToCloud = async (): Promise<boolean> => {
    if (!db) {
      console.warn('Firestore not connected. Config saved to local device.');
      setCloudSyncStatus('local_only');
      return false;
    }
    setCloudSyncStatus('saving');
    try {
      const configDocRef = doc(db, 'cms_config', 'site_config');
      await setDoc(configDocRef, config, { merge: true });
      setCloudSyncStatus('synced');
      setLastCloudSyncTime(new Date().toLocaleTimeString());
      return true;
    } catch (err) {
      console.error('Failed to save CMS config to Firestore cloud:', err);
      setCloudSyncStatus('error');
      return false;
    }
  };

  // Order Booking Modal State
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<ServiceItem | null>(null);
  const [selectedTierForOrder, setSelectedTierForOrder] = useState<string | null>(null);

  const openOrderModal = (service?: ServiceItem, tierName?: string) => {
    setSelectedServiceForOrder(service || config.services[0] || null);
    setSelectedTierForOrder(tierName || null);
    setOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setOrderModalOpen(false);
    setSelectedServiceForOrder(null);
    setSelectedTierForOrder(null);
  };

  // Real-time Firestore sync for Orders
  useEffect(() => {
    if (!db) return;
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedOrders: OrderRecord[] = [];
          snapshot.forEach((docSnap) => {
            fetchedOrders.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<OrderRecord, 'id'>),
            });
          });
          setOrders(fetchedOrders);
        },
        (error) => {
          console.warn('Firestore real-time subscription error (using fallback local store):', error);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore initialization fallback:', err);
    }
  }, []);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  // Save to localStorage & debounced cloud sync on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save CMS state to localStorage:', e);
    }

    // Debounced automatic cloud sync (2.5s)
    if (db) {
      const timer = setTimeout(() => {
        setCloudSyncStatus('saving');
        setDoc(doc(db, 'cms_config', 'site_config'), config, { merge: true })
          .then(() => {
            setCloudSyncStatus('synced');
            setLastCloudSyncTime(new Date().toLocaleTimeString());
          })
          .catch((err) => {
            console.warn('Auto cloud sync notice:', err);
            setCloudSyncStatus('local_only');
          });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [config]);

  // Apply dynamic CSS variables for theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--cms-primary', config.theme.primaryColor);
    root.style.setProperty('--cms-primary-hover', config.theme.primaryHover || config.theme.primaryColor);
    root.style.setProperty('--cms-secondary', config.theme.secondaryColor);
    root.style.setProperty('--cms-accent', config.theme.accentColor);
    root.style.setProperty('--cms-bg', config.theme.backgroundColor);
    root.style.setProperty('--cms-surface', config.theme.surfaceColor);
    root.style.setProperty('--cms-text', config.theme.textColor);
    root.style.setProperty('--cms-text-muted', config.theme.textMutedColor);
    root.style.setProperty('--cms-border', config.theme.borderColor);

    let radius = '8px';
    if (config.theme.borderRadius === 'none') radius = '0px';
    if (config.theme.borderRadius === 'sm') radius = '4px';
    if (config.theme.borderRadius === 'md') radius = '8px';
    if (config.theme.borderRadius === 'lg') radius = '16px';
    if (config.theme.borderRadius === 'full') radius = '9999px';
    root.style.setProperty('--cms-radius', radius);
  }, [config.theme]);

  const updateConfig = (updater: (prev: SiteConfig) => SiteConfig) => {
    setConfig((prev) => updater(prev));
  };

  const updateHeader = (headerPatch: Partial<HeaderConfig>) => {
    setConfig((prev) => ({
      ...prev,
      header: { ...prev.header, ...headerPatch },
    }));
  };

  const updateFooter = (footerPatch: Partial<FooterConfig>) => {
    setConfig((prev) => ({
      ...prev,
      footer: { ...prev.footer, ...footerPatch },
    }));
  };

  const updateTheme = (themePatch: Partial<ThemeConfig>) => {
    setConfig((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...themePatch },
    }));
  };

  const updateSeo = (seoPatch: Partial<SeoConfig>) => {
    setConfig((prev) => ({
      ...prev,
      seo: { ...prev.seo, ...seoPatch },
    }));
  };

  const updatePageSeo = (pageKey: string, seoPatch: Partial<SinglePageSeo>) => {
    setConfig((prev) => {
      const currentPagesSeo = prev.seo.pageSeo || {};
      const targetPageSeo = currentPagesSeo[pageKey] || {};
      return {
        ...prev,
        seo: {
          ...prev.seo,
          pageSeo: {
            ...currentPagesSeo,
            [pageKey]: {
              ...targetPageSeo,
              ...seoPatch,
            },
          },
        },
      };
    });
  };

  // Synchronize dynamic SEO metadata to document head
  useEffect(() => {
    if (!config.seo) return;

    const { seo, header, posts, pages, services } = config;
    const pageSeoMap = seo.pageSeo || {};

    // 1. Determine target page key and default values
    let targetPageKey = 'home';
    let defaultTitle = seo.metaTitle || `${header.siteTitle} — ${header.tagline}`;
    let defaultDescription = seo.metaDescription || header.tagline;
    let defaultKeywords = seo.metaKeywords || '';

    if (activeView === 'home') {
      targetPageKey = 'home';
    } else if (activeView === 'services') {
      targetPageKey = 'services';
      defaultTitle = (seo.titleFormat || '%s — ' + header.siteTitle).replace(
        '%s',
        'SEO Services & Strategic Growth Packages'
      );
      defaultDescription =
        'Explore our high-performance technical SEO, link building, and organic growth services.';
      defaultKeywords = 'SEO services, link building packages, core web vitals, local SEO';
    } else if (activeView.startsWith('service:')) {
      const serviceSlug = activeView.replace('service:', '');
      targetPageKey = `service:${serviceSlug}`;
      const service = services?.find((s) => s.slug === serviceSlug);
      if (service) {
        defaultTitle =
          service.seo?.metaTitle ||
          (seo.titleFormat || '%s — ' + header.siteTitle).replace('%s', service.title);
        defaultDescription = service.seo?.metaDescription || service.shortDesc;
        defaultKeywords =
          service.seo?.metaKeywords || `${service.title}, SEO service, growth package`;
      }
    } else if (activeView === 'blog') {
      targetPageKey = 'blog';
      defaultTitle = (seo.titleFormat || '%s — ' + header.siteTitle).replace(
        '%s',
        'Journal & Search Insights'
      );
      defaultDescription = `Read the latest insights, algorithm breakdowns, and SEO strategies from ${header.siteTitle}.`;
    } else if (activeView.startsWith('post:')) {
      const slug = activeView.replace('post:', '');
      targetPageKey = `post:${slug}`;
      const post = posts.find((p) => p.slug === slug);
      if (post) {
        defaultTitle = (seo.titleFormat || '%s — ' + header.siteTitle).replace('%s', post.title);
        defaultDescription = post.excerpt || defaultDescription;
      }
    } else if (activeView.startsWith('page:')) {
      const slug = activeView.replace('page:', '');
      targetPageKey = `page:${slug}`;
      const page = pages.find((p) => p.slug === slug);
      if (page) {
        defaultTitle = (seo.titleFormat || '%s — ' + header.siteTitle).replace('%s', page.title);
        defaultDescription = page.subtitle || defaultDescription;
      }
    }

    // Check specific page SEO overrides
    const specificSeo =
      pageSeoMap[targetPageKey] ||
      (targetPageKey.startsWith('page:') ? pageSeoMap[targetPageKey.replace('page:', '')] : undefined);

    const resolvedTitle = specificSeo?.metaTitle || defaultTitle;
    const resolvedDescription = specificSeo?.metaDescription || defaultDescription;
    const resolvedKeywords = specificSeo?.metaKeywords || defaultKeywords;
    const resolvedOgImage = specificSeo?.ogImage || seo.ogImage;
    const resolvedNoIndex = specificSeo?.noIndex || seo.allowIndexing === false;

    // Apply document title
    document.title = resolvedTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attribute: string, attrValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, attrValue);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Description & Keywords
    setMetaTag('name', 'description', resolvedDescription);
    if (resolvedKeywords) {
      setMetaTag('name', 'keywords', resolvedKeywords);
    }
    if (seo.authorOrPublisher) {
      setMetaTag('name', 'author', seo.authorOrPublisher);
    }

    // Robots meta directive
    setMetaTag('name', 'robots', resolvedNoIndex ? 'noindex, nofollow' : 'index, follow');

    // OpenGraph Tags
    setMetaTag('property', 'og:title', resolvedTitle);
    setMetaTag('property', 'og:description', resolvedDescription);
    setMetaTag('property', 'og:type', seo.ogType || 'website');
    if (resolvedOgImage) {
      setMetaTag('property', 'og:image', resolvedOgImage);
    }

    // Twitter Tags
    setMetaTag('name', 'twitter:card', seo.twitterCard || 'summary_large_image');
    setMetaTag('name', 'twitter:title', resolvedTitle);
    setMetaTag('name', 'twitter:description', resolvedDescription);
    if (resolvedOgImage) {
      setMetaTag('name', 'twitter:image', resolvedOgImage);
    }

    // Canonical link
    const pageCanonical = specificSeo?.canonicalUrl || (seo.canonicalUrl ? `${seo.canonicalUrl}/${targetPageKey === 'home' ? '' : targetPageKey.replace(':', '/')}` : '');
    if (pageCanonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.href = pageCanonical;
    }
  }, [config.seo, config.header, config.posts, config.pages, config.services, activeView]);

  const applyThemePreset = (presetKey: string) => {
    if (THEME_PRESETS[presetKey]) {
      setConfig((prev) => ({
        ...prev,
        theme: { ...THEME_PRESETS[presetKey] },
      }));
    }
  };

  const updateSection = (sectionId: string, updatedData: any) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, data: { ...sec.data, ...updatedData } } : sec
      ),
    }));
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, isVisible: !sec.isVisible } : sec
      ),
    }));
  };

  const reorderSections = (dragIndex: number, hoverIndex: number) => {
    setConfig((prev) => {
      const nextSections = [...prev.sections];
      const [draggedItem] = nextSections.splice(dragIndex, 1);
      nextSections.splice(hoverIndex, 0, draggedItem);
      return {
        ...prev,
        sections: nextSections,
      };
    });
  };

  const deleteSection = (sectionId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.filter((sec) => sec.id !== sectionId),
    }));
  };

  const addSection = (type: SectionType, title?: string) => {
    const id = `sec-${Date.now()}`;
    let data: any = {};

    switch (type) {
      case 'hero':
        data = {
          badge: 'GROWTH ENGINE',
          headline: 'High-Impact Search Visibility & Technical Superiority',
          subheadline:
            'We eliminate ranking bottlenecks and build authority architectures that drive non-branded organic conversions.',
          primaryBtnText: 'View SEO Packages',
          primaryBtnLink: '/services',
          secondaryBtnText: 'Read Search Journal',
          secondaryBtnLink: '/blog',
          imageUrl:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          alignment: 'split',
        };
        break;
      case 'servicesGrid':
        data = {
          subtitle: 'ENGINEERED CAPABILITIES',
          title: 'Specialized SEO Growth Services',
          description:
            'Comprehensive technical, on-page, and authority campaigns tailored to maximize organic market share.',
          serviceCount: 6,
          showPrice: true,
          showBadge: true,
          viewAllLink: '/services',
        };
        break;
      case 'features':
        data = {
          sectionSubtitle: 'METHODOLOGY',
          sectionTitle: 'Sustainable Search Authority Framework',
          sectionDescription: 'Clear, algorithmic optimization free of spam or temporary hacks.',
          columns: 3,
          features: [
            {
              id: 'f-custom-1',
              icon: 'Shield',
              title: 'White-Hat Compliance',
              description: 'Strict adherence to Google Search Essentials and Helpful Content Guidelines.',
            },
            {
              id: 'f-custom-2',
              icon: 'Zap',
              title: 'Core Web Vitals',
              description: 'Sub-second render speeds and 90+ mobile performance audit benchmarks.',
            },
            {
              id: 'f-custom-3',
              icon: 'Star',
              title: 'Data Attribution',
              description: 'Transparent tracking connecting keyword rankings to actual revenue pipelines.',
            },
          ],
        };
        break;
      case 'contentStory':
        data = {
          subtitle: 'ABOUT OUR DISCIPLINE',
          title: 'Search Architecture Grounded in Mathematical Precision',
          paragraph1:
            'Modern search engines reward clarity, structural integrity, and genuine domain authority. We reverse-engineer user intent to position your brand as the definitive answer.',
          paragraph2:
            'From deep JavaScript crawl bottlenecks to editorial outreach on tier-1 publications, our team handles the entire technical lifecycle.',
          bulletPoints: [
            'Dedicated senior search engineer per client',
            'Full control over deliverables and anchor texts',
            'Live ranking analytics and conversion tracking',
          ],
          imageUrl:
            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
          imagePosition: 'right',
          quote: 'If you want to be found, be undeniable.',
          quoteAuthor: 'Apex SEO Manifesto',
        };
        break;
      case 'blogGrid':
        data = {
          subtitle: 'ALGORITHM DISPATCHES',
          title: 'Latest Research & SEO Intelligence',
          description: 'Technical breakdowns, case studies, and actionable search strategy guides.',
          postCount: 3,
          showCategory: true,
          showDate: true,
          viewAllLink: '/blog',
        };
        break;
      case 'testimonials':
        data = {
          subtitle: 'CLIENT SUCCESS',
          title: 'Measurable Organic Traffic Growth',
          description: 'See what our partners say about our technical rigor and rank velocity.',
          testimonials: [
            {
              id: 't-1',
              quote:
                'Apex lifted our non-branded organic traffic by 280% within 6 months. Their technical audit alone solved years of indexation headaches.',
              author: 'Marcus Vance',
              role: 'VP of Marketing',
              company: 'Krono Labs',
              rating: 5,
            },
            {
              id: 't-2',
              quote:
                'White-hat link building that actually gets results on DR 70+ outlets without feeling spammy. An indispensable growth partner.',
              author: 'Elena Chen',
              role: 'Founder',
              company: 'Verve Editorial',
              rating: 5,
            },
          ],
        };
        break;
      case 'cta':
        data = {
          headline: 'Ready to Dominate Your Organic Search Vertical?',
          subheadline:
            'Get a comprehensive 150+ point technical SEO crawl and competitor keyword gap analysis.',
          primaryBtnText: 'Order Full SEO Audit',
          primaryBtnLink: '/services',
          secondaryBtnText: 'Schedule Strategy Call',
          secondaryBtnLink: '/contact',
          backgroundColor: '#0f172a',
          textColor: '#ffffff',
        };
        break;
      case 'faq':
        data = {
          subtitle: 'QUESTIONS & ANSWERS',
          title: 'Frequently Asked Questions',
          description: 'Clear answers regarding our methodology, contracts, and delivery timelines.',
          items: [
            {
              id: 'faq-1',
              question: 'How long before we see rankings improve?',
              answer:
                'Technical and Core Web Vitals fixes often yield indexing updates within 2 to 4 weeks. Competitive keyword movements and domain authority campaigns typically ramp up significantly by months 3 through 6.',
            },
            {
              id: 'faq-2',
              question: 'Are your backlinks 100% white-hat?',
              answer:
                'Yes. We operate zero PBNs or automated link networks. Every backlink is earned via manual editorial pitching, digital PR, and verified DR 50+ publications.',
            },
          ],
        };
        break;
      case 'customRichText':
        data = {
          subtitle: 'CUSTOM CONTENT',
          title: 'Tailored Section',
          content: 'Add bespoke markdown or text content here to suit your brand story.',
          alignment: 'left',
        };
        break;
      default:
        data = {};
    }

    const newSection: SectionBlock = {
      id,
      type,
      title: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
      isVisible: true,
      data,
    };

    setConfig((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  // Blog Posts
  const addBlogPost = (postData: Omit<BlogPost, 'id' | 'slug'>): string => {
    const id = `post-${Date.now()}`;
    const slug = postData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const newPost: BlogPost = {
      ...postData,
      id,
      slug,
      date: postData.date || new Date().toISOString().split('T')[0],
      author: postData.author || config.header.siteTitle,
      authorRole: postData.authorRole || 'Search Strategist',
      category: postData.category || 'SEO',
      readTime: postData.readTime || '5 min read',
      coverImage:
        postData.coverImage ||
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      published: postData.published !== false,
    };

    setConfig((prev) => ({
      ...prev,
      posts: [newPost, ...prev.posts],
    }));

    return id;
  };

  const updateBlogPost = (id: string, postPatch: Partial<BlogPost>) => {
    setConfig((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.id === id ? { ...p, ...postPatch } : p)),
    }));
  };

  const deleteBlogPost = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== id),
    }));
  };

  // Custom Pages
  const addPage = (pageData: Omit<PageItem, 'id'>): string => {
    const id = `page-${Date.now()}`;
    const newPage: PageItem = {
      ...pageData,
      id,
      lastUpdated: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setConfig((prev) => {
      const nextPages = [...prev.pages, newPage];
      let nextNav = [...prev.header.navItems];
      if (newPage.showInNav) {
        const linkPath = `/${newPage.slug}`;
        if (!nextNav.some((item) => item.link === linkPath)) {
          nextNav.push({
            id: `nav-${Date.now()}`,
            label: newPage.title,
            link: linkPath,
          });
        }
      }
      return {
        ...prev,
        pages: nextPages,
        header: {
          ...prev.header,
          navItems: nextNav,
        },
      };
    });

    return id;
  };

  const updatePage = (id: string, pagePatch: Partial<PageItem>) => {
    setConfig((prev) => {
      const targetPage = prev.pages.find((p) => p.id === id);
      const updatedPages = prev.pages.map((p) => (p.id === id ? { ...p, ...pagePatch } : p));

      let nextNav = [...prev.header.navItems];
      if (targetPage && pagePatch.slug && targetPage.slug !== pagePatch.slug) {
        const oldLink = `/${targetPage.slug}`;
        const newLink = `/${pagePatch.slug}`;
        nextNav = nextNav.map((n) =>
          n.link === oldLink ? { ...n, link: newLink, label: pagePatch.title || n.label } : n
        );
      }

      return {
        ...prev,
        pages: updatedPages,
        header: {
          ...prev.header,
          navItems: nextNav,
        },
      };
    });
  };

  const deletePage = (id: string) => {
    setConfig((prev) => {
      const target = prev.pages.find((p) => p.id === id);
      return {
        ...prev,
        pages: prev.pages.filter((p) => p.id !== id),
        header: {
          ...prev.header,
          navItems: target
            ? prev.header.navItems.filter((item) => item.link !== `/${target.slug}`)
            : prev.header.navItems,
        },
      };
    });
  };

  // Services CRUD
  const addService = (serviceData: Omit<ServiceItem, 'id'>): string => {
    const id = `srv-${Date.now()}`;
    const slug =
      serviceData.slug ||
      serviceData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

    const newService: ServiceItem = {
      ...serviceData,
      id,
      slug,
      order: serviceData.order ?? (config.services?.length || 0) + 1,
    };

    setConfig((prev) => ({
      ...prev,
      services: [...(prev.services || []), newService],
    }));

    return id;
  };

  const updateService = (id: string, servicePatch: Partial<ServiceItem>) => {
    setConfig((prev) => ({
      ...prev,
      services: (prev.services || []).map((s) => (s.id === id ? { ...s, ...servicePatch } : s)),
    }));
  };

  const deleteService = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      services: (prev.services || []).filter((s) => s.id !== id),
    }));
  };

  const reorderServices = (dragIndex: number, hoverIndex: number) => {
    setConfig((prev) => {
      const nextServices = [...(prev.services || [])];
      const [draggedItem] = nextServices.splice(dragIndex, 1);
      nextServices.splice(hoverIndex, 0, draggedItem);
      return {
        ...prev,
        services: nextServices.map((s, idx) => ({ ...s, order: idx + 1 })),
      };
    });
  };

  // Payment methods management (Admin controlled)
  const updatePaymentSettings = (settings: Partial<PaymentSettingsConfig>) => {
    setConfig((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        ...settings,
      },
    }));
  };

  const updatePaymentMethod = (id: string, methodPatch: Partial<PaymentMethodConfig>) => {
    setConfig((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        methods: (prev.payment?.methods || []).map((m) =>
          m.id === id ? { ...m, ...methodPatch } : m
        ),
      },
    }));
  };

  const togglePaymentMethod = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        methods: (prev.payment?.methods || []).map((m) =>
          m.id === id ? { ...m, enabled: !m.enabled } : m
        ),
      },
    }));
  };

  const addPaymentMethod = (methodData: Omit<PaymentMethodConfig, 'id'>): string => {
    const id = `pm_${Date.now()}`;
    const newMethod: PaymentMethodConfig = {
      ...methodData,
      id,
    };
    setConfig((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        methods: [...(prev.payment?.methods || []), newMethod],
      },
    }));
    return id;
  };

  const deletePaymentMethod = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        methods: (prev.payment?.methods || []).filter((m) => m.id !== id),
      },
    }));
  };

  // Orders in Firestore
  const placeOrder = async (
    orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>
  ): Promise<string> => {
    const newRecord: Omit<OrderRecord, 'id'> = {
      ...orderData,
      status: 'pending',
      paymentStatus: orderData.paymentStatus || 'pending_verification',
      createdAt: new Date().toISOString(),
      adminEmail: adminNotificationEmail,
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), newRecord);
      const createdId = docRef.id;

      // Update local state immediately
      setOrders((prev) => [{ ...newRecord, id: createdId }, ...prev]);
      return createdId;
    } catch (error) {
      console.warn('Failed to write order to Firestore, saving to local state:', error);
      const localId = `ord-${Date.now()}`;
      setOrders((prev) => [{ ...newRecord, id: localId }, ...prev]);
      return localId;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderRecord['status']) => {
    // Update local state
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      if (!orderId.startsWith('ord-')) {
        await updateDoc(doc(db, 'orders', orderId), { status });
      }
    } catch (e) {
      console.warn('Failed to update order status in Firestore:', e);
    }
  };

  const updateOrderPaymentStatus = async (
    orderId: string,
    paymentStatus: OrderRecord['paymentStatus'],
    transactionId?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus,
              transactionId: transactionId !== undefined ? transactionId : o.transactionId,
              paymentDate: paymentStatus === 'paid' ? new Date().toISOString() : o.paymentDate,
            }
          : o
      )
    );
    try {
      if (!orderId.startsWith('ord-')) {
        const updatePayload: any = { paymentStatus };
        if (transactionId !== undefined) updatePayload.transactionId = transactionId;
        if (paymentStatus === 'paid') updatePayload.paymentDate = new Date().toISOString();
        await updateDoc(doc(db, 'orders', orderId), updatePayload);
      }
    } catch (e) {
      console.warn('Failed to update order payment status in Firestore:', e);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      if (!orderId.startsWith('ord-')) {
        await deleteDoc(doc(db, 'orders', orderId));
      }
    } catch (e) {
      console.warn('Failed to delete order from Firestore:', e);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all site content, services, design, and settings back to original defaults?')) {
      setConfig(DEFAULT_SITE_CONFIG);
      localStorage.removeItem(STORAGE_KEY);
      setActiveView('home');
    }
  };

  const exportConfigJson = () => {
    return JSON.stringify(config, null, 2);
  };

  const importConfigJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.header || !parsed.theme || !parsed.sections) {
        return false;
      }
      setConfig(parsed);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <CmsContext.Provider
      value={{
        config,
        updateConfig,
        updateHeader,
        updateFooter,
        updateTheme,
        updateSeo,
        updatePageSeo,
        applyThemePreset,
        updateSection,
        toggleSectionVisibility,
        reorderSections,
        deleteSection,
        addSection,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addPage,
        updatePage,
        deletePage,
        // Services
        addService,
        updateService,
        deleteService,
        reorderServices,
        // Payment methods management
        updatePaymentSettings,
        updatePaymentMethod,
        togglePaymentMethod,
        addPaymentMethod,
        deletePaymentMethod,
        // Orders & Firebase
        orders,
        pendingOrdersCount,
        placeOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        deleteOrder,
        adminNotificationEmail,
        setAdminNotificationEmail,
        // Cloud Sync for Multi-Domain / Netlify
        cloudSyncStatus,
        lastCloudSyncTime,
        saveConfigToCloud,
        // Order Modal
        orderModalOpen,
        setOrderModalOpen,
        selectedServiceForOrder,
        selectedTierForOrder,
        openOrderModal,
        closeOrderModal,
        // Views & Admin
        activeView,
        setActiveView,
        isAdminOpen,
        setIsAdminOpen,
        adminTab,
        setAdminTab,
        visitorMode,
        setVisitorMode,
        resetToDefaults,
        exportConfigJson,
        importConfigJson,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
