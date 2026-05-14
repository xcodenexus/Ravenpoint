'use client'

import React from 'react'
import { X, ArrowUpRight } from 'lucide-react'
import type { GraphNode } from '@/lib/types/graph'
import type { EntityType } from '@/lib/types/entity'

interface NodePanelProps {
  node: GraphNode
  onClose: () => void
  onNavigate: (type: EntityType, value: string) => void
}

const TYPE_LABEL: Record<string, string> = {
  domain:   'Domain',
  ip:       'IP Address',
  email:    'Email',
  wallet:   'Wallet',
  username: 'Username',
}

function scoreColor(score: number): string {
  return score > 80 ? 'var(--danger)' : score > 60 ? 'var(--warning)' : 'var(--signal)'
}

export function NodePanel({ node, onClose, onNavigate }: NodePanelProps) {
  return (
    <div
      className="absolute right-4 top-4 bottom-4 w-72 z-10 flex flex-col"
      style={{
        background:   'var(--surface-raised)',
        border:       '1px solid var(--border-default)',
        borderRadius: '2px',
        animation:    'slide-up-in 180ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div className="flex items-center justify-between px-4 h-10 border-b border-border-subtle shrink-0">
        <span className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.08em]">
          {TYPE_LABEL[node.type] ?? node.type}
        </span>
        <button
          onClick={onClose}
          className="text-text-tertiary hover:text-text-primary transition-colors duration-[120ms]"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4">
          <div className="font-mono text-[13px] text-text-primary break-all leading-relaxed">
            {node.value}
          </div>
        </div>

        <div className="mb-4">
          <div className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.08em] mb-2">
            Threat Score
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-surface-hover overflow-hidden" style={{ borderRadius: '1px' }}>
              <div
                className="h-full"
                style={{
                  width:      `${node.threatScore}%`,
                  background: `linear-gradient(90deg, var(--threat-0) 0%, ${scoreColor(node.threatScore)} 100%)`,
                }}
              />
            </div>
            <span
              className="font-mono text-[22px] leading-none font-medium shrink-0"
              style={{ color: scoreColor(node.threatScore) }}
            >
              {node.threatScore}
            </span>
          </div>
        </div>

        <div className="border border-border-subtle bg-surface-base p-3" style={{ borderRadius: '2px' }}>
          <div className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em] mb-1">Node ID</div>
          <div className="font-mono text-[10px] text-text-tertiary break-all">{node.id}</div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border-subtle shrink-0">
        <button
          onClick={() => onNavigate(node.type, node.value)}
          className="w-full flex items-center justify-center gap-1.5 h-7 border border-border-default text-text-tertiary hover:text-text-primary hover:border-border-strong transition-colors duration-[120ms]"
          style={{ borderRadius: '2px' }}
        >
          <span className="font-sans text-[11px]">Open entity profile</span>
          <ArrowUpRight size={11} />
        </button>
      </div>
    </div>
  )
}
