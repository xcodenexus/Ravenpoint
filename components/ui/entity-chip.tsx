'use client'

import { useState } from 'react'
import { Globe, Server, Mail, Wallet, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type EntityType = 'domain' | 'ip' | 'email' | 'wallet' | 'username'

interface EntityChipProps {
  type: EntityType
  value: string
  onPivot?: (type: EntityType, value: string) => void
  className?: string
}

const icons: Record<EntityType, React.ElementType> = {
  domain:   Globe,
  ip:       Server,
  email:    Mail,
  wallet:   Wallet,
  username: User,
}

const typeColor: Record<EntityType, string> = {
  domain:   'var(--info)',
  ip:       'var(--warning)',
  email:    'var(--signal)',
  wallet:   'var(--danger)',
  username: 'var(--text-secondary)',
}

export function EntityChip({ type, value, onPivot, className }: EntityChipProps) {
  const [hovered, setHovered] = useState(false)
  const Icon = icons[type]

  return (
    <span className="relative inline-flex">
      <button
        onClick={() => onPivot?.(type, value)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'inline-flex items-center gap-1.5 h-6 px-2 bg-surface-raised border border-border-default',
          'hover:border-border-strong hover:bg-surface-hover transition-colors duration-[120ms] select-none',
          className,
        )}
        style={{ borderRadius: '4px' }}
      >
        <Icon size={11} style={{ color: typeColor[type], flexShrink: 0 }} />
        <span className="font-mono text-[12px] text-text-primary">{value}</span>
      </button>

      {hovered && (
        <span
          className="absolute bottom-full left-0 mb-2 z-50 w-52 p-3 bg-surface-overlay border border-border-default pointer-events-none flex flex-col gap-1.5"
          style={{
            borderRadius: '4px',
            animation: 'fade-in 120ms ease-out both',
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.08em] font-sans text-text-tertiary">
            {type}
          </span>
          <span className="font-mono text-[12px] text-text-primary break-all">{value}</span>
          <span className="text-[10px] font-sans text-text-tertiary">
            Click to pivot →
          </span>
        </span>
      )}
    </span>
  )
}
