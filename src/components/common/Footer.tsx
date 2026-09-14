import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import {
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Mail,
  Send,
  CheckCircle2,
  ArrowUp,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { config, setActiveView } = useCms();
  const { footer, header, theme } = config;
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleLinkClick = (url: string) => {
    if (url === '/' || url === '/home') {
      setActiveView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (url === '/services') {
      setActiveView('services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (url.startsWith('/service/')) {
      const slug = url.replace('/service/', '');
      setActiveView(`service:${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (url === '/blog') {
      setActiveView('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (url.startsWith('/p/')) {
      setActiveView(`page:${url.replace('/p/', '')}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (url.startsWith('/')) {
      const slug = url.replace('/', '');
      const match = config.pages.find((p) => p.slug === slug);
      if (match) {
        setActiveView(`page:${slug}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setActiveView('home');
      }
    } else if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="cms-main-site-footer"
      className="w-full border-t transition-colors duration-200 mt-auto"
      style={{
        backgroundColor: theme.surfaceColor,
        borderColor: theme.borderColor,
        color: theme.textColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Newsletter Section if enabled */}
        {footer.showNewsletter && (
          <div
            className="mb-14 p-6 sm:p-8 rounded-xl border relative overflow-hidden"
            style={{
              backgroundColor: `${theme.primaryColor}08`,
              borderColor: `${theme.primaryColor}20`,
            }}
          >
            <div className="max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                {footer.newsletterHeading || 'Stay in the loop'}
              </h3>
              <p
                className="text-sm mb-6 leading-relaxed"
                style={{ color: theme.textMutedColor }}
              >
                {footer.newsletterText ||
                  'Receive curated updates directly to your inbox. No marketing spam.'}
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you for subscribing! Check your inbox shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-2 transition"
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: theme.surfaceColor,
                      color: theme.textColor,
                    }}
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer shadow-sm"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b" style={{ borderColor: theme.borderColor }}>
          {/* Brand & Bio Column */}
          <div className="md:col-span-4 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold tracking-tight" style={{ color: theme.textColor }}>
                {header.siteTitle}
              </span>
            </div>
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: theme.textMutedColor }}
            >
              {footer.siteBio}
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              {footer.socialLinks.twitter && (
                <a
                  href={footer.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border hover:opacity-80 transition"
                  style={{ borderColor: theme.borderColor, color: theme.textMutedColor }}
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {footer.socialLinks.linkedin && (
                <a
                  href={footer.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border hover:opacity-80 transition"
                  style={{ borderColor: theme.borderColor, color: theme.textMutedColor }}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {footer.socialLinks.github && (
                <a
                  href={footer.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border hover:opacity-80 transition"
                  style={{ borderColor: theme.borderColor, color: theme.textMutedColor }}
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {footer.socialLinks.instagram && (
                <a
                  href={footer.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border hover:opacity-80 transition"
                  style={{ borderColor: theme.borderColor, color: theme.textMutedColor }}
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {footer.socialLinks.email && (
                <a
                  href={`mailto:${footer.socialLinks.email}`}
                  className="p-2 rounded-full border hover:opacity-80 transition"
                  style={{ borderColor: theme.borderColor, color: theme.textMutedColor }}
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footer.columns.map((col) => (
              <div key={col.id} className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleLinkClick(link.url)}
                        className="text-sm transition hover:opacity-100 text-left block"
                        style={{ color: theme.textMutedColor }}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal Links, Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: theme.textMutedColor }}>
          <div>{footer.copyrightText}</div>

          <div className="flex items-center space-x-6">
            {footer.bottomLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className="hover:underline transition underline-offset-2"
                style={{ color: theme.textMutedColor }}
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:opacity-100 transition p-1 rounded border ml-2"
              style={{ borderColor: theme.borderColor }}
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
