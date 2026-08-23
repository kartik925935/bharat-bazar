'use client'
import { useEffect, useRef } from 'react'

interface ChordConfig {
  firstKey: string
  secondKey: string
  action: () => void
  windowMs?: number
}

export function useKeyboardChord(configs: ChordConfig[]) {
  const stateRef = useRef<{ activeKey: string | null; timer: ReturnType<typeof setTimeout> | null }>({
    activeKey: null,
    timer: null,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return
      }

      const key = e.key.toLowerCase()
      const { activeKey, timer } = stateRef.current

      if (activeKey) {
        // We are waiting for a second key
        const match = configs.find(
          c => c.firstKey.toLowerCase() === activeKey && c.secondKey.toLowerCase() === key
        )
        if (match) {
          e.preventDefault()
          match.action()
        }
        
        // Reset state whether matched or not
        if (timer) clearTimeout(timer)
        stateRef.current.activeKey = null
        stateRef.current.timer = null
      } else {
        // Checking for a potential first key
        const potentialMatch = configs.find(c => c.firstKey.toLowerCase() === key)
        if (potentialMatch) {
          stateRef.current.activeKey = key
          stateRef.current.timer = setTimeout(() => {
            stateRef.current.activeKey = null
            stateRef.current.timer = null
          }, potentialMatch.windowMs || 600)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [configs])
}
