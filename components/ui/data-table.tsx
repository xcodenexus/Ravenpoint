'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type SortDir = 'asc' | 'desc'

export interface Column<T> {
  key: string
  header: string
  width?: string
  /** Render value in Geist Mono */
  mono?: boolean
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  rows: T[]
  keyField: keyof T
  onRowClick?: (row: T) => void
  /** Returns action nodes shown on hover at the row's right edge */
  actions?: (row: T) => React.ReactNode
  className?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  keyField,
  onRowClick,
  actions,
  className,
}: DataTableProps<T>) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [hoverIdx, setHoverIdx]   = useState<number | null>(null)
  const [selected, setSelected]   = useState<Set<unknown>>(new Set())
  const [sort, setSort]           = useState<{ key: string; dir: SortDir } | null>(null)
  const tableRef                  = useRef<HTMLDivElement>(null)

  const sorted = useMemo(() => {
    if (!sort) return rows
    return [...rows].sort((a, b) => {
      const av = String(a[sort.key] ?? '')
      const bv = String(b[sort.key] ?? '')
      return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [rows, sort])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!tableRef.current?.matches(':focus-within') && tableRef.current !== document.activeElement) return
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx(i => Math.min(i + 1, sorted.length - 1))
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx(i => Math.max(i - 1, 0))
      } else if (e.key === 'x') {
        const key = sorted[activeIdx]?.[keyField]
        if (key == null) return
        setSelected(s => {
          const next = new Set(s)
          if (next.has(key)) { next.delete(key) } else { next.add(key) }
          return next
        })
      } else if (e.key === 'Enter') {
        onRowClick?.(sorted[activeIdx])
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sorted, activeIdx, keyField, onRowClick])

  function toggleSort(key: string) {
    setSort(s => {
      if (s?.key === key) return s.dir === 'asc' ? { key, dir: 'desc' } : null
      return { key, dir: 'asc' }
    })
  }

  return (
    <div
      ref={tableRef}
      tabIndex={0}
      className={cn('w-full overflow-x-auto outline-none focus:outline-none', className)}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-subtle">
            {columns.map(col => (
              <th
                key={col.key}
                className="h-7 px-3 text-left font-sans text-[11px] uppercase tracking-[0.06em] text-text-tertiary font-normal whitespace-nowrap select-none"
                style={{ width: col.width }}
              >
                {col.sortable ? (
                  <button
                    onClick={() => toggleSort(col.key)}
                    className="flex items-center gap-1 hover:text-text-secondary transition-colors duration-[120ms]"
                  >
                    {col.header}
                    <span className="flex flex-col" style={{ gap: 1 }}>
                      <ChevronUp  size={8} style={{ opacity: sort?.key === col.key && sort.dir === 'asc'  ? 1 : 0.25 }} />
                      <ChevronDown size={8} style={{ opacity: sort?.key === col.key && sort.dir === 'desc' ? 1 : 0.25 }} />
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
            {actions && <th className="w-8" />}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const key        = row[keyField] as React.Key
            const isActive   = i === activeIdx
            const isHovered  = hoverIdx === i
            const isSelected = selected.has(row[keyField])

            return (
              <tr
                key={key}
                onClick={() => { setActiveIdx(i); onRowClick?.(row) }}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="relative border-b border-border-subtle h-8 cursor-pointer group"
                style={{
                  backgroundColor: isActive ? 'var(--surface-hover)' : isHovered ? 'var(--surface-raised)' : undefined,
                  outline: isSelected ? '1px solid var(--signal)' : undefined,
                  outlineOffset: -1,
                }}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-3 text-[13px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px]',
                      col.mono ? 'font-mono text-text-primary' : 'font-sans text-text-secondary',
                    )}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
                {actions && (
                  <td className="px-2">
                    <span
                      className="flex items-center justify-end gap-1 transition-opacity duration-[120ms]"
                      style={{ opacity: isHovered ? 1 : 0 }}
                    >
                      {actions(row)}
                    </span>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
