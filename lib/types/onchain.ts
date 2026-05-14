export type Chain = 'bitcoin' | 'ethereum' | 'solana'

export interface Transaction {
  txHash: string
  timestamp: string
  direction: 'in' | 'out'
  amount: number
  amountUsd: number
  counterparty: string
  counterpartyLabel: string | null
  confirmed: boolean
  blockHeight: number
}

export interface WalletSummary {
  address: string
  chain: Chain
  label: string | null
  balance: number
  balanceUsd: number
  totalIn: number
  totalOut: number
  txCount: number
  firstTx: string
  lastTx: string
  riskScore: number
  riskFlags: string[]
  transactions: Transaction[]
}
