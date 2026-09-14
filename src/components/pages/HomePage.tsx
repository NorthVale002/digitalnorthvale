import React from 'react';
import { useCms } from '../../context/CmsContext';
import { DynamicSection } from '../sections/DynamicSection';
import { Plus, Sliders } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { config, setIsAdminOpen, setAdminTab, visitorMode } = useCms();
  const { sections, theme } = config;

  const visibleSections = sections.filter((s) => s.isVisible);

  return (
    <main id="cms-home-page" className="w-full flex-1">
      {visibleSections.length > 0 ? (
        visibleSections.map((section) => (
          <DynamicSection key={section.id} section={section} />
        ))
      ) : (
        <div
          className="py-24 px-4 text-center max-w-xl mx-auto my-12 rounded-2xl border"
          style={{
            backgroundColor: theme.surfaceColor,
            borderColor: theme.borderColor,
          }}
        >
          <Sliders className="w-10 h-10 mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-bold mb-2" style={{ color: theme.textColor }}>
            No visible sections on Home Page
          </h3>
          <p className="text-sm mb-6" style={{ color: theme.textMutedColor }}>
            All sections are currently hidden. Open the Admin Panel to enable sections or add new content blocks.
          </p>
          <button
            onClick={() => {
              setAdminTab('sections');
              setIsAdminOpen(true);
            }}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Configure Home Sections
          </button>
        </div>
      )}

      {/* Subtle Add Section Prompt for Admin (hidden in visitor mode) */}
      {!visitorMode && (
        <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
          <button
            id="cms-home-add-block-bottom-btn"
            onClick={() => {
              setAdminTab('sections');
              setIsAdminOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed text-xs font-medium hover:border-solid hover:bg-slate-50 transition"
            style={{
              borderColor: theme.borderColor,
              color: theme.textMutedColor,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add or manage home content blocks</span>
          </button>
        </div>
      )}
    </main>
  );
};
