'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// ── Context ──────────────────────────────────────────────────────────────────
const TabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
}>({ activeTab: '', setActiveTab: () => {} })

// ── Tabs (root) ───────────────────────────────────────────────────────────────
interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [internalTab, setInternalTab] = React.useState(defaultValue)
  const activeTab = value ?? internalTab

  const setActiveTab = React.useCallback((v: string) => {
    setInternalTab(v)
    onValueChange?.(v)
  }, [onValueChange])

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

// ── TabsList ──────────────────────────────────────────────────────────────────
function TabsList({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      role="tablist"
      className={cn('flex items-center', className)}
    >
      {children}
    </div>
  )
}

// ── TabsTrigger ───────────────────────────────────────────────────────────────
function TabsTrigger({
  value,
  className,
  children,
  disabled,
}: {
  value: string
  className?: string
  children: React.ReactNode
  disabled?: boolean
}) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn('inline-flex items-center justify-center transition-all', className)}
    >
      {children}
    </button>
  )
}

// ── TabsContent ───────────────────────────────────────────────────────────────
function TabsContent({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const { activeTab } = React.useContext(TabsContext)
  if (activeTab !== value) return null

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
