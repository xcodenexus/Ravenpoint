'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Renders value in Geist Mono — for IPs, domains, hashes, etc. */
  identifier?: boolean
  /** Keyboard shortcut badge shown inside the right edge */
  shortcut?: string
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ identifier, shortcut, error, className, style, ...props }, ref) => (
    <div className="relative flex items-center w-full">
      <input
        ref={ref}
        {...props}
        className={cn(
          'h-7 w-full px-3 bg-surface-raised border text-[13px] outline-none transition-colors duration-[120ms]',
          identifier ? 'font-mono' : 'font-sans',
          error
            ? 'border-danger text-danger placeholder:text-[rgba(255,92,92,0.4)]'
            : 'border-border-default text-text-primary placeholder:text-text-tertiary focus:border-border-strong',
          shortcut && 'pr-12',
          className,
        )}
        style={{ borderRadius: '4px', ...style }}
      />
      {shortcut && (
        <span
          className="absolute right-2 pointer-events-none flex items-center justify-center px-1 h-4 font-mono text-[10px] text-text-tertiary border border-border-default bg-surface-base"
          style={{ borderRadius: '2px' }}
        >
          {shortcut}
        </span>
      )}
    </div>
  ),
)
Input.displayName = 'Input'
