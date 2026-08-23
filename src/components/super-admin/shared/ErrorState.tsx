'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({ 
  title = "Something went wrong", 
  description = "An unexpected error occurred while loading this module. Please try again.",
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] border border-[#2A2A3E] bg-[#111118] rounded-2xl">
      <div className="w-16 h-16 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
      </div>
      <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-[#8B8B9E] max-w-sm mb-6 leading-relaxed">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 h-9 px-4 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-lg text-xs font-semibold transition-colors border border-[#3A3A50]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  )
}
