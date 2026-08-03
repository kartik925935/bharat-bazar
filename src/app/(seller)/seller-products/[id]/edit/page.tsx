'use client';

import React, { useEffect, use } from 'react';
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
  sku: z
    .string()
    .regex(/^[A-Z0-9_-]*$/, 'SKU: uppercase letters, numbers, hyphens, underscores only')
    .max(50, 'SKU cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
  weightGrams: z
    .string()
    .min(1, 'Product weight is required for shipping')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0 && Number.isInteger(Number(v)), 'Weight must be a positive whole number in grams'),
  processingTimeDays: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 1 && Number(v) <= 30 && Number.isInteger(Number(v)), 'Processing time must be 1–30 days'),
  isHandmade: z.boolean(),
  isGITagged: z.boolean(),
  isOrganic: z.boolean(),
  isEcoFriendly: z.boolean(),
  imageUrl: z.string().min(1, 'Image is required'),
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
);

type ProductFormData = z.infer<typeof productSchema>;

const CATEGORIES = [
  'Handlooms & Textiles', 'Jewelry & Accessories', 'Home Décor', 'Art & Paintings',
  'Pottery & Ceramics', 'Woodcraft', 'Metalcraft', 'Embroidery & Needlework',
  'Block Printing', 'Natural & Organic', 'Bamboo Products', 'Leather Goods',
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

export default function SellerEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { products, updateProduct, seller } = useSellerStore();
  const [isDragging, setIsDragging] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, touchedFields, isSubmitting, isValid },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '', categoryId: '', shortDescription: '', description: '',
      mrp: '', sellingPrice: '', gstSlab: undefined, stock: '', sku: '',
      weightGrams: '', processingTimeDays: '2',
      isHandmade: true, isGITagged: false, isOrganic: false, isEcoFriendly: false,
    },
  });

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) {
      reset({
        name: product.name,
        categoryId: product.categoryId || CATEGORIES[0],
        shortDescription: product.description.substring(0, 150) || 'Handcrafted quality product.',
        description: product.description,
        mrp: String(product.mrp),
        sellingPrice: String(product.sellingPrice),
        gstSlab: '18',
        stock: String(product.stock),
        sku: product.sku,
        weightGrams: String(product.weight || 500),
        processingTimeDays: (product as any).processingTimeDays?.toString() || '2',
        isHandmade: product.handmade || false,
        isGITagged: product.giTagged || false,
        isOrganic: product.specifications?.some((s) => s.key.toLowerCase() === 'organic') || false,
        isEcoFriendly: false,
        imageUrl: product.images?.[0]?.url || '',
      });
    } else {
      router.push('/seller-products');
    }
  }, [id, products, router, reset]);

  const mrp = watch('mrp');
  const sellingPrice = watch('sellingPrice');
  const descText = watch('description', '');
  const shortDescText = watch('shortDescription', '');
  const currentImage = watch('imageUrl');

  const discount = mrp && sellingPrice && Number(mrp) > 0
    ? Math.round(((Number(mrp) - Number(sellingPrice)) / Number(mrp)) * 100)
    : 0;
  const savings = mrp && sellingPrice ? Number(mrp) - Number(sellingPrice) : 0;
  const sellerEarnings = sellingPrice ? Number(sellingPrice) * 0.9 : 0; // 10% platform commission
  
  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => setValue('imageUrl', event.target?.result as string, { shouldValidate: true, shouldDirty: true });
      reader.readAsDataURL(file);
    } else {
      toast.error('Please drop a valid image file');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => setValue('imageUrl', event.target?.result as string, { shouldValidate: true, shouldDirty: true });
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!seller) return;
    await new Promise((r) => setTimeout(r, 800));
    updateProduct(id, {
      name: data.name,
      description: data.description,
      mrp: Number(data.mrp),
      sellingPrice: Number(data.sellingPrice),
      stock: Number(data.stock),
      sku: data.sku || `SKU-${Date.now()}`,
      categoryId: data.categoryId,
      subcategoryId: null,
      tags: [],
      images: [{ id: '1', url: data.imageUrl, isPrimary: true, altText: data.name }],
      discount,
      status: 'pending_review',
      giTagged: data.isGITagged,
      weight: Number(data.weightGrams),
      handmade: data.isHandmade,
    });
    toast.success('Product updated successfully! 🎉');
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
          <h1 className="text-2xl font-black text-[#1A1A1A]">Edit Product</h1>
          <p className="text-sm text-[#9B8F84]">Update product information and pricing</p>
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
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              Primary Image <span className="text-red-500">*</span>
            </label>
            
            {currentImage ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#E5E4DE] bg-gray-50 h-48 group">
                <img src={currentImage} alt="Preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button" 
                    onClick={() => setValue('imageUrl', '', { shouldValidate: true, shouldDirty: true })}
                    className="bg-red-500 text-white rounded-full p-2 hover:scale-110 transition-transform shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleImageDrop}
                className={`relative w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all bg-[#FAFAF8] ${
                  isDragging ? 'border-[#FF7A00] bg-[#FFF8F0]' : errors.imageUrl ? 'border-red-500/50' : 'border-[#E5E4DE] hover:border-[#FF7A00]/50'
                }`}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDragging ? 'bg-[#FF7A00] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-[#1A1A1A]">Drop image here or click to upload</p>
                <p className="text-[10px] text-[#8C8B80] mt-1">JPEG, PNG or WebP up to 5MB</p>
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {errors.imageUrl ? <FieldError key="e" message={errors.imageUrl.message} /> : null}
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
              <label htmlFor="weightGrams" className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Product Weight (grams) <span className="text-red-500">*</span>
              </label>
              <input
                id="weightGrams"
                type="number"
                min="1"
                {...register('weightGrams')}
                className={inputBase(!!errors.weightGrams, touchedFields.weightGrams && !errors.weightGrams)}
                placeholder="e.g. 500"
              />
              <AnimatePresence mode="wait">
                {errors.weightGrams ? <FieldError key="e" message={errors.weightGrams.message} /> : touchedFields.weightGrams && !errors.weightGrams ? <FieldSuccess key="s" /> : null}
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
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>

        {!isValid && (
          <p className="text-center text-xs text-[#9B8F84]">Please fill all required fields correctly to enable Save</p>
        )}
      </form>
    </div>
  );
}
