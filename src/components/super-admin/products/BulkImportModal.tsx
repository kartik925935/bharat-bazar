'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BulkImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File) => Promise<void>
}

export function BulkImportModal({ isOpen, onClose, onImport }: BulkImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleFileSelection = (file: File) => {
    // Check if CSV or Excel
    if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
      setFile(file)
      setUploadStatus('idle')
    } else {
      setUploadStatus('error')
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setIsUploading(true)
    try {
      await onImport(file)
      setUploadStatus('success')
      setTimeout(() => {
        onClose()
        setFile(null)
        setUploadStatus('idle')
      }, 2000)
    } catch (error) {
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-lg bg-[#0D0D14] border border-[#1E1E2E] rounded-2xl flex flex-col shadow-2xl z-10"
          >
            <div className="flex items-center justify-between p-5 border-b border-[#1E1E2E]">
              <h2 className="text-lg font-bold text-white">Bulk Import Products</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:text-white hover:bg-[#1A1A26] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors relative",
                  file ? "border-[#FF7A00]/50 bg-[#FF7A00]/5" : 
                  uploadStatus === 'error' ? "border-red-500/50 bg-red-500/5" : "border-[#2A2A3E] bg-[#1A1A26] hover:border-[#3A3A50]"
                )}
              >
                <input 
                  type="file" 
                  accept=".csv, .xlsx" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelection(e.target.files[0])
                    }
                  }}
                />

                {file ? (
                  <>
                    <FileSpreadsheet className="w-12 h-12 text-[#FF7A00] mb-4" />
                    <p className="text-sm font-bold text-white mb-1">{file.name}</p>
                    <p className="text-xs text-[#8B8B9E]">{(file.size / 1024).toFixed(1)} KB</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-[#6B6B80] mb-4" />
                    <p className="text-sm font-bold text-white mb-1">Click or drag file to this area to upload</p>
                    <p className="text-xs text-[#8B8B9E]">Support for a single CSV or XLSX file.</p>
                  </>
                )}
              </div>

              {uploadStatus === 'error' && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <p>Invalid file format or error reading file. Please upload a valid CSV template.</p>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-500 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <p>Import successful! Processing data in background.</p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-[#1A1A26] border border-[#2A2A3E] text-[#A0A0B8] font-bold hover:text-white hover:bg-[#2A2A3E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading || uploadStatus === 'success'}
                  className="flex-1 py-3 rounded-xl bg-[#FF7A00] text-white font-bold disabled:opacity-50 hover:bg-[#FF9500] transition-colors flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <UploadCloud className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    'Import Data'
                  )}
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1E1E2E] flex items-start gap-3 text-xs text-[#8B8B9E]">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#6B6B80]" />
                <p>
                  Need the template? <a href="#" className="text-[#FF7A00] font-bold hover:underline">Download CSV Template</a>. Make sure required fields (Name, MRP, Price, Seller ID) are present.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
