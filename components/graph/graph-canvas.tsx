'use client'

import React, { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { EntityNode, type EntityNodeData } from './entity-node'
import type { GraphData } from '@/lib/types/graph'
import type { EntityType } from '@/lib/types/entity'

interface GraphCanvasProps {
  graph: GraphData
  onNodeClick?: (type: EntityType, value: string) => void
}

const NODE_TYPES = { entity: EntityNode }

const RELATION_LABELS: Record<string, string> = {
  resolves_to:    '→',
  registered_by:  'reg',
  co_hosted:      'co-host',
  same_asn:       'ASN',
  hosts:          'hosts',
  alias_of:       'alias',
  linked_to:      'linked',
  owned_by:       'owns',
  historical_host:'hist',
}

function scoreColor(score: number): string {
  return score > 80 ? 'var(--danger)' : score > 60 ? 'var(--warning)' : 'var(--signal)'
}

export function GraphCanvas({ graph, onNodeClick }: GraphCanvasProps) {
  const initialNodes = useMemo<Node[]>(() =>
    graph.nodes.map(n => ({
      id:       n.id,
      type:     'entity',
      position: { x: (n.x ?? 0) * 1.4, y: (n.y ?? 0) * 1.4 },
      data:     {
        id:          n.id,
        type:        n.type,
        value:       n.value,
        threatScore: n.threatScore,
      } satisfies EntityNodeData,
    })),
  [graph.nodes])

  const initialEdges = useMemo<Edge[]>(() =>
    graph.edges.map(e => ({
      id:             e.id,
      source:         e.source,
      target:         e.target,
      label:          RELATION_LABELS[e.relation] ?? e.relation,
      labelStyle:     {
        fontFamily: 'var(--font-mono)',
        fontSize:   9,
        fill:       'var(--text-tertiary)',
      },
      labelBgStyle:   { fill: 'var(--surface-base)', fillOpacity: 0.85 },
      labelBgPadding: [3, 4] as [number, number],
      style:          {
        stroke:      'var(--border-strong)',
        strokeWidth: Math.max(1, Math.round(e.confidence / 33)),
        opacity:     0.6 + e.confidence / 333,
      },
      animated: e.confidence >= 90,
    })),
  [graph.edges])

  const [nodes, , onNodesChange]         = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges],
  )

  const handleNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    const d = node.data as unknown as EntityNodeData
    onNodeClick?.(d.type, d.value)
  }, [onNodeClick])

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--surface-base)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.15}
        maxZoom={3}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'var(--surface-base)' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="var(--border-subtle)"
        />

        <Controls
          showInteractive={false}
          style={{
            border:       '1px solid var(--border-default)',
            borderRadius: '2px',
            background:   'var(--surface-raised)',
            boxShadow:    'none',
          }}
        />

        <MiniMap
          nodeColor={n => scoreColor((n.data as unknown as EntityNodeData).threatScore)}
          maskColor="var(--surface-base)"
          style={{
            background:   'var(--surface-raised)',
            border:       '1px solid var(--border-default)',
            borderRadius: '2px',
          }}
        />
      </ReactFlow>
    </div>
  )
}
