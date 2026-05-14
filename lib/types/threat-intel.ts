export interface ThreatCategory {
  id: number
  name: string
}

export interface ThreatReport {
  reportedAt: string
  categories: ThreatCategory[]
  comment: string
  country: string | null
}

export interface ThreatRecord {
  ipAddress: string
  isPublic: boolean
  ipVersion: number
  isWhitelisted: boolean
  abuseConfidenceScore: number
  countryCode: string | null
  usageType: string
  isp: string
  domain: string | null
  hostnames: string[]
  totalReports: number
  numDistinctUsers: number
  lastReportedAt: string | null
  reports: ThreatReport[]
}
