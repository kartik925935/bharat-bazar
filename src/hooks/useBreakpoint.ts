'use client'
import { useState, useEffect } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

function getBreakpoint(width: number): Breakpoint {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export function useBreakpoint(): Breakpoint {
  // SSR-safe: default to 'desktop' on the server, correct on mount
  const [bp, setBp] = useState<Breakpoint>('desktop')

  useEffect(() => {
    const update = () => setBp(getBreakpoint(window.innerWidth))
    update()

    let timer: ReturnType<typeof setTimeout>
    const debounced = () => {
      clearTimeout(timer)
      timer = setTimeout(update, 100)
    }

    window.addEventListener('resize', debounced)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', debounced)
    }
  }, [])

  return bp
}

export function useIsMobile(): boolean {
  return useBreakpoint() === 'mobile'
}
