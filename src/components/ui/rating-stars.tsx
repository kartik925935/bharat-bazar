'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  onRatingChange,
  maxStars = 5,
  size = 20,
  interactive = false,
  className,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={starValue}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={cn(
              'outline-none transition-transform duration-150 p-0.5',
              interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'
            )}
          >
            <Star
              size={size}
              className={cn(
                'transition-all duration-150',
                starValue <= displayRating
                  ? 'fill-[#FFB800] stroke-[#FFB800]'
                  : 'fill-transparent stroke-[#D4D3CB]'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
export default RatingStars;
