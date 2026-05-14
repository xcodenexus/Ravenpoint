'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'default' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const base =
  'inline-flex items-center justify-center gap-1.5 font-sans font-medium select-none transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed outline-none focus-visible:ring-1 focus-visible:ring-border-strong'

const variants: Record<Variant, string> = {
  primary:
    'bg-signal-bg border border-signal-dim text-signal hover:bg-[rgba(127,255,107,0.12)] active:bg-[rgba(127,255,107,0.05)]',
  secondary:
    'bg-transparent border border-border-default text-text-primary hover:bg-surface-hover hover:border-border-strong active:bg-surface-raised',
  ghost:
    'bg-transparent border border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-surface-raised',
  danger:
    'bg-danger-bg border border-danger text-danger hover:bg-[rgba(255,92,92,0.12)] active:bg-[rgba(255,92,92,0.05)]',
}

const sizes: Record<Size, string> = {
  sm:      'h-6 px-2.5 text-[12px]',
  default: 'h-7 px-3 text-[13px]',
  lg:      'h-8 px-4 text-[13px]',
}

export function Button({
  variant = 'secondary',
  size = 'default',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
      style={{ borderRadius: '4px', ...props.style }}
    >
      {loading ? (
        <>
          <span
            aria-hidden
            className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full"
            style={{ animation: 'spin 0.6s linear infinite' }}
          />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
