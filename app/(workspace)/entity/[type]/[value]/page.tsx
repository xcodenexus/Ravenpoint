'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useEntity } from '@/lib/queries/useEntities'
import { Skeleton, ThreatScore, Tabs, EntityChip } from '@/components/ui'
import type { EntityType } from '@/lib/types/entity'

const ENTITY_TABS = [
  { value: 'whois',        label: 'WHOIS'        },
  { value: 'dns',          label: 'DNS Records'  },
  { value: 'certs',        label: 'Certs'        },
  { value: 'threat-intel', label: 'Threat Intel' },
  { value: 'pivots',       label: 'Pivots'       },
]

export default function EntityPage() {
  const { type, value }             = useParams<{ type: string; value: string }>()
  const decoded                     = decodeURIComponent(value)
  const { data: entity, isLoading } = useEntity(type as EntityType, decoded)
  const [tab, setTab]               = useState('whois')

  if (isLoading) {
    return (
      <div className="px-8 py-8 flex flex-col gap-4">
        <Skeleton className="w-64 h-8" />
        <Skeleton variant="line" className="w-full" />
      </div>
    )
  }

  if (!entity) {
    return (
      <div className="px-8 py-8">
        <p className="font-mono text-[13px] text-danger">Entity not found: {decoded}</p>
      </div>
    )
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <header className="mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <div className="mb-2">
              <EntityChip type={entity.type} value={entity.value} />
            </div>
            <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[0.08em]">
              {entity.type} · first seen {entity.firstSeen.slice(0, 10)}
            </p>
            {entity.tags.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {entity.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] text-text-tertiary border border-border-default px-1.5 py-0.5"
                    style={{ borderRadius: '2px' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="w-44 shrink-0">
            <ThreatScore score={entity.threatScore} />
          </div>
        </div>
      </header>

      <Tabs items={ENTITY_TABS} value={tab} onChange={setTab} />

      <div className="mt-4 font-sans text-[13px] text-text-tertiary">
        {tab === 'whois'        && <p>WHOIS data — Session 5.</p>}
        {tab === 'dns'          && <p>DNS records — Session 5.</p>}
        {tab === 'certs'        && <p>Certificate transparency — Session 5.</p>}
        {tab === 'threat-intel' && <p>Threat intelligence — Session 5.</p>}
        {tab === 'pivots'       && <p>Pivot suggestions — Session 5.</p>}
      </div>
    </div>
  )
}
