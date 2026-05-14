import type { Entity } from '@/lib/types/entity'
import raw from '@/mock-data/entities.json'

const ALL = raw as Entity[]

export async function getEntities(): Promise<Entity[]> {
  // LATER: return fetch(`${process.env.API_URL}/entities`).then(r => r.json())
  return ALL
}

export async function getEntity(type: string, value: string): Promise<Entity | null> {
  // LATER: return fetch(`${process.env.API_URL}/entities/${type}/${value}`).then(r => r.json())
  return ALL.find(e => e.type === type && e.value === value) ?? null
}
