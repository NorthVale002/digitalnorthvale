import React from 'react';
import { useCms } from '../../context/CmsContext';
import { ArrowLeft, Calendar, Clock, Edit2, Share2, Tag } from 'lucide-react';

interface BlogPostPageProps {
  slug: string;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug }) => {
  const { config, setActiveView, setIsAdminOpen, setAdminTab, visitorMode } = useCms();
  const { posts, theme } = config;

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4">
        <h2 className="text-2xl font-bold mb-3" style={{ color: theme.textColor }}>
          Article Not Found
        </h2>
        <p className="text-sm mb-6" style={{ color: theme.textMutedColor }}>
          The requested article may have been unpublished or renamed.
        </p>
        <button
          onClick={() => setActiveView('blog')}
          className="px-4 py-2 text-sm font-semibold rounded-lg text-white"
          style={{ backgroundColor: theme.primaryColor }}
        >
          Return to Journal
        </button>
      </div>
    );
  }

  // Related posts (excluding current)
  const relatedPosts = posts.filter((p) => p.id !== post.id && p.published).slice(0, 2);

  return (
    <article
      id={`cms-post-${post.id}`}
      className="py-12 sm:py-20 min-h-[80vh]"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Back */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setActiveView('blog')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-80 transition cursor-pointer"
            style={{ color: theme.primaryColor }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Journal</span>
          </button>

          {!visitorMode && (
            <button
              onClick={() => {
                setAdminTab('blog');
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 transition"
              style={{ color: theme.textMutedColor }}
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit this post</span>
            </button>
          )}
        </div>

        {/* Category & Metadata */}
        <div className="mb-4 flex items-center gap-2">
          {post.category && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${theme.primaryColor}15`,
                color: theme.primaryColor,
              }}
            >
              {post.category}
            </span>
          )}
        </div>

        {/* Article Headline */}
        <h1
          className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6"
          style={{ color: theme.textColor }}
        >
          {post.title}
        </h1>

        {/* Author / Timestamp Bar */}
        <div
          className="flex items-center justify-between border-y py-4 mb-10 text-xs"
          style={{ borderColor: theme.borderColor, color: theme.textMutedColor }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-bold" style={{ color: theme.textColor }}>
                {post.author}
              </p>
              <p className="text-[11px]">{post.authorRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {post.coverImage && (
          <div
            className="rounded-2xl overflow-hidden border shadow-sm mb-12 aspect-[16/9]"
            style={{ borderColor: theme.borderColor }}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Lead Excerpt */}
        {post.excerpt && (
          <div
            className="text-lg sm:text-xl font-medium leading-relaxed mb-8 italic border-l-3 pl-5"
            style={{
              borderColor: theme.primaryColor,
              color: theme.textColor,
            }}
          >
            {post.excerpt}
          </div>
        )}

        {/* Post Body Content */}
        <div
          className="space-y-6 text-base sm:text-lg leading-[1.75] font-normal"
          style={{ color: theme.textColor }}
        >
          {post.content.split('\n\n').map((paragraph, index) => {
            // Check if heading
            if (paragraph.startsWith('### ')) {
              return (
                <h3
                  key={index}
                  className="text-2xl font-bold tracking-tight pt-6 pb-2"
                  style={{ color: theme.textColor }}
                >
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h4
                  key={index}
                  className="text-xl font-bold tracking-tight pt-4 pb-1"
                  style={{ color: theme.textColor }}
                >
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }
            return (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Article Footer & Share */}
        <div
          className="mt-16 pt-8 border-t flex items-center justify-between text-xs"
          style={{ borderColor: theme.borderColor, color: theme.textMutedColor }}
        >
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" />
            <span>Category: {post.category || 'General'}</span>
          </div>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Article URL copied to clipboard!');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border hover:bg-slate-50 transition"
            style={{ borderColor: theme.borderColor, color: theme.textColor }}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Related Reads */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t" style={{ borderColor: theme.borderColor }}>
            <h3 className="text-xl font-bold tracking-tight mb-6" style={{ color: theme.textColor }}>
              Read Next
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    setActiveView(`post:${r.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-5 rounded-xl border cursor-pointer hover:shadow-md transition"
                  style={{
                    backgroundColor: theme.surfaceColor,
                    borderColor: theme.borderColor,
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: theme.primaryColor }}>
                    {r.category}
                  </p>
                  <h4 className="font-bold text-base mb-2" style={{ color: theme.textColor }}>
                    {r.title}
                  </h4>
                  <p className="text-xs line-clamp-2" style={{ color: theme.textMutedColor }}>
                    {r.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
