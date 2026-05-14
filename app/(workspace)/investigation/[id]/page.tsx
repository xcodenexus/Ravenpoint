'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useInvestigation } from '@/lib/queries/useInvestigation'
import { Skeleton, ThreatScore, Tabs, EntityChip } from '@/components/ui'
import type { EntityType } from '@/lib/types/entity'

export default function InvestigationPage() {
  const { id }                   = useParams<{ id: string }>()
  const router                   = useRouter()
  const { data: inv, isLoading } = useInvestigation(id)
  const [tab, setTab]            = useState('entities')

  if (isLoading) {
    return (
      <div className="px-8 py-8 flex flex-col gap-4">
        <Skeleton className="w-64 h-8" />
        <Skeleton variant="line" className="w-full" />
        <Skeleton variant="line" className="w-3/4" />
      </div>
    )
  }

  if (!inv) {
    return (
      <div className="px-8 py-8">
        <p className="font-mono text-[13px] text-danger">Investigation not found: {id}</p>
      </div>
    )
  }

  const pinned = inv.entities.filter(e => e.pinned)

  return (
    <div className="px-8 py-8 max-w-4xl">
      <header className="mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h1 className="font-mono text-[13px] text-text-primary mb-1">{inv.name}</h1>
            <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[0.08em]">
              {inv.description}
            </p>
            {pinned.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {pinned.map(ie => (
                  <EntityChip
                    key={ie.entity.value}
                    type={ie.entity.type as EntityType}
                    value={ie.entity.value}
                    onPivot={(t, v) => router.push(`/entity/${t}/${encodeURIComponent(v)}`)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="w-44 shrink-0">
            <ThreatScore score={inv.maxThreatScore} />
          </div>
        </div>
      </header>

      <Tabs
        items={[
          { value: 'entities', label: 'Entities', count: inv.entities.length },
          { value: 'graph',    label: 'Graph'                                 },
          { value: 'timeline', label: 'Timeline'                              },
          { value: 'notes',    label: 'Notes'                                 },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-4">
        {tab === 'entities' && (
          <div className="flex flex-col divide-y divide-border-subtle">
            {inv.entities.map(ie => (
              <div key={ie.entity.value} className="flex items-center gap-4 h-9">
                <EntityChip
                  type={ie.entity.type as EntityType}
                  value={ie.entity.value}
                  onPivot={(t, v) => router.push(`/entity/${t}/${encodeURIComponent(v)}`)}
                />
                <div className="flex-1" />
                <span
                  className="font-mono text-[12px] shrink-0"
                  style={{
                    color: ie.entity.threatScore > 80 ? 'var(--danger)'
                         : ie.entity.threatScore > 60 ? 'var(--warning)'
                         : 'var(--signal)',
                  }}
                >
                  {ie.entity.threatScore}
                </span>
              </div>
            ))}
          </div>
        )}
        {tab === 'graph' && (
          <p className="font-sans text-[13px] text-text-tertiary">
            Graph canvas — {inv.graph.nodes.length} nodes, {inv.graph.edges.length} edges.
            Implemented in Session 5.
          </p>
        )}
        {tab === 'timeline' && (
          <p className="font-sans text-[13px] text-text-tertiary">Timeline — Session 5.</p>
        )}
        {tab === 'notes' && (
          <pre className="font-mono text-[12px] text-text-secondary whitespace-pre-wrap leading-relaxed">
            {inv.notes}
          </pre>
        )}
      </div>
    </div>
  )
}
