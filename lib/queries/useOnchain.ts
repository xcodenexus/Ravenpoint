import { useQuery } from '@tanstack/react-query'
import { getWallet } from '@/lib/services/onchain'

export function useOnchain(address: string | null) {
  return useQuery({
    queryKey: ['onchain', address],
    queryFn: () => getWallet(address!),
    enabled: address != null,
  })
}
