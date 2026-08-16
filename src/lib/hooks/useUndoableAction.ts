'use client'

import { useCallback, useRef } from 'react'
import { toast } from 'sonner'

interface UndoableActionOptions<T> {
  /** Human-readable description shown in the undo toast */
  description: string
  /** Execute the action */
  action: () => Promise<T>
  /** Undo the action — reverts the mutation */
  undoAction: () => Promise<void>
  /** How long (ms) the undo window stays open (default 6000ms) */
  undoWindowMs?: number
  /** Called after action succeeds (before undo window) */
  onSuccess?: (result: T) => void
  /** Called if undo is triggered */
  onUndo?: () => void
}

/**
 * useUndoableAction — wraps any store mutation with a 6-second undo window.
 *
 * Usage:
 * ```tsx
 * const { execute } = useUndoableAction()
 * await execute({
 *   description: 'Customer blocked',
 *   action: () => blockCustomer(id, reason),
 *   undoAction: () => unblockCustomer(id),
 * })
 * ```
 */
export function useUndoableAction() {
  const undoRef = useRef<(() => void) | null>(null)

  const execute = useCallback(async <T>(options: UndoableActionOptions<T>): Promise<T | null> => {
    const {
      description,
      action,
      undoAction,
      undoWindowMs = 6000,
      onSuccess,
      onUndo,
    } = options

    // Execute the primary action
    let result: T
    try {
      result = await action()
    } catch (err) {
      toast.error('Action failed', { description: String(err) })
      return null
    }

    onSuccess?.(result)

    let undone = false

    // Show undo toast
    toast(description, {
      duration: undoWindowMs,
      action: {
        label: 'Undo',
        onClick: async () => {
          if (undone) return
          undone = true
          try {
            await undoAction()
            onUndo?.()
            toast.success('Action undone successfully')
          } catch {
            toast.error('Could not undo action')
          }
        },
      },
    })

    return result
  }, [])

  return { execute }
}
