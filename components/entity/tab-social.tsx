'use client'

import React from 'react'
import { User, ExternalLink } from 'lucide-react'
import { StatusDot } from '@/components/ui'
import type { EntityType } from '@/lib/types/entity'
import type { SocialResults } from '@/lib/types/social'

interface TabSocialProps {
  entityType: EntityType
  social?: SocialResults | null
}

const DARK_FORUMS = new Set(['HackForums', 'RaidForums', 'BreachForums', 'Nulled'])

function PlatformRow({ match }: { match: SocialResults['matches'][number] }) {
  const found  = match.status === 'found'
  const isDark = DARK_FORUMS.has(match.platform)

  return (
    <div className="flex items-center gap-4 h-10 -mx-4 px-4 hover:bg-surface-hover transition-colors duration-[120ms]">
      <StatusDot
        status={
          match.status === 'found'          ? 'active'
          : match.status === 'not_found'    ? 'idle'
          : match.status === 'rate_limited' ? 'pending'
          : 'error'
        }
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[12px]"
            style={{ color: isDark && found ? 'var(--danger)' : 'var(--text-primary)' }}
          >
            {match.platform}
          </span>
          {isDark && found && (
            <span
              className="font-sans text-[9px] px-1 py-0.5 border border-danger text-danger uppercase tracking-[0.04em]"
              style={{ borderRadius: '2px' }}
            >
              dark
            </span>
          )}
        </div>
        {found && match.bio && (
          <div className="font-sans text-[11px] text-text-tertiary truncate">{match.bio}</div>
        )}
      </div>

      {found && match.followers !== undefined && (
        <span className="font-mono text-[11px] text-text-tertiary shrink-0">
          {match.followers.toLocaleString()} followers
        </span>
      )}

      {found && match.joinedAt && (
        <span className="font-mono text-[11px] text-text-tertiary shrink-0 hidden sm:block">
          {match.joinedAt.slice(0, 10)}
        </span>
      )}

      {found && match.url && (
        <a
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-tertiary hover:text-text-primary transition-colors duration-[120ms] shrink-0"
        >
          <ExternalLink size={11} />
        </a>
      )}

      {!found && (
        <span className="font-sans text-[11px] text-text-tertiary shrink-0 capitalize">
          {match.status.replace('_', ' ')}
        </span>
      )}
    </div>
  )
}

function SocialView({ social }: { social: SocialResults }) {
  const found    = social.matches.filter(m => m.status === 'found')
  const notFound = social.matches.filter(m => m.status !== 'found')
  const darkHits = found.filter(m => DARK_FORUMS.has(m.platform))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 flex-wrap">
        <div
          className="flex flex-col gap-0.5 border border-border-subtle bg-surface-raised px-3 py-2"
          style={{ borderRadius: '2px' }}
        >
          <span className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em]">Platforms Found</span>
          <span className="font-mono text-[18px] leading-none font-medium text-text-primary">
            {found.length} / {social.matches.length}
          </span>
        </div>
        {darkHits.length > 0 && (
          <div
            className="flex flex-col gap-0.5 border border-danger bg-surface-raised px-3 py-2"
            style={{ borderRadius: '2px' }}
          >
            <span className="font-sans text-[10px] text-danger uppercase tracking-[0.06em]">Dark Forum Hits</span>
            <span className="font-mono text-[18px] leading-none font-medium" style={{ color: 'var(--danger)' }}>
              {darkHits.length}
            </span>
          </div>
        )}
        <div
          className="flex flex-col gap-0.5 border border-border-subtle bg-surface-raised px-3 py-2"
          style={{ borderRadius: '2px' }}
        >
          <span className="font-sans text-[10px] text-text-tertiary uppercase tracking-[0.06em]">Scanned</span>
          <span className="font-mono text-[14px] leading-none text-text-primary">{social.scannedAt.slice(0, 10)}</span>
        </div>
      </div>

      <div className="border border-border-subtle bg-surface-raised divide-y divide-border-subtle" style={{ borderRadius: '2px' }}>
        {found.map(m    => <PlatformRow key={m.platform} match={m} />)}
        {notFound.map(m => <PlatformRow key={m.platform} match={m} />)}
      </div>
    </div>
  )
}

export function TabSocial({ entityType, social }: TabSocialProps) {
  if (entityType !== 'username') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <User size={24} className="text-text-tertiary opacity-40" />
        <p className="font-sans text-[13px] text-text-tertiary">
          Social OSINT is only available for username entities.
        </p>
      </div>
    )
  }

  if (!social) {
    return (
      <p className="font-sans text-[13px] text-text-tertiary py-4">No social data available.</p>
    )
  }

  return <SocialView social={social} />
}
