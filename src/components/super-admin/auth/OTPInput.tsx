'use client'

import React, { useRef, useEffect, ClipboardEvent, KeyboardEvent, ChangeEvent } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

export function OTPInput({ length = 6, value, onChange, onComplete, disabled = false, autoFocus = true, className }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const digits = Array.from({ length }, (_, i) => value[i] || '')

  useEffect(() => {
    if (autoFocus && !disabled) {
      const firstEmpty = digits.findIndex((d) => !d)
      const focusIdx = firstEmpty === -1 ? length - 1 : firstEmpty
      inputRefs.current[Math.min(focusIdx, 0)]?.focus()
    }
  }, [autoFocus, disabled])

  const focusInput = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, length - 1))
    inputRefs.current[clamped]?.focus()
    inputRefs.current[clamped]?.select()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) return

    const newDigits = [...digits]
    newDigits[idx] = raw[raw.length - 1] // take last char (handles overwrite)
    const newValue = newDigits.join('')
    onChange(newValue)

    if (idx < length - 1) focusInput(idx + 1)

    if (newValue.length === length) onComplete?.(newValue)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newDigits = [...digits]
      if (newDigits[idx]) {
        newDigits[idx] = ''
        onChange(newDigits.join(''))
      } else if (idx > 0) {
        newDigits[idx - 1] = ''
        onChange(newDigits.join(''))
        focusInput(idx - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusInput(idx - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusInput(idx + 1)
    } else if (e.key === 'Enter' && value.length === length) {
      onComplete?.(value)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    onChange(pasted)
    const nextIdx = Math.min(pasted.length, length - 1)
    focusInput(nextIdx)
    if (pasted.length === length) onComplete?.(pasted)
  }

  return (
    <div className={cn('flex gap-2.5 sm:gap-3', className)} role="group" aria-label="One-time password input">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { inputRefs.current[idx] = el }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={2}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          autoComplete={idx === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${idx + 1}`}
          className={cn(
            'w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold font-mono',
            'bg-[#0E0E16] border-2 rounded-xl text-white outline-none select-none',
            'transition-all duration-200',
            'focus:border-[#FF7A00] focus:shadow-[0_0_0_4px_rgba(255,122,0,0.15)] focus:scale-105',
            digit ? 'border-[#FF7A00]/60 shadow-[0_0_0_1px_rgba(255,122,0,0.2)]' : 'border-[#2A2A3E]',
            disabled && 'opacity-40 cursor-not-allowed'
          )}
        />
      ))}
    </div>
  )
}
