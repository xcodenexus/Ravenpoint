'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Brain, Square, ChevronDown, AlertTriangle } from 'lucide-react'
import { usePathname } from 'next/navigation'

type Mode = 'summarize' | 'pivot' | 'report'

const MODES: { value: Mode; label: string; description: string }[] = [
  { value: 'summarize', label: 'Summarize',  description: 'Threat summary for current entity' },
  { value: 'pivot',     label: 'Pivots',     description: 'Next investigation steps'          },
  { value: 'report',    label: 'Report',     description: 'Full OSINT intelligence report'    },
]

function parseEntityFromPath(pathname: string): { type: string; value: string } | null {
  const match = pathname.match(/^\/entity\/([^/]+)\/(.+)$/)
  if (!match) return null
  return { type: match[1], value: decodeURIComponent(match[2]) }
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-text-primary font-medium">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[11px] text-signal bg-surface-overlay px-1" style={{ borderRadius: '2px' }}>
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="font-sans text-[12px] text-text-secondary leading-relaxed space-y-1.5">
      {lines.map((line, i) => {
        if (line.startsWith('# '))   return <h1 key={i} className="font-mono text-[13px] text-text-primary font-medium mt-3 first:mt-0">{line.slice(2)}</h1>
        if (line.startsWith('## '))  return <h2 key={i} className="font-mono text-[12px] text-text-primary mt-3 first:mt-0">{line.slice(3)}</h2>
        if (line.startsWith('### ')) return <h3 key={i} className="font-sans text-[11px] text-text-secondary uppercase tracking-[0.06em] mt-2">{line.slice(4)}</h3>
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex gap-2 items-baseline">
              <span className="text-signal shrink-0">·</span>
              <span>{renderInline(line.slice(2))}</span>
            </div>
          )
        }
        if (/^\d+\.\s/.test(line)) {
          const dotIdx = line.indexOf('. ')
          const num    = line.slice(0, dotIdx)
          const rest   = line.slice(dotIdx + 2)
          return (
            <div key={i} className="flex gap-2 items-baseline">
              <span className="font-mono text-[10px] text-text-tertiary shrink-0">{num}.</span>
              <span>{renderInline(rest)}</span>
            </div>
          )
        }
        if (line.trim() === '') return <div key={i} className="h-1" />
        return <p key={i}>{renderInline(line)}</p>
      })}
    </div>
  )
}

export function AnalystPanel() {
  const pathname                = usePathname()
  const entity                  = parseEntityFromPath(pathname)
  const [mode, setMode]         = useState<Mode>('summarize')
  const [modeOpen, setModeOpen] = useState(false)
  const [output, setOutput]     = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [hasKey, setHasKey]     = useState<boolean | null>(null)
  const abortRef                = useRef<AbortController | null>(null)
  const outputRef               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/analyst', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ mode: 'summarize' }),
    })
      .then(r => setHasKey(r.status !== 500))
      .catch(() => setHasKey(false))
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const analyze = useCallback(async () => {
    if (streaming) return
    setOutput('')
    setError(null)
    setStreaming(true)
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/analyst', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          mode,
          entityType:  entity?.type,
          entityValue: entity?.value,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''

        for (const event of events) {
          const line = event.replace(/^data: /, '').trim()
          if (!line || line === '[DONE]') continue
          try {
            const parsed = JSON.parse(line) as { text?: string; error?: string }
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.text)  setOutput(prev => prev + parsed.text)
          } catch {
            // skip malformed SSE frames
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message)
    } finally {
      setStreaming(false)
    }
  }, [mode, entity, streaming])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setStreaming(false)
  }, [])

  const currentMode = MODES.find(m => m.value === mode)!

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="px-4 py-3 border-b border-border-subtle shrink-0">
        {entity && (
          <div className="font-mono text-[10px] text-text-tertiary truncate mb-2">
            {entity.type} · {entity.value}
          </div>
        )}

        {/* Mode selector */}
        <div className="relative">
          <button
            onClick={() => setModeOpen(o => !o)}
            className="w-full flex items-center justify-between h-7 px-2.5 border border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors duration-[120ms]"
            style={{ borderRadius: '2px' }}
          >
            <span className="font-sans text-[12px]">{currentMode.label}</span>
            <ChevronDown
              size={11}
              style={{ transition: 'transform 120ms', transform: modeOpen ? 'rotate(180deg)' : 'none' }}
            />
          </button>

          {modeOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1 border border-border-default bg-surface-overlay z-10"
              style={{ borderRadius: '2px' }}
            >
              {MODES.map(m => (
                <button
                  key={m.value}
                  onClick={() => { setMode(m.value); setModeOpen(false) }}
                  className="w-full text-left px-3 py-2 hover:bg-surface-hover transition-colors duration-[120ms]"
                >
                  <div className="font-sans text-[12px] text-text-primary">{m.label}</div>
                  <div className="font-sans text-[10px] text-text-tertiary">{m.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Analyze / Stop */}
        <button
          onClick={streaming ? stop : analyze}
          disabled={hasKey === false}
          className="w-full flex items-center justify-center gap-1.5 h-7 mt-2 border transition-colors duration-[120ms] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            borderRadius: '2px',
            borderColor:  streaming ? 'var(--danger)' : 'var(--signal)',
            color:        streaming ? 'var(--danger)' : 'var(--signal)',
          }}
        >
          {streaming
            ? <><Square size={10} /><span className="font-sans text-[11px]">Stop</span></>
            : <><Brain  size={10} /><span className="font-sans text-[11px]">Analyze</span></>
          }
        </button>

        {hasKey === false && (
          <div className="flex items-center gap-1.5 mt-2">
            <AlertTriangle size={10} className="text-warning shrink-0" />
            <span className="font-sans text-[10px] text-warning">ANTHROPIC_API_KEY not set</span>
          </div>
        )}
      </div>

      {/* Output */}
      <div ref={outputRef} className="flex-1 overflow-y-auto px-4 py-4">
        {!output && !streaming && !error && (
          <p className="font-sans text-[12px] text-text-tertiary text-center mt-8 leading-relaxed">
            {entity
              ? `Select a mode and click Analyze to get AI insights on ${entity.value}.`
              : 'Navigate to an entity page to get contextual AI analysis.'
            }
          </p>
        )}

        {error && (
          <div
            className="flex items-start gap-2 p-3 border border-danger bg-surface-raised"
            style={{ borderRadius: '2px' }}
          >
            <AlertTriangle size={12} className="text-danger shrink-0 mt-0.5" />
            <span className="font-sans text-[12px] text-danger">{error}</span>
          </div>
        )}

        {output && <MarkdownText text={output} />}

        {streaming && (
          <span
            className="inline-block w-[2px] h-[14px] ml-0.5 bg-signal align-middle"
            style={{ animation: 'cursor-blink 1s step-end infinite' }}
          />
        )}
      </div>
    </div>
  )
}
