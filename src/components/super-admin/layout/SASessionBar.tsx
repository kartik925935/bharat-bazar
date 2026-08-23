'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'

function formatRelativeTime(dateStr: string) {
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function formatSessionRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const totalMins = Math.floor(diff / 60000)
  const hours = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

export function SASessionBar() {
  const { session } = useSAAuthStore()
  
  // Live clock
  const [clock, setClock] = useState('')
  useEffect(() => {
    const update = () => {
      setClock(new Intl.DateTimeFormat('en-IN', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      }).format(new Date()))
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  // Mock fluctuating latency
  // TODO: replace with real API latency ping
  const [latency, setLatency] = useState(38)
  const [latencyColor, setLatencyColor] = useState<'green' | 'yellow' | 'red'>('green')
  useEffect(() => {
    const t = setInterval(() => {
      const ms = Math.floor(Math.random() * 80) + 20
      setLatency(ms)
      setLatencyColor(ms < 60 ? 'green' : ms < 120 ? 'yellow' : 'red')
    }, 4000)
    return () => clearInterval(t)
  }, [])

  // Session remaining (updates every minute)
  const [sessionStr, setSessionStr] = useState('')
  useEffect(() => {
    if (!session) return
    const update = () => setSessionStr(formatSessionRemaining(session.expiresAt))
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [session])

  const latencyColorMap = {
    green: 'text-[#22C55E] bg-[#22C55E]',
    yellow: 'text-[#F59E0B] bg-[#F59E0B]',
    red: 'text-[#EF4444] bg-[#EF4444]',
  }
  const latencyDotColor = {
    green: 'bg-[#22C55E]',
    yellow: 'bg-[#F59E0B]',
    red: 'bg-[#EF4444]',
  }

  return (
    // Hidden on mobile
    <div className="hidden md:flex fixed bottom-0 left-0 right-0 z-40 h-9 bg-[#09090B]/90 backdrop-blur-md border-t border-[#1E1E2E] items-center px-6 gap-6">
      
      {/* ── Left: Latency + Status ── */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${latencyDotColor[latencyColor]}`} />
          <span className={`text-[10px] font-mono font-bold ${latencyColor === 'green' ? 'text-[#22C55E]' : latencyColor === 'yellow' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
            {latency}ms
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          <span className="text-[10px] text-[#22C55E] font-medium">All Systems Operational</span>
        </div>
      </div>

      {/* ── Center: Live Clock ── */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-[10px] font-mono font-medium text-[#6B6B80] tracking-wide">{clock}</span>
      </div>

      {/* ── Right: Session Expiry + Shield ── */}
      <div className="flex items-center gap-3">
        {session && (
          <span className="text-[10px] text-[#6B6B80] font-medium">
            Session expires in <span className="text-[#A0A0B8] font-bold font-mono">{sessionStr}</span>
          </span>
        )}
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-[#22C55E]" />
          <span className="text-[10px] text-[#3A3A50] font-medium">Secure</span>
        </div>
      </div>
    </div>
  )
}
