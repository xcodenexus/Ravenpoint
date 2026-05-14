'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useGraph } from '@/lib/queries/useGraph'
import { Skeleton } from '@/components/ui'

export default function GraphPage() {
  const { id }                     = useParams<{ id: string }>()
  const { data: graph, isLoading } = useGraph(id)

  if (isLoading) {
    return (
      <div className="px-8 py-8 flex flex-col gap-4">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-full h-[520px]" />
      </div>
    )
  }

  if (!graph) {
    return (
      <div className="px-8 py-8">
        <p className="font-mono text-[13px] text-danger">Graph not found: {id}</p>
      </div>
    )
  }

  return (
    <div className="px-8 py-8">
      <header className="mb-6">
        <h1 className="font-mono text-[13px] text-text-primary mb-1">Graph — {id}</h1>
        <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[0.08em]">
          {graph.nodes.length} nodes · {graph.edges.length} edges
        </p>
      </header>

      <div
        className="border border-border-subtle bg-surface-raised flex items-center justify-center"
        style={{ height: '520px', borderRadius: '2px' }}
      >
        <div className="text-center">
          <p className="font-mono text-[13px] text-text-tertiary mb-1">
            Interactive graph canvas
          </p>
          <p className="font-sans text-[11px] text-text-tertiary">Session 5 — D3 / Sigma.js</p>
        </div>
      </div>
    </div>
  )
}
