'use client'

import React, { useState } from 'react'
import { Trash2, ExternalLink, Copy } from 'lucide-react'
import {
  Button,
  Citation,
  CommandPalette,
  DataTable,
  Dialog,
  EntityChip,
  Input,
  SearchInput,
  Skeleton,
  StatBlock,
  StatusDot,
  Tabs,
  ThreatScore,
  ToastVariant,
  Tooltip,
  useToast,
} from '@/components/ui'
import type { Column, PaletteItem } from '@/components/ui'

interface EntityRow extends Record<string, unknown> {
  id: string
  entity: string
  type: string
  score: number
  seen: string
  status: string
}

const TABLE_ROWS: EntityRow[] = [
  { id: '1', entity: '198.51.100.42',       type: 'IP',     score: 87, seen: '2 min ago',  status: 'active'  },
  { id: '2', entity: 'mail.exfil-c2.ru',    type: 'Domain', score: 94, seen: '14 min ago', status: 'active'  },
  { id: '3', entity: 'h4x0r@protonmail.com', type: 'Email', score: 55, seen: '1 hr ago',   status: 'idle'    },
  { id: '4', entity: 'bc1qxy2kgdygjrs6',    type: 'Wallet', score: 72, seen: '3 hr ago',   status: 'pending' },
  { id: '5', entity: 'darkuser_99',          type: 'User',   score: 30, seen: '1 day ago',  status: 'idle'    },
]

const TABLE_COLS: Column<EntityRow>[] = [
  { key: 'entity', header: 'Entity',  mono: true,  sortable: true,  width: '45%' },
  { key: 'type',   header: 'Type',    mono: false, sortable: true  },
  { key: 'score',  header: 'Score',   mono: true,  sortable: true,
    render: (v) => <span style={{ color: Number(v) > 80 ? 'var(--danger)' : Number(v) > 60 ? 'var(--warning)' : 'var(--signal)' }}>{String(v)}</span> },
  { key: 'seen',   header: 'Last Seen', mono: false },
  { key: 'status', header: 'Status',  mono: false,
    render: (v) => <StatusDot status={v as 'active' | 'idle' | 'error' | 'pending'} label={String(v)} /> },
]

const PALETTE_ITEMS: PaletteItem[] = [
  { type: 'entity',        subtype: 'ip',     label: '198.51.100.42',     description: 'pivot entity'   },
  { type: 'entity',        subtype: 'domain',  label: 'exfil-c2.ru',       description: 'pivot entity'   },
  { type: 'entity',        subtype: 'email',   label: 'h4x0r@proton.me',   description: 'pivot entity'   },
  { type: 'action',                            label: 'New Investigation',  shortcut: 'N'                 },
  { type: 'action',                            label: 'Export Report',      shortcut: 'E'                 },
  { type: 'investigation',                     label: 'Op: Ghostnet',       description: 'last active 2h' },
  { type: 'investigation',                     label: 'Op: SilkRoad3',      description: 'last active 4d' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-sans text-[11px] uppercase tracking-[0.08em] text-text-tertiary mb-4 pb-2 border-b border-border-subtle">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-3 flex-wrap">
      <span className="font-mono text-[11px] text-text-tertiary w-28 shrink-0">{label}</span>
      {children}
    </div>
  )
}

export default function ComponentsPage() {
  const { toast } = useToast()

  const [tabValue,    setTabValue]    = useState('overview')
  const [dialogOpen,  setDialogOpen]  = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [searchVal,   setSearchVal]   = useState('')
  const [inputVal,    setInputVal]    = useState('')

  function fireToast(variant: ToastVariant) {
    const msgs: Record<ToastVariant, string> = {
      default: 'Background scan queued.',
      success: 'Entity pivoted successfully.',
      error:   'Connection to feed timed out.',
      info:    'OSINT feed refreshed — 14 new.',
    }
    toast(msgs[variant], variant)
  }

  return (
    <div className="min-h-screen bg-surface-base px-8 py-10 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="font-mono text-[13px] text-signal mb-1">RAVENPOINT</h1>
        <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[0.08em]">
          Component Showcase — Session 2
        </p>
      </header>

      {/* BUTTON */}
      <Section title="Button">
        <Row label="primary">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary">Default</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" loading>Loading</Button>
        </Row>
        <Row label="secondary">
          <Button variant="secondary" size="sm">Small</Button>
          <Button variant="secondary">Default</Button>
          <Button variant="secondary" size="lg">Large</Button>
        </Row>
        <Row label="ghost / danger">
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </Row>
      </Section>

      {/* INPUT */}
      <Section title="Input">
        <Row label="default">
          <Input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Target domain or IP…"
          />
        </Row>
        <Row label="identifier">
          <Input
            value="198.51.100.42"
            identifier
            readOnly
            onChange={() => {}}
          />
        </Row>
        <Row label="shortcut">
          <Input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Quick-add entity…"
            shortcut="⌘K"
          />
        </Row>
        <Row label="error">
          <Input
            value="bad-domain"
            onChange={() => {}}
            error
          />
        </Row>
      </Section>

      {/* SEARCH INPUT */}
      <Section title="SearchInput">
        <Row label="default">
          <div className="w-64">
            <SearchInput
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search entities…"
            />
          </div>
        </Row>
      </Section>

      {/* STATUS DOT */}
      <Section title="StatusDot">
        <Row label="statuses">
          <StatusDot status="active"  label="active"  />
          <StatusDot status="idle"    label="idle"    />
          <StatusDot status="pending" label="pending" />
          <StatusDot status="error"   label="error"   />
        </Row>
      </Section>

      {/* SKELETON */}
      <Section title="Skeleton">
        <Row label="block">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-24 h-8" />
        </Row>
        <Row label="line">
          <Skeleton variant="line" className="w-64" />
        </Row>
        <Row label="stacked">
          <div className="flex flex-col gap-2 w-48">
            <Skeleton variant="line" />
            <Skeleton variant="line" className="w-3/4" />
            <Skeleton variant="line" className="w-1/2" />
          </div>
        </Row>
      </Section>

      {/* STAT BLOCK */}
      <Section title="StatBlock">
        <div className="flex gap-8 flex-wrap">
          <StatBlock label="Entities"     value="1,284" />
          <StatBlock label="Threat Score" value="87"   unit="/100" delta={{ value: '+14%',  direction: 'up'      }} />
          <StatBlock label="Feed Hits"    value="23"               delta={{ value: '−8',    direction: 'down'    }} />
          <StatBlock label="Pivot Depth"  value="4"   unit="hops"  delta={{ value: '±0',    direction: 'neutral' }} />
        </div>
      </Section>

      {/* TABS */}
      <Section title="Tabs">
        <Tabs
          items={[
            { value: 'overview',  label: 'Overview',  count: 12  },
            { value: 'entities',  label: 'Entities',  count: 284 },
            { value: 'timeline',  label: 'Timeline'              },
            { value: 'raw',       label: 'Raw Data'              },
          ]}
          value={tabValue}
          onChange={setTabValue}
        />
        <div className="mt-3 font-mono text-[13px] text-text-secondary">
          Active tab: <span className="text-signal">{tabValue}</span>
        </div>
      </Section>

      {/* TOOLTIP */}
      <Section title="Tooltip">
        <Row label="positions">
          <Tooltip content="Pivot this entity" side="top">
            <Button variant="secondary" size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="Export as JSON" side="right" shortcut="⌘+E">
            <Button variant="secondary" size="sm">Right + shortcut</Button>
          </Tooltip>
          <Tooltip content="Delete permanently" side="bottom">
            <Button variant="danger" size="sm">Bottom</Button>
          </Tooltip>
        </Row>
      </Section>

      {/* CITATION */}
      <Section title="Citation">
        <p className="font-sans text-[13px] text-text-secondary max-w-prose leading-relaxed">
          The domain <span className="font-mono text-text-primary">exfil-c2.ru</span> was first
          observed in threat feeds on 2024-03-01
          <Citation index={1} source="VirusTotal — confirmed C2 infrastructure, 47 AV detections" />{' '}
          and has since been linked to at least three ransomware campaigns
          <Citation index={2} source="Recorded Future — APT29 attribution confidence: HIGH" />.
        </p>
      </Section>

      {/* ENTITY CHIP */}
      <Section title="EntityChip">
        <Row label="types">
          <EntityChip type="ip"       value="198.51.100.42"      onPivot={() => fireToast('info')} />
          <EntityChip type="domain"   value="exfil-c2.ru"        onPivot={() => fireToast('info')} />
          <EntityChip type="email"    value="h4x0r@proton.me"    onPivot={() => fireToast('info')} />
        </Row>
        <Row label="more">
          <EntityChip type="wallet"   value="bc1qxy2kgdygjrs6"   onPivot={() => fireToast('info')} />
          <EntityChip type="username" value="darkuser_99"         onPivot={() => fireToast('info')} />
        </Row>
      </Section>

      {/* THREAT SCORE */}
      <Section title="ThreatScore">
        <Row label="horizontal">
          <div className="w-64">
            <ThreatScore
              score={87}
              breakdown={[
                { label: 'Malware',    contribution: 92 },
                { label: 'Phishing',   contribution: 78 },
                { label: 'Reputation', contribution: 91 },
              ]}
            />
          </div>
        </Row>
        <Row label="vertical">
          <ThreatScore score={42} orientation="vertical" />
          <ThreatScore score={87} orientation="vertical"
            breakdown={[
              { label: 'Malware', contribution: 92 },
              { label: 'Phishing', contribution: 80 },
            ]}
          />
        </Row>
        <Row label="low / mid">
          <div className="w-48"><ThreatScore score={12} /></div>
          <div className="w-48"><ThreatScore score={55} /></div>
        </Row>
      </Section>

      {/* DIALOG */}
      <Section title="Dialog">
        <Row label="trigger">
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>Open Dialog</Button>
        </Row>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Confirm Entity Deletion"
          maxWidth="sm"
        >
          <p className="font-sans text-[13px] text-text-secondary leading-relaxed mb-4">
            Permanently remove <span className="font-mono text-text-primary">198.51.100.42</span> and
            all associated pivot data from this investigation? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost"  onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { setDialogOpen(false); fireToast('error') }}>
              Delete
            </Button>
          </div>
        </Dialog>
      </Section>

      {/* TOAST */}
      <Section title="Toast">
        <Row label="variants">
          <Button variant="secondary" size="sm" onClick={() => fireToast('default')}>Default</Button>
          <Button variant="secondary" size="sm" onClick={() => fireToast('success')}>Success</Button>
          <Button variant="secondary" size="sm" onClick={() => fireToast('error')}>Error</Button>
          <Button variant="secondary" size="sm" onClick={() => fireToast('info')}>Info</Button>
        </Row>
      </Section>

      {/* DATA TABLE */}
      <Section title="DataTable">
        <DataTable
          columns={TABLE_COLS}
          rows={TABLE_ROWS}
          keyField="id"
          onRowClick={() => fireToast('info')}
          actions={() => (
            <>
              <Tooltip content="Copy" side="top">
                <button className="p-1 text-text-tertiary hover:text-text-primary transition-colors duration-[120ms]">
                  <Copy size={12} />
                </button>
              </Tooltip>
              <Tooltip content="Open" side="top">
                <button className="p-1 text-text-tertiary hover:text-text-primary transition-colors duration-[120ms]">
                  <ExternalLink size={12} />
                </button>
              </Tooltip>
              <Tooltip content="Delete" side="top">
                <button className="p-1 text-text-tertiary hover:text-danger transition-colors duration-[120ms]">
                  <Trash2 size={12} />
                </button>
              </Tooltip>
            </>
          )}
        />
        <p className="font-sans text-[11px] text-text-tertiary mt-2">
          Use <kbd className="font-mono px-1 border border-border-default" style={{ borderRadius: '2px' }}>j/k</kbd> or{' '}
          <kbd className="font-mono px-1 border border-border-default" style={{ borderRadius: '2px' }}>↑↓</kbd> to navigate,{' '}
          <kbd className="font-mono px-1 border border-border-default" style={{ borderRadius: '2px' }}>x</kbd> to select rows.
        </p>
      </Section>

      {/* COMMAND PALETTE */}
      <Section title="CommandPalette">
        <Row label="trigger">
          <Button variant="secondary" onClick={() => setPaletteOpen(true)}>
            Open Palette <kbd className="ml-2 font-mono text-[10px] text-text-tertiary border border-border-default px-1" style={{ borderRadius: '2px' }}>⌘K</kbd>
          </Button>
        </Row>
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          items={PALETTE_ITEMS}
        />
      </Section>
    </div>
  )
}
