'use client'

import React from 'react'
import Link from 'next/link'
import { Brain, ArrowRight } from 'lucide-react'
import { ThreatScore, EntityChip } from '@/components/ui'
import type { Entity, EntityType } from '@/lib/types/entity'
import type { GraphNode, GraphEdge } from '@/lib/types/graph'
import type { WhoisRecord } from '@/lib/types/whois'
import type { ThreatRecord } from '@/lib/types/threat-intel'
import type { BreachSummary } from '@/lib/types/breach'
import type { SocialResults } from '@/lib/types/social'
import type { WalletSummary } from '@/lib/types/onchain'

export interface RelatedEntity {
  node: GraphNode
  edge: GraphEdge
  direction: 'out' | 'in'
}

interface TabOverviewProps {
  entity: Entity
  related: RelatedEntity[]
  whois?: WhoisRecord | null
  threatIntel?: ThreatRecord | null
  breach?: BreachSummary | null
  social?: SocialResults | null
  onchain?: WalletSummary | null
  investigationId?: string | null
  onEntityClick?: (type: EntityType, value: string) => void
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

function deriveBreakdown(
  entity: Entity,
  whois?: WhoisRecord | null,
  threatIntel?: ThreatRecord | null,
  breach?: BreachSummary | null,
  social?: SocialResults | null,
  onchain?: WalletSummary | null,
): { label: string; contribution: number }[] {
  if (entity.type === 'ip' && threatIntel) {
    return [
      { label: 'Abuse Confidence',   contribution: threatIntel.abuseConfidenceScore                              },
      { label: 'Report Volume',      contribution: Math.min(100, Math.round(threatIntel.totalReports / 5))       },
      { label: 'Distinct Reporters', contribution: Math.min(100, Math.round(threatIntel.numDistinctUsers * 1.1)) },
    ]
  }
  if (entity.type === 'email' && breach) {
    return [
      { label: 'Breach Exposure', contribution: Math.min(100, breach.breachCount * 22) },
      { label: 'Paste Exposure',  contribution: Math.min(100, breach.pasteCount  * 12) },
      { label: 'Password Leaked', contribution: breach.exposedPasswords ? 90 : 20      },
    ]
  }
  if (entity.type === 'username' && social) {
    const dark  = social.matches.filter(
      m => m.status === 'found' && ['HackForums', 'RaidForums', 'BreachForums'].includes(m.platform),
    ).length
    const found = social.matches.filter(m => m.status === 'found').length
    return [
      { label: 'Dark Forum Presence', contribution: Math.min(100, dark  * 33) },
      { label: 'Platform Footprint',  contribution: Math.min(100, found * 10) },
      { label: 'OSINT Exposure',      contribution: entity.threatScore        },
    ]
  }
  if (entity.type === 'wallet' && onchain) {
    return [
      { label: 'Risk Score',         contribution: onchain.riskScore },
      { label: 'Ransom Attribution', contribution: onchain.riskFlags.some(f => f.includes('ransomware')) ? 95 : 15 },
      { label: 'Mixing Activity',    contribution: onchain.riskFlags.some(f => f.includes('mixing'))     ? 80 : 15 },
    ]
  }
  if (entity.type === 'domain' && whois) {
    const ageMonths = (Date.now() - new Date(whois.registeredAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    return [
      { label: 'Domain Age Risk',    contribution: Math.max(10, Math.min(100, Math.round(120 - ageMonths * 5))) },
      { label: 'TLD Risk',           contribution: (whois.domain.endsWith('.ru') || whois.domain.endsWith('.onion')) ? 88 : 25 },
      { label: 'Registrant Privacy', contribution: whois.registrantOrg == null ? 80 : 25 },
    ]
  }
  return []
}

function StatItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.08em]">{label}</span>
      <span className="font-mono text-[13px] text-text-primary">{value}</span>
    </div>
  )
}

function QuickStats({ entity, whois, threatIntel, breach, social, onchain }: Pick<TabOverviewProps, 'entity' | 'whois' | 'threatIntel' | 'breach' | 'social' | 'onchain'>) {
  const stats: { label: string; value: React.ReactNode }[] = []

  if (entity.type === 'domain' && whois) {
    stats.push(
      { label: 'Registrar',   value: whois.registrar },
      { label: 'Registered',  value: whois.registeredAt.slice(0, 10) },
      { label: 'Expires',     value: whois.expiresAt.slice(0, 10) },
      { label: 'Country',     value: whois.registrantCountry ?? '—' },
      { label: 'Nameservers', value: String(whois.nameservers.length) },
      { label: 'DNSSEC',      value: whois.dnssec ? 'Enabled' : 'Disabled' },
    )
  } else if (entity.type === 'ip' && threatIntel) {
    stats.push(
      { label: 'Country',      value: threatIntel.countryCode },
      { label: 'ISP',          value: threatIntel.isp },
      { label: 'Usage Type',   value: threatIntel.usageType },
      { label: 'Abuse Score',  value: `${threatIntel.abuseConfidenceScore}/100` },
      { label: 'Total Reports',value: String(threatIntel.totalReports) },
      { label: 'Reporters',    value: String(threatIntel.numDistinctUsers) },
    )
  } else if (entity.type === 'email' && breach) {
    stats.push(
      { label: 'Breaches',          value: String(breach.breachCount) },
      { label: 'Pastes',            value: String(breach.pasteCount) },
      { label: 'Passwords Exposed', value: breach.exposedPasswords ? 'YES' : 'NO' },
      { label: 'Financial Data',    value: breach.exposedFinancial  ? 'YES' : 'NO' },
    )
  } else if (entity.type === 'username' && social) {
    const found = social.matches.filter(m => m.status === 'found').length
    stats.push(
      { label: 'Platforms Found', value: `${found} / ${social.matches.length}` },
      { label: 'Scanned',         value: social.scannedAt.slice(0, 10) },
    )
  } else if (entity.type === 'wallet' && onchain) {
    const satToBtc = (s: number) => (s / 1e8).toFixed(4)
    stats.push(
      { label: 'Balance',      value: `${satToBtc(onchain.balance)} BTC` },
      { label: 'USD Value',    value: `$${onchain.balanceUsd.toLocaleString()}` },
      { label: 'Transactions', value: String(onchain.txCount) },
      { label: 'Risk Score',   value: `${onchain.riskScore}/100` },
      { label: 'Chain',        value: onchain.chain },
    )
  }

  if (stats.length === 0) return null

  return (
    <div className="flex gap-8 flex-wrap py-4 border-b border-border-subtle">
      {stats.map(s => <StatItem key={s.label} label={s.label} value={s.value} />)}
    </div>
  )
}

export function TabOverview({
  entity, related, whois, threatIntel, breach, social, onchain, investigationId, onEntityClick,
}: TabOverviewProps) {
  const breakdown = deriveBreakdown(entity, whois, threatIntel, breach, social, onchain)

  return (
    <div className="flex flex-col gap-6">
      <QuickStats
        entity={entity} whois={whois} threatIntel={threatIntel}
        breach={breach} social={social} onchain={onchain}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat assessment */}
        <div className="border border-border-subtle bg-surface-raised p-4" style={{ borderRadius: '2px' }}>
          <div className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.08em] mb-3">
            Threat Assessment
          </div>
          <ThreatScore
            score={entity.threatScore}
            breakdown={breakdown.length > 0 ? breakdown : undefined}
          />
        </div>

        {/* Related entities */}
        <div className="border border-border-subtle bg-surface-raised p-4" style={{ borderRadius: '2px' }}>
          <div className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.08em] mb-3">
            Graph Connections ({related.length})
          </div>
          {related.length === 0 ? (
            <p className="font-sans text-[13px] text-text-tertiary">No graph connections found.</p>
          ) : (
            <div className="flex flex-col">
              {related.map(({ node, edge }) => (
                <div
                  key={edge.id}
                  className="flex items-center gap-3 h-9 -mx-4 px-4 cursor-pointer hover:bg-surface-hover transition-colors duration-[120ms]"
                  onClick={() => onEntityClick?.(node.type, node.value)}
                >
                  <div className="flex-1 min-w-0">
                    <EntityChip type={node.type} value={node.value} />
                  </div>
                  <span className="font-mono text-[10px] text-text-tertiary shrink-0 hidden sm:block">
                    {RELATION_LABELS[edge.relation] ?? edge.relation}
                  </span>
                  <span className="font-mono text-[10px] text-text-tertiary shrink-0">
                    {edge.confidence}%
                  </span>
                  <span
                    className="font-mono text-[12px] shrink-0 w-6 text-right"
                    style={{
                      color: node.threatScore > 80 ? 'var(--danger)'
                           : node.threatScore > 60 ? 'var(--warning)'
                           : 'var(--signal)',
                    }}
                  >
                    {node.threatScore}
                  </span>
                </div>
              ))}
            </div>
          )}
          {investigationId && (
            <Link
              href={`/graph/${investigationId}`}
              className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border-subtle font-sans text-[11px] text-text-tertiary hover:text-text-primary transition-colors duration-[120ms]"
            >
              <ArrowRight size={11} />
              View full graph
            </Link>
          )}
        </div>
      </div>

      {/* AI Analyst placeholder */}
      <div
        className="border border-border-subtle bg-surface-raised p-4 flex items-center gap-4"
        style={{ borderRadius: '2px' }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center border border-border-default bg-surface-overlay shrink-0"
          style={{ borderRadius: '4px' }}
        >
          <Brain size={14} className="text-signal" />
        </div>
        <div className="flex-1">
          <div className="font-mono text-[12px] text-text-primary mb-0.5">AI Analyst</div>
          <div className="font-sans text-[12px] text-text-tertiary">
            Contextual analysis of {entity.value} streams here — Session 7.
          </div>
        </div>
        <button
          disabled
          className="flex items-center gap-1.5 h-6 px-2.5 border border-border-default text-text-tertiary shrink-0 opacity-40"
          style={{ borderRadius: '2px' }}
        >
          <span className="font-sans text-[11px]">Analyze</span>
          <ArrowRight size={10} />
        </button>
      </div>
    </div>
  )
}
