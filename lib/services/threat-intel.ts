import type { ThreatRecord } from '@/lib/types/threat-intel'
import ip1 from '@/mock-data/threat-intel/198.51.100.42.json'
import ip2 from '@/mock-data/threat-intel/203.0.113.77.json'
import ip3 from '@/mock-data/threat-intel/45.142.212.15.json'

const DB: Record<string, ThreatRecord> = {
  '198.51.100.42': ip1 as ThreatRecord,
  '203.0.113.77':  ip2 as ThreatRecord,
  '45.142.212.15': ip3 as ThreatRecord,
}

export async function getThreatIntel(ip: string): Promise<ThreatRecord | null> {
  // LATER: return fetch(`${process.env.API_URL}/threat-intel/${ip}`).then(r => r.json())
  return DB[ip] ?? null
}
