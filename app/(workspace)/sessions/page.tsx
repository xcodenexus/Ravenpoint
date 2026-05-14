'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useInvestigations } from '@/lib/queries/useInvestigation'
import { DataTable, Skeleton, StatusDot } from '@/components/ui'
import type { Column } from '@/components/ui'

interface InvestigationRow extends Record<string, unknown> {
  id: string
  name: string
  status: string
  entityCount: number
  maxThreatScore: number
  updatedAt: string
}

const COLS: Column<InvestigationRow>[] = [
  {
    key: 'name', header: 'Investigation', mono: true, sortable: true, width: '38%',
  },
  {
    key: 'status', header: 'Status', mono: false,
    render: (v) => (
      <StatusDot
        status={v === 'active' ? 'active' : v === 'archived' ? 'idle' : 'pending'}
        label={String(v)}
      />
    ),
  },
  { key: 'entityCount', header: 'Entities', mono: true, sortable: true },
  {
    key: 'maxThreatScore', header: 'Max Score', mono: true, sortable: true,
    render: (v) => (
      <span style={{
        color: Number(v) > 80 ? 'var(--danger)'
             : Number(v) > 60 ? 'var(--warning)'
             : 'var(--signal)',
      }}>
        {String(v)}
      </span>
    ),
  },
  { key: 'updatedAt', header: 'Updated', mono: false },
]

export default function SessionsPage() {
  const router                                   = useRouter()
  const { data: investigations = [], isLoading } = useInvestigations()

  const rows: InvestigationRow[] = investigations.map(inv => ({
    id:             inv.id,
    name:           inv.name,
    status:         inv.status,
    entityCount:    inv.entities.length,
    maxThreatScore: inv.maxThreatScore,
    updatedAt:      new Date(inv.updatedAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }),
  }))

  return (
    <div className="px-8 py-8 max-w-4xl">
      <header className="mb-6">
        <h1 className="font-mono text-[13px] text-text-primary mb-1">Sessions</h1>
        <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[0.08em]">
          {investigations.length} investigation{investigations.length !== 1 ? 's' : ''}
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="line" className="w-full" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={COLS}
          rows={rows}
          keyField="id"
          onRowClick={row => router.push(`/investigation/${row.id}`)}
        />
      )}
    </div>
  )
}
