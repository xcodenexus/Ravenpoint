'use client'

import React, { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowUpRight, ExternalLink, Pin } from 'lucide-react'
import Link from 'next/link'
import { useInvestigation } from '@/lib/queries/useInvestigation'
import { useInvestigationStore } from '@/lib/stores/investigation'
import { Skeleton, ThreatScore, Tabs, EntityChip } from '@/components/ui'
import { GraphCanvas } from '@/components/graph/graph-canvas'
import type { EntityType } from '@/lib/types/entity'

const TABS = [
  { value: 'entities', label: 'Entities' },
  { value: 'graph',    label: 'Graph'    },
  { value: 'timeline', label: 'Timeline' },
  { value: 'notes',    label: 'Notes'    },
]

function scoreColor(score: number) {
  return score > 80 ? 'var(--danger)' : score > 60 ? 'var(--warning)' : 'var(--signal)'
}

const RELATION_LABELS: Record<string, string> = {
  resolves_to:    'Resolves to',
  registered_by:  'Registered by',
  co_hosted:      'Co-hosted',
  same_asn:       'Same ASN',
  hosts:          'Hosts',
  alias_of:       'Alias of',
  linked_to:      'Linked to',
  owned_by:       'Owned by',
  historical_host:'Historical host',
}

export default function InvestigationPage() {
  const { id }                   = useParams<{ id: string }>()
  const router                   = useRouter()
  const { data: inv, isLoading } = useInvestigation(id)
  const [tab, setTab]            = useState('entities')
  const [editingNotes, setEditingNotes] = useState(false)

  const { setNotes, getNotes } = useInvestigationStore()

  const notes = useMemo(
    () => getNotes(id, inv?.notes ?? ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, inv?.notes],
  )

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

  const pinned     = inv.entities.filter(e => e.pinned)
  const allSorted  = [...inv.entities].sort((a, b) => b.entity.threatScore - a.entity.threatScore)

  function navigateEntity(type: EntityType, value: string) {
    router.push(`/entity/${type}/${encodeURIComponent(value)}`)
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-6 pb-6 border-b border-border-subtle">
        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="font-mono text-[16px] text-text-primary">{inv.name}</h1>
              <span
                className="font-mono text-[9px] px-1.5 py-0.5 border uppercase tracking-[0.06em]"
                style={{
                  borderRadius: '2px',
                  borderColor: inv.status === 'active' ? 'var(--signal)' : 'var(--border-default)',
                  color:       inv.status === 'active' ? 'var(--signal)' : 'var(--text-tertiary)',
                }}
              >
                {inv.status}
              </span>
            </div>

            <p className="font-sans text-[12px] text-text-tertiary mb-3">{inv.description}</p>

            {inv.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {inv.tags.map(tag => (
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

            {pinned.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pinned.map(ie => (
                  <EntityChip
                    key={ie.entity.value}
                    type={ie.entity.type as EntityType}
                    value={ie.entity.value}
                    onPivot={navigateEntity}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-3 text-[11px] font-mono text-text-tertiary">
              <span>created {inv.createdAt.slice(0, 10)}</span>
              <span>·</span>
              <span>updated {inv.updatedAt.slice(0, 10)}</span>
            </div>
          </div>

          <div className="w-44 shrink-0">
            <ThreatScore score={inv.maxThreatScore} />
          </div>
        </div>
      </header>

      <Tabs
        items={TABS.map(t => t.value === 'entities' ? { ...t, count: inv.entities.length } : t)}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-6">
        {/* Entities */}
        {tab === 'entities' && (
          <div className="border border-border-subtle bg-surface-raised overflow-hidden" style={{ borderRadius: '2px' }}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8">Entity</th>
                  <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8 w-24">Added</th>
                  <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8 w-12 text-right">Score</th>
                  <th className="px-4 h-8 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {allSorted.map(ie => (
                  <tr
                    key={ie.entity.value}
                    className="hover:bg-surface-hover transition-colors duration-[120ms] cursor-pointer"
                    onClick={() => navigateEntity(ie.entity.type as EntityType, ie.entity.value)}
                  >
                    <td className="px-4 h-9">
                      <div className="flex items-center gap-2">
                        {ie.pinned && <Pin size={10} className="text-signal shrink-0" />}
                        <EntityChip type={ie.entity.type as EntityType} value={ie.entity.value} />
                      </div>
                    </td>
                    <td className="px-4 h-9 font-mono text-[11px] text-text-tertiary">
                      {ie.addedAt.slice(0, 10)}
                    </td>
                    <td
                      className="px-4 h-9 font-mono text-[13px] text-right font-medium"
                      style={{ color: scoreColor(ie.entity.threatScore) }}
                    >
                      {ie.entity.threatScore}
                    </td>
                    <td className="px-4 h-9 text-right">
                      <ArrowUpRight size={12} className="text-text-tertiary inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Graph */}
        {tab === 'graph' && (
          <div className="flex flex-col gap-3">
            <div
              className="border border-border-subtle overflow-hidden"
              style={{ borderRadius: '2px', height: '480px' }}
            >
              <GraphCanvas graph={inv.graph} onNodeClick={navigateEntity} />
            </div>
            <Link
              href={`/graph/${inv.id}`}
              className="flex items-center gap-1.5 font-sans text-[11px] text-text-tertiary hover:text-text-primary transition-colors duration-[120ms]"
            >
              <ExternalLink size={11} />
              Open full graph view
            </Link>
          </div>
        )}

        {/* Timeline */}
        {tab === 'timeline' && (
          <div className="relative flex flex-col">
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border-subtle" />
            {inv.graph.edges.map((edge, i) => {
              const srcNode = inv.graph.nodes.find(n => n.id === edge.source)
              const tgtNode = inv.graph.nodes.find(n => n.id === edge.target)
              if (!srcNode || !tgtNode) return null
              return (
                <div key={edge.id} className="relative flex gap-4 pb-5">
                  <div
                    className="relative z-10 w-[15px] h-[15px] flex items-center justify-center border border-border-default bg-surface-base shrink-0 mt-0.5"
                    style={{ borderRadius: '2px' }}
                  >
                    <span className="font-mono text-[8px] text-text-tertiary">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-mono text-[12px] text-text-primary truncate max-w-[160px]">
                        {srcNode.value}
                      </span>
                      <span className="font-sans text-[10px] text-text-tertiary shrink-0">
                        {RELATION_LABELS[edge.relation] ?? edge.relation}
                      </span>
                      <span className="font-mono text-[12px] text-text-primary truncate max-w-[160px]">
                        {tgtNode.value}
                      </span>
                    </div>
                    <div className="font-sans text-[11px] text-text-tertiary mt-0.5">
                      {edge.label ?? ''} · {edge.confidence}% confidence
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Notes */}
        {tab === 'notes' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[11px] text-text-tertiary">
                {editingNotes ? 'Editing' : 'Preview'}
              </span>
              <button
                onClick={() => setEditingNotes(e => !e)}
                className="flex items-center gap-1 h-6 px-2.5 border border-border-default text-text-tertiary hover:text-text-primary hover:border-border-strong transition-colors duration-[120ms]"
                style={{ borderRadius: '2px' }}
              >
                <span className="font-sans text-[11px]">{editingNotes ? 'Preview' : 'Edit'}</span>
              </button>
            </div>

            {editingNotes ? (
              <textarea
                value={notes}
                onChange={e => setNotes(id, e.target.value)}
                className="w-full font-mono text-[12px] text-text-primary bg-surface-raised border border-border-default resize-none outline-none p-4 leading-relaxed"
                style={{ borderRadius: '2px', minHeight: '400px' }}
                placeholder="Investigation notes (markdown supported)…"
                spellCheck={false}
              />
            ) : (
              <div
                className="w-full font-mono text-[12px] text-text-secondary bg-surface-raised border border-border-subtle p-4 leading-relaxed whitespace-pre-wrap"
                style={{ borderRadius: '2px', minHeight: '400px' }}
              >
                {notes || <span className="text-text-tertiary">No notes yet. Click Edit to start writing.</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
