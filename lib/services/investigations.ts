import type { Investigation } from '@/lib/types/investigation'
import ghostnet from '@/mock-data/investigations/ghostnet.json'

const DB: Record<string, Investigation> = {
  ghostnet: ghostnet as unknown as Investigation,
}

const ALL: Investigation[] = Object.values(DB)

export async function getInvestigations(): Promise<Investigation[]> {
  // LATER: return fetch(`${process.env.API_URL}/investigations`).then(r => r.json())
  return ALL
}

export async function getInvestigation(id: string): Promise<Investigation | null> {
  // LATER: return fetch(`${process.env.API_URL}/investigations/${id}`).then(r => r.json())
  return DB[id] ?? null
}
