'use client'

import React, { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGraph } from '@/lib/queries/useGraph'
import { Skeleton } from '@/components/ui'
import { GraphCanvas } from '@/components/graph/graph-canvas'
import { NodePanel } from '@/components/graph/node-panel'
import type { GraphNode } from '@/lib/types/graph'
import type { EntityType } from '@/lib/types/entity'

export default function GraphPage() {
  const { id }                     = useParams<{ id: string }>()
  const router                     = useRouter()
  const { data: graph, isLoading } = useGraph(id)
  const [selected, setSelected]    = useState<GraphNode | null>(null)

  const handleNodeClick = useCallback((type: EntityType, value: string) => {
    const node = graph?.nodes.find(n => n.type === type && n.value === value)
    setSelected(node ?? null)
  }, [graph])

  const handleNavigate = useCallback((type: EntityType, value: string) => {
    router.push(`/entity/${type}/${encodeURIComponent(value)}`)
  }, [router])

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
    <div className="flex flex-col" style={{ height: 'calc(100vh - 88px)' }}>
      <div className="flex items-center gap-4 px-8 h-11 border-b border-border-subtle shrink-0">
        <h1 className="font-mono text-[12px] text-text-primary">Graph — {id}</h1>
        <span className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.08em]">
          {graph.nodes.length} nodes · {graph.edges.length} edges
        </span>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <GraphCanvas
          graph={graph}
          onNodeClick={handleNodeClick}
        />

        {selected && (
          <NodePanel
            node={selected}
            onClose={() => setSelected(null)}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </div>
  )
}
