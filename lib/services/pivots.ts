import type { EntityType } from '@/lib/types/entity'
import type { PivotSuggestion } from '@/lib/types/pivot'
import { getWhois } from './whois'
import { getDns } from './dns'
import { getCerts } from './cert-transparency'
import { getThreatIntel } from './threat-intel'
import { getBreach } from './breach'

export async function getPivots(
  type: EntityType,
  value: string,
): Promise<PivotSuggestion[]> {
  // LATER: return fetch(`${process.env.API_URL}/pivots?type=${type}&value=${value}`).then(r => r.json())
  const pivots: PivotSuggestion[] = []

  if (type === 'domain') {
    const [whois, dns, certs] = await Promise.all([
      getWhois(value),
      getDns(value),
      getCerts(value),
    ])

    if (dns) {
      for (const rec of dns.records.filter(r => r.type === 'A')) {
        pivots.push({
          entityType: 'ip',
          value: rec.value,
          reason: 'DNS A record — active resolution target',
          source: 'dns',
          confidence: 100,
          threatScore: 70,
        })
      }
    }

    if (certs) {
      const allSans = new Set<string>()
      for (const cert of certs.certs) {
        for (const san of cert.sans) {
          if (san !== value && !san.startsWith('www.')) allSans.add(san)
        }
      }
      for (const san of allSans) {
        pivots.push({
          entityType: 'domain',
          value: san,
          reason: 'Subject Alternative Name in certificate — may share infrastructure',
          source: 'cert',
          confidence: 85,
          threatScore: 65,
        })
      }
    }

    if (whois?.registrantOrg) {
      pivots.push({
        entityType: 'domain',
        value: whois.registrantOrg,
        reason: 'Shared registrant org — may control additional domains',
        source: 'whois',
        confidence: 80,
        threatScore: 60,
      })
    }
  }

  if (type === 'ip') {
    const intel = await getThreatIntel(value)
    if (intel?.domain) {
      pivots.push({
        entityType: 'domain',
        value: intel.domain,
        reason: 'Reverse DNS — domain associated with this IP',
        source: 'threat_intel',
        confidence: 75,
        threatScore: 55,
      })
    }
  }

  if (type === 'email') {
    const breach = await getBreach(value)
    if (breach) {
      for (const b of breach.breaches.filter(x => x.isVerified)) {
        pivots.push({
          entityType: 'domain',
          value: b.domain,
          reason: `Verified breach — email appeared in ${b.title}`,
          source: 'breach',
          confidence: 90,
          threatScore: 50,
        })
      }
    }
  }

  return pivots
}
