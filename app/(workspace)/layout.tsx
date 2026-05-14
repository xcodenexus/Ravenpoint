'use client'

import React, { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Layers, Settings, Clock, Brain, X, ChevronRight, Search,
} from 'lucide-react'
import { CommandPalette } from '@/components/ui'
import { AnalystPanel } from '@/components/analyst/analyst-panel'
import type { PaletteItem } from '@/components/ui'
import { useUiStore } from '@/lib/stores/ui'
import { useEntities } from '@/lib/queries/useEntities'
import { useInvestigations } from '@/lib/queries/useInvestigation'
import { cn } from '@/lib/utils/cn'

function NavItem({
  href,
  icon: Icon,
  label,
  count,
  active,
}: {
  href: string
  icon: React.ElementType
  label: string
  count?: number
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 h-7 px-3 text-[13px] transition-colors duration-[120ms] select-none',
        active
          ? 'text-text-primary bg-surface-hover'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised',
      )}
    >
      <Icon size={12} className="shrink-0" />
      <span className="font-sans flex-1 truncate">{label}</span>
      {count != null && (
        <span className="font-mono text-[10px] text-text-tertiary">{count}</span>
      )}
    </Link>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-3 pt-4 pb-1">
      <span className="font-sans text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
        {label}
      </span>
    </div>
  )
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { commandPaletteOpen, analystOpen, setCommandPaletteOpen, toggleAnalyst } =
    useUiStore()

  const { data: entities       = [] } = useEntities()
  const { data: investigations = [] } = useInvestigations()

  // Global keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'k') { e.preventDefault(); setCommandPaletteOpen(true) }
      if (mod && e.key === 'j') { e.preventDefault(); toggleAnalyst()             }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setCommandPaletteOpen, toggleAnalyst])

  // Build palette items from live mock data
  const paletteItems = useMemo<PaletteItem[]>(() => {
    const actions: PaletteItem[] = [
      {
        type: 'action', label: 'Go to Sessions',
        shortcut: 'S', onSelect: () => router.push('/sessions'),
      },
      {
        type: 'action', label: 'Open Settings',
        shortcut: ',', onSelect: () => router.push('/settings'),
      },
      {
        type: 'action', label: 'Toggle AI Analyst',
        shortcut: '⌘J', onSelect: toggleAnalyst,
      },
    ]
    const invItems: PaletteItem[] = investigations.map(inv => ({
      type: 'investigation' as const,
      label: inv.name,
      description: `score ${inv.maxThreatScore} · ${inv.status}`,
      onSelect: () => router.push(`/investigation/${inv.id}`),
    }))
    const entityItems: PaletteItem[] = entities.map(e => ({
      type: 'entity' as const,
      subtype: e.type,
      label: e.value,
      description: e.type,
      onSelect: () => router.push(`/entity/${e.type}/${encodeURIComponent(e.value)}`),
    }))
    return [...actions, ...invItems, ...entityItems]
  }, [entities, investigations, router, toggleAnalyst])

  // Active investigation ID from URL
  const activeInvId = pathname.match(/^\/investigation\/([^/]+)/)?.[1] ?? null

  // Breadcrumb labels from URL segments
  const crumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    if (!segments.length) return [{ label: 'Sessions' }]
    const staticLabels: Record<string, string> = {
      sessions: 'Sessions', settings: 'Settings',
      investigation: 'Investigation', entity: 'Entity', graph: 'Graph',
    }
    return segments.map(seg => ({
      label: staticLabels[seg] ?? investigations.find(i => i.id === seg)?.name ?? seg,
    }))
  }, [pathname, investigations])

  return (
    <div className="fixed inset-0 flex flex-col bg-surface-base text-text-primary overflow-hidden">
      {/* ── Top Bar ── */}
      <header className="h-10 shrink-0 flex items-center px-4 gap-3 border-b border-border-subtle bg-surface-raised">
        <span className="font-mono text-[12px] text-signal tracking-wide shrink-0">
          RAVENPOINT
        </span>
        <span className="text-border-default mx-1 font-sans">·</span>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
          {crumbs.map((c, i) => (
            <React.Fragment key={`${c.label}-${i}`}>
              {i > 0 && <ChevronRight size={11} className="text-text-tertiary shrink-0" />}
              <span
                className={cn(
                  'font-mono text-[12px] truncate',
                  i === crumbs.length - 1 ? 'text-text-secondary' : 'text-text-tertiary',
                )}
              >
                {c.label}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* ⌘K search trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 h-6 px-2.5 border border-border-default text-text-tertiary hover:text-text-secondary hover:border-border-strong transition-colors duration-[120ms] shrink-0"
          style={{ borderRadius: '2px' }}
        >
          <Search size={11} />
          <span className="font-sans text-[11px] hidden sm:inline">Search</span>
          <kbd className="font-mono text-[10px] ml-1">⌘K</kbd>
        </button>

        {/* AI Analyst toggle */}
        <button
          onClick={toggleAnalyst}
          className={cn(
            'flex items-center gap-1.5 h-6 px-2.5 border transition-colors duration-[120ms] shrink-0',
            analystOpen
              ? 'border-signal text-signal'
              : 'border-border-default text-text-tertiary hover:text-text-secondary hover:border-border-strong',
          )}
          style={{ borderRadius: '2px' }}
        >
          <Brain size={11} />
          <span className="font-sans text-[11px] hidden sm:inline">Analyst</span>
          <kbd className="font-mono text-[10px] ml-1">⌘J</kbd>
        </button>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">
        {/* ── Sidebar ── */}
        <aside className="w-[220px] shrink-0 flex flex-col border-r border-border-subtle bg-surface-raised overflow-y-auto">
          <SectionLabel label="Workspace" />
          <NavItem
            href="/sessions"
            icon={Layers}
            label="Sessions"
            count={investigations.length || undefined}
            active={pathname === '/sessions' || pathname === '/'}
          />
          <NavItem
            href="/settings"
            icon={Settings}
            label="Settings"
            active={pathname.startsWith('/settings')}
          />

          {investigations.length > 0 && (
            <>
              <SectionLabel label="Investigations" />
              {investigations.map(inv => (
                <NavItem
                  key={inv.id}
                  href={`/investigation/${inv.id}`}
                  icon={Clock}
                  label={inv.name}
                  active={activeInvId === inv.id}
                />
              ))}
            </>
          )}
        </aside>

        {/* ── Main + Analyst ── */}
        <div className="flex flex-1 min-w-0">
          <main className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </main>

          {/* ── AI Analyst Panel ── */}
          {analystOpen && (
            <aside
              className="w-[320px] shrink-0 border-l border-border-subtle bg-surface-raised flex flex-col overflow-hidden"
              style={{ animation: 'fade-in 180ms ease-out both' }}
            >
              <div className="flex items-center justify-between h-10 px-4 border-b border-border-subtle shrink-0">
                <div className="flex items-center gap-2">
                  <Brain size={13} className="text-signal" />
                  <span className="font-mono text-[12px] text-text-primary">AI Analyst</span>
                </div>
                <button
                  onClick={toggleAnalyst}
                  className="text-text-tertiary hover:text-text-primary transition-colors duration-[120ms]"
                  aria-label="Close analyst panel"
                >
                  <X size={13} />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <AnalystPanel />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ── Status Bar ── */}
      <footer className="h-6 shrink-0 border-t border-border-subtle flex items-center px-3 gap-4 bg-surface-raised">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
          <span className="font-mono text-[10px] text-text-tertiary">OSINT FEEDS ACTIVE</span>
        </div>
        <div className="flex-1" />
        <span className="font-mono text-[10px] text-text-tertiary">
          {entities.length} entities · {investigations.length} investigations
        </span>
        <span className="w-px h-3 bg-border-default" />
        <span className="font-mono text-[10px] text-text-tertiary">v0.7.0</span>
      </footer>

      {/* ── Command Palette (wired to real data) ── */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        items={paletteItems}
      />
    </div>
  )
}
