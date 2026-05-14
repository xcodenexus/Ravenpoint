import type { BreachSummary } from '@/lib/types/breach'
import h4x0r from '@/mock-data/breach/h4x0r@protonmail.com.json'
import admin  from '@/mock-data/breach/admin@darkmail.cc.json'

const DB: Record<string, BreachSummary> = {
  'h4x0r@protonmail.com': h4x0r as BreachSummary,
  'admin@darkmail.cc':     admin as BreachSummary,
}

export async function getBreach(email: string): Promise<BreachSummary | null> {
  // LATER: return fetch(`${process.env.API_URL}/breach/${email}`).then(r => r.json())
  return DB[email.toLowerCase()] ?? null
}
