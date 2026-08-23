'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Plus, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FieldType = 'text' | 'number' | 'date' | 'enum' | 'boolean'
export type Operator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in'

export interface FilterField {
  key: string
  label: string
  type: FieldType
  options?: { label: string; value: string }[]  // for enum type
}

export interface FilterRule {
  id: string
  field: string
  operator: Operator
  value: string | string[]
}

interface AdvancedFilterBuilderProps {
  fields: FilterField[]
  onApply: (rules: FilterRule[]) => void
  onClear: () => void
  activeRules?: FilterRule[]
}

const OPERATORS_BY_TYPE: Record<FieldType, { value: Operator; label: string }[]> = {
  text:    [{ value: 'contains', label: 'Contains' }, { value: 'equals', label: 'Equals' }, { value: 'not_equals', label: 'Not Equals' }],
  number:  [{ value: 'equals', label: 'Equals' }, { value: 'greater_than', label: 'Greater Than' }, { value: 'less_than', label: 'Less Than' }, { value: 'not_equals', label: 'Not Equals' }],
  date:    [{ value: 'equals', label: 'On Date' }, { value: 'greater_than', label: 'After' }, { value: 'less_than', label: 'Before' }],
  enum:    [{ value: 'in', label: 'Is One Of' }, { value: 'equals', label: 'Is' }, { value: 'not_equals', label: 'Is Not' }],
  boolean: [{ value: 'equals', label: 'Is' }],
}

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

function FilterRuleRow({
  rule,
  fields,
  onChange,
  onRemove,
}: {
  rule: FilterRule
  fields: FilterField[]
  onChange: (id: string, patch: Partial<FilterRule>) => void
  onRemove: (id: string) => void
}) {
  const field = fields.find((f) => f.key === rule.field)
  const operators = field ? OPERATORS_BY_TYPE[field.type] : []

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Field */}
      <select
        value={rule.field}
        onChange={(e) => onChange(rule.id, { field: e.target.value, operator: 'equals', value: '' })}
        className="h-8 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-2 text-xs text-white outline-none focus:border-[#FF7A00] transition-colors appearance-none min-w-[120px]"
      >
        <option value="">Select field…</option>
        {fields.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
      </select>

      {/* Operator */}
      <select
        value={rule.operator}
        onChange={(e) => onChange(rule.id, { operator: e.target.value as Operator })}
        disabled={!field}
        className="h-8 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-2 text-xs text-white outline-none focus:border-[#FF7A00] transition-colors appearance-none min-w-[110px] disabled:opacity-40"
      >
        {operators.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
      </select>

      {/* Value input — type-aware */}
      {field?.type === 'enum' ? (
        <select
          value={Array.isArray(rule.value) ? rule.value[0] ?? '' : rule.value}
          onChange={(e) => onChange(rule.id, { value: e.target.value })}
          className="h-8 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-2 text-xs text-white outline-none focus:border-[#FF7A00] transition-colors appearance-none min-w-[120px]"
        >
          <option value="">Select…</option>
          {field.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : field?.type === 'date' ? (
        <input
          type="date"
          value={String(rule.value)}
          onChange={(e) => onChange(rule.id, { value: e.target.value })}
          className="h-8 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-2 text-xs text-white outline-none focus:border-[#FF7A00] transition-colors min-w-[130px]"
        />
      ) : field?.type === 'number' ? (
        <input
          type="number"
          value={String(rule.value)}
          onChange={(e) => onChange(rule.id, { value: e.target.value })}
          placeholder="Enter value…"
          className="h-8 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-2 text-xs text-white outline-none focus:border-[#FF7A00] transition-colors placeholder:text-[#5A5A70] min-w-[120px]"
        />
      ) : (
        <input
          type="text"
          value={String(rule.value)}
          onChange={(e) => onChange(rule.id, { value: e.target.value })}
          placeholder="Enter value…"
          className="h-8 bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-2 text-xs text-white outline-none focus:border-[#FF7A00] transition-colors placeholder:text-[#5A5A70] min-w-[120px]"
        />
      )}

      {/* Remove */}
      <button
        onClick={() => onRemove(rule.id)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6B80] hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function AdvancedFilterBuilder({ fields, onApply, onClear, activeRules = [] }: AdvancedFilterBuilderProps) {
  const [open, setOpen] = useState(false)
  const [rules, setRules] = useState<FilterRule[]>(activeRules.length ? activeRules : [])

  const addRule = () => {
    setRules((r) => [...r, { id: genId(), field: fields[0]?.key ?? '', operator: 'equals', value: '' }])
    if (!open) setOpen(true)
  }

  const updateRule = (id: string, patch: Partial<FilterRule>) => {
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)))
  }

  const removeRule = (id: string) => {
    setRules((r) => r.filter((rule) => rule.id !== id))
  }

  const handleApply = () => {
    const valid = rules.filter((r) => r.field && (Array.isArray(r.value) ? r.value.length > 0 : String(r.value).trim() !== ''))
    onApply(valid)
    setOpen(false)
  }

  const handleClear = () => {
    setRules([])
    onClear()
  }

  return (
    <div className="space-y-2">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-bold transition-all',
          open || rules.length > 0
            ? 'border-[#FF7A00]/40 bg-[#FF7A00]/5 text-[#FF7A00]'
            : 'border-[#2A2A3E] bg-[#111118] text-[#6B6B80] hover:text-white hover:border-[#3A3A50]'
        )}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Filters
        {rules.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-[#FF7A00] text-[#1C1B14] text-[9px] font-black flex items-center justify-center">
            {rules.length}
          </span>
        )}
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-widest">Advanced Filters — AND logic</p>
                <span className="text-[9px] text-[#5A5A70]">v1: AND-only chaining (OR in roadmap)</span>
              </div>

              {/* Rules */}
              <div className="space-y-2">
                <AnimatePresence>
                  {rules.map((rule, i) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                    >
                      <div className="flex items-center gap-2">
                        {i > 0 && (
                          <span className="text-[10px] font-bold text-[#FF7A00] shrink-0 w-8 text-center">AND</span>
                        )}
                        <FilterRuleRow
                          rule={rule}
                          fields={fields}
                          onChange={updateRule}
                          onRemove={removeRule}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {rules.length === 0 && (
                <p className="text-xs text-[#5A5A70] text-center py-2">No rules yet — add one below</p>
              )}

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#1E1E2E]">
                <button
                  onClick={addRule}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#FF7A00] hover:text-[#FF9500] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Rule
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClear}
                    className="h-7 px-3 rounded-lg text-xs font-bold text-[#6B6B80] hover:text-white border border-[#2A2A3E] hover:border-[#3A3A50] transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleApply}
                    className="h-7 px-3 rounded-lg text-xs font-bold bg-[#FF7A00] text-white hover:bg-[#FF9500] transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      {!open && rules.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {rules.map((rule) => {
            const field = fields.find((f) => f.key === rule.field)
            const val = Array.isArray(rule.value) ? rule.value.join(', ') : rule.value
            return (
              <span
                key={rule.id}
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20 rounded-full"
              >
                {field?.label ?? rule.field}: {val}
                <button onClick={() => { removeRule(rule.id); onApply(rules.filter((r) => r.id !== rule.id)) }}>
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Apply filter rules to a dataset */
export function applyFilterRules<T>(data: T[], rules: FilterRule[], fields: FilterField[]): T[] {
  if (rules.length === 0) return data
  return data.filter((row) =>
    rules.every((rule) => {
      const field = fields.find((f) => f.key === rule.field)
      if (!field) return true
      const val = (row as Record<string, unknown>)[rule.field]
      const strVal = String(val ?? '').toLowerCase()
      const ruleVal = String(rule.value).toLowerCase()

      switch (rule.operator) {
        case 'equals': return strVal === ruleVal
        case 'not_equals': return strVal !== ruleVal
        case 'contains': return strVal.includes(ruleVal)
        case 'greater_than': return Number(val) > Number(rule.value)
        case 'less_than': return Number(val) < Number(rule.value)
        case 'in': return Array.isArray(rule.value) ? rule.value.map(String).includes(String(val)) : strVal === ruleVal
        default: return true
      }
    })
  )
}
