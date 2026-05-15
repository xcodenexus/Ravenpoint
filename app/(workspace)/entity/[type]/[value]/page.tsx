'use client'

import React, { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useEntity } from '@/lib/queries/useEntities'
import { useWhois } from '@/lib/queries/useWhois'
import { useDns } from '@/lib/queries/useDns'
import { useCerts } from '@/lib/queries/useCerts'
import { useBreach } from '@/lib/queries/useBreach'
import { useSocial } from '@/lib/queries/useSocial'
import { useThreatIntel } from '@/lib/queries/useThreatIntel'
import { useOnchain } from '@/lib/queries/useOnchain'
import { useInvestigations } from '@/lib/queries/useInvestigation'
import { Skeleton, Tabs } from '@/components/ui'
import {
  EntityHeader,
  TabOverview,
  TabInfrastructure,
  TabExposure,
  TabSocial,
  TabTimeline,
} from '@/components/entity'
import type { EntityType } from '@/lib/types/entity'
import type { RelatedEntity } from '@/components/entity'

const ENTITY_TABS = [
  { value: 'overview',       label: 'Overview'       },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'exposure',       label: 'Exposure'       },
  { value: 'social',         label: 'Social'         },
  { value: 'timeline',       label: 'Timeline'       },
  { value: 'pivots',         label: 'Pivots'         },
]

export default function EntityPage() {
  const { type, value }             = useParams<{ type: string; value: string }>()
  const router                      = useRouter()
  const decoded                     = decodeURIComponent(value)
  const entityType                  = type as EntityType
  const [tab, setTab]               = useState('overview')

  const isDomain   = entityType === 'domain'
  const isIp       = entityType === 'ip'
  const isEmail    = entityType === 'email'
  const isUsername = entityType === 'username'
  const isWallet   = entityType === 'wallet'

  const { data: entity,      isLoading: loadingEntity }      = useEntity(entityType, decoded)
  const { data: whois,       isLoading: loadingWhois }       = useWhois(isDomain    ? decoded : null)
  const { data: dns,         isLoading: loadingDns }         = useDns(isDomain      ? decoded : null)
  const { data: certs,       isLoading: loadingCerts }       = useCerts(isDomain    ? decoded : null)
  const { data: breach,      isLoading: loadingBreach }      = useBreach(isEmail    ? decoded : null)
  const { data: social,      isLoading: loadingSocial }      = useSocial(isUsername ? decoded : null)
  const { data: threatIntel, isLoading: loadingThreatIntel } = useThreatIntel(isIp  ? decoded : null)
  const { data: onchain,     isLoading: loadingOnchain }     = useOnchain(isWallet  ? decoded : null)
  const { data: investigations }                             = useInvestigations()

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const { related, investigationId } = useMemo(() => {
    if (!investigations || !entity) return { related: [], investigationId: null }

    for (const inv of investigations) {
      const node = inv.graph.nodes.find(n => n.type === entityType && n.value === decoded)
      if (!node) continue

      const edges = inv.graph.edges.filter(e => e.source === node.id || e.target === node.id)
      const relatedEntities: RelatedEntity[] = edges.flatMap(edge => {
        const otherId   = edge.source === node.id ? edge.target : edge.source
        const otherNode = inv.graph.nodes.find(n => n.id === otherId)
        if (!otherNode) return []
        return [{ node: otherNode, edge, direction: (edge.source === node.id ? 'out' : 'in') as 'out' | 'in' }]
      })

      return { related: relatedEntities, investigationId: inv.id }
    }

    return { related: [], investigationId: null }
  }, [investigations, entity, entityType, decoded])

  const isLoading =
    loadingEntity ||
    (isDomain   && (loadingWhois || loadingDns || loadingCerts)) ||
    (isIp       && loadingThreatIntel) ||
    (isEmail    && loadingBreach) ||
    (isUsername && loadingSocial) ||
    (isWallet   && loadingOnchain)

  if (isLoading) {
    return (
      <div className="px-8 py-8 flex flex-col gap-6 max-w-4xl">
        <Skeleton className="w-full h-24" />
        <Skeleton variant="line" className="w-full" />
        <Skeleton className="w-full h-48" />
      </div>
    )
  }

  if (!entity) {
    return (
      <div className="px-8 py-8">
        <p className="font-mono text-[13px] text-danger">Entity not found: {decoded}</p>
      </div>
    )
  }

  function handleEntityClick(t: EntityType, v: string) {
    router.push(`/entity/${t}/${encodeURIComponent(v)}`)
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      <EntityHeader entity={entity} />

      <div className="mt-6">
        <Tabs items={ENTITY_TABS} value={tab} onChange={setTab} />
      </div>

      <div className="mt-6">
        {tab === 'overview' && (
          <TabOverview
            entity={entity}
            related={related}
            whois={whois}
            threatIntel={threatIntel}
            breach={breach}
            social={social}
            onchain={onchain}
            investigationId={investigationId}
            onEntityClick={handleEntityClick}
          />
        )}

        {tab === 'infrastructure' && (
          <TabInfrastructure
            entityType={entityType}
            whois={whois}
            dns={dns}
            certs={certs}
            threatIntel={threatIntel}
            onchain={onchain}
          />
        )}

        {tab === 'exposure' && (
          <TabExposure entityType={entityType} breach={breach} />
        )}

        {tab === 'social' && (
          <TabSocial entityType={entityType} social={social} />
        )}

        {tab === 'timeline' && (
          <TabTimeline
            whois={whois}
            dns={dns}
            certs={certs}
            threatIntel={threatIntel}
            breach={breach}
            social={social}
            onchain={onchain}
          />
        )}

        {tab === 'pivots' && (
          <p className="font-sans text-[13px] text-text-tertiary">
            Pivot suggestions — Session 7.
          </p>
        )}
      </div>
    </div>
  )
}
