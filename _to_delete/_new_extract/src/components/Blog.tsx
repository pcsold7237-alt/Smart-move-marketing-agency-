import React, { useState } from 'react';
import { BookOpen, Clock, ArrowUpRight, X, Calendar, User, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogProps {
  posts: BlogPost[];
  heading?: string;
}

export const Blog: React.FC<BlogProps> = ({ posts, heading }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  const categories = ['All', 'Paid Advertising', 'Web & UX', 'Social Media', 'Growth Strategy'];

  const FALLBACK_BLOG_IMAGE = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_BLOG_IMAGE;
  };

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  return (
    <section id="blog" className="py-24 relative bg-[#0B0F17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-[#B7FF00]/30 text-[#B7FF00] text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#B7FF00]" />
            <span>Growth Intelligence & Field Manuals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {heading || "Latest Marketing Playbooks & Data Breakdown Articles"}
          </h2>
          <p className="text-[#BFC5D2] text-base sm:text-lg">
            Tactical playbooks directly from our media buying and web engineering trenches.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#B7FF00]/20 text-[#B7FF00] border border-[#B7FF00] shadow-[0_0_15px_rgba(183,255,0,0.2)]'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group rounded-3xl glass-card border border-white/10 glass-card-hover flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-gray-950">
                  <img loading="lazy" decoding="async" src={post.image || FALLBACK_BLOG_IMAGE}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-[#B7FF00]">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#B7FF00]" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#B7FF00]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#B7FF00] transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#BFC5D2] line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-2">
                  <img loading="lazy" decoding="async" src={post.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                    alt={post.author?.name || "Smart Move Team"}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-[11px] text-gray-300 font-medium">{post.author?.name || "Smart Move Team"}</span>
                </div>

                <button
                  onClick={() => setReadingPost(post)}
                  className="text-xs font-bold text-[#B7FF00] hover:text-[#CFFF33] flex items-center gap-1 cursor-pointer"
                >
                  Read Article
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {readingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl p-6 sm:p-10 rounded-3xl glass-card border border-[#B7FF00]/30 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReadingPost(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#B7FF00]/20 text-[#B7FF00] border border-[#B7FF00]/40 text-xs font-mono font-bold">
                {readingPost.category}
              </span>
              <span className="text-xs text-gray-400">{readingPost.date} • {readingPost.readTime}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 leading-snug">
              {readingPost.title}
            </h2>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <img loading="lazy" decoding="async" src={readingPost.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={readingPost.author?.name || "Smart Move Team"}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <div className="text-xs font-bold text-white">{readingPost.author?.name || "Smart Move Team"}</div>
                <div className="text-[10px] text-[#B7FF00]">{readingPost.author?.role || "Growth Strategist"}</div>
              </div>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden mb-8 bg-gray-950">
              <img loading="lazy" decoding="async" src={readingPost.image || FALLBACK_BLOG_IMAGE} alt={readingPost.title} className="w-full h-full object-cover" onError={handleImageError} />
            </div>

            <div className="prose prose-invert max-w-none text-gray-200 text-sm leading-relaxed space-y-4 whitespace-pre-line">
              {readingPost.content}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#BFC5D2]">Smart Move Agency Editorial Team</span>
              <button
                onClick={() => setReadingPost(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B7FF00] to-[#9BE000] text-xs font-extrabold text-black cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
