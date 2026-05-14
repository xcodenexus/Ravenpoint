import type { Entity } from './entity'
import type { GraphData } from './graph'

export interface InvestigationEntity {
  entity: Entity
  addedAt: string
  notes: string
  pinned: boolean
}

export interface Investigation {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'archived' | 'exported'
  tags: string[]
  entities: InvestigationEntity[]
  notes: string
  graph: GraphData
  maxThreatScore: number
}
