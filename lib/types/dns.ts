export type DnsRecordType = 'A' | 'AAAA' | 'MX' | 'NS' | 'TXT' | 'CNAME' | 'SOA' | 'PTR'

export interface DnsRecord {
  type: DnsRecordType
  value: string
  ttl: number
  priority?: number
  firstSeen?: string
  lastSeen?: string
}

export interface DnsRecords {
  domain: string
  resolvedAt: string
  records: DnsRecord[]
}
