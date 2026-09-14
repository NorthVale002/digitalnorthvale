import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { DynamicIcon } from './DynamicIcon';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { config, activeView, setActiveView, setIsAdminOpen, setAdminTab } = useCms();
  const { header, theme } = config;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (link: string) => {
    setMobileMenuOpen(false);
    if (link === '/' || link === '/home') {
      setActiveView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link === '/services') {
      setActiveView('services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.startsWith('/service/')) {
      const slug = link.replace('/service/', '');
      setActiveView(`service:${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link === '/blog') {
      setActiveView('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.startsWith('/p/')) {
      const slug = link.replace('/p/', '');
      setActiveView(`page:${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.startsWith('/')) {
      const slug = link.replace('/', '');
      // Check if matches a known page
      const matchedPage = config.pages.find((p) => p.slug === slug);
      if (matchedPage) {
        setActiveView(`page:${slug}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setActiveView('home');
      }
    } else if (link.startsWith('#')) {
      if (link === '#admin-open') {
        setIsAdminOpen(true);
      } else {
        const el = document.querySelector(link);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const isNavActive = (link: string) => {
    if (link === '/' && activeView === 'home') return true;
    if (link === '/services' && (activeView === 'services' || activeView.startsWith('service:'))) return true;
    if (link === '/blog' && (activeView === 'blog' || activeView.startsWith('post:'))) return true;
    if (link.startsWith('/') && activeView === `page:${link.replace('/', '')}`) return true;
    return false;
  };

  return (
    <div className={`w-full ${header.isSticky ? 'sticky top-0 z-40' : 'relative z-20'}`}>
      {/* Top Announcement Bar if enabled */}
      {header.showAnnouncement && header.announcementText && (
        <div
          id="cms-announcement-bar"
          className="text-xs py-2 px-4 text-center font-medium border-b flex items-center justify-center gap-2 transition"
          style={{
            backgroundColor: theme.surfaceColor,
            borderColor: theme.borderColor,
            color: theme.textColor,
          }}
        >
          <Sparkles className="w-3.5 h-3.5 inline-block opacity-80" />
          <span>{header.announcementText}</span>
          {header.announcementLink && (
            <button
              onClick={() => handleNavClick(header.announcementLink)}
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:opacity-80 ml-1.5 cursor-pointer"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Main Navigation Header */}
      <header
        id="cms-main-site-header"
        className="w-full border-b backdrop-blur-md transition duration-200"
        style={{
          backgroundColor: `${theme.surfaceColor}f2`,
          borderColor: theme.borderColor,
          color: theme.textColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo / Site Title */}
            <div className="flex items-center gap-3">
              <button
                id="cms-header-logo-btn"
                onClick={() => handleNavClick('/')}
                className="flex items-center gap-2.5 text-left group"
              >
                {header.logoType === 'icon' && header.logoIcon && (
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm transition group-hover:scale-105"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <DynamicIcon name={header.logoIcon} className="w-5 h-5" />
                  </div>
                )}
                {header.logoType === 'image' && header.logoUrl && (
                  <img
                    src={header.logoUrl}
                    alt={header.siteTitle}
                    className="h-8 w-auto object-contain"
                  />
                )}
                <div>
                  <span
                    className="text-lg font-bold tracking-tight block leading-tight group-hover:opacity-80 transition"
                    style={{ color: theme.textColor }}
                  >
                    {header.siteTitle || 'My Studio'}
                  </span>
                  {header.tagline && (
                    <span
                      className="text-xs hidden sm:block tracking-normal font-normal"
                      style={{ color: theme.textMutedColor }}
                    >
                      {header.tagline}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {header.navItems.map((item) => {
                const active = isNavActive(item.link);
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.link)}
                    className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition relative ${
                      active ? 'font-semibold' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{
                      color: active ? theme.primaryColor : theme.textColor,
                      backgroundColor: active ? `${theme.primaryColor}10` : 'transparent',
                    }}
                  >
                    {item.label}
                    {active && (
                      <span
                        className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Header Right Actions & CTA */}
            <div className="hidden md:flex items-center gap-3">
              {header.ctaButton.show && (
                <button
                  id="cms-header-cta-btn"
                  onClick={() => handleNavClick(header.ctaButton.link)}
                  className="px-4 py-2 text-sm font-semibold rounded-md transition shadow-sm hover:opacity-95 active:scale-98 cursor-pointer flex items-center gap-1.5 text-white"
                  style={{
                    backgroundColor: theme.primaryColor,
                    borderRadius:
                      theme.borderRadius === 'none'
                        ? '0px'
                        : theme.borderRadius === 'full'
                        ? '9999px'
                        : '6px',
                  }}
                >
                  <span>{header.ctaButton.text || 'Get Started'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                id="cms-mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md hover:bg-slate-100/50 transition"
                style={{ color: theme.textColor }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2"
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
            }}
          >
            {header.navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.link)}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-md transition block"
                style={{
                  color: isNavActive(item.link) ? theme.primaryColor : theme.textColor,
                  backgroundColor: isNavActive(item.link) ? `${theme.primaryColor}12` : 'transparent',
                }}
              >
                {item.label}
              </button>
            ))}

            {header.ctaButton.show && (
              <div className="pt-2">
                <button
                  onClick={() => handleNavClick(header.ctaButton.link)}
                  className="w-full py-2.5 text-sm font-semibold rounded-md text-white text-center block shadow-sm"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {header.ctaButton.text}
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
};
