'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface BreakdownItem {
  label: string
  contribution: number
}

interface ThreatScoreProps {
  score: number
  breakdown?: BreakdownItem[]
  orientation?: 'horizontal' | 'vertical'
  compact?: boolean
}

function scoreColor(n: number): string {
  if (n <= 30) return 'var(--threat-0)'
  if (n <= 65) return 'var(--threat-50)'
  return 'var(--threat-100)'
}

export function ThreatScore({
  score,
  breakdown,
  orientation = 'horizontal',
  compact = false,
}: ThreatScoreProps) {
  const [expanded, setExpanded] = useState(false)
  const clamped = Math.max(0, Math.min(100, score))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {orientation === 'horizontal' ? (
          <>
            <div
              className="flex-1 relative rounded-xs"
              style={{ height: 3, backgroundColor: 'var(--surface-hover)' }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-xs"
                style={{
                  width: `${Math.max(clamped, 2)}%`,
                  background:
                    'linear-gradient(to right, var(--threat-0), var(--threat-50) 55%, var(--threat-100) 100%)',
                }}
              />
            </div>
            <span
              className={cn(
                'font-mono font-medium tabular-nums w-6 text-right shrink-0',
                compact ? 'text-[11px]' : 'text-[13px]',
              )}
              style={{ color: scoreColor(clamped) }}
            >
              {clamped}
            </span>
          </>
        ) : (
          <div className="flex items-end gap-2">
            <div
              className="relative w-2 rounded-xs overflow-hidden"
              style={{ height: 48, backgroundColor: 'var(--surface-hover)' }}
            >
              <div
                className="absolute bottom-0 w-full rounded-xs"
                style={{
                  height: `${clamped}%`,
                  background:
                    'linear-gradient(to top, var(--threat-0), var(--threat-50) 55%, var(--threat-100) 100%)',
                }}
              />
            </div>
            <span
              className="font-mono text-[13px] font-medium tabular-nums"
              style={{ color: scoreColor(clamped) }}
            >
              {clamped}
            </span>
          </div>
        )}

        {breakdown && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center text-text-tertiary hover:text-text-secondary transition-colors duration-[120ms]"
            aria-label={expanded ? 'Collapse breakdown' : 'Expand breakdown'}
          >
            <ChevronDown
              size={13}
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 120ms ease-out',
              }}
            />
          </button>
        )}
      </div>

      {expanded && breakdown && (
        <div
          className="flex flex-col gap-1.5 pt-2 border-t border-border-subtle"
          style={{ animation: 'slide-up-in 180ms cubic-bezier(0.16,1,0.3,1) both' }}
        >
          {breakdown.map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-[11px] font-sans text-text-secondary flex-1 truncate">
                {item.label}
              </span>
              <div
                className="relative rounded-xs"
                style={{ width: 64, height: 3, backgroundColor: 'var(--surface-hover)' }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-xs"
                  style={{
                    width: `${item.contribution}%`,
                    backgroundColor: scoreColor(item.contribution),
                  }}
                />
              </div>
              <span className="font-mono text-[10px] text-text-tertiary w-5 text-right tabular-nums">
                {item.contribution}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
