'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Eye, Shield } from 'lucide-react'

const TRUST_INDICATORS = [
  { icon: ShieldCheck, label: '256-bit Encryption', color: '#22C55E' },
  { icon: Lock, label: 'Multi-Factor Auth', color: '#FF7A00' },
  { icon: Eye, label: 'Full Audit Trail', color: '#3B82F6' },
]

const BLOB_VARIANTS = [
  {
    animate: { x: [0, 80, -40, 0], y: [0, -80, 40, 0], scale: [1, 1.15, 0.9, 1] },
    transition: { duration: 14, repeat: Infinity, ease: 'easeInOut' as const },
    style: { top: '-15%', left: '-10%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(255,122,0,0.15) 0%, transparent 70%)' },
  },
  {
    animate: { x: [0, -60, 30, 0], y: [0, 60, -30, 0], scale: [1, 0.85, 1.1, 1] },
    transition: { duration: 11, repeat: Infinity, ease: 'easeInOut' as const },
    style: { bottom: '5%', right: '-5%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)' },
  },
  {
    animate: { x: [0, 40, -20, 0], y: [0, 40, -60, 0], scale: [1, 1.1, 0.95, 1] },
    transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' as const },
    style: { top: '40%', left: '20%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(255,69,0,0.1) 0%, transparent 70%)' },
  },
]

export function SAAuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#09090B] overflow-hidden">

      {/* ─── LEFT PANEL (60% desktop, compact banner on mobile) ─── */}
      <div className="relative flex flex-col lg:w-[60%] overflow-hidden
        /* Mobile: compact top banner ~120px */
        h-[130px] lg:h-auto lg:min-h-screen
        border-b lg:border-b-0 lg:border-r border-[#1E1E2E]"
      >
        {/* Animated blob mesh */}
        <div className="absolute inset-0 pointer-events-none">
          {BLOB_VARIANTS.map((blob, i) => (
            <motion.div
              key={i}
              animate={blob.animate}
              transition={blob.transition}
              className="absolute rounded-full"
              style={{ ...blob.style, filter: 'blur(60px)' }}
            />
          ))}
        </div>

        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* ─── Mobile: only logo + tagline ─── */}
        <div className="lg:hidden relative z-10 flex items-center gap-4 p-6 h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#F5C842] flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-serif text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#F5C842] font-bold tracking-wide">
                Bharat Bazaar
              </p>
              <p className="text-xs text-[#6B6B80]">Command Center · Restricted Access</p>
            </div>
          </div>
        </div>

        {/* ─── Desktop: full left panel content ─── */}
        <div className="hidden lg:flex relative z-10 flex-col justify-between h-full p-14 xl:p-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#F5C842] flex items-center justify-center shadow-xl shadow-orange-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#F5C842] font-bold tracking-widest uppercase">
              Bharat Bazaar
            </span>
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div>
              <h1 className="font-serif text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
                <span className="text-white">The</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] via-[#FFB800] to-[#F5C842]">
                  Command
                </span>
                <br />
                <span className="text-white">Center</span>
              </h1>
            </div>
            <p className="text-[#7A7A90] text-lg xl:text-xl font-light leading-relaxed max-w-sm">
              Fortress-grade security for<br />platform command.
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            {TRUST_INDICATORS.map(({ icon: Icon, label, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}18`, borderColor: `${color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#D0D0E0]">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT PANEL (40% desktop, full on mobile) ─── */}
      <div className="flex-1 relative flex flex-col items-center justify-center bg-[#0C0C14] p-6 sm:p-8 lg:p-12 min-h-0 overflow-y-auto">
        
        {/* Subtle radial gradient glow behind the form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,122,0,0.04) 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[440px] flex flex-col"
        >
          {children}

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-[#1A1A26]">
            <p className="text-center text-xs text-[#3A3A50] font-medium tracking-wide">
              Protected by Bharat Bazaar Security · v2.0
            </p>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
