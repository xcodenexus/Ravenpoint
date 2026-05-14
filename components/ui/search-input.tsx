'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shortcut?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ shortcut, className, onFocus, onBlur, onChange, ...props }, ref) {
    const [focused, setFocused] = useState(false)
    const [hasContent, setHasContent] = useState(
      Boolean(props.value ?? props.defaultValue),
    )

    const showCursor = focused && !hasContent

    return (
      <div className="relative flex items-center w-full">
        {showCursor && (
          <span
            aria-hidden
            className="absolute left-3 top-1/2 -translate-y-1/2 w-px h-3.5 bg-signal pointer-events-none animate-cursor-blink"
          />
        )}
        <input
          ref={ref}
          {...props}
          onFocus={e => { setFocused(true); onFocus?.(e) }}
          onBlur={e => { setFocused(false); onBlur?.(e) }}
          onChange={e => { setHasContent(e.target.value.length > 0); onChange?.(e) }}
          className={cn(
            'h-8 w-full px-3 bg-surface-raised border border-border-default font-sans text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-strong transition-colors duration-[120ms]',
            showCursor && 'caret-transparent',
            shortcut && 'pr-12',
            className,
          )}
          style={{ borderRadius: '4px' }}
        />
        {shortcut && (
          <span
            className="absolute right-2 pointer-events-none flex items-center justify-center px-1 h-4 font-mono text-[10px] text-text-tertiary border border-border-default bg-surface-base"
            style={{ borderRadius: '2px' }}
          >
            {shortcut}
          </span>
        )}
      </div>
    )
  },
)
SearchInput.displayName = 'SearchInput'
