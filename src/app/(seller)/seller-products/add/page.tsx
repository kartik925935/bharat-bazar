'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, ArrowLeft, AlertCircle, CheckCircle2, Loader2,
  Package, FileText, DollarSign, BarChart3, Truck, Info, Image as ImageIcon, UploadCloud, X
} from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { toast } from 'sonner';
import Link from 'next/link';

// ─── Schema ──────────────────────────────────────────────────────────────────
const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(5, 'Product name must be at least 5 characters')
    .max(100, 'Product name cannot exceed 100 characters'),
  categoryId: z.string().min(1, 'Please select a product category'),
  customCategory: z.string().optional(),
  shortDescription: z
    .string()
    .min(1, 'Short description is required')
    .min(20, 'Short description must be at least 20 characters')
    .max(200, 'Short description cannot exceed 200 characters'),
  description: z
    .string()
    .min(1, 'Full description is required')
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  mrp: z
    .string()
    .min(1, 'MRP is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'MRP must be a positive number')
    .refine((v) => Number(v) <= 1000000, 'MRP cannot exceed ₹10,00,000'),
  sellingPrice: z
    .string()
    .min(1, 'Selling price is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Selling price must be a positive number'),
  gstSlab: z.enum(['0', '5', '12', '18', '28'], {
    required_error: 'Please select applicable GST slab',
  }),
  stock: z
    .string()
    .min(1, 'Stock quantity is required')
    .refine((v) => !isNaN(Number(v)) && Number.isInteger(Number(v)) && Number(v) >= 0, 'Stock must be a whole number (0 or more)'),
  lowStockThreshold: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number.isInteger(Number(v)) && Number(v) >= 0, 'Must be a whole number')
    .optional(),
  sku: z
    .string()
    .regex(/^[A-Z0-9_-]*$/, 'SKU: uppercase letters, numbers, hyphens, underscores only')
    .max(50, 'SKU cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
  weightValue: z
    .string()
    .min(1, 'Product weight/volume is required for shipping')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Must be a positive number'),
  weightUnit: z.enum(['g', 'kg', 'ml', 'l', 'oz', 'lb'], { required_error: 'Unit is required' }),
  processingTimeDays: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 1 && Number(v) <= 30 && Number.isInteger(Number(v)), 'Processing time must be 1–30 days'),
  isHandmade: z.boolean(),
  isGITagged: z.boolean(),
  isOrganic: z.boolean(),
  isEcoFriendly: z.boolean(),
  images: z.array(z.string()).min(3, 'Please upload at least 3 images for the product'),
})
.refine(
  (data) => Number(data.sellingPrice) <= Number(data.mrp),
  { message: 'Selling price cannot be higher than MRP', path: ['sellingPrice'] }
)
.refine(
  (data) => {
    const mrp = Number(data.mrp);
    const sp = Number(data.sellingPrice);
    if (mrp > 0 && sp > 0) return ((mrp - sp) / mrp) * 100 <= 90;
    return true;
  },
  { message: 'Discount cannot exceed 90% of MRP — please verify your prices', path: ['sellingPrice'] }
)
.refine(
  (data) => {
    if (data.categoryId === 'Other' && (!data.customCategory || data.customCategory.trim().length === 0)) {
      return false;
    }
    return true;
  },
  { message: 'Please specify your custom category', path: ['customCategory'] }
);

type ProductFormData = z.infer<typeof productSchema>;

const CATEGORIES = [
  'Handlooms & Textiles', 'Jewelry & Accessories', 'Home Décor', 'Art & Paintings',
  'Pottery & Ceramics', 'Woodcraft', 'Metalcraft', 'Embroidery & Needlework',
  'Block Printing', 'Natural & Organic', 'Bamboo Products', 'Leather Goods', 'Other',
];

const GST_SLABS = [
  { value: '0', label: '0% GST — Exempt' },
  { value: '5', label: '5% GST' },
  { value: '12', label: '12% GST' },
  { value: '18', label: '18% GST' },
  { value: '28', label: '28% GST' },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-sm text-red-500 mt-1.5"
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.p>
  );
}

function FieldSuccess() {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-sm text-green-500 mt-1.5"
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      Looks good!
    </motion.p>
  );
}

const inputBase = (error: boolean, valid?: boolean) =>
  `w-full h-12 px-4 rounded-xl border-2 text-base outline-none transition-all duration-200 bg-white focus:ring-4 ${
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : valid
      ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
      : 'border-[#F0EDE8] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
  }`;

const SectionCard = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-3xl border border-[#F0EDE8] p-6 shadow-sm space-y-5">
    <h2 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wide flex items-center gap-2">
      <Icon size={16} className="text-[#FF7A00]" />
      {title}
    </h2>
    {children}
  </div>
);

export default function SellerAddProductPage() {
  const router = useRouter();
  const { createProduct, seller } = useSellerStore();
  const [isDragging, setIsDragging] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, touchedFields, isSubmitting, isValid },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '', categoryId: '', shortDescription: '', description: '',
      mrp: '', sellingPrice: '', gstSlab: undefined, stock: '', sku: '', lowStockThreshold: '5',
      weightValue: '', weightUnit: 'g', processingTimeDays: '2',
      isHandmade: true, isGITagged: false, isOrganic: false, isEcoFriendly: false,
      images: [],
    },
  });

  const mrp = watch('mrp');
  const sellingPrice = watch('sellingPrice');
  const descText = watch('description', '');
  const shortDescText = watch('shortDescription', '');

  const discount = mrp && sellingPrice && Number(mrp) > 0
    ? Math.round(((Number(mrp) - Number(sellingPrice)) / Number(mrp)) * 100)
    : 0;
  const savings = mrp && sellingPrice ? Number(mrp) - Number(sellingPrice) : 0;
  const sellerEarnings = sellingPrice ? Number(sellingPrice) * 0.9 : 0; // 10% platform commission
  const currentImages = watch('images') || [];

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setValue('images', [...(watch('images') || []), result], { shouldValidate: true, shouldDirty: true });
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      toast.error('Please drop valid image files');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setValue('images', [...(watch('images') || []), result], { shouldValidate: true, shouldDirty: true });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = [...currentImages];
    newImages.splice(indexToRemove, 1);
    setValue('images', newImages, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!seller) { toast.error('Seller profile not found'); return; }
    await new Promise((r) => setTimeout(r, 800));
    createProduct({
      sellerId: seller.id,
      name: data.name,
      description: data.description,
      mrp: Number(data.mrp),
      sellingPrice: Number(data.sellingPrice),
      stock: Number(data.stock),
      sku: data.sku || `SKU-${Date.now()}`,
      categoryId: data.categoryId === 'Other' && data.customCategory ? data.customCategory : data.categoryId,
      subcategoryId: null,
      tags: [],
      images: data.images.map((url, index) => ({ id: String(index + 1), url, isPrimary: index === 0, altText: `${data.name} ${index + 1}` })),
      discount,
      status: 'pending_review',
      lowStockThreshold: Number(data.lowStockThreshold),
      giTagged: data.isGITagged,
      slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      story: null,
      weight: Number(data.weightValue),
      weightUnit: data.weightUnit,
      specifications: [],
      hasVariants: false,
      variants: [],
      freeShipping: false,
      shippingCharge: 0,
      handmade: data.isHandmade,
      rejectionReason: null,
      featuredByAdmin: false,
    });
    toast.success('Product submitted for review! 🎉');
    router.push('/seller-products');
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller-products" className="w-11 h-11 rounded-xl border-2 border-[#F0EDE8] flex items-center justify-center text-[#9B8F84] hover:bg-[#FAFAF8] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">Add New Product</h1>
          <p className="text-sm text-[#9B8F84]">List a new handcrafted item to your catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

        {/* ── 1. Basic Info ───────────────────────────── */}
        <SectionCard icon={Package} title="Basic Information">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              {...register('name')}
              className={inputBase(!!errors.name, touchedFields.name && !errors.name)}
              placeholder="e.g. Handwoven Silk Saree from Varanasi"
            />
            <AnimatePresence mode="wait">
              {errors.name ? <FieldError key="e" message={errors.name.message} /> : touchedFields.name && !errors.name ? <FieldSuccess key="s" /> : null}
            </AnimatePresence>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              {...register('categoryId')}
              className={`${inputBase(!!errors.categoryId, touchedFields.categoryId && !errors.categoryId)} bg-white`}
            >
              <option value="">Select Category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <AnimatePresence mode="wait">
              {errors.categoryId ? <FieldError key="e" message={errors.categoryId.message} /> : touchedFields.categoryId && !errors.categoryId ? <FieldSuccess key="s" /> : null}
            </AnimatePresence>
            {watch('categoryId') === 'Other' && (
              <div className="mt-3">
                <input 
                  type="text"
                  placeholder="Please specify your category"
                  {...register('customCategory')}
                  className={inputBase(!!errors.customCategory, touchedFields.customCategory && !errors.customCategory)}
                />
                <AnimatePresence mode="wait">
                  {errors.customCategory ? <FieldError key="e" message={errors.customCategory.message} /> : null}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 flex items-center justify-between">
              <span>Product Images (Min. 3) <span className="text-red-500">*</span></span>
              <span className={`text-[11px] font-semibold ${currentImages.length < 3 ? 'text-red-500' : 'text-[#9B8F84]'}`}>
                {currentImages.length} uploaded
              </span>
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {currentImages.map((img, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border-2 border-[#E5E4DE] bg-gray-50 aspect-square group">
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <div className="absolute top-1.5 left-1.5 bg-[#FF7A00] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Primary</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(idx)}
                      className="bg-red-500 text-white rounded-full p-1.5 hover:scale-110 transition-transform shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleImageDrop}
                className={`relative w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all bg-[#FAFAF8] ${
                  isDragging ? 'border-[#FF7A00] bg-[#FFF8F0]' : errors.images ? 'border-red-500/50' : 'border-[#E5E4DE] hover:border-[#FF7A00]/50'
                }`}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${isDragging ? 'bg-[#FF7A00] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <UploadCloud size={16} />
                </div>
                <p className="text-[10px] font-bold text-[#1A1A1A] text-center px-2 leading-tight">Add More</p>
              </div>
              
              {Array.from({ length: Math.max(0, 2 - currentImages.length) }).map((_, idx) => (
                <div 
                  key={`placeholder-${idx}`} 
                  className="w-full aspect-square rounded-xl border-2 border-dashed border-[#E5E4DE]/50 bg-[#FAFAF8]/50 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100/50 text-gray-300">
                    <UploadCloud size={16} />
                  </div>
                </div>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              {errors.images ? <FieldError key="e" message={errors.images.message} /> : null}
            </AnimatePresence>
          </div>

          {/* Short Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="shortDescription" className="text-xs font-bold text-[#1A1A1A]">
                Short Description <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] font-semibold ${shortDescText.length > 180 ? 'text-red-500' : 'text-[#9B8F84]'}`}>
                {shortDescText.length}/200
              </span>
            </div>
            <textarea
              id="shortDescription"
              rows={2}
              maxLength={200}
              {...register('shortDescription')}
              className={`w-full p-3 rounded-xl border-2 text-base outline-none transition-all duration-200 bg-white focus:ring-4 resize-none ${
                errors.shortDescription ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : touchedFields.shortDescription && !errors.shortDescription ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                : 'border-[#F0EDE8] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
              }`}
              placeholder="A quick summary of what makes this product special (shown in search results)"
            />
            <AnimatePresence mode="wait">
              {errors.shortDescription ? <FieldError key="e" message={errors.shortDescription.message} /> : touchedFields.shortDescription && !errors.shortDescription ? <FieldSuccess key="s" /> : null}
            </AnimatePresence>
          </div>
        </SectionCard>

        {/* ── 2. Description ──────────────────────────── */}
        <SectionCard icon={FileText} title="Full Description">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="text-xs font-bold text-[#1A1A1A]">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] font-semibold ${descText.length > 1900 ? 'text-red-500' : 'text-[#9B8F84]'}`}>
                {descText.length}/2000
              </span>
            </div>
            <textarea
              id="description"
              rows={6}
              maxLength={2000}
              {...register('description')}
              className={`w-full p-3 rounded-xl border-2 text-base outline-none transition-all duration-200 bg-white focus:ring-4 resize-none ${
                errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : touchedFields.description && !errors.description ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                : 'border-[#F0EDE8] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
              }`}
              placeholder="Describe the materials used, craft origin, technique, what makes it special, dimensions, care instructions…"
            />
            <AnimatePresence mode="wait">
              {errors.description ? <FieldError key="e" message={errors.description.message} /> : touchedFields.description && !errors.description ? <FieldSuccess key="s" /> : null}
            </AnimatePresence>
          </div>

          {/* Artisan Badges */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Product Badges</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'isHandmade' as const, label: '🤲 Handmade' },
                { name: 'isGITagged' as const, label: '🏷️ GI Tagged' },
                { name: 'isOrganic' as const, label: '🌿 Organic' },
                { name: 'isEcoFriendly' as const, label: '♻️ Eco-Friendly' },
              ].map(({ name, label }) => {
                const val = watch(name);
                return (
                  <label
                    key={name}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                      val ? 'border-[#FF7A00] bg-[#FFF3E8] text-[#FF7A00]' : 'border-[#F0EDE8] text-[#9B8F84]'
                    }`}
                  >
                    <input type="checkbox" {...register(name)} className="sr-only" />
                    <span className="text-xs font-bold">{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* ── 3. Pricing ──────────────────────────────── */}
        <SectionCard icon={DollarSign} title="Pricing">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* MRP */}
            <div>
              <label htmlFor="mrp" className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                MRP (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8F84] font-bold text-base">₹</span>
                <input
                  id="mrp"
                  type="number"
                  min="1"
                  step="0.01"
                  {...register('mrp')}
                  className={`${inputBase(!!errors.mrp, touchedFields.mrp && !errors.mrp)} pl-8`}
                  placeholder="0.00"
                />
              </div>
              <AnimatePresence mode="wait">
                {errors.mrp ? <FieldError key="e" message={errors.mrp.message} /> : touchedFields.mrp && !errors.mrp ? <FieldSuccess key="s" /> : null}
              </AnimatePresence>
            </div>
            {/* Selling Price */}
            <div>
              <label htmlFor="sellingPrice" className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Selling Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B8F84] font-bold text-base">₹</span>
                <input
                  id="sellingPrice"
                  type="number"
                  min="1"
                  step="0.01"
                  {...register('sellingPrice')}
                  className={`${inputBase(!!errors.sellingPrice, touchedFields.sellingPrice && !errors.sellingPrice)} pl-8`}
                  placeholder="0.00"
                />
              </div>
              <AnimatePresence mode="wait">
                {errors.sellingPrice ? <FieldError key="e" message={errors.sellingPrice.message} /> : touchedFields.sellingPrice && !errors.sellingPrice ? <FieldSuccess key="s" /> : null}
              </AnimatePresence>
            </div>
          </div>

          {/* Live pricing preview */}
          {mrp && sellingPrice && Number(mrp) > 0 && Number(sellingPrice) > 0 && !errors.mrp && !errors.sellingPrice && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFF3E8] border border-[#FFD4A3] rounded-xl p-4 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#9B8F84]">Discount</span>
                <span className={`font-black text-base ${discount > 0 ? 'text-[#16A34A]' : 'text-red-500'}`}>{discount}% off</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9B8F84]">Customer saves</span>
                <span className="font-bold text-[#1A1A1A]">₹{savings.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#FFD4A3] pt-1.5 mt-1.5">
                <span className="text-[#9B8F84] flex items-center gap-1"><Info size={11} /> Your earnings (after 10% commission)</span>
                <span className="font-black text-[#FF7A00]">₹{sellerEarnings.toFixed(0)}</span>
              </div>
            </motion.div>
          )}

          {/* GST Slab */}
          <div>
            <label htmlFor="gstSlab" className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              GST Slab <span className="text-red-500">*</span>
            </label>
            <select
              id="gstSlab"
              {...register('gstSlab')}
              className={`${inputBase(!!errors.gstSlab, touchedFields.gstSlab && !errors.gstSlab)} bg-white`}
            >
              <option value="">Select GST slab…</option>
              {GST_SLABS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <AnimatePresence mode="wait">
              {errors.gstSlab ? <FieldError key="e" message={errors.gstSlab.message} /> : touchedFields.gstSlab && !errors.gstSlab ? <FieldSuccess key="s" /> : null}
            </AnimatePresence>
          </div>
        </SectionCard>

        {/* ── 4. Inventory ────────────────────────────── */}
        <SectionCard icon={BarChart3} title="Inventory">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stock" className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                {...register('stock')}
                className={inputBase(!!errors.stock, touchedFields.stock && !errors.stock)}
                placeholder="e.g. 50"
              />
              <AnimatePresence mode="wait">
                {errors.stock ? <FieldError key="e" message={errors.stock.message} /> : touchedFields.stock && !errors.stock ? <FieldSuccess key="s" /> : null}
              </AnimatePresence>
            </div>
            <div>
              <label htmlFor="sku" className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                SKU <span className="text-[#9B8F84] font-normal">(optional — auto-generated if empty)</span>
              </label>
              <input
                id="sku"
                type="text"
                {...register('sku')}
                className={inputBase(!!errors.sku, touchedFields.sku && !!watch('sku') && !errors.sku)}
                placeholder="e.g. SAREE-BLU-001"
              />
              {errors.sku && <FieldError message={errors.sku.message} />}
            </div>
          </div>
        </SectionCard>

        {/* ── 5. Shipping ─────────────────────────────── */}
        <SectionCard icon={Truck} title="Shipping & Logistics">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="weightValue" className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Product Weight / Volume <span className="text-red-500">*</span>
              </label>
              <div className="relative flex">
                <input
                  id="weightValue"
                  type="number"
                  min="0.1"
                  step="any"
                  {...register('weightValue')}
                  className={`${inputBase(!!errors.weightValue, touchedFields.weightValue && !errors.weightValue)} rounded-r-none border-r-0`}
                  placeholder="e.g. 500"
                />
                <select
                  {...register('weightUnit')}
                  className={`h-11 px-3 border-2 rounded-r-xl text-sm font-semibold outline-none transition-colors focus:ring-4 focus:ring-[#FF7A00]/10 ${errors.weightValue ? 'border-red-500 bg-red-50/30' : 'border-[#E5E4DE] focus:border-[#FF7A00] bg-gray-50'}`}
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="oz">oz</option>
                  <option value="lb">lb</option>
                </select>
              </div>
              <AnimatePresence mode="wait">
                {errors.weightValue ? <FieldError key="e" message={errors.weightValue.message} /> : touchedFields.weightValue && !errors.weightValue ? <FieldSuccess key="s" /> : null}
              </AnimatePresence>
            </div>
            <div>
              <label htmlFor="processingTimeDays" className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Processing Time (days) <span className="text-red-500">*</span>
              </label>
              <input
                id="processingTimeDays"
                type="number"
                min="1"
                max="30"
                {...register('processingTimeDays')}
                className={inputBase(!!errors.processingTimeDays, touchedFields.processingTimeDays && !errors.processingTimeDays)}
                placeholder="e.g. 2"
              />
              <AnimatePresence mode="wait">
                {errors.processingTimeDays ? <FieldError key="e" message={errors.processingTimeDays.message} /> : touchedFields.processingTimeDays && !errors.processingTimeDays ? <FieldSuccess key="s" /> : null}
              </AnimatePresence>
            </div>
          </div>
        </SectionCard>

        {/* ── Submit ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <Link href="/seller-products" className="flex-1 sm:flex-none px-6 h-12 flex items-center justify-center rounded-xl border-2 border-[#F0EDE8] text-[#4A4540] text-sm font-bold hover:bg-[#FAFAF8] transition-all">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`flex-1 sm:flex-none px-8 h-12 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all ${
              (!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-95 cursor-pointer'
            }`}
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save size={16} /> Save Product</>}
          </button>
        </div>

        {!isValid && (
          <p className="text-center text-xs text-[#9B8F84]">Please fill all required fields correctly to enable Save</p>
        )}
      </form>
    </div>
  );
}
