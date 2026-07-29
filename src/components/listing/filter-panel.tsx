'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterPanelProps {
  // Category
  selectedCategories: string[];
  onCategoryChange: (cats: string[]) => void;
  categories?: FilterOption[];

  // Price
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  maxPrice?: number;

  // Rating
  minRating: number;
  onRatingChange: (r: number) => void;

  // Seller Tier
  selectedTiers: string[];
  onTierChange: (tiers: string[]) => void;

  // Mobile
  isMobileOpen?: boolean;
  onMobileClose?: () => void;

  // Actions
  onReset: () => void;
  activeCount?: number;
}

const DEFAULT_CATEGORIES: FilterOption[] = [
  { label: 'Handloom & Textiles', value: 'handloom-textiles', count: 2400 },
  { label: 'Pottery & Ceramics', value: 'pottery-ceramics', count: 1200 },
  { label: 'Paintings & Art', value: 'paintings-art', count: 800 },
  { label: 'Jewelry & Silver', value: 'jewelry', count: 3100 },
  { label: 'Organic Food', value: 'organic-food', count: 640 },
  { label: 'Home Decor', value: 'home-decor', count: 1800 },
  { label: 'Clothing & Apparel', value: 'clothing-apparel', count: 2200 },
  { label: 'Spiritual & Puja', value: 'spiritual-puja', count: 560 },
];

const TIERS: FilterOption[] = [
  { label: '💎 Platinum', value: 'platinum' },
  { label: '🥇 Gold', value: 'gold' },
  { label: '🥈 Silver', value: 'silver' },
  { label: '🥉 Bronze', value: 'bronze' },
];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E8E4DE] last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 px-1 text-sm font-bold text-[#1A0A00] hover:text-[#FF7A00] transition-colors cursor-pointer"
      >
        {title}
        {open ? <ChevronUp size={14} className="text-[#8C7B6E]" /> : <ChevronDown size={14} className="text-[#8C7B6E]" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterPanel({
  selectedCategories, onCategoryChange, categories = DEFAULT_CATEGORIES,
  priceRange, onPriceChange, maxPrice = 10000,
  minRating, onRatingChange,
  selectedTiers, onTierChange,
  isMobileOpen, onMobileClose,
  onReset, activeCount = 0,
}: FilterPanelProps) {
  const toggleCategory = useCallback((val: string) => {
    if (selectedCategories.includes(val)) {
      onCategoryChange(selectedCategories.filter((c) => c !== val));
    } else {
      onCategoryChange([...selectedCategories, val]);
    }
  }, [selectedCategories, onCategoryChange]);

  const toggleTier = useCallback((val: string) => {
    if (selectedTiers.includes(val)) {
      onTierChange(selectedTiers.filter((t) => t !== val));
    } else {
      onTierChange([...selectedTiers, val]);
    }
  }, [selectedTiers, onTierChange]);

  const content = (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#FF7A00]" />
          <span className="font-bold text-[#1A0A00]">Filters</span>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF7A00] text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-[#FF7A00] hover:underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => toggleCategory(cat.value)}
                className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer',
                  selectedCategories.includes(cat.value)
                    ? 'bg-[#FF7A00] border-[#FF7A00]'
                    : 'border-[#C8C4BE] group-hover:border-[#FF7A00]'
                )}
              >
                {selectedCategories.includes(cat.value) && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#4A3728] group-hover:text-[#1A0A00] flex-1">{cat.label}</span>
              {cat.count && (
                <span className="text-[10px] text-[#B5A99A]">{cat.count.toLocaleString()}</span>
              )}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#8C7B6E]">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-[#FF7A00] cursor-pointer"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => onPriceChange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="flex-1 h-8 px-2 rounded-lg border border-[#E8E4DE] text-xs outline-none focus:border-[#FF7A00]"
              placeholder="Min"
            />
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value) || maxPrice])}
              className="flex-1 h-8 px-2 rounded-lg border border-[#E8E4DE] text-xs outline-none focus:border-[#FF7A00]"
              placeholder="Max"
            />
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => onRatingChange(minRating === r ? 0 : r)}
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer',
                  minRating === r
                    ? 'bg-[#FF7A00] border-[#FF7A00]'
                    : 'border-[#C8C4BE] group-hover:border-[#FF7A00]'
                )}
              >
                {minRating === r && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm text-[#4A3728] flex items-center gap-1">
                {'★'.repeat(r)}{'☆'.repeat(5 - r)} {r}+ Stars
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Seller Tier */}
      <FilterSection title="Seller Tier" defaultOpen={false}>
        <div className="space-y-2">
          {TIERS.map((tier) => (
            <label key={tier.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => toggleTier(tier.value)}
                className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer',
                  selectedTiers.includes(tier.value)
                    ? 'bg-[#FF7A00] border-[#FF7A00]'
                    : 'border-[#C8C4BE] group-hover:border-[#FF7A00]'
                )}
              >
                {selectedTiers.includes(tier.value) && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#4A3728]">{tier.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  // Mobile version (slide-in panel)
  if (typeof isMobileOpen !== 'undefined') {
    return (
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#E8E4DE]">
                <span className="font-bold text-[#1A0A00]">Filters</span>
                <button onClick={onMobileClose} className="p-1.5 rounded-lg hover:bg-[#F5F4F0] cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <div className="p-4">{content}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop sidebar version
  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
      {content}
    </div>
  );
}

// ─── Filter Chips ─────────────────────────────────────────────────────────────
interface FilterChip {
  label: string;
  onRemove: () => void;
}

export function FilterChips({ chips }: { chips: FilterChip[] }) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF3E8] text-[#FF7A00] text-xs font-semibold border border-[#FFE4CC]"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="text-[#FF7A00] hover:text-[#C42B00] cursor-pointer"
          >
            <X size={10} />
          </button>
        </span>
      ))}
    </div>
  );
}
