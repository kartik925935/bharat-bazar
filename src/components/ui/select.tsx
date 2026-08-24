'use client'

import * as React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Context ───────────────────────────────────────────────────────────────────
interface SelectContextType {
  value: string
  onValueChange: (v: string) => void
  open: boolean
  setOpen: (v: boolean) => void
}
const SelectContext = React.createContext<SelectContextType>({
  value: '',
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
})

// ── Select (root) ─────────────────────────────────────────────────────────────
interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
}

function Select({ value, defaultValue = '', onValueChange, children, disabled }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const resolvedValue = value ?? internalValue

  const handleValueChange = React.useCallback((v: string) => {
    setInternalValue(v)
    onValueChange?.(v)
    setOpen(false)
  }, [onValueChange])

  // Close on outside click
  const containerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <SelectContext.Provider value={{ value: resolvedValue, onValueChange: handleValueChange, open, setOpen }}>
      <div ref={containerRef} className="relative" aria-disabled={disabled}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// ── SelectTrigger ─────────────────────────────────────────────────────────────
function SelectTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = React.useContext(SelectContext)

  return (
    <button
      type="button"
      role="combobox"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn(
        'flex items-center justify-between w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'gap-2',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn('w-4 h-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
    </button>
  )
}

// ── SelectValue ───────────────────────────────────────────────────────────────
function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)

  // Find display label from children of SelectContent
  // We store displayed labels in a ref via SelectItem
  const label = React.useContext(SelectLabelContext)

  return (
    <span className="truncate text-left">
      {label || value || <span className="text-muted-foreground">{placeholder}</span>}
    </span>
  )
}

// ── Internal label context (set by SelectItem on value match) ─────────────────
const SelectLabelContext = React.createContext<string>('')

// ── SelectContent ─────────────────────────────────────────────────────────────
function SelectContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, value } = React.useContext(SelectContext)

  // Collect labels from SelectItems to show in SelectValue
  const [currentLabel, setCurrentLabel] = React.useState('')

  // Traverse children to find matching label
  React.useLayoutEffect(() => {
    // Walk children recursively to find SelectItem matching value
    const findLabel = (nodes: React.ReactNode): string => {
      let found = ''
      React.Children.forEach(nodes, (child) => {
        if (!React.isValidElement(child)) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const el = child as React.ReactElement<any>
        if (el.props?.value === value) {
          found = String(el.props?.children ?? value)
        } else if (el.props?.children) {
          const inner = findLabel(el.props.children)
          if (inner) found = inner
        }
      })
      return found
    }
    setCurrentLabel(findLabel(children))
  }, [value, children])

  if (!open) {
    // Still render the label context for SelectValue, just not the dropdown
    return <SelectLabelContext.Provider value={currentLabel}>{null}</SelectLabelContext.Provider>
  }

  return (
    <SelectLabelContext.Provider value={currentLabel}>
      <div
        className={cn(
          'absolute z-50 top-full mt-1 left-0 right-0',
          'rounded-xl border border-border bg-popover shadow-xl',
          'overflow-hidden animate-in fade-in-0 zoom-in-95',
          className
        )}
      >
        <div className="max-h-60 overflow-y-auto py-1">
          {children}
        </div>
      </div>
    </SelectLabelContext.Provider>
  )
}

// ── SelectItem ────────────────────────────────────────────────────────────────
function SelectItem({
  value: itemValue,
  className,
  children,
  disabled,
}: {
  value: string
  className?: string
  children: React.ReactNode
  disabled?: boolean
}) {
  const { value, onValueChange } = React.useContext(SelectContext)
  const isSelected = value === itemValue

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => onValueChange(itemValue)}
      className={cn(
        'flex items-center gap-2 w-full px-3 py-2 text-sm text-left',
        'hover:bg-accent hover:text-accent-foreground transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isSelected && 'bg-accent/50 font-medium',
        className
      )}
    >
      <Check className={cn('w-3.5 h-3.5 shrink-0 text-primary', isSelected ? 'opacity-100' : 'opacity-0')} />
      {children}
    </button>
  )
}

// ── SelectGroup / SelectLabel ─────────────────────────────────────────────────
function SelectGroup({ children }: { children: React.ReactNode }) {
  return <div role="group">{children}</div>
}

function SelectLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-3 py-1.5 text-xs font-semibold text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel }
