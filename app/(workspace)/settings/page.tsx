'use client'

import React, { useState } from 'react'
import { Tabs, Input, Button } from '@/components/ui'

const SHORTCUTS = [
  { key: '⌘K',    action: 'Open command palette'            },
  { key: '⌘J',    action: 'Toggle AI Analyst panel'         },
  { key: 'j / ↓', action: 'Navigate table row down'         },
  { key: 'k / ↑', action: 'Navigate table row up'           },
  { key: '↵',     action: 'Open selected row / navigate'    },
  { key: 'Esc',   action: 'Close dialog, palette, or panel' },
  { key: '⌘C',    action: 'Copy entity value'               },
  { key: 'g e',   action: 'Go to Sessions list'             },
  { key: 'g g',   action: 'Go to Graph view'                },
]

const API_KEY_FIELDS = [
  { label: 'Anthropic API Key',     placeholder: 'sk-ant-…',    env: 'ANTHROPIC_API_KEY'  },
  { label: 'VirusTotal API Key',    placeholder: 'vt-api-…',    env: 'VIRUSTOTAL_API_KEY' },
  { label: 'Shodan API Key',        placeholder: 'shodan-…',    env: 'SHODAN_API_KEY'     },
  { label: 'AbuseIPDB API Key',     placeholder: 'abuseipdb-…', env: 'ABUSEIPDB_API_KEY'  },
  { label: 'Recorded Future Token', placeholder: 'rf-token-…',  env: 'RF_API_TOKEN'       },
]

const DATA_SOURCES = [
  { id: 'vt',   label: 'VirusTotal',      connected: true  },
  { id: 'sh',   label: 'Shodan',          connected: false },
  { id: 'ab',   label: 'AbuseIPDB',       connected: true  },
  { id: 'rf',   label: 'Recorded Future', connected: false },
  { id: 'ct',   label: 'crt.sh',          connected: true  },
  { id: 'rdns', label: 'Passive DNS',     connected: true  },
]

const STACK_INFO = [
  ['Framework',   'Next.js 16.2.6 / App Router'   ],
  ['UI Layer',    'React 19.2.4 / TypeScript'      ],
  ['Styling',     'Tailwind CSS v4 — tokens-first' ],
  ['State',       'Zustand + TanStack Query v5'    ],
  ['Data',        'Static mock layer (OSINT swap)' ],
]

function ApiKeysTab() {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {API_KEY_FIELDS.map(({ label, placeholder, env }) => (
        <div key={label}>
          <div className="font-sans text-[11px] text-text-secondary mb-2">{label}</div>
          <div className="flex gap-2">
            <Input
              value=""
              onChange={() => {}}
              placeholder={placeholder}
              identifier
              className="flex-1"
            />
            <Button variant="secondary" size="sm">Save</Button>
          </div>
          <div className="font-mono text-[10px] text-text-tertiary mt-1">env: {env}</div>
        </div>
      ))}
    </div>
  )
}

function DataSourcesTab() {
  return (
    <div className="flex flex-col divide-y divide-border-subtle max-w-lg">
      {DATA_SOURCES.map(s => (
        <div key={s.id} className="flex items-center h-9 gap-4">
          <span className="font-sans text-[13px] text-text-primary w-40 shrink-0">{s.label}</span>
          <span
            className="font-mono text-[11px]"
            style={{ color: s.connected ? 'var(--signal)' : 'var(--text-tertiary)' }}
          >
            {s.connected ? 'connected' : 'disconnected'}
          </span>
          <div className="flex-1" />
          <Button variant="secondary" size="sm">Configure</Button>
        </div>
      ))}
    </div>
  )
}

function ShortcutsTab() {
  return (
    <div className="flex flex-col divide-y divide-border-subtle max-w-md">
      {SHORTCUTS.map(s => (
        <div key={s.key} className="flex items-center h-9 gap-4">
          <kbd
            className="font-mono text-[11px] text-text-secondary border border-border-default px-2 py-0.5 min-w-[72px] text-center shrink-0"
            style={{ borderRadius: '2px' }}
          >
            {s.key}
          </kbd>
          <span className="font-sans text-[13px] text-text-secondary">{s.action}</span>
        </div>
      ))}
    </div>
  )
}

const GUIDE_SECTIONS = [
  {
    title: 'What is Ravenpoint?',
    body: 'Ravenpoint is a threat intelligence workspace for solo investigators. Create an Investigation — a named case — then add entities (IPs, domains, emails, usernames, crypto wallets). The platform enriches each entity with OSINT data from multiple sources and lets you trace connections between them.',
  },
  {
    title: 'Entity types',
    body: 'Five entity types are supported: IP addresses (e.g. 94.102.49.193), Domains (e.g. exfil-c2.ru), Email addresses, Usernames, and Crypto wallet addresses. Each type has its own enrichment tabs — infrastructure data for IPs/domains, exposure data for emails, social footprint for usernames, on-chain activity for wallets.',
  },
  {
    title: 'Starting an investigation',
    body: 'Go to Sessions from the sidebar. Each card is a named investigation with a threat score, status, and entity count. Click a session to open the workspace. Inside you\'ll find the Entities tab (sorted by threat score), Graph (force-graph of connections), Timeline (edge history), and Notes (freeform markdown).',
  },
  {
    title: 'Pivoting between entities',
    body: 'On any entity profile, the Overview tab shows connected entities from your investigations. Click any connection to jump to that entity\'s profile. Use ⌘K to search across all entities and investigations, or click a node in the graph to open the node panel and navigate to the entity page.',
  },
  {
    title: 'Using the AI Analyst',
    body: 'Press ⌘J or click Analyst in the top bar to open the streaming panel. Choose a mode: Summarise (threat summary), Pivots (suggested next steps), or Report (full structured report). The analyst reads the current page context. An ANTHROPIC_API_KEY must be configured in Settings → API Keys.',
  },
  {
    title: 'Graph view',
    body: 'Each investigation has an embedded graph on the Graph tab. Click "Open full graph view" to expand to the full canvas. Nodes are color-coded by entity type and sized by threat score. Click any node to open the side panel, which links to the entity profile. Scroll to zoom, drag to pan.',
  },
  {
    title: 'Command palette',
    body: 'Press ⌘K from anywhere to open the command palette. It searches across all entities, investigations, and app actions in real time. Use arrow keys or j/k to navigate, Enter to select, Esc to close.',
  },
]

function GuideTab() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      {GUIDE_SECTIONS.map(({ title, body }) => (
        <div key={title} className="flex flex-col gap-2">
          <span className="font-mono text-[12px] text-text-primary">{title}</span>
          <p className="font-sans text-[13px] text-text-secondary leading-relaxed">{body}</p>
        </div>
      ))}
    </div>
  )
}

function AboutTab() {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[22px] text-signal tracking-wide">RAVENPOINT</span>
        <span className="font-sans text-[13px] text-text-tertiary">v0.9.0 — Session 9 build</span>
      </div>
      <div className="flex flex-col gap-2 border-t border-border-subtle pt-4">
        {STACK_INFO.map(([k, v]) => (
          <div key={k} className="flex gap-4">
            <span className="font-mono text-[11px] text-text-tertiary w-24 shrink-0">{k}</span>
            <span className="font-sans text-[13px] text-text-secondary">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState('guide')

  return (
    <div className="px-8 py-8 max-w-3xl">
      <header className="mb-6">
        <h1 className="font-mono text-[13px] text-text-primary mb-1">Settings</h1>
        <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[0.08em]">
          Configuration &amp; integrations
        </p>
      </header>

      <Tabs
        items={[
          { value: 'guide',        label: 'Guide'              },
          { value: 'api-keys',     label: 'API Keys'           },
          { value: 'data-sources', label: 'Data Sources'       },
          { value: 'shortcuts',    label: 'Keyboard Shortcuts' },
          { value: 'about',        label: 'About'              },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-6">
        {tab === 'guide'        && <GuideTab />}
        {tab === 'api-keys'     && <ApiKeysTab />}
        {tab === 'data-sources' && <DataSourcesTab />}
        {tab === 'shortcuts'    && <ShortcutsTab />}
        {tab === 'about'        && <AboutTab />}
      </div>
    </div>
  )
}
