'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// ─── Rating Component ────────────────────────────────────────────────────────
interface RatingProps {
  value: number;           // 0–5, supports half
  onChange?: (v: number) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showValue?: boolean;
  showCount?: number;
  className?: string;
}

const starSizes = { sm: 12, md: 16, lg: 20, xl: 24 };
const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-lg' };

export function Rating({ value, onChange, size = 'md', showValue, showCount, className }: RatingProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const interactive = !!onChange;
  const sz = starSizes[size];
  const displayed = hover ?? value;

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = displayed >= star;
          const half   = !filled && displayed >= star - 0.5;
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => onChange?.(star)}
              onMouseEnter={() => interactive && setHover(star)}
              onMouseLeave={() => interactive && setHover(null)}
              className={cn(
                'relative focus-visible:outline-none',
                interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
              )}
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={sz}
                className={cn(
                  'transition-colors',
                  filled
                    ? 'fill-[#F59E0B] stroke-[#F59E0B]'
                    : half
                    ? 'fill-[#F59E0B]/50 stroke-[#F59E0B]'
                    : 'fill-transparent stroke-[#D4D3CB]'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-semibold text-[#1A0A00]', textSizes[size])}>
          {value.toFixed(1)}
        </span>
      )}
      {showCount !== undefined && (
        <span className={cn('text-[#8C7B6E]', textSizes[size])}>
          ({showCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}

// ─── Rating Breakdown ────────────────────────────────────────────────────────
interface RatingBreakdownProps {
  distribution: number[]; // [5star%, 4star%, 3star%, 2star%, 1star%]
  average: number;
  total: number;
  className?: string;
}

export function RatingBreakdown({ distribution, average, total, className }: RatingBreakdownProps) {
  return (
    <div className={cn('flex gap-6', className)}>
      {/* Average */}
      <div className="flex flex-col items-center justify-center gap-1 min-w-[80px]">
        <span className="text-4xl font-black text-[#1A0A00]">{average.toFixed(1)}</span>
        <Rating value={average} size="sm" />
        <span className="text-xs text-[#8C7B6E]">{total.toLocaleString()} reviews</span>
      </div>

      {/* Bars */}
      <div className="flex-1 space-y-2">
        {distribution.map((pct, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#4A3728] w-4 text-right">
              {5 - idx}
            </span>
            <Star size={10} className="fill-[#F59E0B] stroke-[#F59E0B] shrink-0" />
            <div className="flex-1 h-2 rounded-full bg-[#EDE9E3] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F59E0B] transition-all duration-1000 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-[#8C7B6E] w-8 text-right">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────
interface ReviewCardProps {
  reviewer: {
    name: string;
    avatar?: string;
    city?: string;
    verified?: boolean;
  };
  rating: number;
  title?: string;
  body: string;
  date: string;
  photos?: string[];
  helpful?: number;
  sellerResponse?: { shopName: string; text: string };
  className?: string;
}

export function ReviewCard({
  reviewer,
  rating,
  title,
  body,
  date,
  photos,
  helpful,
  sellerResponse,
  className,
}: ReviewCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const initials = reviewer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn('bg-white rounded-2xl border border-[#E8E4DE] p-5 space-y-3', className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {reviewer.avatar ? (
            <img
              src={reviewer.avatar}
              alt={reviewer.name}
              className="w-10 h-10 rounded-full object-cover border border-[#E8E4DE]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#1A0A00]">{reviewer.name}</span>
              {reviewer.verified && (
                <span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#8C7B6E]">
              {reviewer.city && <span>{reviewer.city}</span>}
              {reviewer.city && <span>·</span>}
              <span>{date}</span>
            </div>
          </div>
        </div>
        <Rating value={rating} size="sm" />
      </div>

      {/* Content */}
      {title && <p className="text-sm font-semibold text-[#1A0A00]">{title}</p>}
      <p className={cn('text-sm text-[#4A3728] leading-relaxed', !expanded && 'line-clamp-3')}>
        {body}
      </p>
      {body.length > 200 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-[#FF7A00] hover:underline cursor-pointer"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Photos */}
      {photos && photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {photos.slice(0, 4).map((photo, i) => (
            <img
              key={i}
              src={photo}
              alt={`Review photo ${i + 1}`}
              className="w-16 h-16 rounded-lg object-cover border border-[#E8E4DE] cursor-pointer hover:opacity-90 transition-opacity"
            />
          ))}
        </div>
      )}

      {/* Helpful */}
      {helpful !== undefined && (
        <div className="flex items-center gap-1.5 text-xs text-[#8C7B6E]">
          <button className="hover:text-[#FF7A00] transition-colors cursor-pointer">👍</button>
          <span>Helpful ({helpful})</span>
        </div>
      )}

      {/* Seller Response */}
      {sellerResponse && (
        <div className="ml-4 p-3 rounded-xl bg-[#FFF8F0] border border-[#FFE4CC]">
          <p className="text-xs font-bold text-[#FF7A00] mb-1">Reply from {sellerResponse.shopName}</p>
          <p className="text-xs text-[#4A3728] leading-relaxed">{sellerResponse.text}</p>
        </div>
      )}
    </div>
  );
}
