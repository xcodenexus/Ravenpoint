import type { CertHistory } from '@/lib/types/cert'
import exfilC2Ru   from '@/mock-data/certs/exfil-c2.ru.json'
import malwareDrop from '@/mock-data/certs/malware-drop.net.json'

const DB: Record<string, CertHistory> = {
  'exfil-c2.ru':      exfilC2Ru   as CertHistory,
  'malware-drop.net': malwareDrop as CertHistory,
}

export async function getCerts(domain: string): Promise<CertHistory | null> {
  // LATER: return fetch(`${process.env.API_URL}/certs/${domain}`).then(r => r.json())
  return DB[domain.toLowerCase()] ?? null
}
