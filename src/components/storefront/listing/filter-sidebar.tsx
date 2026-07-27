'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { mockCategories } from '@/lib/mock/categories';

interface FilterSidebarProps {
  activeCategory: string;
  onCategoryChange: (categorySlug: string) => void;
  activePrice: string;
  onPriceChange: (priceRange: string) => void;
  activeRating: string;
  onRatingChange: (rating: string) => void;
  onClearAll: () => void;
}

export function FilterSidebarClient({
  activeCategory,
  onCategoryChange,
  activePrice,
  onPriceChange,
  activeRating,
  onRatingChange,
  onClearAll,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>(['Categories', 'Price Range', 'Rating']);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const hasActiveFilters = activeCategory !== '' || activePrice !== '' || activeRating !== '';

  return (
    <div className="w-72 shrink-0 hidden lg:block">
      <div className="bg-white rounded-2xl border border-black/5 p-5 sticky top-24 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-[#1C1B14] text-base">Filters</h3>
          {hasActiveFilters && (
            <button onClick={onClearAll} className="text-sm font-medium text-[#FF7A00] hover:underline">
              Clear All
            </button>
          )}
        </div>

        {/* Categories Section */}
        <div className="mb-5 pb-5 border-b border-black/5">
          <button
            onClick={() => toggleSection('Categories')}
            className="w-full flex items-center justify-between font-semibold text-sm text-[#1C1B14] mb-3"
          >
            Categories {openSections.includes('Categories') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.includes('Categories') && (
            <div className="space-y-1">
              <button
                onClick={() => onCategoryChange('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                  activeCategory === ''
                    ? 'bg-[#FFF8F0] text-[#FF7A00] font-semibold'
                    : 'text-[#555449] hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {mockCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all ${
                    activeCategory === cat.slug
                      ? 'bg-[#FFF8F0] text-[#FF7A00] font-semibold'
                      : 'text-[#555449] hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="mb-5 pb-5 border-b border-black/5">
          <button
            onClick={() => toggleSection('Price Range')}
            className="w-full flex items-center justify-between font-semibold text-sm text-[#1C1B14] mb-3"
          >
            Price Range {openSections.includes('Price Range') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.includes('Price Range') && (
            <div className="space-y-2">
              {[
                { label: 'Under ₹500', value: '0-500' },
                { label: '₹500 - ₹1,000', value: '500-1000' },
                { label: '₹1,000 - ₹2,000', value: '1000-2000' },
                { label: '₹2,000+', value: '2000-99999' },
              ].map((range) => (
                <label key={range.value} className="flex items-center gap-2.5 text-xs text-[#555449] cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={activePrice === range.value}
                    onChange={() => onPriceChange(activePrice === range.value ? '' : range.value)}
                    className="accent-[#FF7A00]"
                  />
                  {range.label}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div>
          <button
            onClick={() => toggleSection('Rating')}
            className="w-full flex items-center justify-between font-semibold text-sm text-[#1C1B14] mb-3"
          >
            Rating {openSections.includes('Rating') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.includes('Rating') && (
            <div className="space-y-2">
              {[
                { label: '4★ & above', value: '4' },
                { label: '3★ & above', value: '3' },
              ].map((r) => (
                <label key={r.value} className="flex items-center gap-2.5 text-xs text-[#555449] cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={activeRating === r.value}
                    onChange={() => onRatingChange(activeRating === r.value ? '' : r.value)}
                    className="accent-[#FF7A00]"
                  />
                  {r.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
