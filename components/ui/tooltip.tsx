'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface TooltipProps {
  content: React.ReactNode
  shortcut?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
  className?: string
}

export function Tooltip({ content, shortcut, side = 'top', children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  const positionClass: Record<NonNullable<TooltipProps['side']>, string> = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={cn(
            'absolute z-50 flex items-center gap-2 whitespace-nowrap px-2 py-1',
            'bg-surface-overlay border border-border-default',
            'text-[11px] font-sans text-text-secondary pointer-events-none',
            positionClass[side],
          )}
          style={{
            borderRadius: '4px',
            animation: 'fade-in 120ms ease-out both',
          }}
        >
          <span>{content}</span>
          {shortcut && (
            <span className="flex items-center gap-0.5">
              {shortcut.split('+').map((key, i) => (
                <kbd
                  key={i}
                  className="flex items-center justify-center px-1 h-4 font-mono text-[10px] text-text-tertiary bg-surface-hover border border-border-default"
                  style={{ borderRadius: '2px' }}
                >
                  {key}
                </kbd>
              ))}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
