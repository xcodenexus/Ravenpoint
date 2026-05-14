type Status = 'active' | 'idle' | 'error' | 'pending'

interface StatusDotProps {
  status: Status
  label?: string
}

const statusColor: Record<Status, string> = {
  active:  'var(--signal)',
  idle:    'var(--text-tertiary)',
  error:   'var(--danger)',
  pending: 'var(--warning)',
}

export function StatusDot({ status, label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5" title={label ?? status}>
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: statusColor[status],
          flexShrink: 0,
        }}
      />
      {label && (
        <span className="text-[11px] font-mono text-text-tertiary leading-none">{label}</span>
      )}
    </span>
  )
}
