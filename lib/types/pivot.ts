import type { EntityType } from './entity'

export type PivotSource =
  | 'whois'
  | 'dns'
  | 'cert'
  | 'breach'
  | 'social'
  | 'threat_intel'
  | 'onchain'
  | 'co_host'
  | 'historical'

export interface PivotSuggestion {
  entityType: EntityType
  value: string
  reason: string
  source: PivotSource
  confidence: number
  threatScore: number
}
