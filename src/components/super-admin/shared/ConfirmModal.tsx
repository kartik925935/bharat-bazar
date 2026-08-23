'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { useSAUIStore } from '@/lib/store/sa-ui-store'

const VARIANT_CONFIG = {
  danger: {
    icon: AlertTriangle,
    iconBg: 'bg-[#EF4444]/10',
    iconBorder: 'border-[#EF4444]/20',
    iconColor: 'text-[#EF4444]',
    buttonBg: 'bg-[#EF4444] hover:bg-[#DC2626]',
    borderColor: 'border-[#EF4444]/20',
  },
  warning: {
    icon: AlertCircle,
    iconBg: 'bg-[#F59E0B]/10',
    iconBorder: 'border-[#F59E0B]/20',
    iconColor: 'text-[#F59E0B]',
    buttonBg: 'bg-[#F59E0B] hover:bg-[#D97706]',
    borderColor: 'border-[#F59E0B]/20',
  },
  info: {
    icon: Info,
    iconBg: 'bg-[#3B82F6]/10',
    iconBorder: 'border-[#3B82F6]/20',
    iconColor: 'text-[#3B82F6]',
    buttonBg: 'bg-[#3B82F6] hover:bg-[#2563EB]',
    borderColor: 'border-[#3B82F6]/20',
  },
}

export function ConfirmModal() {
  const { confirmModal, closeConfirmModal } = useSAUIStore()
  const { isOpen, title, description, variant, confirmLabel, onConfirm } = confirmModal

  const config = VARIANT_CONFIG[variant]
  const Icon = config.icon

  const handleConfirm = () => {
    onConfirm?.()
    closeConfirmModal()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeConfirmModal()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={closeConfirmModal}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-md bg-[#111118] border ${config.borderColor} rounded-2xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] z-10`}
          >
            {/* Close button */}
            <button
              onClick={closeConfirmModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:text-white hover:bg-[#1A1A26] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl ${config.iconBg} border ${config.iconBorder} flex items-center justify-center mb-6`}>
              <Icon className={`w-7 h-7 ${config.iconColor}`} />
            </div>

            <h2 className="text-2xl font-bold text-white font-serif mb-3">{title}</h2>
            <p className="text-[#A0A0B8] leading-relaxed mb-8">{description}</p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                className="flex-1 h-11 bg-[#1A1A26] border border-[#2A2A3E] text-white rounded-xl font-medium hover:bg-[#2A2A3E] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 h-11 ${config.buttonBg} text-white rounded-xl font-semibold transition-all active:scale-[0.98] shadow-lg`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
