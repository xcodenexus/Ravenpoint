'use client'

import React from 'react'
import type { EntityType } from '@/lib/types/entity'
import type { WhoisRecord } from '@/lib/types/whois'
import type { DnsRecords } from '@/lib/types/dns'
import type { CertHistory } from '@/lib/types/cert'
import type { ThreatRecord } from '@/lib/types/threat-intel'
import type { WalletSummary } from '@/lib/types/onchain'

interface TabInfrastructureProps {
  entityType: EntityType
  whois?: WhoisRecord | null
  dns?: DnsRecords | null
  certs?: CertHistory | null
  threatIntel?: ThreatRecord | null
  onchain?: WalletSummary | null
}

const DNS_TYPE_COLOR: Record<string, string> = {
  A:     'var(--info)',
  AAAA:  'var(--info)',
  MX:    'var(--warning)',
  NS:    'var(--text-secondary)',
  TXT:   'var(--text-secondary)',
  CNAME: 'var(--signal)',
  SOA:   'var(--text-tertiary)',
}

const DNS_TYPE_ORDER: Record<string, number> = {
  A: 0, AAAA: 1, CNAME: 2, MX: 3, NS: 4, TXT: 5, SOA: 6,
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.08em] shrink-0">
        {title}
        {count !== undefined && (
          <span className="ml-1.5 font-mono text-[10px] text-text-tertiary opacity-60">({count})</span>
        )}
      </span>
      <div className="flex-1 h-px bg-border-subtle" />
    </div>
  )
}

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center h-8 gap-4 -mx-4 px-4">
      <span className="font-sans text-[11px] text-text-tertiary w-36 shrink-0">{label}</span>
      <span className="font-mono text-[12px] text-text-primary flex-1 min-w-0 truncate">{value}</span>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="font-sans text-[13px] text-text-tertiary py-4">{message}</p>
  )
}

function WhoisSection({ whois }: { whois: WhoisRecord }) {
  return (
    <div className="mb-8">
      <SectionHeader title="WHOIS" />
      <div className="border border-border-subtle bg-surface-raised divide-y divide-border-subtle" style={{ borderRadius: '2px' }}>
        <KVRow label="Registrar"         value={whois.registrar} />
        <KVRow label="Registered"        value={whois.registeredAt.slice(0, 10)} />
        <KVRow label="Expires"           value={whois.expiresAt.slice(0, 10)} />
        <KVRow label="Updated"           value={whois.updatedAt.slice(0, 10)} />
        <KVRow label="Country"           value={whois.registrantCountry ?? '—'} />
        <KVRow label="Registrant Org"    value={whois.registrantOrg ?? '—'} />
        <KVRow label="DNSSEC"            value={whois.dnssec ? 'Enabled' : 'Disabled'} />
        <KVRow
          label="Status"
          value={
            <div className="flex gap-1.5 flex-wrap">
              {whois.status.map(s => (
                <span
                  key={s}
                  className="font-mono text-[9px] px-1.5 py-0.5 border border-border-default text-text-tertiary"
                  style={{ borderRadius: '2px' }}
                >
                  {s}
                </span>
              ))}
            </div>
          }
        />
        <KVRow
          label="Nameservers"
          value={
            <div className="flex flex-col gap-0.5">
              {whois.nameservers.map(ns => (
                <span key={ns} className="font-mono text-[12px]">{ns}</span>
              ))}
            </div>
          }
        />
      </div>
    </div>
  )
}

function DnsSection({ dns }: { dns: DnsRecords }) {
  const sorted = [...dns.records].sort(
    (a, b) => (DNS_TYPE_ORDER[a.type] ?? 99) - (DNS_TYPE_ORDER[b.type] ?? 99),
  )

  return (
    <div className="mb-8">
      <SectionHeader title="DNS Records" count={dns.records.length} />
      <div className="border border-border-subtle bg-surface-raised overflow-hidden" style={{ borderRadius: '2px' }}>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8 w-16">Type</th>
              <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8">Value</th>
              <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8 w-20 text-right">TTL</th>
              <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8 w-28 text-right">First Seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {sorted.map((r, i) => (
              <tr key={i} className="hover:bg-surface-hover transition-colors duration-[120ms]">
                <td className="px-4 h-8">
                  <span
                    className="font-mono text-[10px] font-medium"
                    style={{ color: DNS_TYPE_COLOR[r.type] ?? 'var(--text-secondary)' }}
                  >
                    {r.type}
                  </span>
                </td>
                <td className="px-4 h-8 font-mono text-[12px] text-text-primary max-w-xs truncate">{r.value}</td>
                <td className="px-4 h-8 font-mono text-[11px] text-text-tertiary text-right">{r.ttl}</td>
                <td className="px-4 h-8 font-mono text-[11px] text-text-tertiary text-right">
                  {r.firstSeen?.slice(0, 10) ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CertsSection({ certs }: { certs: CertHistory }) {
  return (
    <div className="mb-8">
      <SectionHeader title="Certificate Transparency" count={certs.certs.length} />
      <div className="flex flex-col gap-3">
        {certs.certs.map(cert => (
          <div
            key={cert.fingerprint}
            className="border border-border-subtle bg-surface-raised p-4"
            style={{ borderRadius: '2px' }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="font-mono text-[12px] text-text-primary">{cert.commonName}</div>
                <div className="font-sans text-[11px] text-text-tertiary mt-0.5">{cert.issuer}</div>
              </div>
              <span className="font-mono text-[10px] text-text-tertiary shrink-0">#{cert.serialNumber.slice(-8)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3 text-[11px]">
              <div>
                <span className="font-sans text-text-tertiary">Not Before  </span>
                <span className="font-mono text-text-primary">{cert.notBefore.slice(0, 10)}</span>
              </div>
              <div>
                <span className="font-sans text-text-tertiary">Not After  </span>
                <span className="font-mono text-text-primary">{cert.notAfter.slice(0, 10)}</span>
              </div>
            </div>
            {cert.sans.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {cert.sans.map(san => (
                  <span
                    key={san}
                    className="font-mono text-[9px] px-1.5 py-0.5 border border-border-default text-text-tertiary"
                    style={{ borderRadius: '2px' }}
                  >
                    {san}
                  </span>
                ))}
              </div>
            )}
            <div className="font-mono text-[10px] text-text-tertiary truncate">{cert.fingerprint}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


function ThreatIntelSection({ threatIntel }: { threatIntel: ThreatRecord }) {
  return (
    <div className="mb-8">
      <SectionHeader title="Threat Intelligence" />
      <div className="border border-border-subtle bg-surface-raised divide-y divide-border-subtle mb-4" style={{ borderRadius: '2px' }}>
        <KVRow label="Country"        value={threatIntel.countryCode ?? '—'} />
        <KVRow label="ISP"            value={threatIntel.isp} />
        <KVRow label="Usage Type"     value={threatIntel.usageType} />
        <KVRow label="Domain"         value={threatIntel.domain} />
        <KVRow label="Abuse Score"    value={`${threatIntel.abuseConfidenceScore}/100`} />
        <KVRow label="Total Reports"  value={String(threatIntel.totalReports)} />
        <KVRow label="Distinct Users" value={String(threatIntel.numDistinctUsers)} />
        <KVRow label="Last Reported"  value={threatIntel.lastReportedAt?.slice(0, 10) ?? '—'} />
        <KVRow label="Whitelisted"    value={threatIntel.isWhitelisted ? 'Yes' : 'No'} />
      </div>

      {threatIntel.reports.length > 0 && (
        <>
          <SectionHeader title="Abuse Reports" count={threatIntel.reports.length} />
          <div className="border border-border-subtle bg-surface-raised overflow-hidden" style={{ borderRadius: '2px' }}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8 w-28">Date</th>
                  <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8">Categories</th>
                  <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {threatIntel.reports.map((r, i) => (
                  <tr key={i} className="hover:bg-surface-hover transition-colors duration-[120ms]">
                    <td className="px-4 h-8 font-mono text-[11px] text-text-tertiary">{r.reportedAt.slice(0, 10)}</td>
                    <td className="px-4 h-8">
                      <div className="flex flex-wrap gap-1">
                        {r.categories.map(c => (
                          <span
                            key={c.id}
                            className="font-sans text-[9px] px-1 py-0.5 bg-surface-overlay border border-border-default text-text-tertiary"
                            style={{ borderRadius: '2px' }}
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 h-8 font-mono text-[11px] text-text-secondary max-w-xs truncate">
                      {r.comment ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function OnchainSection({ onchain }: { onchain: WalletSummary }) {
  return (
    <div className="mb-8">
      <SectionHeader title="On-Chain Summary" />
      <div className="border border-border-subtle bg-surface-raised divide-y divide-border-subtle mb-4" style={{ borderRadius: '2px' }}>
        <KVRow label="Chain"           value={onchain.chain} />
        <KVRow label="Balance"         value={`${onchain.balance.toFixed(8)} BTC`} />
        <KVRow label="USD Value"       value={`$${onchain.balanceUsd.toLocaleString()}`} />
        <KVRow label="Transactions"    value={String(onchain.txCount)} />
        <KVRow label="Risk Score"      value={`${onchain.riskScore}/100`} />
        <KVRow
          label="Risk Flags"
          value={
            onchain.riskFlags.length > 0
              ? (
                <div className="flex flex-wrap gap-1">
                  {onchain.riskFlags.map(f => (
                    <span
                      key={f}
                      className="font-mono text-[9px] px-1.5 py-0.5 border border-danger text-danger"
                      style={{ borderRadius: '2px' }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )
              : '—'
          }
        />
      </div>

      {onchain.transactions.length > 0 && (
        <>
          <SectionHeader title="Transactions" count={onchain.transactions.length} />
          <div className="border border-border-subtle bg-surface-raised overflow-hidden" style={{ borderRadius: '2px' }}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8 w-8">Dir</th>
                  <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8">Hash</th>
                  <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8 text-right w-32">Amount</th>
                  <th className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] px-4 h-8 text-right w-28">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {onchain.transactions.map(tx => (
                  <tr key={tx.txHash} className="hover:bg-surface-hover transition-colors duration-[120ms]">
                    <td className="px-4 h-8">
                      <span
                        className="font-mono text-[10px] font-medium"
                        style={{ color: tx.direction === 'in' ? 'var(--signal)' : 'var(--danger)' }}
                      >
                        {tx.direction === 'in' ? '↓' : '↑'}
                      </span>
                    </td>
                    <td className="px-4 h-8 font-mono text-[11px] text-text-tertiary">
                      {tx.txHash.slice(0, 12)}…{tx.txHash.slice(-8)}
                    </td>
                    <td
                      className="px-4 h-8 font-mono text-[12px] text-right"
                      style={{ color: tx.direction === 'in' ? 'var(--signal)' : 'var(--danger)' }}
                    >
                      {tx.direction === 'in' ? '+' : '-'}{tx.amount.toFixed(4)}
                    </td>
                    <td className="px-4 h-8 font-mono text-[11px] text-text-tertiary text-right">
                      {tx.timestamp.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export function TabInfrastructure({
  entityType, whois, dns, certs, threatIntel, onchain,
}: TabInfrastructureProps) {
  if (entityType === 'domain') {
    return (
      <div className="flex flex-col">
        {whois  ? <WhoisSection whois={whois}   /> : <EmptyState message="No WHOIS data available." />}
        {dns    ? <DnsSection   dns={dns}        /> : <EmptyState message="No DNS records found." />}
        {certs  ? <CertsSection certs={certs}    /> : <EmptyState message="No certificate records found." />}
      </div>
    )
  }

  if (entityType === 'ip') {
    return (
      <div className="flex flex-col">
        {threatIntel
          ? <ThreatIntelSection threatIntel={threatIntel} />
          : <EmptyState message="No threat intelligence data available." />}
      </div>
    )
  }

  if (entityType === 'wallet') {
    return (
      <div className="flex flex-col">
        {onchain
          ? <OnchainSection onchain={onchain} />
          : <EmptyState message="No on-chain data available." />}
      </div>
    )
  }

  return <EmptyState message="Infrastructure data is not applicable for this entity type." />
}
