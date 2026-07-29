'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export type BadgeVariant =
  | 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info'
  | 'dark' | 'gold' | 'silver' | 'platinum' | 'new' | 'sale' | 'handmade' | 'organic';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
  outlined?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:   'bg-[#F0EDE8] text-[#4A3728]',
  brand:     'bg-[#FFF3E8] text-[#FF7A00]',
  success:   'bg-[#F0FDF4] text-[#16A34A]',
  warning:   'bg-[#FFFBEB] text-[#D97706]',
  error:     'bg-[#FEF2F2] text-[#DC2626]',
  info:      'bg-[#EFF6FF] text-[#2563EB]',
  dark:      'bg-[#1A0A00] text-white',
  gold:      'bg-gradient-to-r from-[#D4A017] to-[#F5C842] text-[#1A0A00]',
  silver:    'bg-gradient-to-r from-[#94A3B8] to-[#CBD5E1] text-[#1A0A00]',
  platinum:  'bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white',
  new:       'bg-[#F0FDF4] text-[#15803D]',
  sale:      'bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white',
  handmade:  'bg-[#FFF7ED] text-[#C2410C]',
  organic:   'bg-[#F0FDF4] text-[#15803D]',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[10px] gap-1',
  sm: 'px-2   py-0.5 text-xs    gap-1',
  md: 'px-2.5 py-1   text-xs    gap-1.5',
  lg: 'px-3   py-1   text-sm    gap-1.5',
};

const dotColors: Record<BadgeVariant, string> = {
  default:   'bg-[#8C7B6E]',
  brand:     'bg-[#FF7A00]',
  success:   'bg-[#22C55E]',
  warning:   'bg-[#F59E0B]',
  error:     'bg-[#EF4444]',
  info:      'bg-[#3B82F6]',
  dark:      'bg-white',
  gold:      'bg-[#1A0A00]',
  silver:    'bg-[#1A0A00]',
  platinum:  'bg-white',
  new:       'bg-[#22C55E]',
  sale:      'bg-white',
  handmade:  'bg-[#C2410C]',
  organic:   'bg-[#16A34A]',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  icon,
  dot,
  outlined = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full whitespace-nowrap shrink-0',
        variantStyles[variant],
        sizeStyles[size],
        outlined && 'bg-transparent border border-current',
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'inline-block rounded-full shrink-0',
            size === 'xs' || size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            dotColors[variant]
          )}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// ─── Seller Tier Badge ───────────────────────────────────────────────────────
const TIER_MAP = {
  bronze:   { label: 'Bronze',   variant: 'default'  as BadgeVariant, icon: '🥉' },
  silver:   { label: 'Silver',   variant: 'silver'   as BadgeVariant, icon: '🥈' },
  gold:     { label: 'Gold',     variant: 'gold'     as BadgeVariant, icon: '🥇' },
  platinum: { label: 'Platinum', variant: 'platinum' as BadgeVariant, icon: '💎' },
};

interface SellerTierBadgeProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  size?: BadgeSize;
  showLabel?: boolean;
}

export function SellerTierBadge({ tier, size = 'sm', showLabel = false }: SellerTierBadgeProps) {
  const config = TIER_MAP[tier];
  return (
    <Badge variant={config.variant} size={size} className="font-bold">
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; variant: BadgeVariant; icon: string }> = {
  pending:    { label: 'Pending',    variant: 'warning',  icon: '⏳' },
  confirmed:  { label: 'Confirmed',  variant: 'info',     icon: '✓' },
  processing: { label: 'Processing', variant: 'info',     icon: '⚙' },
  shipped:    { label: 'Shipped',    variant: 'brand',    icon: '🚚' },
  delivered:  { label: 'Delivered',  variant: 'success',  icon: '✓' },
  cancelled:  { label: 'Cancelled',  variant: 'error',    icon: '✗' },
  returned:   { label: 'Returned',   variant: 'warning',  icon: '↩' },
  refunded:   { label: 'Refunded',   variant: 'success',  icon: '↩' },
};

interface StatusBadgeProps {
  status: string;
  size?: BadgeSize;
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_MAP[status.toLowerCase()] ?? {
    label: status,
    variant: 'default' as BadgeVariant,
    icon: '',
  };
  return (
    <Badge variant={config.variant} size={size}>
      {config.icon && <span className="mr-0.5">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}
