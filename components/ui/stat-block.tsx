interface Delta {
  value: string | number
  direction: 'up' | 'down' | 'neutral'
}

interface StatBlockProps {
  label: string
  value: string | number
  unit?: string
  delta?: Delta
}

const deltaColor: Record<Delta['direction'], string> = {
  up:      'var(--signal)',
  down:    'var(--danger)',
  neutral: 'var(--text-tertiary)',
}

const deltaPrefix: Record<Delta['direction'], string> = {
  up: '+', down: '−', neutral: '',
}

export function StatBlock({ label, value, unit, delta }: StatBlockProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-[0.08em] font-sans text-text-tertiary leading-none">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-[24px] font-mono text-text-primary leading-none tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-[12px] font-mono text-text-tertiary leading-none">{unit}</span>
        )}
      </div>
      {delta && (
        <span className="text-[11px] font-mono leading-none" style={{ color: deltaColor[delta.direction] }}>
          {deltaPrefix[delta.direction]}{delta.value}
        </span>
      )}
    </div>
  )
}
