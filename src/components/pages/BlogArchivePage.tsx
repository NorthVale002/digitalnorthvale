import React, { useState, useMemo } from 'react';
import { useCms } from '../../context/CmsContext';
import { Search, Calendar, Clock, ArrowRight, PenTool, Plus } from 'lucide-react';

export const BlogArchivePage: React.FC = () => {
  const { config, setActiveView, setIsAdminOpen, setAdminTab, visitorMode } = useCms();
  const { posts, theme } = config;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory && post.published;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div
      id="cms-blog-archive-page"
      className="py-16 sm:py-24 min-h-[75vh]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <p
            className="text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: theme.primaryColor }}
          >
            THE EDITORIAL JOURNAL
          </p>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
            style={{ color: theme.textColor }}
          >
            Essays, Perspectives & Research
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: theme.textMutedColor }}
          >
            Insights on design systems, typography discipline, digital publishing workflows, and thoughtful technology.
          </p>

          {!visitorMode && (
            <div className="mt-5">
              <button
                onClick={() => {
                  setAdminTab('blog');
                  setIsAdminOpen(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write New Article</span>
              </button>
            </div>
          )}
        </div>

        {/* Search & Category Filter Bar */}
        <div
          className="p-4 rounded-xl border mb-12 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            backgroundColor: theme.surfaceColor,
            borderColor: theme.borderColor,
          }}
        >
          {/* Category Pills */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                  style={{
                    backgroundColor: active ? theme.primaryColor : 'transparent',
                    color: active ? '#ffffff' : theme.textColor,
                    border: active ? 'none' : `1px solid ${theme.borderColor}`,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 transition"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
              }}
            />
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => {
                  setActiveView(`post:${post.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col"
                style={{
                  backgroundColor: theme.surfaceColor,
                  borderColor: theme.borderColor,
                }}
              >
                {/* Cover Image */}
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

                {/* Content */}
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

                    <h2
                      className="text-xl font-bold tracking-tight mb-2.5 group-hover:opacity-85 transition leading-snug"
                      style={{ color: theme.textColor }}
                    >
                      {post.title}
                    </h2>

                    <p
                      className="text-sm leading-relaxed line-clamp-3 mb-4"
                      style={{ color: theme.textMutedColor }}
                    >
                      {post.excerpt}
                    </p>
                  </div>

                  <div
                    className="pt-4 border-t flex items-center justify-between"
                    style={{ borderColor: theme.borderColor }}
                  >
                    <div>
                      <span className="text-xs font-semibold block" style={{ color: theme.textColor }}>
                        {post.author}
                      </span>
                      <span className="text-[11px]" style={{ color: theme.textMutedColor }}>
                        {post.authorRole}
                      </span>
                    </div>

                    <span
                      className="text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition"
                      style={{ color: theme.primaryColor }}
                    >
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20 rounded-xl border max-w-lg mx-auto"
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
            }}
          >
            <PenTool className="w-10 h-10 mx-auto mb-3 text-slate-400" />
            <h3 className="text-lg font-bold mb-1" style={{ color: theme.textColor }}>
              No articles found
            </h3>
            <p className="text-xs mb-4" style={{ color: theme.textMutedColor }}>
              Try adjusting your search query or selected category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs font-semibold underline"
              style={{ color: theme.primaryColor }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
