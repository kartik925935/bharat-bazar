'use client'

import { useEffect, useState } from 'react'
import { Database, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react'
import { MOCK_DB } from '@/lib/mock/db'
import { validateMockDataIntegrity } from '@/lib/mock/db/validate'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

let isPanelMounted = false

export function DataIntegrityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [isSingleton, setIsSingleton] = useState(true)

  useEffect(() => {
    if (isPanelMounted) {
      setIsSingleton(false)
      console.error('DataIntegrityPanel is mounted multiple times! This violates the singleton guard.')
    }
    isPanelMounted = true
    return () => {
      isPanelMounted = false
    }
  }, [])

  const validate = () => {
    setIsValidating(true)
    setTimeout(() => {
      const issues = validateMockDataIntegrity(MOCK_DB)
      setErrors(issues)
      setIsValidating(false)
    }, 400)
  }

  useEffect(() => {
    validate()
  }, [])

  if (process.env.NODE_ENV !== 'development') return null
  if (!isSingleton) return null

  return (
    <div className="fixed bottom-4 right-4 z-[999] font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border backdrop-blur-md transition-all text-xs font-semibold",
          errors.length > 0 
            ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20" 
            : "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"
        )}
      >
        <Database className="w-3.5 h-3.5" />
        DB Sync
        {errors.length > 0 ? (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px]">
            {errors.length}
          </span>
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-2 w-80 bg-[#111118] border border-[#2A2A3E] rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-[#2A2A3E] flex items-center justify-between bg-[#1A1A26]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#A0A0B8]" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Mock DB Integrity</h3>
              </div>
              <button 
                onClick={validate}
                disabled={isValidating}
                className="p-1 hover:bg-[#2A2A3E] rounded-md transition-colors disabled:opacity-50"
              >
                <RefreshCw className={cn("w-3.5 h-3.5 text-[#A0A0B8]", isValidating && "animate-spin")} />
              </button>
            </div>
            
            <div className="p-3 max-h-60 overflow-y-auto">
              {errors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4 text-green-500">
                  <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs font-medium">All mock data relations valid.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-500 mb-3 bg-red-500/10 p-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <p className="text-xs font-medium">Found {errors.length} integrity issues</p>
                  </div>
                  {errors.map((err, i) => (
                    <div key={i} className="text-[10px] text-[#A0A0B8] bg-[#1A1A26] p-2 rounded border border-[#2A2A3E]">
                      {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
