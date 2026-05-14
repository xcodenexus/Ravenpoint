export interface CertRecord {
  id: number
  commonName: string
  issuer: string
  notBefore: string
  notAfter: string
  sans: string[]
  serialNumber: string
  fingerprint: string
}

export interface CertHistory {
  domain: string
  certs: CertRecord[]
}
