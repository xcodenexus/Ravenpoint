export interface BreachRecord {
  name: string
  title: string
  domain: string
  breachDate: string
  addedDate: string
  dataClasses: string[]
  pwnCount: number
  description: string
  isVerified: boolean
  isFabricated: boolean
  isSensitive: boolean
}

export interface BreachSummary {
  email: string
  breachCount: number
  pasteCount: number
  exposedPasswords: boolean
  exposedFinancial: boolean
  breaches: BreachRecord[]
}
