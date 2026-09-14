import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ArrowLeft, Edit2, CheckCircle2, Send, Calendar } from 'lucide-react';

interface CustomPageViewProps {
  slug: string;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ slug }) => {
  const { config, setActiveView, setIsAdminOpen, setAdminTab, visitorMode } = useCms();
  const { pages, theme } = config;

  // Find page by slug
  const page = pages.find((p) => p.slug === slug);

  // Form states for contact-like pages
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!page) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4">
        <h2 className="text-3xl font-extrabold mb-3" style={{ color: theme.textColor }}>
          Page Not Found (404)
        </h2>
        <p className="text-sm mb-6" style={{ color: theme.textMutedColor }}>
          The page slug "/{slug}" does not exist yet. You can create it in the Admin Panel under "Pages".
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="px-4 py-2 text-xs font-semibold rounded-lg border hover:bg-slate-50 transition"
            style={{ borderColor: theme.borderColor, color: theme.textColor }}
          >
            Go to Home
          </button>
          {!visitorMode && (
            <button
              onClick={() => {
                setAdminTab('pages');
                setIsAdminOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-white"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Create Page in Admin
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 6000);
    }
  };

  const isContactPage = slug === 'contact';

  return (
    <div
      id={`cms-page-${page.id}`}
      className="py-12 sm:py-20 min-h-[75vh]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation / Actions Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition cursor-pointer"
            style={{ color: theme.primaryColor }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          {!visitorMode && (
            <button
              onClick={() => {
                setAdminTab('pages');
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 transition"
              style={{ color: theme.textMutedColor }}
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit page in Admin</span>
            </button>
          )}
        </div>

        {/* Header */}
        <header className="mb-10 pb-8 border-b" style={{ borderColor: theme.borderColor }}>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: theme.textColor }}
          >
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-lg sm:text-xl leading-relaxed max-w-2xl" style={{ color: theme.textMutedColor }}>
              {page.subtitle}
            </p>
          )}
          {page.lastUpdated && (
            <div className="flex items-center gap-1.5 text-xs mt-4" style={{ color: theme.textMutedColor }}>
              <Calendar className="w-3.5 h-3.5" />
              <span>Last updated on {page.lastUpdated}</span>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-10">
          <div
            className="space-y-6 text-base sm:text-lg leading-[1.75]"
            style={{ color: theme.textColor }}
          >
            {page.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={idx}
                    className="text-2xl font-bold tracking-tight pt-4 pb-1"
                    style={{ color: theme.textColor }}
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4
                    key={idx}
                    className="text-xl font-bold tracking-tight pt-3"
                    style={{ color: theme.textColor }}
                  >
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('- ')) {
                const listItems = paragraph.split('\n');
                return (
                  <ul key={idx} className="space-y-2 my-4 list-disc pl-5">
                    {listItems.map((li, i) => (
                      <li key={i} className="text-base">
                        {li.replace(/^- /, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Interactive Contact Form if on contact page */}
          {isContactPage && (
            <div
              className="mt-8 p-6 sm:p-8 rounded-xl border shadow-xs"
              style={{
                backgroundColor: theme.surfaceColor,
                borderColor: theme.borderColor,
              }}
            >
              <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: theme.textColor }}>
                Send a Direct Message
              </h3>
              <p className="text-xs mb-6" style={{ color: theme.textMutedColor }}>
                Fill in the form below and our studio team will get back to you promptly.
              </p>

              {formSubmitted ? (
                <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Message Sent Successfully</p>
                    <p className="text-xs">Thank you for reaching out. We will respond within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-1 transition"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-1 transition"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe your project or inquiry..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border focus:outline-none focus:ring-1 transition"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition flex items-center gap-2 shadow-sm cursor-pointer hover:opacity-95"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
