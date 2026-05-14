'use client'

import React, { useState } from 'react'
import { Tabs, Input, Button } from '@/components/ui'

const SHORTCUTS = [
  { key: '⌘K',    action: 'Open command palette'     },
  { key: '⌘J',    action: 'Toggle AI Analyst panel'  },
  { key: 'j / ↓', action: 'Navigate table row down'  },
  { key: 'k / ↑', action: 'Navigate table row up'    },
  { key: 'x',     action: 'Select / deselect row'    },
  { key: '↵',     action: 'Open selected row'        },
  { key: 'Esc',   action: 'Close dialog or palette'  },
]

const API_KEY_FIELDS = [
  { label: 'VirusTotal API Key',    placeholder: 'vt-api-…'     },
  { label: 'Shodan API Key',        placeholder: 'shodan-…'     },
  { label: 'AbuseIPDB API Key',     placeholder: 'abuseipdb-…' },
  { label: 'Recorded Future Token', placeholder: 'rf-token-…'  },
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
      {API_KEY_FIELDS.map(({ label, placeholder }) => (
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

function AboutTab() {
  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[22px] text-signal tracking-wide">RAVENPOINT</span>
        <span className="font-sans text-[13px] text-text-tertiary">v0.4.0 — Session 4 build</span>
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
  const [tab, setTab] = useState('api-keys')

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
          { value: 'api-keys',     label: 'API Keys'           },
          { value: 'data-sources', label: 'Data Sources'       },
          { value: 'shortcuts',    label: 'Keyboard Shortcuts' },
          { value: 'about',        label: 'About'              },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-6">
        {tab === 'api-keys'     && <ApiKeysTab />}
        {tab === 'data-sources' && <DataSourcesTab />}
        {tab === 'shortcuts'    && <ShortcutsTab />}
        {tab === 'about'        && <AboutTab />}
      </div>
    </div>
  )
}
