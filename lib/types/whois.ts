export interface WhoisHistoryEntry {
  date: string
  registrar: string
  registrantOrg: string | null
  nameservers: string[]
}

export interface WhoisRecord {
  domain: string
  registrar: string
  registeredAt: string
  expiresAt: string
  updatedAt: string
  nameservers: string[]
  registrantOrg: string | null
  registrantCountry: string | null
  dnssec: boolean
  status: string[]
  history: WhoisHistoryEntry[]
}
