'use client'

import { cn } from '@/lib/utils/cn'

interface Tab {
  value: string
  label: string
  count?: number
}

interface TabsProps {
  items: Tab[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn('flex items-center border-b border-border-subtle', className)}
    >
      {items.map(tab => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative flex items-center gap-1.5 px-3 h-9 font-sans text-[13px] select-none transition-colors duration-[120ms] whitespace-nowrap',
              active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn('font-mono text-[11px] tabular-nums', active ? 'text-text-tertiary' : 'text-text-disabled')}>
                {tab.count}
              </span>
            )}
            {active && (
              <span className="absolute bottom-0 inset-x-0 h-px bg-text-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}
