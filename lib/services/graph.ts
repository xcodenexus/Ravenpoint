import type { GraphData } from '@/lib/types/graph'
import ghostnet from '@/mock-data/graph/ghostnet.json'

const DB: Record<string, GraphData> = {
  ghostnet: ghostnet as GraphData,
}

export async function getGraph(investigationId: string): Promise<GraphData | null> {
  // LATER: return fetch(`${process.env.API_URL}/graph/${investigationId}`).then(r => r.json())
  return DB[investigationId] ?? null
}
