'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, Pen, TrendingUp } from 'lucide-react';
import { useBlogStore, BLOG_CATEGORIES } from '@/lib/store/blog-store';

// ─── Skeleton ──────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-black/5 animate-pulse">
      <div className="aspect-[16/10] bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-gray-200 rounded-3xl" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

// ─── Featured Card ──────────────────────────────────────────────────────────
function FeaturedCard({ post, index }: { post: ReturnType<typeof useBlogStore.getState>['posts'][0]; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Link href={`/blog/${post.slug}`} className="block group">
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] mb-4">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
              style={{ background: '#FF7A00' }}
            >
              {post.category}
            </span>
            <h3
              className="text-white font-bold text-lg leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {post.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#8C8B80]">
          <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0">
            <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" sizes="24px" />
          </div>
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <Clock size={12} />
          <span>{post.readTime}</span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Grid Card ──────────────────────────────────────────────────────────────
function BlogCard({ post, index }: { post: ReturnType<typeof useBlogStore.getState>['posts'][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-lg transition-all hover:-translate-y-1 group h-full"
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: '#FFF8F0', color: '#FF7A00' }}
            >
              {post.category}
            </span>
            <span className="text-xs text-[#B0AFA5] flex items-center gap-1">
              <Clock size={11} />
              {post.readTime}
            </span>
          </div>
          <h3
            className="font-bold text-[#1C1B14] mb-2 line-clamp-2 group-hover:text-[#FF7A00] transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {post.title}
          </h3>
          <p className="text-sm text-[#8C8B80] line-clamp-2 mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-2 text-xs text-[#B0AFA5]">
            <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
              <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" sizes="20px" />
            </div>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Blog Listing Page ─────────────────────────────────────────────────
export function BlogPage() {
  const { posts } = useBlogStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const publishedPosts = posts.filter((p) => p.status === 'published');
  const featured = publishedPosts.filter((p) => p.featured).slice(0, 2);

  const filtered = publishedPosts.filter((post) => {
    const matchCat = activeCategory === 'All' || post.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const trending = [...publishedPosts].sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      {/* ── Hero ────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ background: '#FFF8F0', color: '#FF7A00' }}
            >
              📖 STORIES & INSIGHTS
            </span>
            <h1
              className="text-[#1C1B14] mb-4"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
              }}
            >
              The Bharat Bazaar Journal
            </h1>
            <p className="text-[#8C8B80] text-lg max-w-xl mx-auto">
              Craft stories, seller journeys, buying guides, and the living traditions of India&apos;s artisan
              communities.
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-lg mx-auto relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
            <input
              type="text"
              placeholder="Search articles, authors, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-5 rounded-2xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap justify-center">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'text-white shadow-md'
                    : 'bg-white border border-black/10 text-[#555449] hover:border-[#FF7A00]'
                }`}
                style={activeCategory === cat ? { background: 'linear-gradient(135deg, #FF7A00, #FF4500)' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Featured ──────────────────────────────── */}
        <AnimatePresence>
          {activeCategory === 'All' && !searchQuery && featured.length > 0 && (
            <section className="py-12">
              <h2
                className="font-bold text-[#1C1B14] mb-6 text-xl"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Featured Stories
              </h2>
              {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FeaturedSkeleton />
                  <FeaturedSkeleton />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featured.map((post, i) => (
                    <FeaturedCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              )}
            </section>
          )}
        </AnimatePresence>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10 pb-16">
          {/* ── Articles Grid ──────────────────────── */}
          <section className="py-8 lg:py-0">
            {!searchQuery && activeCategory === 'All' && (
              <h2
                className="font-bold text-[#1C1B14] mb-6 text-xl"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                All Articles
              </h2>
            )}
            {searchQuery && (
              <p className="text-sm text-[#8C8B80] mb-6">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
              </p>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : publishedPosts.length === 0 ? (
              // Zero posts in store at all
              <div className="text-center py-24">
                <div className="text-6xl mb-5">✍️</div>
                <h2
                  className="text-xl font-bold text-[#1C1B14] mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  No articles yet
                </h2>
                <p className="text-[#8C8B80] mb-6 max-w-xs mx-auto">
                  Be the first to share your story. Sellers can publish blog posts directly to this page.
                </p>
                <Link
                  href="/seller-blog/create"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
                >
                  <Pen size={14} />
                  Write the First Post
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-[#8C8B80] font-medium mb-2">No articles found</p>
                <p className="text-sm text-[#B0AFA5]">Try a different keyword or category</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="mt-4 px-5 py-2 rounded-full text-sm font-semibold text-[#FF7A00] border border-[#FF7A00] hover:bg-[#FFF8F0] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filtered.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </section>

          {/* ── Sidebar ────────────────────────────── */}
          <aside className="hidden lg:block pt-8">
            <div className="sticky top-24 space-y-6">
              {/* Trending */}
              {trending.length > 0 && (
              <div className="bg-white rounded-2xl border border-black/5 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-[#FF7A00]" />
                  <h4
                    className="font-semibold text-[#1C1B14] text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Trending Now
                  </h4>
                </div>
                <div className="space-y-4">
                  {trending.map((p, i) => (
                    <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-3 group">
                      <span className="text-2xl font-black text-[#F0EDE8] shrink-0 leading-none">{i + 1}</span>
                      <div>
                        <div className="text-xs font-bold mb-0.5" style={{ color: '#FF7A00' }}>
                          {p.category}
                        </div>
                        <div
                          className="text-sm text-[#1C1B14] font-medium leading-snug group-hover:text-[#FF7A00] transition-colors line-clamp-2"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {p.title}
                        </div>
                        <div className="text-xs text-[#B0AFA5] mt-0.5">{p.views.toLocaleString()} views</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              )}

              {/* Write for us CTA */}
              <div
                className="rounded-2xl p-5 text-white"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
              >
                <div className="text-2xl mb-2">✍️</div>
                <div className="font-semibold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Are you a seller?
                </div>
                <p className="text-xs text-white/80 mb-3">
                  Share your craft story, tips, or journey. Write a blog post and reach thousands of customers.
                </p>
                <Link
                  href="/seller-blog/create"
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-white rounded-xl text-xs font-semibold hover:scale-105 transition-transform"
                  style={{ color: '#FF7A00' }}
                >
                  <Pen size={12} />
                  Write a Post
                </Link>
              </div>

              {/* Newsletter */}
              <div className="bg-white rounded-2xl border border-black/5 p-5">
                <h4
                  className="font-semibold text-[#1C1B14] mb-1 text-sm"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Stay Updated
                </h4>
                <p className="text-xs text-[#8C8B80] mb-3">New stories every week. No spam, ever.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 h-9 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-xs"
                  />
                  <button
                    className="h-9 px-3 rounded-xl text-white text-xs font-semibold"
                    style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Newsletter Banner ─────────────────────── */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-white text-center sm:text-left">
              <h3
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Get Curated Artisan Finds in Your Inbox
              </h3>
              <p className="text-white/80 text-sm">Join 2,34,000 craft lovers. No spam, ever.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 sm:w-64 h-12 px-4 rounded-xl outline-none text-sm text-[#1C1B14]"
              />
              <button className="h-12 px-6 rounded-xl bg-[#1C1B14] text-white text-sm font-bold hover:bg-black transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
