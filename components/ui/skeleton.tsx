import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
  /** 'line' for inline text replacement, 'block' for area placeholders */
  variant?: 'line' | 'block'
}

export function Skeleton({ className, variant = 'block' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer bg-[length:200%_100%] shrink-0',
        'bg-[linear-gradient(90deg,var(--surface-raised),var(--surface-hover),var(--surface-raised))]',
        variant === 'line' && 'h-[1em] rounded-xs',
        className,
      )}
    />
  )
}
