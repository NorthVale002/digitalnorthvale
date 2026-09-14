export interface NavigationItem {
  id: string;
  label: string;
  link: string; // e.g., '/', '/blog', '/about', or custom slug '/p/services'
  isExternal?: boolean;
  newTab?: boolean;
}

export interface HeaderConfig {
  siteTitle: string;
  tagline: string;
  logoType: 'text' | 'icon' | 'image';
  logoIcon: string;
  logoUrl?: string;
  navItems: NavigationItem[];
  ctaButton: {
    show: boolean;
    text: string;
    link: string;
  };
  isSticky: boolean;
  layout: 'left' | 'center' | 'split';
  showAnnouncement: boolean;
  announcementText: string;
  announcementLink: string;
}

export type SectionType =
  | 'hero'
  | 'features'
  | 'contentStory'
  | 'blogGrid'
  | 'servicesGrid'
  | 'testimonials'
  | 'cta'
  | 'faq'
  | 'customRichText';

export interface ServicesGridSectionData {
  subtitle: string;
  title: string;
  description: string;
  serviceCount: number;
  showPrice: boolean;
  showBadge: boolean;
  viewAllLink: string;
}

export interface HeroSectionData {
  badge: string;
  headline: string;
  subheadline: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  imageUrl: string;
  alignment: 'center' | 'left' | 'split';
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tag?: string;
}

export interface FeaturesSectionData {
  sectionSubtitle: string;
  sectionTitle: string;
  sectionDescription: string;
  columns: 2 | 3 | 4;
  features: FeatureItem[];
}

export interface ContentStorySectionData {
  subtitle: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  bulletPoints: string[];
  imageUrl: string;
  imagePosition: 'left' | 'right';
  quote: string;
  quoteAuthor: string;
}

export interface BlogGridSectionData {
  subtitle: string;
  title: string;
  description: string;
  postCount: number;
  showCategory: boolean;
  showDate: boolean;
  viewAllLink: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
  rating: number;
}

export interface TestimonialsSectionData {
  subtitle: string;
  title: string;
  description: string;
  testimonials: TestimonialItem[];
}

export interface CtaSectionData {
  badge: string;
  headline: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryText?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSectionData {
  subtitle: string;
  title: string;
  description: string;
  items: FaqItem[];
}

export interface CustomRichTextSectionData {
  subtitle?: string;
  title: string;
  htmlContent: string;
  backgroundColor: 'default' | 'muted' | 'card';
}

export interface SectionBlock {
  id: string;
  type: SectionType;
  title: string;
  isVisible: boolean;
  data: any;
}

export interface ThemeConfig {
  presetName: string;
  primaryColor: string; // e.g. '#2563eb'
  primaryHover: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string; // e.g. '#fafafa'
  surfaceColor: string; // e.g. '#ffffff'
  textColor: string; // e.g. '#0f172a'
  textMutedColor: string; // e.g. '#64748b'
  borderColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  contentWidth: 'compact' | 'standard' | 'wide';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  category: string;
  readTime: string;
  coverImage: string;
  published: boolean;
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  sections?: SectionBlock[];
  showInNav: boolean;
  published: boolean;
  lastUpdated: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: { label: string; url: string }[];
}

export interface FooterConfig {
  siteBio: string;
  copyrightText: string;
  showNewsletter: boolean;
  newsletterHeading: string;
  newsletterText: string;
  columns: FooterColumn[];
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    facebook?: string;
    instagram?: string;
    email?: string;
  };
  bottomLinks: { label: string; url: string }[];
}

export interface SinglePageSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface SeoConfig {
  metaTitle: string;
  titleFormat: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  allowIndexing: boolean;
  authorOrPublisher?: string;
  pageSeo?: Record<string, SinglePageSeo>;
}

export interface ServicePackageTier {
  id: string;
  name: string; // 'Starter' | 'Growth' | 'Enterprise'
  price: string;
  period: string; // e.g. '/month' or 'one-time'
  description: string;
  deliverables: string[];
  popular?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  price: string;
  duration: string;
  badge?: string;
  features: string[];
  tiers?: ServicePackageTier[];
  published: boolean;
  order: number;
  seo?: SinglePageSeo;
}

export interface PaymentMethodConfig {
  id: string; // 'bank_transfer' | 'stripe_card' | 'paypal' | 'easypaisa_jazzcash' | 'crypto_usdt' | custom
  name: string;
  code: 'bank' | 'card' | 'paypal' | 'wallet' | 'crypto' | 'custom';
  description: string;
  badge?: string; // e.g. "Instant", "0% Fee", "Most Popular", "Verified"
  icon: string; // Dynamic icon name
  enabled: boolean;
  requiresTransactionId: boolean;
  instructions: string;
  // Specific account properties customizable by admin:
  accountTitle?: string;
  accountNumber?: string;
  bankName?: string;
  ibanOrSwift?: string;
  branchNameOrCode?: string;
  paypalEmailOrLink?: string;
  walletNumber?: string;
  walletProvider?: string;
  cryptoAddress?: string;
  cryptoNetwork?: string;
  stripePublishableKey?: string;
  testMode?: boolean;
}

export interface PaymentSettingsConfig {
  currency: string; // 'USD' | 'PKR' | 'EUR' | 'GBP' | 'AED'
  currencySymbol: string; // '$' | '₨' | '€' | '£' | 'AED'
  currencyPosition: 'before' | 'after';
  methods: PaymentMethodConfig[];
  allowClientTransactionProof: boolean;
  checkoutSuccessMessage?: string;
  invoiceNotes?: string;
}

export interface OrderRecord {
  id?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientWebsite: string;
  serviceId: string;
  serviceTitle: string;
  packageTier?: string;
  price: string;
  targetKeywords?: string;
  notes?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  adminEmail: string;
  // Payment tracking fields
  paymentMethod?: string;
  paymentMethodName?: string;
  paymentStatus?: 'pending_verification' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
  paymentProofNotes?: string;
  paymentDate?: string;
}

export interface SiteConfig {
  header: HeaderConfig;
  footer: FooterConfig;
  theme: ThemeConfig;
  sections: SectionBlock[];
  posts: BlogPost[];
  pages: PageItem[];
  services: ServiceItem[];
  seo: SeoConfig;
  payment: PaymentSettingsConfig;
}
