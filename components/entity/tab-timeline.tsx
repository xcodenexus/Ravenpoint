'use client'

import React from 'react'
import { Globe, Shield, FileText, User, Wallet } from 'lucide-react'
import type { WhoisRecord } from '@/lib/types/whois'
import type { DnsRecords } from '@/lib/types/dns'
import type { CertHistory } from '@/lib/types/cert'
import type { ThreatRecord } from '@/lib/types/threat-intel'
import type { BreachSummary } from '@/lib/types/breach'
import type { SocialResults } from '@/lib/types/social'
import type { WalletSummary } from '@/lib/types/onchain'

interface TabTimelineProps {
  whois?: WhoisRecord | null
  dns?: DnsRecords | null
  certs?: CertHistory | null
  threatIntel?: ThreatRecord | null
  breach?: BreachSummary | null
  social?: SocialResults | null
  onchain?: WalletSummary | null
}

type EventCategory = 'registration' | 'dns' | 'cert' | 'threat' | 'breach' | 'social' | 'transaction'

interface TimelineEvent {
  date: string
  category: EventCategory
  title: string
  detail: string
}

const CATEGORY_ICON: Record<EventCategory, React.ElementType> = {
  registration: Globe,
  dns:          Globe,
  cert:         FileText,
  threat:       Shield,
  breach:       Shield,
  social:       User,
  transaction:  Wallet,
}

const CATEGORY_COLOR: Record<EventCategory, string> = {
  registration: 'var(--info)',
  dns:          'var(--info)',
  cert:         'var(--text-secondary)',
  threat:       'var(--danger)',
  breach:       'var(--danger)',
  social:       'var(--text-secondary)',
  transaction:  'var(--warning)',
}

function buildEvents(props: TabTimelineProps): TimelineEvent[] {
  const events: TimelineEvent[] = []

  if (props.whois) {
    const w = props.whois
    events.push({ date: w.registeredAt, category: 'registration', title: 'Domain Registered', detail: `via ${w.registrar}` })
    events.push({ date: w.updatedAt,    category: 'registration', title: 'WHOIS Updated',     detail: `Registrar: ${w.registrar}` })
    events.push({ date: w.expiresAt,    category: 'registration', title: 'Expiry Date',        detail: 'Domain expires' })
    for (const h of w.history) {
      events.push({ date: h.date, category: 'registration', title: 'WHOIS History Entry', detail: `Registrar: ${h.registrar}` })
    }
  }

  if (props.dns) {
    for (const r of props.dns.records) {
      if (r.firstSeen) {
        events.push({ date: r.firstSeen, category: 'dns', title: `DNS ${r.type} Record Observed`, detail: r.value.slice(0, 60) })
      }
    }
    events.push({ date: props.dns.resolvedAt, category: 'dns', title: 'DNS Resolved', detail: `${props.dns.records.length} records` })
  }

  if (props.certs) {
    for (const c of props.certs.certs) {
      events.push({ date: c.notBefore, category: 'cert', title: 'Certificate Issued',  detail: `${c.issuer} — ${c.commonName}` })
      events.push({ date: c.notAfter,  category: 'cert', title: 'Certificate Expires', detail: c.commonName })
    }
  }

  if (props.threatIntel) {
    for (const r of props.threatIntel.reports) {
      events.push({
        date:     r.reportedAt,
        category: 'threat',
        title:    'Abuse Report',
        detail:   r.categories.map(c => c.name).join(', ') || r.comment || 'Reported',
      })
    }
    if (props.threatIntel.lastReportedAt) {
      events.push({ date: props.threatIntel.lastReportedAt, category: 'threat', title: 'Last Reported', detail: `Score: ${props.threatIntel.abuseConfidenceScore}/100` })
    }
  }

  if (props.breach) {
    for (const b of props.breach.breaches) {
      events.push({ date: b.breachDate, category: 'breach', title: `Breach: ${b.title}`,         detail: b.dataClasses.join(', ') })
      events.push({ date: b.addedDate,  category: 'breach', title: `Added to HIBP: ${b.title}`,  detail: `${b.pwnCount.toLocaleString()} accounts` })
    }
  }

  if (props.social) {
    events.push({ date: props.social.scannedAt, category: 'social', title: 'Social OSINT Scan', detail: `${props.social.matches.filter(m => m.status === 'found').length} platforms found` })
    for (const m of props.social.matches) {
      if (m.joinedAt && m.status === 'found') {
        events.push({ date: m.joinedAt, category: 'social', title: `Joined ${m.platform}`, detail: m.bio ?? '' })
      }
    }
  }

  if (props.onchain) {
    events.push({ date: props.onchain.firstTx, category: 'transaction', title: 'First Transaction', detail: props.onchain.chain })
    events.push({ date: props.onchain.lastTx,  category: 'transaction', title: 'Last Transaction',  detail: props.onchain.chain })
    for (const tx of props.onchain.transactions) {
      events.push({
        date:     tx.timestamp,
        category: 'transaction',
        title:    tx.direction === 'in' ? 'Received' : 'Sent',
        detail:   `${tx.amount.toFixed(4)} — ${tx.counterpartyLabel ?? tx.counterparty.slice(0, 12) + '…'}`,
      })
    }
  }

  return events
    .filter(e => Boolean(e.date))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function TabTimeline(props: TabTimelineProps) {
  const events = buildEvents(props)

  if (events.length === 0) {
    return (
      <p className="font-sans text-[13px] text-text-tertiary py-4">No timeline events available.</p>
    )
  }

  return (
    <div className="relative flex flex-col">
      <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border-subtle" />
      {events.map((ev, i) => {
        const Icon = CATEGORY_ICON[ev.category]
        return (
          <div key={i} className="relative flex gap-4 pb-5">
            <div
              className="relative z-10 w-[15px] h-[15px] flex items-center justify-center border border-border-default bg-surface-base shrink-0 mt-0.5"
              style={{ borderRadius: '2px' }}
            >
              <Icon size={8} style={{ color: CATEGORY_COLOR[ev.category] }} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-mono text-[12px] text-text-primary">{ev.title}</span>
                <span className="font-mono text-[10px] text-text-tertiary">{ev.date.slice(0, 10)}</span>
              </div>
              {ev.detail && (
                <div className="font-sans text-[11px] text-text-tertiary mt-0.5 truncate">{ev.detail}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
