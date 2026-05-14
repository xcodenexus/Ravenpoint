import type { DnsRecords } from '@/lib/types/dns'
import exfilC2Ru   from '@/mock-data/dns/exfil-c2.ru.json'
import malwareDrop from '@/mock-data/dns/malware-drop.net.json'

const DB: Record<string, DnsRecords> = {
  'exfil-c2.ru':      exfilC2Ru   as DnsRecords,
  'malware-drop.net': malwareDrop as DnsRecords,
}

export async function getDns(domain: string): Promise<DnsRecords | null> {
  // LATER: return fetch(`${process.env.API_URL}/dns/${domain}`).then(r => r.json())
  return DB[domain.toLowerCase()] ?? null
}
