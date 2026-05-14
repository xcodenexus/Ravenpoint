import type { SocialResults } from '@/lib/types/social'
import darkuser99   from '@/mock-data/social/darkuser_99.json'
import malw4reK1ng  from '@/mock-data/social/malw4re_k1ng.json'

const DB: Record<string, SocialResults> = {
  'darkuser_99':  darkuser99   as SocialResults,
  'malw4re_k1ng': malw4reK1ng as SocialResults,
}

export async function getSocial(username: string): Promise<SocialResults | null> {
  // LATER: return fetch(`${process.env.API_URL}/social/${username}`).then(r => r.json())
  return DB[username.toLowerCase()] ?? null
}
