'use client'

import React from 'react'
import { ShieldAlert } from 'lucide-react'
import type { EntityType } from '@/lib/types/entity'
import type { BreachSummary } from '@/lib/types/breach'

interface TabExposureProps {
  entityType: EntityType
  breach?: BreachSummary | null
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

function StatChip({
  label,
  value,
  danger,
}: {
  label: string
  value: string
  danger?: boolean
}) {
  return (
    <div
      className="flex flex-col gap-0.5 border border-border-subtle bg-surface-raised px-3 py-2"
      style={{ borderRadius: '2px' }}
    >
      <span className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em]">{label}</span>
      <span
        className="font-mono text-[18px] leading-none font-medium"
        style={{ color: danger ? 'var(--danger)' : 'var(--text-primary)' }}
      >
        {value}
      </span>
    </div>
  )
}

function BreachRecordCard({ record }: { record: BreachSummary['breaches'][number] }) {
  return (
    <div
      className="border border-border-subtle bg-surface-raised p-4"
      style={{ borderRadius: '2px' }}
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <div className="font-mono text-[13px] text-text-primary">{record.title}</div>
          <div className="font-mono text-[11px] text-text-tertiary mt-0.5">{record.breachDate}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {record.isVerified && (
            <span
              className="font-sans text-[9px] px-1.5 py-0.5 border border-signal text-signal uppercase tracking-[0.04em]"
              style={{ borderRadius: '2px' }}
            >
              Verified
            </span>
          )}
          <span className="font-mono text-[11px] text-text-tertiary">
            {record.pwnCount.toLocaleString()} accounts
          </span>
        </div>
      </div>

      {record.description && (
        <p className="font-sans text-[12px] text-text-secondary mb-3 leading-relaxed">
          {record.description}
        </p>
      )}

      {record.dataClasses.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {record.dataClasses.map(dc => (
            <span
              key={dc}
              className="font-mono text-[9px] px-1.5 py-0.5 border border-border-default text-text-tertiary"
              style={{ borderRadius: '2px' }}
            >
              {dc}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function BreachView({ breach }: { breach: BreachSummary }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 flex-wrap">
        <StatChip label="Breaches"        value={String(breach.breachCount)} danger={breach.breachCount > 5} />
        <StatChip label="Pastes"          value={String(breach.pasteCount)} />
        <StatChip label="Password Leaked" value={breach.exposedPasswords ? 'YES' : 'NO'} danger={breach.exposedPasswords} />
        <StatChip label="Financial Data"  value={breach.exposedFinancial  ? 'YES' : 'NO'} danger={breach.exposedFinancial} />
      </div>

      {breach.breaches.length > 0 && (
        <div>
          <SectionHeader title="Breach Records" count={breach.breaches.length} />
          <div className="flex flex-col gap-3">
            {breach.breaches.map(r => (
              <BreachRecordCard key={r.name} record={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function TabExposure({ entityType, breach }: TabExposureProps) {
  if (entityType !== 'email') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <ShieldAlert size={24} className="text-text-tertiary opacity-40" />
        <p className="font-sans text-[13px] text-text-tertiary">
          Exposure data is only available for email entities.
        </p>
      </div>
    )
  }

  if (!breach) {
    return (
      <p className="font-sans text-[13px] text-text-tertiary py-4">No breach data available.</p>
    )
  }

  return <BreachView breach={breach} />
}
