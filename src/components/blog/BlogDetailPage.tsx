'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Clock,
  Tag,
  ArrowLeft,
  Bookmark,
  Heart,
  Eye,
  Link2,
  CheckCircle2,
} from 'lucide-react';

// lucide-react removed Twitter/Facebook — use inline SVGs
function IconTwitterX({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function IconFacebook({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
import { useBlogStore } from '@/lib/store/blog-store';
import { toast } from 'sonner';

// ── Skeleton ────────────────────────────────────────────────────────────────
function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      <div className="h-[50vh] bg-gray-200 animate-pulse" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-20 bg-gray-200 rounded-full" />
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`h-4 bg-gray-200 rounded ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
              ))}
            </div>
          </div>
          <div className="hidden lg:block space-y-4 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Blog Detail ─────────────────────────────────────────────────────────────
export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { posts, likePost, incrementViews, getPostBySlug } = useBlogStore();

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const post = getPostBySlug(String(slug));
  const allPosts = posts.filter((p) => p.status === 'published');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (post && !isLoading) {
      incrementViews(post.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id, isLoading]);

  if (isLoading) return <BlogDetailSkeleton />;

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-[#1C1B14] mb-2">Article Not Found</h2>
          <p className="text-[#8C8B80] mb-6">This story has moved or doesn&apos;t exist.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
          >
            <ArrowLeft size={16} />
            Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  const related = allPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);
  const moreArticles = allPosts.filter((p) => p.id !== post.id).slice(0, 4);
  const paragraphs = post.content.split('\n\n').filter(Boolean);

  const handleLike = () => {
    if (!liked) {
      likePost(post.id);
      setLiked(true);
      toast.success('Added to your liked articles');
    }
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Link copied!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Could not copy link');
      }
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0">
      {/* ── Hero Image ─────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[320px] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
                style={{ background: '#FF7A00' }}
              >
                {post.category}
              </span>
              <h1
                className="text-white mb-3"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-white/80 text-sm flex-wrap">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
                  <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" sizes="32px" />
                </div>
                <span className="font-medium">{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <Clock size={14} />
                <span>{post.readTime}</span>
                <span>·</span>
                <Eye size={14} />
                <span>{(post.views + 1).toLocaleString()} views</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
          {/* Article */}
          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#8C8B80] hover:text-[#FF7A00] mb-8 transition-colors"
            >
              <ArrowLeft size={15} />
              Back to Journal
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-[#D4D3CB] text-[#555449]"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Body */}
            <div className="prose max-w-none">
              {paragraphs.map((para, i) => {
                if (para.startsWith('## ')) {
                  return (
                    <h2
                      key={i}
                      className="text-[#1C1B14] mt-10 mb-4"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '1.35rem',
                        fontWeight: 700,
                      }}
                    >
                      {para.replace('## ', '')}
                    </h2>
                  );
                }
                if (para.startsWith('# ')) {
                  return (
                    <h1
                      key={i}
                      className="text-[#1C1B14] mt-10 mb-4"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '1.75rem',
                        fontWeight: 800,
                      }}
                    >
                      {para.replace('# ', '')}
                    </h1>
                  );
                }
                return (
                  <p key={i} className="text-[#555449] leading-relaxed mb-5 text-base">
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Author Box */}
            <div className="mt-12 p-6 bg-white rounded-2xl border border-black/5 flex gap-4 items-start">
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                <Image src={post.authorAvatar} alt={post.author} fill className="object-cover" sizes="56px" />
              </div>
              <div>
                <div
                  className="font-semibold text-[#1C1B14] mb-0.5"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {post.author}
                </div>
                <div className="text-xs font-medium mb-2" style={{ color: '#FF7A00' }}>
                  {post.authorTitle}
                </div>
                <p className="text-sm text-[#8C8B80]">{post.authorBio}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  liked
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-[#D4D3CB] text-[#555449] hover:border-red-200'
                }`}
              >
                <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
                {liked ? `${post.likes + 1} Liked` : `${post.likes} Likes`}
              </button>
              <button
                onClick={() => setBookmarked((b) => !b)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  bookmarked
                    ? 'border-[#FF7A00] bg-[#FFF8F0] text-[#FF7A00]'
                    : 'border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00]'
                }`}
              >
                <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
                {bookmarked ? 'Saved' : 'Save'}
              </button>

              {/* Share buttons */}
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[#D4D3CB] text-[#555449] hover:border-sky-400 hover:text-sky-500 transition-all"
              >
                <IconTwitterX size={14} />
                Tweet
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[#D4D3CB] text-[#555449] hover:border-blue-500 hover:text-blue-500 transition-all"
              >
                <IconFacebook size={14} />
                Share
              </button>
              <button
                onClick={() => handleShare('copy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  copied
                    ? 'border-green-400 text-green-500 bg-green-50'
                    : 'border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00]'
                }`}
              >
                {copied ? <CheckCircle2 size={14} /> : <Link2 size={14} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </motion.article>

          {/* ── Sidebar ─────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* More articles */}
              <div className="bg-white rounded-2xl border border-black/5 p-5">
                <h4
                  className="font-semibold text-[#1C1B14] mb-4 text-sm"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  More Articles
                </h4>
                <div className="space-y-4">
                  {moreArticles.map((p) => (
                    <Link key={p.id} href={`/blog/${p.slug}`} className="block group">
                      <div className="text-xs font-bold mb-0.5" style={{ color: '#FF7A00' }}>
                        {p.category}
                      </div>
                      <div
                        className="text-sm text-[#1C1B14] font-medium leading-snug group-hover:text-[#FF7A00] transition-colors line-clamp-2"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {p.title}
                      </div>
                      <div className="text-xs text-[#B0AFA5] mt-0.5">{p.readTime}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Shop CTA */}
              <div
                className="rounded-2xl p-5 text-white"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
              >
                <div className="text-2xl mb-2">🛍️</div>
                <div className="font-semibold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Shop the Story
                </div>
                <p className="text-xs text-white/80 mb-3">
                  Find authentic {post.tags[0]} products on Bharat Bazaar
                </p>
                <Link
                  href="/products"
                  className="block w-full text-center py-2 bg-white rounded-xl text-xs font-semibold hover:scale-105 transition-transform"
                  style={{ color: '#FF7A00' }}
                >
                  Browse Products →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Related ────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3
              className="font-bold text-[#1C1B14] mb-6 text-xl"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Related Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="block bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-md transition-all group"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-bold mb-2" style={{ color: '#FF7A00' }}>
                      {p.category}
                    </div>
                    <div
                      className="text-sm font-semibold text-[#1C1B14] line-clamp-2 group-hover:text-[#FF7A00] transition-colors"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {p.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
