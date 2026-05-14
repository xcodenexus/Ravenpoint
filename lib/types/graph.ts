import type { EntityType } from './entity'

export type EdgeRelationType =
  | 'resolves_to'
  | 'registered_by'
  | 'co_hosted'
  | 'same_asn'
  | 'hosts'
  | 'alias_of'
  | 'linked_to'
  | 'owned_by'
  | 'historical_host'

export interface GraphNode {
  id: string
  type: EntityType
  value: string
  threatScore: number
  x?: number
  y?: number
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  relation: EdgeRelationType
  confidence: number
  label?: string
}

export interface GraphData {
  investigationId: string
  nodes: GraphNode[]
  edges: GraphEdge[]
}
