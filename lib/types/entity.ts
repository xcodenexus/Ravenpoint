export type EntityType = 'domain' | 'ip' | 'email' | 'username' | 'wallet'

export interface BaseEntity {
  type: EntityType
  value: string
  threatScore: number
  firstSeen: string
  lastSeen: string
  tags: string[]
}

export interface DomainEntity   extends BaseEntity { type: 'domain'   }
export interface IpEntity       extends BaseEntity { type: 'ip'       }
export interface EmailEntity    extends BaseEntity { type: 'email'    }
export interface UsernameEntity extends BaseEntity { type: 'username' }
export interface WalletEntity   extends BaseEntity { type: 'wallet'   }

export type Entity =
  | DomainEntity
  | IpEntity
  | EmailEntity
  | UsernameEntity
  | WalletEntity
