'use client'

import React, { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Globe, Server, Mail, Wallet, User } from 'lucide-react'
import type { EntityType } from '@/lib/types/entity'

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

function scoreColor(score: number): string {
  return score > 80 ? 'var(--danger)' : score > 60 ? 'var(--warning)' : 'var(--signal)'
}

export interface EntityNodeData {
  id:          string
  type:        EntityType
  value:       string
  threatScore: number
}

function EntityNodeInner({ data, selected }: { data: EntityNodeData; selected?: boolean }) {
  const Icon   = TYPE_ICON[data.type]
  const accent = TYPE_COLOR[data.type]

  const truncated =
    data.value.length > 22
      ? data.value.slice(0, 10) + '…' + data.value.slice(-8)
      : data.value

  return (
    <>
      <Handle type="target" position={Position.Top}    style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="target" position={Position.Left}   style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0, pointerEvents: 'none' }} />

      <div
        style={{
          background:   selected ? 'var(--surface-overlay)' : 'var(--surface-raised)',
          border:       `1px solid ${selected ? accent : 'var(--border-default)'}`,
          borderRadius: '2px',
          minWidth:     '140px',
          maxWidth:     '190px',
          boxShadow:    selected ? `0 0 0 1px ${accent}22` : 'none',
          transition:   'border-color 120ms, box-shadow 120ms',
        }}
      >
        <div style={{ height: '2px', background: accent, borderRadius: '2px 2px 0 0' }} />

        <div style={{ padding: '8px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Icon size={11} style={{ color: accent, flexShrink: 0 }} />
            <span style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '9px',
              color:         accent,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {data.type}
            </span>
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   '11px',
            color:      'var(--text-primary)',
            wordBreak:  'break-all',
            lineHeight: '1.3',
          }}>
            {truncated}
          </div>

          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            marginTop:      '6px',
          }}>
            <div style={{
              flex:         1,
              height:       '2px',
              background:   'var(--surface-hover)',
              borderRadius: '1px',
              overflow:     'hidden',
              marginRight:  '8px',
            }}>
              <div style={{
                width:      `${data.threatScore}%`,
                height:     '100%',
                background: `linear-gradient(90deg, var(--threat-0) 0%, ${scoreColor(data.threatScore)} 100%)`,
              }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize:   '11px',
              color:      scoreColor(data.threatScore),
              fontWeight: 500,
            }}>
              {data.threatScore}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export const EntityNode = memo(function EntityNode({
  data,
  selected,
}: {
  data: EntityNodeData
  selected: boolean
}) {
  return <EntityNodeInner data={data} selected={selected} />
})
