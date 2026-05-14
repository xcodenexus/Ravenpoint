'use client'

import { useState } from 'react'

interface CitationProps {
  index: number
  source?: string
  onClick?: () => void
}

export function Citation({ index, source, onClick }: CitationProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <span className="relative inline-flex">
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="font-mono text-[10px] leading-none text-signal hover:text-text-primary transition-colors duration-[120ms] cursor-pointer align-super"
        aria-label={source ? `Citation ${index}: ${source}` : `Citation ${index}`}
      >
        [{index}]
      </button>
      {hovered && source && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-48 px-2.5 py-2 bg-surface-overlay border border-border-default text-[11px] font-sans text-text-secondary pointer-events-none"
          style={{
            borderRadius: '4px',
            animation: 'fade-in 120ms ease-out both',
          }}
        >
          {source}
        </span>
      )}
    </span>
  )
}
