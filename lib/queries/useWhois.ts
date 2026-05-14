import { useQuery } from '@tanstack/react-query'
import { getWhois } from '@/lib/services/whois'

export function useWhois(domain: string | null) {
  return useQuery({
    queryKey: ['whois', domain],
    queryFn: () => getWhois(domain!),
    enabled: domain != null,
  })
}
