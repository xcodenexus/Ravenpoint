import type { WhoisRecord } from '@/lib/types/whois'
import exfilC2Ru   from '@/mock-data/whois/exfil-c2.ru.json'
import malwareDrop from '@/mock-data/whois/malware-drop.net.json'
import darkmail    from '@/mock-data/whois/darkmail.cc.json'

const DB: Record<string, WhoisRecord> = {
  'exfil-c2.ru':      exfilC2Ru   as WhoisRecord,
  'malware-drop.net': malwareDrop as WhoisRecord,
  'darkmail.cc':      darkmail    as WhoisRecord,
}

export async function getWhois(domain: string): Promise<WhoisRecord | null> {
  // LATER: return fetch(`${process.env.API_URL}/whois/${domain}`).then(r => r.json())
  return DB[domain.toLowerCase()] ?? null
}
