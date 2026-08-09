'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorTitle: string;
  authorBio: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
  status: 'published' | 'draft' | 'pending_review';
  sellerId?: string;
  sellerShopName?: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  posts: BlogPost[];
  isLoading: boolean;
  addPost: (post: Omit<BlogPost, 'id' | 'slug' | 'likes' | 'views' | 'createdAt' | 'updatedAt'>) => void;
  likePost: (id: string) => void;
  incrementViews: (id: string) => void;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  getPublishedPosts: () => BlogPost[];
  getFeaturedPosts: () => BlogPost[];
  getSellerPosts: (sellerId: string) => BlogPost[];
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      posts: [],
      isLoading: false,

      addPost: (postData) => {
        const id = String(Date.now());
        const slug = postData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 80);
        const now = new Date().toISOString();
        const newPost: BlogPost = {
          ...postData,
          id,
          slug,
          likes: 0,
          views: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ posts: [newPost, ...s.posts] }));
      },

      likePost: (id) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)),
        })),

      incrementViews: (id) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p)),
        })),

      getPostBySlug: (slug) => get().posts.find((p) => p.slug === slug),

      getPublishedPosts: () => get().posts.filter((p) => p.status === 'published'),

      getFeaturedPosts: () =>
        get()
          .posts.filter((p) => p.featured && p.status === 'published')
          .slice(0, 2),

      getSellerPosts: (sellerId) => get().posts.filter((p) => p.sellerId === sellerId),
    }),
    { name: 'bharat-bazaar-blog', version: 2 }
  )
);

export const BLOG_CATEGORIES = [
  'All',
  'Craft Stories',
  'Seller Stories',
  'Food & Spices',
  "Buyer's Guide",
  'Lifestyle',
  'Culture & Heritage',
  'Sustainability',
];

export function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}
