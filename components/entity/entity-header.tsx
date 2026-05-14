'use client'

import React, { useState } from 'react'
import { Globe, Server, Mail, Wallet, User, Copy, Check, Plus, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Entity, EntityType } from '@/lib/types/entity'

const TYPE_ICON: Record<EntityType, React.ElementType> = {
  domain:   Globe,
  ip:       Server,
  email:    Mail,
  wallet:   Wallet,
  username: User,
}

const TYPE_COLOR: Record<EntityType, string> = {
  domain:   'var(--info)',
  ip:       'var(--warning)',
  email:    'var(--signal)',
  wallet:   'var(--danger)',
  username: 'var(--text-secondary)',
}

function scoreColor(score: number) {
  return score > 80 ? 'var(--danger)' : score > 60 ? 'var(--warning)' : 'var(--signal)'
}

interface EntityHeaderProps {
  entity: Entity
  onAddToInvestigation?: () => void
  onPivot?: () => void
}

export function EntityHeader({ entity, onAddToInvestigation, onPivot }: EntityHeaderProps) {
  const [copied, setCopied] = useState(false)
  const Icon = TYPE_ICON[entity.type]

  function copyValue() {
    navigator.clipboard.writeText(entity.value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <div className="border-b border-border-subtle pb-6">
      <div className="flex items-start gap-4">
        {/* Type icon */}
        <div
          className="w-9 h-9 flex items-center justify-center border border-border-default bg-surface-raised shrink-0 mt-0.5"
          style={{ borderRadius: '4px' }}
        >
          <Icon size={18} style={{ color: TYPE_COLOR[entity.type] }} />
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-mono text-[18px] text-text-primary break-all leading-tight">
              {entity.value}
            </h1>
            <span
              className="font-mono text-[9px] px-1.5 py-0.5 border shrink-0 uppercase tracking-[0.06em]"
              style={{
                borderRadius: '2px',
                borderColor: TYPE_COLOR[entity.type],
                color:       TYPE_COLOR[entity.type],
              }}
            >
              {entity.type}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono text-text-tertiary flex-wrap">
            <span>first seen {entity.firstSeen.slice(0, 10)}</span>
            <span>·</span>
            <span>last seen {entity.lastSeen.slice(0, 10)}</span>
          </div>

          {entity.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {entity.tags.map(tag => (
                <span
                  key={tag}
                  className="font-mono text-[10px] text-text-tertiary border border-border-default px-1.5 py-0.5"
                  style={{ borderRadius: '2px' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={copyValue}
              className={cn(
                'flex items-center gap-1.5 h-6 px-2.5 border transition-colors duration-[120ms]',
                copied
                  ? 'border-signal text-signal'
                  : 'border-border-default text-text-tertiary hover:text-text-primary hover:border-border-strong',
              )}
              style={{ borderRadius: '2px' }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              <span className="font-sans text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {onAddToInvestigation && (
              <button
                onClick={onAddToInvestigation}
                className="flex items-center gap-1.5 h-6 px-2.5 border border-border-default text-text-tertiary hover:text-text-primary hover:border-border-strong transition-colors duration-[120ms]"
                style={{ borderRadius: '2px' }}
              >
                <Plus size={11} />
                <span className="font-sans text-[11px]">Add to investigation</span>
              </button>
            )}

            {onPivot && (
              <button
                onClick={onPivot}
                className="flex items-center gap-1.5 h-6 px-2.5 border border-border-default text-text-tertiary hover:text-text-primary hover:border-border-strong transition-colors duration-[120ms]"
                style={{ borderRadius: '2px' }}
              >
                <ArrowUpRight size={11} />
                <span className="font-sans text-[11px]">Pivot</span>
              </button>
            )}
          </div>
        </div>

        {/* Score chip */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <div
            className="font-mono text-[36px] leading-none font-medium"
            style={{ color: scoreColor(entity.threatScore) }}
          >
            {entity.threatScore}
          </div>
          <div className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.08em]">
            threat score
          </div>
          <div className="w-24 h-1 bg-surface-hover overflow-hidden">
            <div
              className="h-full"
              style={{
                width: `${entity.threatScore}%`,
                background: `linear-gradient(90deg, var(--threat-0) 0%, ${
                  entity.threatScore > 80 ? 'var(--threat-100)' : 'var(--threat-50)'
                } 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
