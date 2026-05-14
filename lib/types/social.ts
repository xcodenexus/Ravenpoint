export type SocialMatchStatus = 'found' | 'not_found' | 'rate_limited' | 'error'

export interface SocialMatch {
  platform: string
  url: string | null
  status: SocialMatchStatus
  followers?: number
  joinedAt?: string
  bio?: string
}

export interface SocialResults {
  username: string
  scannedAt: string
  matches: SocialMatch[]
}
