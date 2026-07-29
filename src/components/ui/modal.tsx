'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  className?: string;
  children: React.ReactNode;
  closeOnOverlay?: boolean;
}

const sizeMap: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-xl',
  '2xl':'max-w-2xl',
  full: 'max-w-full m-0',
};

export function Modal({ open, onClose, size = 'md', className, children, closeOnOverlay = true }: ModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500]"
            onClick={closeOnOverlay ? onClose : undefined}
          />

          {/* Content — Desktop: centered, Mobile: bottom sheet */}
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className={cn(
              'fixed z-[501] inset-x-4 top-[10%] bottom-auto mx-auto',
              'bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[85vh]',
              'sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full',
              sizeMap[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Sub-components
interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
}

export function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-start justify-between p-5 border-b border-[#E8E4DE]">
      <div>
        <h2 className="text-base font-bold text-[#1A0A00]" style={{ fontFamily: 'Inter, sans-serif' }}>{title}</h2>
        {subtitle && <p className="text-sm text-[#8C7B6E] mt-0.5">{subtitle}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#8C7B6E] hover:text-[#1A0A00] hover:bg-[#F5F4F0] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export function ModalBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function ModalFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex items-center justify-end gap-3 p-5 border-t border-[#E8E4DE]', className)}>
      {children}
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmModal({
  open, onClose, onConfirm, title, message,
  confirmText = 'Confirm', cancelText = 'Cancel',
  confirmVariant = 'primary', loading = false,
}: ConfirmModalProps) {
  const confirmStyle = confirmVariant === 'danger'
    ? 'bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white'
    : 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white';

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>
        <p className="text-sm text-[#4A3728] leading-relaxed">{message}</p>
      </ModalBody>
      <ModalFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-[#4A3728] hover:bg-[#F5F4F0] rounded-xl transition-colors cursor-pointer"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn('px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer', confirmStyle)}
        >
          {loading ? 'Loading…' : confirmText}
        </button>
      </ModalFooter>
    </Modal>
  );
}
