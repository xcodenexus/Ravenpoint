'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'

export type ToastVariant = 'default' | 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

type Action =
  | { type: 'ADD'; item: ToastItem }
  | { type: 'REMOVE'; id: string }

function reducer(state: ToastItem[], action: Action): ToastItem[] {
  switch (action.type) {
    case 'ADD':    return [...state, action.item]
    case 'REMOVE': return state.filter(t => t.id !== action.id)
  }
}

const variantIcon: Partial<Record<ToastVariant, React.ElementType>> = {
  success: CheckCircle2,
  error:   AlertCircle,
  info:    Info,
}

const variantColor: Record<ToastVariant, string> = {
  default: 'var(--text-primary)',
  success: 'var(--signal)',
  error:   'var(--danger)',
  info:    'var(--info)',
}

function ToastCard({
  item,
  onRemove,
}: {
  item: ToastItem
  onRemove: (id: string) => void
}) {
  const Icon = variantIcon[item.variant]
  return (
    <div
      className="flex items-start gap-2.5 w-80 px-3.5 py-3 bg-surface-overlay border border-border-default"
      style={{
        borderRadius: '4px',
        animation: 'toast-in 240ms cubic-bezier(0.16,1,0.3,1) both',
      }}
      role="alert"
    >
      {Icon && (
        <Icon size={14} style={{ color: variantColor[item.variant], marginTop: 1, flexShrink: 0 }} />
      )}
      <p className="flex-1 font-sans text-[13px] text-text-primary leading-snug">
        {item.message}
      </p>
      <button
        onClick={() => onRemove(item.id)}
        className="shrink-0 mt-0.5 text-text-tertiary hover:text-text-primary transition-colors duration-[120ms]"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, [])

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'default', duration = 4000) => {
      const id = Math.random().toString(36).slice(2, 9)
      dispatch({ type: 'ADD', item: { id, message, variant } })
      if (duration > 0) {
        setTimeout(() => dispatch({ type: 'REMOVE', id }), duration)
      }
    },
    [],
  )

  const remove = useCallback((id: string) => dispatch({ type: 'REMOVE', id }), [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2" aria-live="polite">
          {toasts.map(item => (
            <ToastCard key={item.id} item={item} onRemove={remove} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
