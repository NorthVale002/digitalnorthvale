import { SiteConfig, ThemeConfig, ServiceItem } from '../types';

export const THEME_PRESETS: Record<string, ThemeConfig> = {
  nordic: {
    presetName: 'Nordic Slate',
    primaryColor: '#2563eb',
    primaryHover: '#1d4ed8',
    secondaryColor: '#0f172a',
    accentColor: '#38bdf8',
    backgroundColor: '#f8fafc',
    surfaceColor: '#ffffff',
    textColor: '#0f172a',
    textMutedColor: '#64748b',
    borderColor: '#e2e8f0',
    fontFamily: 'sans',
    borderRadius: 'md',
    contentWidth: 'standard',
  },
  forest: {
    presetName: 'Forest Editorial',
    primaryColor: '#1b4332',
    primaryHover: '#081c15',
    secondaryColor: '#2d6a4f',
    accentColor: '#d8f3dc',
    backgroundColor: '#faf8f5',
    surfaceColor: '#ffffff',
    textColor: '#1c1917',
    textMutedColor: '#78716c',
    borderColor: '#e7e5e4',
    fontFamily: 'serif',
    borderRadius: 'sm',
    contentWidth: 'standard',
  },
  monochrome: {
    presetName: 'Monochrome Studio',
    primaryColor: '#18181b',
    primaryHover: '#09090b',
    secondaryColor: '#27272a',
    accentColor: '#71717a',
    backgroundColor: '#ffffff',
    surfaceColor: '#fafafa',
    textColor: '#09090b',
    textMutedColor: '#52525b',
    borderColor: '#e4e4e7',
    fontFamily: 'sans',
    borderRadius: 'none',
    contentWidth: 'standard',
  },
  warmOchre: {
    presetName: 'Warm Ochre',
    primaryColor: '#c2410c',
    primaryHover: '#9a3412',
    secondaryColor: '#431407',
    accentColor: '#fed7aa',
    backgroundColor: '#fdfbf7',
    surfaceColor: '#ffffff',
    textColor: '#292524',
    textMutedColor: '#78716c',
    borderColor: '#f5ebe0',
    fontFamily: 'sans',
    borderRadius: 'lg',
    contentWidth: 'standard',
  },
  midnight: {
    presetName: 'Midnight Executive',
    primaryColor: '#4f46e5',
    primaryHover: '#4338ca',
    secondaryColor: '#312e81',
    accentColor: '#a5b4fc',
    backgroundColor: '#0f172a',
    surfaceColor: '#1e293b',
    textColor: '#f8fafc',
    textMutedColor: '#94a3b8',
    borderColor: '#334155',
    fontFamily: 'sans',
    borderRadius: 'md',
    contentWidth: 'standard',
  },
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  header: {
    siteTitle: 'Atelier Studio',
    tagline: 'Thoughtful Design & Digital Publishing',
    logoType: 'text',
    logoIcon: 'Globe',
    navItems: [
      { id: 'nav-1', label: 'Home', link: '/' },
      { id: 'nav-2', label: 'About', link: '/about' },
      { id: 'nav-3', label: 'Services', link: '/services' },
      { id: 'nav-4', label: 'Journal', link: '/blog' },
      { id: 'nav-5', label: 'Contact', link: '/contact' },
    ],
    ctaButton: {
      show: true,
      text: 'Start Project',
      link: '/contact',
    },
    isSticky: true,
    layout: 'split',
    showAnnouncement: true,
    announcementText: '✨ Introducing our 2026 Spring Collection & Design Insights',
    announcementLink: '/blog',
  },
  footer: {
    siteBio:
      'A bespoke digital studio focused on quiet craftsmanship, structured content, and high-impact digital experiences.',
    copyrightText: '© 2026 Atelier Studio. All rights reserved.',
    showNewsletter: true,
    newsletterHeading: 'Subscribe to our quiet journal',
    newsletterText: 'Occasional essays on design, typography, and web architecture. No spam ever.',
    columns: [
      {
        id: 'col-1',
        title: 'Navigation',
        links: [
          { label: 'Home', url: '/' },
          { label: 'About Studio', url: '/about' },
          { label: 'Selected Work', url: '/services' },
          { label: 'Journal Articles', url: '/blog' },
        ],
      },
      {
        id: 'col-2',
        title: 'Services',
        links: [
          { label: 'Digital Architecture', url: '/services' },
          { label: 'Design Systems', url: '/services' },
          { label: 'Content Strategy', url: '/services' },
          { label: 'Consulting', url: '/contact' },
        ],
      },
      {
        id: 'col-3',
        title: 'Studio',
        links: [
          { label: 'hello@atelierstudio.com', url: 'mailto:hello@atelierstudio.com' },
          { label: '+1 (555) 234-8900', url: 'tel:+15552348900' },
          { label: 'Amsterdam & Global Remote', url: '/contact' },
        ],
      },
    ],
    socialLinks: {
      twitter: 'https://x.com',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'hello@atelierstudio.com',
    },
    bottomLinks: [
      { label: 'Privacy Policy', url: '#' },
      { label: 'Terms of Service', url: '#' },
      { label: 'Sitemap', url: '#' },
    ],
  },
  theme: THEME_PRESETS.nordic,
  sections: [
    {
      id: 'sec-hero-1',
      type: 'hero',
      title: 'Hero Header Banner',
      isVisible: true,
      data: {
        badge: 'CRAFTED WITH PRECISION',
        headline: 'Modern Publishing & Elegant Design Systems',
        subheadline:
          'We build quiet, high-performance web platforms where every typography choice, whitespace rhythm, and content block serves a deliberate purpose.',
        primaryBtnText: 'Explore Our Work',
        primaryBtnLink: '/services',
        secondaryBtnText: 'Read The Journal',
        secondaryBtnLink: '/blog',
        imageUrl:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        alignment: 'split',
      },
    },
    {
      id: 'sec-feat-1',
      type: 'features',
      title: 'Core Features & Offerings',
      isVisible: true,
      data: {
        sectionSubtitle: 'METHODOLOGY',
        sectionTitle: 'Engineered for Clarity and Longevity',
        sectionDescription:
          'No unnecessary complexity or bloated frameworks. Pure structural balance designed to give your ideas the presence they deserve.',
        columns: 3,
        features: [
          {
            id: 'f-1',
            icon: 'Layout',
            title: 'Modular Layout Architecture',
            description:
              'Seamlessly control header, content blocks, and footer with unified design tokens and instant real-time customization.',
            tag: 'Foundation',
          },
          {
            id: 'f-2',
            icon: 'Palette',
            title: 'WordPress-Style Customizer',
            description:
              'Fine-tune color palettes, typography pairs, and container widths effortlessly without writing CSS code.',
            tag: 'Customizer',
          },
          {
            id: 'f-3',
            icon: 'BookOpen',
            title: 'Editorial Journal Engine',
            description:
              'Integrated publishing system for essays, thought leadership, and case studies with distraction-free reading.',
            tag: 'Publishing',
          },
        ],
      },
    },
    {
      id: 'sec-story-1',
      type: 'contentStory',
      title: 'Content Story / About Preview',
      isVisible: true,
      data: {
        subtitle: 'OUR PHILOSOPHY',
        title: 'Restraint is the highest form of sophistication',
        paragraph1:
          'In an era overwhelmed by excessive visual noise, true craftsmanship emerges from deliberate subtraction. We craft experiences that prioritize legibility, spatial harmony, and authentic brand voice.',
        paragraph2:
          'Every section of this platform is modular and adaptable. You remain in complete administrative control of the layout, narrative flow, and aesthetic styling.',
        bulletPoints: [
          'Full control over Header, Content Blocks, and Footer styling',
          'Create unlimited custom pages with unique slugs and content',
          'Curated editorial journal with categorized articles',
          'Instant client-side updates with zero reload friction',
        ],
        imageUrl:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
        imagePosition: 'right',
        quote: 'Good design is as little design as possible.',
        quoteAuthor: 'Dieter Rams',
      },
    },
    {
      id: 'sec-blog-1',
      type: 'blogGrid',
      title: 'Blog / Journal Preview',
      isVisible: true,
      data: {
        subtitle: 'LATEST ESSAYS',
        title: 'From The Editorial Journal',
        description:
          'Deep dives into typography, modern web ergonomics, and content publishing workflows.',
        postCount: 3,
        showCategory: true,
        showDate: true,
        viewAllLink: '/blog',
      },
    },
    {
      id: 'sec-faq-1',
      type: 'faq',
      title: 'Frequently Asked Questions',
      isVisible: true,
      data: {
        subtitle: 'COMMON QUESTIONS',
        title: 'How Everything Connects',
        description: 'Clear answers on managing pages, themes, and content blocks.',
        items: [
          {
            id: 'faq-1',
            question: 'How do I edit the Header and Footer?',
            answer:
              'Click the "Admin Panel" or "Customize" button on the top admin bar. Go to the Header or Footer tab to change logos, navigation menus, social links, and copyright text.',
          },
          {
            id: 'faq-2',
            question: 'Can I add my own custom pages?',
            answer:
              'Yes! Open the Admin Panel, select "Pages", and click "Add New Page". You can write any content, give it a custom title and URL slug, and automatically link it to the top navigation.',
          },
          {
            id: 'faq-3',
            question: 'How does the theme customizer work?',
            answer:
              'In the "Theme & Style" tab, select from curated preset themes or pick your own custom brand colors, font styles, and border curvatures. Changes apply instantly.',
          },
          {
            id: 'faq-4',
            question: 'Can I reorder or hide sections on the Home page?',
            answer:
              'In the "Home Content Blocks" tab, you can drag or click Up/Down arrows to reorder any section, toggle visibility on/off, or add new content blocks.',
          },
        ],
      },
    },
    {
      id: 'sec-cta-1',
      type: 'cta',
      title: 'Call to Action Banner',
      isVisible: true,
      data: {
        badge: 'GET STARTED TODAY',
        headline: 'Ready to build your bespoke online presence?',
        description:
          'Use the top admin bar to customize this layout, publish your first essay, or create custom pages suited to your exact business needs.',
        buttonText: 'Open Admin Customizer',
        buttonLink: '#admin-open',
        secondaryText: 'Instant live preview • No coding required',
      },
    },
  ],
  posts: [
    {
      id: 'post-1',
      slug: 'minimalist-web-design-principles',
      title: 'The Art of Minimalist Web Design in 2026',
      excerpt:
        'Why deliberate negative space and disciplined typography outshine flashy decorative animations every single time.',
      content: `### The Power of Intentional Restraint

Minimalism is not the lack of something. It is simply the perfect amount of everything. When every unnecessary element is stripped away, what remains commands full attention.

In modern web design, users often experience cognitive fatigue from jarring banner animations, popups, and nested cards. By establishing a coherent visual rhythm through:

- **Strict typographic hierarchy**: Limiting font weights and scaling proportionally.
- **Consistent mathematical margins**: Ensuring outer container padding always exceeds inner gaps.
- **High contrast readability**: Maintaining WCAG AA compliance with purposeful neutrals.

#### Content-First Architecture
When the container respects the content, your message speaks directly to the reader without distraction.`,
      author: 'Sarah Lin',
      authorRole: 'Design Director',
      date: 'March 10, 2026',
      category: 'Design Systems',
      readTime: '4 min read',
      coverImage:
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
      published: true,
    },
    {
      id: 'post-2',
      slug: 'building-content-architecture-that-converts',
      title: 'Building Content Architecture That Actually Converts',
      excerpt:
        'How structuring your homepage around a coherent narrative leads to higher engagement than random feature lists.',
      content: `### Narrative Flow Over Feature Lists

Most homepages fail not because of poor products, but because of disjointed storytelling. Visitors need a logical progression from initial value proposition to validation.

1. **The Hero Hook**: Address the core problem in one clear sentence.
2. **The Mechanism**: Explain how your solution operates without jargon.
3. **The Proof**: Share genuine customer perspectives or editorial case studies.
4. **The Clear Action**: Give the user a single, unambiguous next step.

When this sequence is honored, your conversion rate naturally climbs because the user never feels lost.`,
      author: 'David Vance',
      authorRole: 'Content Strategist',
      date: 'March 4, 2026',
      category: 'Strategy',
      readTime: '6 min read',
      coverImage:
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
      published: true,
    },
    {
      id: 'post-3',
      slug: 'why-typography-matters-more-than-effects',
      title: 'Why Thoughtful Typography Matters More Than Fancy Effects',
      excerpt:
        'The web is 95% typography. Exploring line heights, character limits, and optical balance for pristine legibility.',
      content: `### The Voice of Your Interface

Typography is the ambient sound of the digital world. Before a word is read, its typeface, line length, and tracking communicate emotion and authority.

Key rules we uphold in our design system:
- **Optimal reading width**: Keep body paragraphs constrained between 60 and 75 characters per line.
- **Line height rhythm**: A 1.5 to 1.7 line height ensures the eye transitions smoothly to the next row without losing its place.
- **Micro-contrast**: Subtle contrast differences between headings and body text create intuitive scanning patterns.`,
      author: 'Elena Rostova',
      authorRole: 'Lead Typographer',
      date: 'February 26, 2026',
      category: 'Typography',
      readTime: '5 min read',
      coverImage:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
      published: true,
    },
  ],
  pages: [
    {
      id: 'page-about',
      title: 'About Us',
      slug: 'about',
      subtitle: 'A dedicated team committed to digital simplicity and lasting craft.',
      content: `### Who We Are

Atelier Studio was founded on a simple premise: the modern web deserves better than disposable templates and cookie-cutter designs. We partner with founders, creators, and institutions to articulate their identity with clarity and dignity.

#### Our Core Values
- **Integrity in Design**: We never employ deceptive design patterns or artificial urgency.
- **Performance by Default**: Fast, accessible, and responsive across every device.
- **Client Empowerment**: You own your content. Our CMS architecture gives you complete autonomy over layouts, pages, and themes.

#### Our Space
We operate as a distributed collective with headquarters in Amsterdam and collaborators worldwide.`,
      showInNav: true,
      published: true,
      lastUpdated: 'March 11, 2026',
    },
    {
      id: 'page-services',
      title: 'Services',
      slug: 'services',
      subtitle: 'Tailored solutions across digital identity, publishing, and design systems.',
      content: `### Strategic Capabilities

We help organizations build digital foundations that endure.

#### 1. Digital Architecture & CMS Strategy
Custom CMS architectures configured to give your editorial team effortless control over every section, header, and footer without code dependencies.

#### 2. Visual Identity & Design Systems
Comprehensive brand books, typographic hierarchies, color palettes, and component libraries engineered for scale.

#### 3. Editorial & Content Production
Long-form storytelling, corporate journalism, and technical documentation that communicates with poise and precision.`,
      showInNav: true,
      published: true,
      lastUpdated: 'March 11, 2026',
    },
    {
      id: 'page-contact',
      title: 'Contact',
      slug: 'contact',
      subtitle: 'Let’s discuss your next project or publication.',
      content: `### Reach Out Directly

Whether you are seeking to launch a new publication, overhaul your company presence, or simply have a question about our methodology, we would love to hear from you.

- **Direct Inquiries**: hello@atelierstudio.com
- **New Projects**: projects@atelierstudio.com
- **Office**: Keizersgracht 421, 1016 EK Amsterdam, Netherlands
- **Operating Hours**: Monday — Friday, 9:00 AM — 6:00 PM CET

We typically respond to inquiries within 24 hours on business days.`,
      showInNav: true,
      published: true,
      lastUpdated: 'March 11, 2026',
    },
  ],
  services: [
    {
      id: 'srv-technical-seo',
      title: 'Technical SEO & Core Web Vitals',
      slug: 'technical-seo',
      shortDesc: 'Deep crawl audits, indexation fixes, JavaScript SEO, page speed acceleration, and schema markup engineering.',
      fullDesc: `Eliminate technical bottlenecks preventing Google from indexing and ranking your pages. We audit every line of code, server response headers, canonical tags, and JavaScript rendering pipeline.

Our technical engineers optimize LCP, FID/INP, and CLS scores to pass Core Web Vitals with 90+ mobile scores.`,
      icon: 'Shield',
      price: '$799',
      duration: 'Audit & Implementation',
      badge: 'High Impact',
      features: [
        'Comprehensive Deep Crawl & Indexing Audit',
        'Core Web Vitals & Speed Optimization (90+ score)',
        'Schema.org JSON-LD Structured Data Implementation',
        'XML Sitemap & Robots.txt Architecture',
        'Crawl Budget & 404/301 Redirect Loop Remediation',
        'Hreflang & Internationalization Setup',
      ],
      tiers: [
        {
          id: 'tier-tech-starter',
          name: 'Technical Audit',
          price: '$799',
          period: 'one-time',
          description: 'Thorough audit identifying all critical technical barriers and crawl bottlenecks.',
          deliverables: ['100+ Point Crawl Audit', 'Core Web Vitals Diagnosis', 'Schema Gap Analysis', 'Actionable Fix Roadmap'],
        },
        {
          id: 'tier-tech-growth',
          name: 'Audit & Full Implementation',
          price: '$1,499',
          period: 'one-time',
          description: 'Complete hands-on remediation executed by our developers.',
          deliverables: ['All Audit Findings Fixed', 'Full Core Web Vitals Fix', 'Schema.org JSON-LD Injection', '30-Day Indexation Monitoring'],
          popular: true,
        },
        {
          id: 'tier-tech-enterprise',
          name: 'Enterprise Architecture',
          price: '$2,899',
          period: 'quarterly',
          description: 'Tailored for large sites (10k+ pages), headless CMS, and international stores.',
          deliverables: ['Headless/SSR Optimization', 'Crawl Budget Engineering', 'Dedicated Dev Liaison', 'Weekly Monitoring Alerts'],
        },
      ],
      published: true,
      order: 1,
      seo: {
        metaTitle: 'Technical SEO Services & Core Web Vitals Optimization',
        metaDescription: 'Fix crawl errors, accelerate page load speed, and implement rich schema markup with our technical SEO engineering service.',
        metaKeywords: 'technical SEO, core web vitals, schema markup, crawl budget, speed optimization',
      },
    },
    {
      id: 'srv-onpage-seo',
      title: 'On-Page SEO & Content Strategy',
      slug: 'on-page-seo',
      shortDesc: 'Search intent keyword mapping, topical authority clusters, NLP content optimization, and internal link silos.',
      fullDesc: `Transform your existing pages into top-ranking search powerhouses. We leverage modern entity-based SEO and semantic keyword clusters to capture high-intent buyers at every stage of the funnel.`,
      icon: 'FileText',
      price: '$650',
      duration: 'Monthly Campaign',
      badge: 'Popular',
      features: [
        'High-Intent Keyword Gap & Opportunity Mapping',
        'Topical Authority Silo Architecture',
        'H1-H6 Hierarchy & Semantic Content Optimization',
        'Strategic Internal Anchor Link Modeling',
        'Featured Snippet & People Also Ask Capture',
        'Continuous Content Refresh Cycles',
      ],
      tiers: [
        {
          id: 'tier-onpage-starter',
          name: 'Starter Strategy (5 Pages)',
          price: '$650',
          period: '/month',
          description: 'Ideal for small businesses targeting local or niche high-intent terms.',
          deliverables: ['5 Core Landing Pages Optimized', 'Keyword Research Matrix', 'Content Briefs Provided', 'Monthly SERP Tracking'],
        },
        {
          id: 'tier-onpage-growth',
          name: 'Authority Engine (15 Pages)',
          price: '$1,299',
          period: '/month',
          description: 'Scale organic visibility across commercial category pages and editorial hubs.',
          deliverables: ['15 Pages Fully Optimized', 'Topical Cluster Architecture', '4 Semantic Blog Articles Included', 'Bi-weekly Rank Reports'],
          popular: true,
        },
        {
          id: 'tier-onpage-enterprise',
          name: 'Market Domination (30+ Pages)',
          price: '$2,499',
          period: '/month',
          description: 'Comprehensive content operations designed to dominate competitive verticals.',
          deliverables: ['30+ Pages Optimized', 'Full Entity SEO Strategy', '8 Long-form Articles Included', 'Dedicated Senior Strategist'],
        },
      ],
      published: true,
      order: 2,
      seo: {
        metaTitle: 'On-Page SEO & Semantic Content Strategy Services',
        metaDescription: 'Target high-intent search queries with structured topical authority clusters, NLP optimization, and strategic internal link networks.',
        metaKeywords: 'on-page SEO, keyword mapping, semantic SEO, content strategy, rank higher',
      },
    },
    {
      id: 'srv-link-building',
      title: 'High-Authority Link Building & PR Outreach',
      slug: 'link-building',
      shortDesc: '100% white-hat editorial backlinks, digital PR campaigns, and niche-relevant placements from DR 60+ publications.',
      fullDesc: `Build genuine domain authority that stands up to every Google core algorithm update. We execute bespoke digital PR, journalist quote outreach, and editorial guest contributions on authentic, high-traffic industry publications.`,
      icon: 'Layers',
      price: '$999',
      duration: 'Per Campaign',
      badge: 'Rank Multiplier',
      features: [
        'Zero PBNs, Zero Spam: 100% Manual Editorial Outreach',
        'Minimum DR 55+ & Real Organic Search Traffic Verification',
        'Natural Anchor Text Distribution Strategy',
        'Competitor Backlink Profile Gap Replication',
        'HARO & Journalist Source Placements',
        'Live Transparent Links Dashboard',
      ],
      tiers: [
        {
          id: 'tier-link-starter',
          name: 'Authority Seed (3 DR 50+ Links)',
          price: '$999',
          period: '/month',
          description: 'Consistent backlink foundation for growing sites and fresh domains.',
          deliverables: ['3 Guaranteed Editorial Links', 'DR 50-70 Publications', 'Contextual Content Included', 'Replacement Guarantee'],
        },
        {
          id: 'tier-link-growth',
          name: 'Authority Accelerator (7 DR 60+ Links)',
          price: '$2,199',
          period: '/month',
          description: 'Accelerate keyword movement in competitive commercial industries.',
          deliverables: ['7 Guaranteed High-Authority Links', 'DR 60-80 Publications', 'Digital PR Pitch Outreach', 'Replacement Guarantee'],
          popular: true,
        },
        {
          id: 'tier-link-enterprise',
          name: 'Dominance Scale (15+ Links + PR)',
          price: '$4,499',
          period: '/month',
          description: 'Tier-1 national press placements and industry-leading authority campaigns.',
          deliverables: ['15+ Tier-1 Editorial Links', 'Tier-1 News & Industry Outlets', 'Data-Driven Study PR Campaign', 'Executive Link Architect'],
        },
      ],
      published: true,
      order: 3,
      seo: {
        metaTitle: 'White-Hat Link Building & Digital PR Outreach Services',
        metaDescription: 'Earn authentic editorial backlinks on high-traffic DR 60+ publications to multiply your domain authority and organic rankings.',
        metaKeywords: 'link building, white-hat backlinks, digital PR, domain rating, editorial outreach',
      },
    },
    {
      id: 'srv-local-seo',
      title: 'Local SEO & Google Maps Domination',
      slug: 'local-seo',
      shortDesc: 'Google Business Profile optimization, local citation building, geo-targeted pages, and Local Map Pack #1 rankings.',
      fullDesc: `Capture local customers searching for your services in your immediate city, region, or multi-location footprint. We optimize your Google Business Profile (GBP), build consistent NAP citations across top tier directories, and earn top 3 Google Map Pack spots.`,
      icon: 'Sliders',
      price: '$499',
      duration: 'Monthly Campaign',
      badge: 'Local Traffic',
      features: [
        'Google Business Profile Full Audit & Category Optimization',
        'Google Map Pack 3-Pack Proximity Expansion',
        '50+ High-Authority Local Directory Citations (NAP Consistency)',
        'Localized Landing Pages & City Schema Setup',
        'Reputation & Review Generation Framework',
        'Geo-Grid Keyword Ranking Reports',
      ],
      tiers: [
        {
          id: 'tier-local-starter',
          name: 'Single Location Pack',
          price: '$499',
          period: '/month',
          description: 'Perfect for single office, clinic, or local store.',
          deliverables: ['1 Google Business Profile Managed', 'Local Citation Cleanup', 'Weekly GBP Posts & Photos', 'Geo-Grid Rank Tracker'],
        },
        {
          id: 'tier-local-growth',
          name: 'Regional Leader (Up to 3 Locations)',
          price: '$899',
          period: '/month',
          description: 'Multi-location businesses and service area operations.',
          deliverables: ['Up to 3 Locations Managed', 'Local Schema & Geo Landing Pages', 'Citation Building & Suppression', 'Review Strategy'],
          popular: true,
        },
      ],
      published: true,
      order: 4,
      seo: {
        metaTitle: 'Local SEO Services & Google Business Profile Optimization',
        metaDescription: 'Dominate the Google Map Pack and local search queries for your service business with localized citations and geo-grid optimization.',
        metaKeywords: 'local SEO, Google Map Pack, Google Business Profile, local citations, geo-grid ranking',
      },
    },
    {
      id: 'srv-ecommerce-seo',
      title: 'E-Commerce SEO & Product Schema',
      slug: 'ecommerce-seo',
      shortDesc: 'Category taxonomy structure, faceted navigation crawl budget protection, merchant center product schema, and revenue growth.',
      fullDesc: `Scale non-branded organic revenue for Shopify, WooCommerce, and custom stores. We fix duplicate content from faceted filtering, optimize high-volume category hubs, and implement rich Merchant snippet badges.`,
      icon: 'Zap',
      price: '$1,199',
      duration: 'Monthly Campaign',
      badge: 'Revenue Focused',
      features: [
        'Faceted Navigation & Filter Canonicalization',
        'Product Schema Markup (Ratings, InStock, Price drop)',
        'Collection & Category Hub Optimization',
        'Out-of-Stock Product Redirect Strategy',
        'Shopify / WooCommerce Core Speed Tuning',
        'Revenue & Attribution Analytics Tracking',
      ],
      tiers: [
        {
          id: 'tier-ecom-starter',
          name: 'Catalog Boost (Up to 100 Products)',
          price: '$1,199',
          period: '/month',
          description: 'Boutique online stores aiming to outrank major marketplaces.',
          deliverables: ['Category Pages Overhaul', 'Product Schema Implementation', 'Faceted Filter Canonical Rules', 'Revenue Attribution Dashboard'],
        },
        {
          id: 'tier-ecom-growth',
          name: 'Scale Catalog (Up to 1,000 Products)',
          price: '$2,399',
          period: '/month',
          description: 'Mid-to-large catalogs requiring advanced crawl budget engineering.',
          deliverables: ['Comprehensive Catalog Architecture', 'Automated Rich Schema Scripts', 'Commercial Content Production', 'Dedicated E-Commerce Specialist'],
          popular: true,
        },
      ],
      published: true,
      order: 5,
      seo: {
        metaTitle: 'E-Commerce SEO Services for Shopify & WooCommerce',
        metaDescription: 'Drive organic shopping revenue with faceted navigation SEO, rich product schema, and collection page architecture.',
        metaKeywords: 'ecommerce SEO, Shopify SEO, product schema, category page optimization, WooCommerce SEO',
      },
    },
    {
      id: 'srv-audit-consulting',
      title: 'Comprehensive SEO Audit & Growth Blueprint',
      slug: 'seo-audit',
      shortDesc: 'A rigorous 150+ point technical, content, backlink, and competitive audit with prioritized execution roadmap.',
      fullDesc: `Uncover the hidden algorithm penalties, cannibalization traps, and missed search volume opportunities holding your business back. Delivered as an exhaustive 40+ page executive report with prioritized sprint tasks.`,
      icon: 'Eye',
      price: '$1,250',
      duration: 'One-Time Delivery',
      badge: 'Essential',
      features: [
        '150+ Point Algorithmic & Technical Audit',
        'Competitor Keyword & Backlink Matrix Analysis',
        'Topical Authority Gap & Content Roadmap',
        'Mobile Experience & Core Web Vitals Benchmark',
        'Penalty & Algorithm Recovery Assessment',
        '60-Minute 1-on-1 Strategy Walkthrough Call',
      ],
      tiers: [
        {
          id: 'tier-audit-standard',
          name: 'Executive SEO Audit',
          price: '$1,250',
          period: 'one-time',
          description: 'Complete strategic diagnosis for standard web applications and marketing sites.',
          deliverables: ['40+ Page Detailed Report', 'Crawl Bottleneck Spreadsheet', 'Prioritized Engineering Backlog', '60-Min Video Strategy Call'],
          popular: true,
        },
      ],
      published: true,
      order: 6,
      seo: {
        metaTitle: 'Comprehensive SEO Audit & Growth Strategy Blueprint',
        metaDescription: 'Get an exhaustive 150+ point SEO audit uncovering technical errors, content gaps, and an actionable roadmap to double your organic traffic.',
        metaKeywords: 'SEO audit, technical audit, SEO roadmap, website penalty recovery, competitor gap analysis',
      },
    },
  ],
  seo: {
    metaTitle: 'Apex SEO Studio — High-Performance Organic Growth & Search Architecture',
    titleFormat: '%s — Apex SEO Studio',
    metaDescription: 'Premier SEO engineering agency delivering technical audits, semantic content silos, high-authority backlink outreach, and sustainable Google #1 rankings.',
    metaKeywords: 'SEO agency, technical SEO, link building, organic growth, Google rankings, SEO audit, Core Web Vitals',
    canonicalUrl: 'https://apexseostudio.com',
    ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    allowIndexing: true,
    authorOrPublisher: 'Apex SEO Growth Team',
    pageSeo: {
      home: {
        metaTitle: 'Apex SEO Studio — High-Performance Organic Growth & Search Architecture',
        metaDescription: 'Premier SEO engineering agency delivering technical audits, semantic content silos, high-authority backlink outreach, and sustainable Google #1 rankings.',
        metaKeywords: 'SEO agency, technical SEO, link building, organic growth, Google rankings',
      },
      services: {
        metaTitle: 'SEO Agency Services & Strategic Growth Packages | Apex SEO',
        metaDescription: 'Explore our ROI-driven SEO services: Technical Core Web Vitals audits, on-page topical authority silos, high-DR link building, and local Google Map Pack domination.',
        metaKeywords: 'SEO services, SEO packages, hire SEO expert, SEO monthly retainer, backlink outreach',
      },
      blog: {
        metaTitle: 'Search Insights & Algorithm Intelligence Journal | Apex SEO',
        metaDescription: 'Actionable SEO case studies, Google algorithm breakdown dispatches, and organic growth playbooks written by senior search architects.',
        metaKeywords: 'SEO blog, Google algorithm updates, link building guide, Core Web Vitals tutorial',
      },
      about: {
        metaTitle: 'About Apex SEO Studio — Search Engineers & Data Strategists',
        metaDescription: 'Meet our distributed collective of SEO architects, former search quality raters, and data engineers obsessed with organic revenue.',
        metaKeywords: 'SEO agency team, about SEO experts, data-driven SEO, search intelligence',
      },
      contact: {
        metaTitle: 'Book a Strategy Call & Inquire About SEO Retainers | Apex SEO',
        metaDescription: 'Ready to scale non-branded organic revenue? Request a custom discovery call or SEO proposal from our senior consultants.',
        metaKeywords: 'contact SEO agency, request SEO proposal, hire SEO consultant',
      },
    },
  },
  payment: {
    currency: 'USD',
    currencySymbol: '$',
    currencyPosition: 'before',
    allowClientTransactionProof: true,
    checkoutSuccessMessage:
      'Thank you for your order! Your payment details and project scope have been received and recorded in our live database.',
    invoiceNotes: 'Official invoice issued by Apex SEO Studio. Technical sprints commence upon payment confirmation.',
    methods: [
      {
        id: 'bank_transfer',
        name: 'Direct Bank Transfer / Wire',
        code: 'bank',
        description: 'Transfer directly to our agency corporate bank account (IBAN / Wire).',
        badge: 'Recommended',
        icon: 'Building2',
        enabled: true,
        requiresTransactionId: true,
        bankName: 'Standard Chartered / Chase Commercial',
        accountTitle: 'Apex Digital NorthVale Agency LLC',
        accountNumber: '0129-4820-9912-3841',
        ibanOrSwift: 'SCBLPKKHI019284',
        branchNameOrCode: 'Main Corporate Branch 0102',
        instructions:
          'Please make your bank wire transfer using your Company Name or Order Reference. Once transferred, enter your Transaction / Reference ID below for rapid verification.',
      },
      {
        id: 'stripe_card',
        name: 'Credit / Debit Card (Visa, MasterCard, Amex)',
        code: 'card',
        description: 'Fast & secure encrypted payment via Visa, MasterCard, or American Express.',
        badge: 'Instant',
        icon: 'CreditCard',
        enabled: true,
        requiresTransactionId: false,
        testMode: true,
        stripePublishableKey: 'pk_test_sample_51O9... (Customizable in Admin)',
        instructions:
          'Card payments are encrypted with 256-bit bank-grade SSL protocol. Receipts are emailed instantly.',
      },
      {
        id: 'paypal',
        name: 'PayPal Express Checkout',
        code: 'paypal',
        description: 'Pay safely using your PayPal balance or linked international credit cards.',
        badge: 'Buyer Protection',
        icon: 'Wallet',
        enabled: true,
        requiresTransactionId: true,
        paypalEmailOrLink: 'payments@northvale.agency',
        instructions:
          'Send payment to our verified PayPal business account: payments@northvale.agency (or paypal.me/apexseostudio). Enter the PayPal Transaction ID below.',
      },
      {
        id: 'easypaisa_jazzcash',
        name: 'JazzCash / EasyPaisa / Mobile Wallet',
        code: 'wallet',
        description: 'Instant mobile account transfer for Pakistani clients & local agency retainers.',
        badge: 'Instant Mobile',
        icon: 'Smartphone',
        enabled: true,
        requiresTransactionId: true,
        walletProvider: 'JazzCash / EasyPaisa / Raast',
        accountTitle: 'NorthVale Digital Media',
        walletNumber: '0300-8291482',
        instructions:
          'Open your JazzCash / EasyPaisa app > Send Money > Enter 0300-8291482 (NorthVale Digital Media). Copy the TID from the confirmation SMS and enter it below.',
      },
      {
        id: 'crypto_usdt',
        name: 'Cryptocurrency (USDT TRC-20 / Bitcoin)',
        code: 'crypto',
        description: 'Pay with borderless digital assets with zero foreign exchange markup.',
        badge: '0% FX Fee',
        icon: 'Coins',
        enabled: false,
        requiresTransactionId: true,
        cryptoNetwork: 'USDT (TRC-20 / Binance Pay)',
        cryptoAddress: 'TYs9823hAkL20NqPd93kLq912kLqwP109k',
        instructions:
          'Send exact USDT amount via TRC-20 network to the address above. Paste transaction TXID hash below.',
      },
      {
        id: 'agency_invoice',
        name: 'Official Agency Invoice (Net-15 / PO)',
        code: 'custom',
        description: 'Pay upon receiving an official tax invoice with 15-day corporate payment terms.',
        badge: 'Corporate PO',
        icon: 'Receipt',
        enabled: true,
        requiresTransactionId: false,
        instructions:
          'An official agency invoice with payment slip and W-9 / Tax ID will be dispatched to your accounts payable email within 2 business hours.',
      },
    ],
  },
  adminAuth: {
    secretSlug: 'secret-admin',
    username: 'admin',
    allowEmailLogin: true,
  },
};
