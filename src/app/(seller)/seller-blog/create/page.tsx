'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Bold,
  Italic,
  Heading2,
  List,
  Quote,
  Image as ImageIcon,
  X,
  Eye,
  Save,
  Send,
  Tag,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';
import { useBlogStore, BLOG_CATEGORIES, estimateReadTime } from '@/lib/store/blog-store';
import { useSellerStore } from '@/lib/store/seller-store';

// ── Zod schema ────────────────────────────────────────────────────────────
const blogSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  excerpt: z
    .string()
    .min(50, 'Excerpt must be at least 50 characters')
    .max(300, 'Excerpt cannot exceed 300 characters'),
  content: z
    .string()
    .min(200, 'Content must be at least 200 characters')
    .max(20000, 'Content cannot exceed 20,000 characters'),
  category: z.string().min(1, 'Please select a category').refine((v) => v !== 'All', 'Please select a valid category'),
  coverImageUrl: z.string().min(1, 'Cover image is required').refine((val) => val.startsWith('http') || val.startsWith('data:image/'), 'Please enter a valid image URL or drop an image'),
  tagsInput: z.string().optional(),
  authorBio: z.string().max(300, 'Bio cannot exceed 300 characters').optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

// ── Helpers ────────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex items-center gap-1.5 text-red-500 text-sm mt-1.5"
        >
          <AlertCircle size={13} />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function FieldSuccess() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-green-500"
    >
      <CheckCircle2 size={16} />
    </motion.span>
  );
}

const inputBase = (hasError: boolean, isValid?: boolean) =>
  `w-full px-4 py-3 rounded-xl border-2 text-base outline-none transition-all focus:ring-4 ${
    hasError
      ? 'border-red-400 bg-red-50/30 focus:border-red-400 focus:ring-red-500/10'
      : isValid
      ? 'border-green-400 focus:border-green-500 focus:ring-green-500/10 bg-green-50/10'
      : 'border-[#E5E4DE] focus:border-[#FF7A00] focus:ring-[#FF7A00]/10'
  }`;

// ── Toolbar button ─────────────────────────────────────────────────────────
function ToolbarBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-[#FF7A00]/10 hover:text-[#FF7A00] text-[#6B7280] transition-colors"
    >
      <Icon size={16} />
    </button>
  );
}

// ── Tag chip ───────────────────────────────────────────────────────────────
function TagChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF8F0] text-[#FF7A00] border border-[#FFDBB5] rounded-full text-sm font-medium">
      <Tag size={11} />
      {label}
      <button type="button" onClick={onRemove} className="hover:text-red-500 transition-colors">
        <X size={11} />
      </button>
    </span>
  );
}

// ── Preview modal ──────────────────────────────────────────────────────────
function PreviewModal({
  data,
  onClose,
}: {
  data: BlogFormValues & { tags: string[] };
  onClose: () => void;
}) {
  const paragraphs = data.content.split('\n\n').filter(Boolean);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[#F0EDE8] px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <span className="text-sm font-semibold text-[#6B7280]">Preview — How it will appear</span>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Cover */}
        {data.coverImageUrl && (data.coverImageUrl.startsWith('http') || data.coverImageUrl.startsWith('data:image/')) && (
          <div className="relative h-56 sm:h-72 overflow-hidden">
            <Image src={data.coverImageUrl} alt={data.title} fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2" style={{ background: '#FF7A00' }}>
                {data.category}
              </span>
              <h1
                className="text-white font-bold leading-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.25rem, 2.5vw, 2rem)' }}
              >
                {data.title}
              </h1>
            </div>
          </div>
        )}

        <div className="px-6 py-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {data.tags.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-medium border border-[#D4D3CB] text-[#555449]">
                #{t}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            {paragraphs.map((para, i) => {
              if (para.startsWith('## '))
                return (
                  <h2 key={i} className="text-[#1C1B14] mt-8 mb-3 text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {para.replace('## ', '')}
                  </h2>
                );
              if (para.startsWith('# '))
                return (
                  <h1 key={i} className="text-[#1C1B14] mt-8 mb-3 text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {para.replace('# ', '')}
                  </h1>
                );
              if (para.startsWith('> '))
                return (
                  <blockquote key={i} className="border-l-4 border-[#FF7A00] pl-4 my-4 italic text-[#555449]">
                    {para.replace('> ', '')}
                  </blockquote>
                );
              return (
                <p key={i} className="text-[#555449] leading-relaxed mb-4 text-base">
                  {para}
                </p>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function SellerBlogCreatePage() {
  const router = useRouter();
  const { seller } = useSellerStore();
  const { addPost } = useBlogStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreviewError, setCoverPreviewError] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors, touchedFields, isValid },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      coverImageUrl: '',
      authorBio: '',
    },
  });

  const watchedContent = watch('content', '');
  const watchedCoverUrl = watch('coverImageUrl', '');
  const watchedTitle = watch('title', '');

  const [isDraggingImage, setIsDraggingImage] = useState(false);

  useEffect(() => {
    setCharCount(watchedContent.length);
  }, [watchedContent]);

  // ── Drag & Drop handlers ────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setValue('coverImageUrl', result, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        setCoverPreviewError(false);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast.error('Please drop a valid image file');
    }
  };

  // ── Tag handlers ────────────────────────────────────────────────────────
  const addTag = () => {
    const cleaned = tagInput.trim().replace(/[^a-zA-Z0-9\s]/g, '').trim();
    if (cleaned && !tags.includes(cleaned) && tags.length < 8) {
      setTags((prev) => [...prev, cleaned]);
      setTagInput('');
    } else if (tags.length >= 8) {
      toast.warning('Maximum 8 tags allowed');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  // ── Toolbar helpers ─────────────────────────────────────────────────────
  const insertMarkdown = (prefix: string, suffix = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end);
    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);
    const inserted = `${prefix}${selected || 'text'}${suffix}`;
    const newVal = `${before}${inserted}${after}`;
    // We need to update RHF value via native input event
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    nativeInputValueSetter?.call(ta, newVal);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'text').length);
    }, 0);
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = async (data: BlogFormValues, status: 'draft' | 'pending_review') => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    const finalTags = tags.length > 0 ? tags : ['Artisan', 'India'];
    const readTime = estimateReadTime(data.content);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    addPost({
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      image: data.coverImageUrl,
      tags: finalTags,
      author: seller?.displayName || seller?.legalName || 'Seller',
      authorTitle: `Seller at ${seller?.shopName || 'Bharat Bazaar'}`,
      authorBio: data.authorBio || "An artisan seller sharing their craft journey on Bharat Bazaar.",
      authorAvatar:
        seller?.shopLogo ||
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=80&h=80&fit=crop',
      date: dateStr,
      readTime,
      featured: false,
      status,
      sellerId: seller?.sellerId,
      sellerShopName: seller?.shopName,
    });

    setIsSubmitting(false);

    if (status === 'draft') {
      toast.success('Draft saved!', { description: "You can edit it anytime from your blog dashboard." });
    } else {
      toast.success('Post submitted for review! 🎉', {
        description: "Our team will review and publish it within 24 hours.",
      });
    }
    router.push('/blog');
  };

  const currentFormData = {
    ...watch(),
    tags,
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#F0EDE8] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/seller-dashboard"
              className="p-2 rounded-xl hover:bg-[#FAFAF8] transition-colors text-[#6B7280] hover:text-[#1C1B14]"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1
                className="text-lg font-black text-[#1C1B14] leading-none"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Write a Blog Post
              </h1>
              <p className="text-xs text-[#9B8F84] mt-0.5">Share your story with thousands of customers</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="hidden sm:flex items-center gap-2 px-4 h-9 rounded-xl border-2 border-[#E5E4DE] text-sm font-semibold text-[#555449] hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all"
            >
              <Eye size={15} />
              Preview
            </button>
            <button
              type="button"
              onClick={handleSubmit((d) => onSubmit(d, 'draft'))}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 h-9 rounded-xl border-2 border-[#E5E4DE] text-sm font-semibold text-[#555449] hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Draft
            </button>
            <button
              type="button"
              onClick={async () => {
                const valid = await trigger();
                if (valid) {
                  handleSubmit((d) => onSubmit(d, 'pending_review'))();
                }
              }}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 h-9 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* ── Main Column ─────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div 
              className={`rounded-2xl border ${isDraggingImage ? 'border-[#FF7A00] bg-[#FFF8F0] shadow-md scale-[1.01]' : 'border-[#F0EDE8] bg-white'} overflow-hidden transition-all duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {watchedCoverUrl && (watchedCoverUrl.startsWith('http') || watchedCoverUrl.startsWith('data:image/')) && !coverPreviewError ? (
                <div className={`relative h-52 sm:h-64 ${isDraggingImage ? 'opacity-50' : ''}`}>
                  <Image
                    src={watchedCoverUrl}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    onError={() => setCoverPreviewError(true)}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Change URL or drop new image below</span>
                  </div>
                </div>
              ) : (
                <div className={`h-52 sm:h-64 flex flex-col items-center justify-center ${isDraggingImage ? 'bg-[#FFF8F0] text-[#FF7A00]' : 'bg-gradient-to-br from-[#FFF8F0] to-[#FAFAF8] text-[#B0AFA5]'} transition-colors`}>
                  <ImageIcon size={40} className={`mb-3 ${isDraggingImage ? 'opacity-100 scale-110' : 'opacity-40'} transition-all`} />
                  <p className="text-sm font-medium">{isDraggingImage ? 'Drop image here' : 'Cover image preview'}</p>
                  <p className="text-xs mt-1">{isDraggingImage ? 'Release to set cover' : 'Enter an image URL or drop an image below'}</p>
                </div>
              )}
              <div className="p-4">
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                  Cover Image URL <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      {...register('coverImageUrl', {
                        onChange: () => setCoverPreviewError(false),
                      })}
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      className={`${inputBase(!!errors.coverImageUrl, touchedFields.coverImageUrl && !errors.coverImageUrl)} pr-10`}
                    />
                    {touchedFields.coverImageUrl && !errors.coverImageUrl && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <FieldSuccess />
                      </span>
                    )}
                  </div>
                </div>
                <FieldError message={errors.coverImageUrl?.message} />
                <p className="text-xs text-[#B0AFA5] mt-1.5">
                  Use a landscape image (16:9 ratio). Unsplash, Pexels, or your own hosted image.
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Article Title <span className="text-red-500">*</span>
                <span className="text-[#B0AFA5] font-normal ml-2">({watchedTitle.length}/120)</span>
              </label>
              <div className="relative">
                <textarea
                  {...register('title')}
                  rows={2}
                  placeholder="E.g. 'How I Built a ₹2 Lakh/Month Business with Madhubani Art'"
                  className={`${inputBase(!!errors.title, touchedFields.title && !errors.title)} resize-none`}
                  style={{ fontSize: '1.1rem', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                />
                {touchedFields.title && !errors.title && (
                  <span className="absolute right-3 top-3">
                    <FieldSuccess />
                  </span>
                )}
              </div>
              <FieldError message={errors.title?.message} />
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Short Excerpt <span className="text-red-500">*</span>
                <span className="text-[#B0AFA5] font-normal ml-2">
                  ({watch('excerpt', '').length}/300)
                </span>
              </label>
              <p className="text-xs text-[#8C8B80] mb-2">
                A brief summary shown on the blog listing page. Write 1–3 sentences that make people want to click.
              </p>
              <div className="relative">
                <textarea
                  {...register('excerpt')}
                  rows={3}
                  placeholder="E.g. 'When I started selling online, I had ₹5,000 and a simple loom. Here's what I learned in 2 years that changed everything.'"
                  className={`${inputBase(!!errors.excerpt, touchedFields.excerpt && !errors.excerpt)} resize-none`}
                />
                {touchedFields.excerpt && !errors.excerpt && (
                  <span className="absolute right-3 top-3">
                    <FieldSuccess />
                  </span>
                )}
              </div>
              <FieldError message={errors.excerpt?.message} />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-4 py-2.5 border-b border-[#F0EDE8] flex-wrap">
                <ToolbarBtn icon={Bold} label="Bold" onClick={() => insertMarkdown('**', '**')} />
                <ToolbarBtn icon={Italic} label="Italic" onClick={() => insertMarkdown('_', '_')} />
                <div className="w-px h-5 bg-[#E5E4DE] mx-1" />
                <ToolbarBtn icon={Heading2} label="Heading" onClick={() => insertMarkdown('\n## ', '')} />
                <ToolbarBtn icon={List} label="Bullet list" onClick={() => insertMarkdown('\n- ', '')} />
                <ToolbarBtn icon={Quote} label="Blockquote" onClick={() => insertMarkdown('\n> ', '')} />
                <div className="ml-auto flex items-center gap-2 text-xs text-[#B0AFA5]">
                  <FileText size={13} />
                  <span>{charCount.toLocaleString()} chars</span>
                  <span>·</span>
                  <span>{estimateReadTime(watchedContent)}</span>
                </div>
              </div>

              <div className="p-5">
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                  Article Content <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-[#8C8B80] mb-3">
                  Write your full article. Use <code className="bg-gray-100 px-1 rounded">## Heading</code> for
                  sections, <code className="bg-gray-100 px-1 rounded">&gt; Quote</code> for blockquotes.
                  Minimum 200 characters.
                </p>
                <textarea
                  {...register('content')}
                  ref={(e) => {
                    register('content').ref(e);
                    (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = e;
                  }}
                  rows={18}
                  placeholder={`Start your story here...\n\n## My Journey\n\nTell readers about your craft, your village, your process — anything that connects them to what you make.\n\n## What I Learned\n\nShare insights, tips, or lessons from your experience as an artisan or seller.`}
                  className={`${inputBase(!!errors.content, touchedFields.content && !errors.content)} resize-y font-mono text-sm leading-relaxed min-h-[300px]`}
                />
                <FieldError message={errors.content?.message} />
              </div>
            </div>

            {/* Author Bio */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                About the Author (Optional)
              </label>
              <p className="text-xs text-[#8C8B80] mb-2">
                A short bio shown at the bottom of your article. Describe yourself as a seller or artisan.
              </p>
              <textarea
                {...register('authorBio')}
                rows={2}
                placeholder="E.g. 'Third-generation Kalamkari artist from Andhra Pradesh. I sell sustainable home decor on Bharat Bazaar.'"
                className={inputBase(!!errors.authorBio, touchedFields.authorBio && !errors.authorBio)}
              />
              <FieldError message={errors.authorBio?.message} />
            </div>
          </div>

          {/* ── Sidebar Column ──────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Category */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
              <label className="block text-xs font-bold text-[#1A1A1A] mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category')}
                className={`${inputBase(!!errors.category, touchedFields.category && !errors.category)} py-2.5`}
              >
                <option value="">Select a category…</option>
                {BLOG_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <FieldError message={errors.category?.message} />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
              <label className="block text-xs font-bold text-[#1A1A1A] mb-2">
                Tags <span className="text-[#B0AFA5] font-normal">({tags.length}/8)</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag…"
                  maxLength={30}
                  className="flex-1 h-10 px-3 rounded-xl border-2 border-[#E5E4DE] text-sm focus:border-[#FF7A00] outline-none focus:ring-4 focus:ring-[#FF7A00]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
                >
                  <Plus size={16} />
                </button>
              </div>
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <TagChip key={tag} label={tag} onRemove={() => setTags((t) => t.filter((x) => x !== tag))} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#B0AFA5]">No tags yet. Tags help readers find your article.</p>
              )}
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
              <h4
                className="text-sm font-bold text-[#1A1A1A] mb-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Publish Checklist
              </h4>
              <div className="space-y-2.5">
                {[
                  { label: 'Cover image URL', done: !!watchedCoverUrl && !errors.coverImageUrl },
                  { label: 'Title (10–120 chars)', done: !!watchedTitle && !errors.title },
                  { label: 'Excerpt (50–300 chars)', done: !!watch('excerpt') && !errors.excerpt },
                  { label: 'Content (200+ chars)', done: charCount >= 200 && !errors.content },
                  { label: 'Category selected', done: !!watch('category') && watch('category') !== 'All' },
                  { label: 'At least 1 tag', done: tags.length > 0 },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm">
                    {done ? (
                      <CheckCircle2 size={15} className="text-green-500 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#D4D3CB] shrink-0" />
                    )}
                    <span className={done ? 'text-[#1C1B14]' : 'text-[#B0AFA5]'}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[#FFF8F0] rounded-2xl border border-[#FFDBB5] p-5">
              <h4 className="text-sm font-bold text-[#FF7A00] mb-3">✍️ Writing Tips</h4>
              <ul className="space-y-2 text-xs text-[#555449]">
                <li>• Use ## to create sections — breaks the text and improves readability</li>
                <li>• Write in first person — "I learned…" is more engaging than "One learns…"</li>
                <li>• Include specific numbers — ₹, weights, timelines. They build trust.</li>
                <li>• End with a question or call-to-action to spark comments</li>
                <li>• Minimum 500 characters recommended for good reach</li>
              </ul>
            </div>

            {/* Preview btn mobile */}
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="sm:hidden w-full h-11 rounded-xl border-2 border-[#E5E4DE] text-sm font-semibold text-[#555449] flex items-center justify-center gap-2 hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all"
            >
              <Eye size={16} />
              Preview Article
            </button>

            {/* Submit btns (bottom on mobile) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSubmit((d) => onSubmit(d, 'draft'))}
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl border-2 border-[#E5E4DE] text-sm font-semibold text-[#555449] flex items-center justify-center gap-2 hover:border-[#FF7A00] hover:text-[#FF7A00] transition-all disabled:opacity-50"
              >
                <Save size={15} />
                Save as Draft
              </button>
              <button
                type="button"
                onClick={async () => {
                  const valid = await trigger();
                  if (valid) {
                    handleSubmit((d) => onSubmit(d, 'pending_review'))();
                  }
                }}
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                {isSubmitting ? 'Submitting…' : 'Submit for Review'}
              </button>
              <p className="text-xs text-center text-[#B0AFA5]">
                Our team reviews articles within 24 hours. You can save a draft anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Preview Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPreview && (
          <PreviewModal data={currentFormData as BlogFormValues & { tags: string[] }} onClose={() => setShowPreview(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
