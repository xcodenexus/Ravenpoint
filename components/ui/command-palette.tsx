'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Globe, Server, Mail, Wallet, User, Zap, Clock, CornerDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type PaletteItemType = 'entity' | 'action' | 'investigation'

export interface PaletteItem {
  type: PaletteItemType
  /** Used to pick an icon variant (e.g. "domain", "ip", "email") */
  subtype?: string
  label: string
  description?: string
  shortcut?: string
  onSelect?: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  items: PaletteItem[]
  placeholder?: string
}

const subIcons: Record<string, React.ElementType> = {
  domain: Globe, ip: Server, email: Mail, wallet: Wallet, username: User,
}
const typeIcons: Record<PaletteItemType, React.ElementType> = {
  entity: Globe, action: Zap, investigation: Clock,
}

function itemIcon(item: PaletteItem): React.ElementType {
  if (item.subtype && subIcons[item.subtype]) return subIcons[item.subtype]
  return typeIcons[item.type]
}

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = 'Search entities, actions, investigations…',
}: CommandPaletteProps) {
  const [query, setQuery]         = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef                  = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(
      it => it.label.toLowerCase().includes(q) ||
            it.description?.toLowerCase().includes(q) ||
            it.subtype?.includes(q),
    )
  }, [items, query])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActiveIdx(0) }, [filtered.length])

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('')
      setActiveIdx(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'Escape')     { onClose(); return }
      if (e.key === 'ArrowDown')  { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp')    { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter') {
        e.preventDefault()
        const item = filtered[activeIdx]
        if (item) { item.onSelect?.(); onClose() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, filtered, activeIdx, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh]">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        style={{ animation: 'fade-in 240ms ease-out both' }}
      />
      <div
        className="relative z-10 w-full max-w-lg mx-4 bg-surface-overlay border border-border-default overflow-hidden flex flex-col"
        style={{
          borderRadius: '4px',
          animation: 'scale-in 240ms cubic-bezier(0.16,1,0.3,1) both',
          maxHeight: '60vh',
        }}
      >
        {/* Search bar */}
        <div className="flex items-center gap-2.5 px-3 border-b border-border-subtle shrink-0">
          <CornerDownLeft size={13} className="text-text-tertiary shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-10 bg-transparent font-sans text-[13px] text-text-primary placeholder:text-text-tertiary outline-none"
          />
          <kbd
            className="hidden sm:flex items-center justify-center px-1.5 h-5 font-mono text-[10px] text-text-tertiary border border-border-default bg-surface-raised shrink-0"
            style={{ borderRadius: '2px' }}
          >
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-12 font-sans text-[13px] text-text-tertiary">
              No results
            </div>
          ) : (
            filtered.map((item, i) => {
              const Icon = itemIcon(item)
              return (
                <button
                  key={`${item.type}-${item.label}-${i}`}
                  onClick={() => { item.onSelect?.(); onClose() }}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 h-8 text-left transition-colors duration-[120ms]',
                    i === activeIdx ? 'bg-surface-hover' : 'hover:bg-surface-raised',
                  )}
                >
                  <Icon size={13} className="text-text-tertiary shrink-0" />
                  <span className="flex-1 font-mono text-[13px] text-text-primary truncate">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="font-sans text-[11px] text-text-tertiary truncate max-w-[120px] hidden sm:block">
                      {item.description}
                    </span>
                  )}
                  {item.shortcut && (
                    <kbd
                      className="flex items-center justify-center px-1.5 h-4 font-mono text-[10px] text-text-tertiary border border-border-default bg-surface-base shrink-0"
                      style={{ borderRadius: '2px' }}
                    >
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-3 h-8 border-t border-border-subtle shrink-0">
          {[
            { key: '↑↓', label: 'navigate' },
            { key: '↵',  label: 'select'   },
            { key: 'esc', label: 'close'   },
          ].map(({ key, label }) => (
            <span key={key} className="flex items-center gap-1 text-[10px] font-mono text-text-tertiary">
              <kbd className="px-1 border border-border-default" style={{ borderRadius: '2px' }}>{key}</kbd>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
