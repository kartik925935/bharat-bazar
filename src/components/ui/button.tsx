'use client';

import React, { useState, useRef } from 'react';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'dark' | 'glass';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
export type ButtonRounded = 'default' | 'full' | 'none';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: ButtonRounded;
  successFeedback?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-[0_8px_24px_rgba(255,122,0,0.25)] hover:shadow-[0_16px_48px_rgba(255,122,0,0.35)] hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-white text-[#FF7A00] border-2 border-[#FF7A00] hover:bg-[#FFF3E8] active:bg-[#FFE4CC]',
  ghost:
    'bg-transparent text-[#1A0A00] hover:bg-[#FFF3E8] hover:text-[#FF7A00] active:bg-[#FFE4CC]',
  danger:
    'bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white shadow-[0_8px_24px_rgba(239,68,68,0.25)] hover:-translate-y-0.5',
  success:
    'bg-gradient-to-r from-[#22C55E] to-[#15803D] text-white shadow-[0_8px_24px_rgba(34,197,94,0.25)] hover:-translate-y-0.5',
  dark:
    'bg-[#1A0A00] text-white hover:bg-[#2C1A0A] active:bg-[#0D0500]',
  glass:
    'bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs:   'h-11 md:h-7  px-3  text-xs  gap-1.5',
  sm:   'h-11 md:h-9  px-4  text-sm  gap-1.5',
  md:   'h-11 px-6  text-sm  gap-2',
  lg:   'h-13 px-8  text-base gap-2',
  xl:   'h-16 px-10 text-lg  gap-2.5',
  icon: 'h-11 w-11  text-sm  gap-0',
};

const roundedStyles: Record<ButtonRounded, string> = {
  default: 'rounded-xl',
  full:    'rounded-full',
  none:    'rounded-none',
};

const iconSizes: Record<ButtonSize, number> = {
  xs: 12, sm: 14, md: 16, lg: 18, xl: 20, icon: 18,
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = 'default',
  successFeedback = false,
  disabled,
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Ripple effect
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++rippleId.current;
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
    }

    // Success feedback
    if (successFeedback && onClick) {
      onClick(e);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      return;
    }

    onClick?.(e);
  };

  const isDisabled = disabled || loading;
  const spinnerSize = iconSizes[size];

  return (
    <button
      ref={btnRef}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden font-semibold',
        'transition-all duration-[250ms] cubic-bezier(0.4,0,0.2,1)',
        'select-none outline-none cursor-pointer',
        'focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        showSuccess && 'bg-gradient-to-r from-[#22C55E] to-[#15803D] border-none',
        className
      )}
      {...props}
    >
      {/* Ripple */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
          style={{
            left: r.x - 16,
            top: r.y - 16,
            width: 32,
            height: 32,
          }}
        />
      ))}

      {/* Content */}
      {loading ? (
        <>
          <Loader2 size={spinnerSize} className="animate-spin shrink-0" />
          {loadingText && <span>{loadingText}</span>}
          {!loadingText && children}
        </>
      ) : showSuccess ? (
        <>
          <Check size={spinnerSize} className="shrink-0" />
          <span>Done!</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
