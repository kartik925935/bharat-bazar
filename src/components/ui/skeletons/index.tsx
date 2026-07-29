'use client';

import { cn } from '@/lib/utils/cn';

export function SkeletonBox({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-2xl bg-[#E5E4DE]/60', className)}
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className,
  ...props
}: { lines?: number } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 rounded-full bg-[#E5E4DE]/60 animate-pulse',
            i === lines - 1 && lines > 1 ? 'w-[60%]' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = 'md',
  className,
  ...props
}: { size?: 'sm' | 'md' | 'lg' | 'xl' } & React.HTMLAttributes<HTMLDivElement>) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  return (
    <div
      className={cn(
        'rounded-full bg-[#E5E4DE]/60 animate-pulse shrink-0',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

export function SkeletonBadge({
  width = 'w-16',
  className,
  ...props
}: { width?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'h-6 rounded-full bg-[#E5E4DE]/60 animate-pulse inline-block',
        width,
        className
      )}
      {...props}
    />
  );
}

export function SkeletonButton({
  width = 'w-24',
  className,
  ...props
}: { width?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'h-10 rounded-xl bg-[#E5E4DE]/60 animate-pulse',
        width,
        className
      )}
      {...props}
    />
  );
}

export function SkeletonImage({
  aspectRatio = 'square',
  className,
  ...props
}: { aspectRatio?: 'square' | 'video' | 'portrait' } & React.HTMLAttributes<HTMLDivElement>) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div
      className={cn(
        'rounded-2xl bg-[#E5E4DE]/60 animate-pulse',
        aspectClasses[aspectRatio],
        className
      )}
      {...props}
    />
  );
}

export function SkeletonStat({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#E5E4DE] bg-white p-6 shadow-sm flex items-center gap-4',
        className
      )}
      {...props}
    >
      <SkeletonAvatar size="md" />
      <div className="space-y-1.5 flex-1">
        <SkeletonBox className="h-4 w-20" />
        <SkeletonBox className="h-8 w-28" />
        <SkeletonBox className="h-3 w-16" />
      </div>
    </div>
  );
}

export function SkeletonTableRow({
  columns = 5,
  className,
  ...props
}: { columns?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const widths = ['w-16', 'w-32', 'w-24', 'w-12', 'w-20', 'w-28'];
  return (
    <div className={cn('flex items-center gap-4 py-4 border-b border-[#E5E4DE]', className)} {...props}>
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonBox
          key={i}
          className={cn(
            'h-4',
            widths[i % widths.length],
            i === 0 ? 'h-6 w-12 rounded-lg' : ''
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  variant,
  className,
  ...props
}: { variant: 'product' | 'order' | 'review' | 'notification' | 'seller' | 'category' } & React.HTMLAttributes<HTMLDivElement>) {
  if (variant === 'product') {
    return (
      <div className={cn('bg-white rounded-2xl border border-[#E5E4DE] p-4 shadow-sm space-y-4', className)} {...props}>
        <SkeletonImage aspectRatio="square" className="w-full" />
        <SkeletonBadge width="w-20" />
        <SkeletonText lines={2} />
        <div className="flex justify-between items-center pt-2">
          <SkeletonBox className="h-6 w-24" />
          <SkeletonAvatar size="sm" />
        </div>
        <SkeletonButton className="w-full" />
      </div>
    );
  }

  if (variant === 'order') {
    return (
      <div className={cn('bg-white p-5 rounded-2xl border border-[#E5E4DE] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm', className)} {...props}>
        <div className="space-y-2">
          <SkeletonBox className="h-4 w-28" />
          <SkeletonBox className="h-6 w-48" />
          <SkeletonBox className="h-3.5 w-32" />
        </div>
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="text-right space-y-2 hidden md:block">
            <SkeletonBox className="h-6 w-20 ml-auto" />
            <SkeletonBadge width="w-16" className="ml-auto" />
          </div>
          <SkeletonButton className="w-28" />
        </div>
      </div>
    );
  }

  if (variant === 'review') {
    return (
      <div className={cn('bg-white p-5 rounded-2xl border border-[#E5E4DE] space-y-4 shadow-sm', className)} {...props}>
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="md" />
          <div>
            <SkeletonBox className="h-4 w-32 mb-1.5" />
            <SkeletonBox className="h-3 w-20" />
          </div>
          <SkeletonBadge width="w-16" className="ml-auto" />
        </div>
        <SkeletonText lines={3} />
      </div>
    );
  }

  if (variant === 'notification') {
    return (
      <div className={cn('bg-white p-4 rounded-2xl border border-[#E5E4DE] flex gap-3 shadow-sm', className)} {...props}>
        <SkeletonAvatar size="sm" className="mt-1" />
        <div className="space-y-2 flex-1">
          <SkeletonText lines={2} />
          <SkeletonBox className="h-3 w-16" />
        </div>
      </div>
    );
  }

  if (variant === 'seller') {
    return (
      <div className={cn('bg-white rounded-2xl border border-[#E5E4DE] overflow-hidden shadow-sm', className)} {...props}>
        <SkeletonBox className="h-32 w-full rounded-t-2xl rounded-b-none" />
        <div className="p-5 relative pt-12 space-y-4">
          <SkeletonAvatar size="lg" className="absolute -top-8 left-5 border-4 border-white" />
          <SkeletonBox className="h-6 w-48" />
          <SkeletonText lines={2} />
          <div className="flex gap-2 pt-2">
            <SkeletonBadge width="w-20" />
            <SkeletonBadge width="w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'category') {
    return (
      <div className={cn('text-center space-y-3', className)} {...props}>
        <SkeletonBox className="w-full aspect-square rounded-2xl" />
        <SkeletonBox className="h-4 w-20 mx-auto" />
      </div>
    );
  }

  return null;
}

export function SkeletonChart({
  height = 'h-64',
  className,
  ...props
}: { height?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#E5E4DE] bg-white p-6 shadow-sm flex flex-col justify-between',
        height,
        className
      )}
      {...props}
    >
      <div className="space-y-2 mb-4">
        <SkeletonBox className="h-5 w-40" />
        <SkeletonBox className="h-3 w-60" />
      </div>
      <div className="flex-1 flex flex-col justify-between py-2 border-l border-b border-[#E5E4DE]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full border-t border-dashed border-[#E5E4DE] relative">
            <span className="absolute -left-6 -top-2.5 text-[10px] text-[#8C8B80]">--</span>
          </div>
        ))}
        {/* Fake chart bars */}
        <div className="flex items-end justify-around h-32 pt-4 px-4">
          <SkeletonBox className="w-8 h-12 rounded-t-lg rounded-b-none" />
          <SkeletonBox className="w-8 h-20 rounded-t-lg rounded-b-none" />
          <SkeletonBox className="w-8 h-16 rounded-t-lg rounded-b-none" />
          <SkeletonBox className="w-8 h-28 rounded-t-lg rounded-b-none" />
          <SkeletonBox className="w-8 h-24 rounded-t-lg rounded-b-none" />
        </div>
      </div>
    </div>
  );
}
