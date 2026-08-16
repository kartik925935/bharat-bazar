'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode // Right-side action button slot
  breadcrumb?: string[]
  className?: string
}

export function PageHeader({ title, description, children, breadcrumb, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6', className)}
    >
      <div className="flex flex-col gap-1">
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 mb-1">
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                <span className="text-xs text-[#6B6B80] font-medium uppercase tracking-wider">
                  {crumb}
                </span>
                {i < breadcrumb.length - 1 && (
                  <span className="text-[#3A3A50] text-xs">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-2xl lg:text-3xl font-bold text-white font-serif tracking-tight">{title}</h1>
        {description && (
          <p className="text-[#A0A0B8] text-sm leading-relaxed">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </motion.div>
  )
}
