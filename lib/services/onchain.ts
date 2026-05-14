import type { WalletSummary } from '@/lib/types/onchain'
import wallet1 from '@/mock-data/onchain/bc1qxy2kgdygjrs6elezzfpiqe9temjsg5ybfqlyr8.json'

const DB: Record<string, WalletSummary> = {
  'bc1qxy2kgdygjrs6elezzfpiqe9temjsg5ybfqlyr8': wallet1 as WalletSummary,
}

export async function getWallet(address: string): Promise<WalletSummary | null> {
  // LATER: return fetch(`${process.env.API_URL}/onchain/${address}`).then(r => r.json())
  return DB[address] ?? null
}
