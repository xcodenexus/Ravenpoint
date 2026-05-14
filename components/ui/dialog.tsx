'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg'
  className?: string
}

const widths = { sm: 480, md: 560, lg: 640 }

export function Dialog({ open, onClose, title, children, maxWidth = 'md', className }: DialogProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        style={{ animation: 'fade-in 240ms ease-out both' }}
      />

      {/* Panel */}
      <div
        className={cn(
          'relative z-10 w-full mx-4 bg-surface-overlay border border-border-default flex flex-col max-h-[80vh]',
          className,
        )}
        style={{
          maxWidth: widths[maxWidth],
          borderRadius: '4px',
          animation: 'scale-in 240ms cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        {title && (
          <div className="flex items-center justify-between px-4 h-10 border-b border-border-subtle shrink-0">
            <span className="font-sans text-[13px] font-medium text-text-primary">{title}</span>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors duration-[120ms]"
              aria-label="Close"
            >
              <X size={13} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}
