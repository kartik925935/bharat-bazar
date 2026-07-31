'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Clock, Tag, ArrowRight, Search, ChevronRight } from 'lucide-react';
import { MOCK_BLOG_POSTS, type MockBlogPost } from '@/lib/mock/customer';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Handloom & Textiles': { bg: '#FFF3E8', text: '#FF7A00' },
  'Pottery & Ceramics':  { bg: '#EFF6FF', text: '#2563EB' },
  'Toys & Games':        { bg: '#F0FDF4', text: '#16A34A' },
  'Care Tips':           { bg: '#FDF4FF', text: '#9333EA' },
  'Culture & Heritage':  { bg: '#FEFCE8', text: '#CA8A04' },
  'Artisan Stories':     { bg: '#FFF1F2', text: '#E11D48' },
};

export default function BlogPage() {
  const [posts] = useState<MockBlogPost[]>(MOCK_BLOG_POSTS);
  const [selectedPost, setSelectedPost] = useState<MockBlogPost | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
          📖 Artisan Stories & Blog
        </h1>
        <p className="text-sm text-[#8C7B6E] mt-0.5">Discover stories, tips and culture behind India's handcrafted treasures</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5A99A]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search stories, crafts, artisans…"
          className="w-full h-11 pl-10 pr-4 rounded-2xl border border-[#E8E4DE] bg-white text-sm outline-none focus:border-[#FF7A00] transition-colors"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-[0_4px_12px_rgba(255,122,0,0.25)]'
                : 'bg-white border border-[#E8E4DE] text-[#4A3728] hover:border-[#FF7A00]/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-12 text-center">
          <BookOpen size={40} className="text-[#E8E4DE] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#4A3728]">No posts found</p>
          <p className="text-xs text-[#8C7B6E] mt-1">Try a different search or category</p>
        </div>
      ) : (
        <>
          {/* Featured Post */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-[#E8E4DE] overflow-hidden hover:shadow-[0_8px_32px_rgba(255,122,0,0.1)] transition-all cursor-pointer group"
              onClick={() => setSelectedPost(featured)}
            >
              <div className="relative h-56 sm:h-72 overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full"
                  style={{ background: CATEGORY_COLORS[featured.category]?.bg ?? '#FFF3E8', color: CATEGORY_COLORS[featured.category]?.text ?? '#FF7A00' }}>
                  {featured.category}
                </span>
                <span className="absolute top-4 right-4 text-[10px] font-bold bg-black/30 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                  Featured
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-white font-black text-lg leading-tight line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {featured.title}
                  </h2>
                  <p className="text-white/80 text-xs mt-1 line-clamp-2">{featured.excerpt}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={featured.authorAvatar} alt={featured.author} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-[#1A0A00]">{featured.author}</p>
                    <p className="text-[10px] text-[#8C7B6E]">{featured.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#8C7B6E]">
                  <span className="flex items-center gap-1"><Clock size={11} /> {featured.readTime}</span>
                  <span className="flex items-center gap-1 text-[#FF7A00] font-bold">Read More <ArrowRight size={11} /></span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-white rounded-2xl border border-[#E8E4DE] overflow-hidden hover:shadow-[0_8px_32px_rgba(255,122,0,0.08)] hover:-translate-y-1 transition-all cursor-pointer group"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: CATEGORY_COLORS[post.category]?.bg ?? '#FFF3E8', color: CATEGORY_COLORS[post.category]?.text ?? '#FF7A00' }}>
                      {post.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-black text-[#1A0A00] line-clamp-2 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#8C7B6E] line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#F5F4F0]">
                      <div className="flex items-center gap-1.5">
                        <img src={post.authorAvatar} alt={post.author} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-[10px] text-[#8C7B6E]">{post.author}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-[#8C7B6E]"><Clock size={10} /> {post.readTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-56 overflow-hidden rounded-t-2xl">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
                <span className="absolute bottom-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: CATEGORY_COLORS[selectedPost.category]?.bg ?? '#FFF3E8', color: CATEGORY_COLORS[selectedPost.category]?.text ?? '#FF7A00' }}>
                  {selectedPost.category}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <h2 className="text-xl font-black text-[#1A0A00] leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedPost.title}
                </h2>

                <div className="flex items-center gap-4 text-xs text-[#8C7B6E]">
                  <div className="flex items-center gap-1.5">
                    <img src={selectedPost.authorAvatar} alt={selectedPost.author} className="w-6 h-6 rounded-full" />
                    <span className="font-semibold text-[#4A3728]">{selectedPost.author}</span>
                  </div>
                  <span>{selectedPost.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {selectedPost.readTime}</span>
                </div>

                <div className="text-sm text-[#4A3728] leading-relaxed whitespace-pre-line">
                  {selectedPost.content}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F5F4F0]">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] font-bold text-[#8C7B6E] bg-[#F5F4F0] px-2.5 py-1 rounded-full">
                      <Tag size={9} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
