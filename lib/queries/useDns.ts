import { useQuery } from '@tanstack/react-query'
import { getDns } from '@/lib/services/dns'

export function useDns(domain: string | null) {
  return useQuery({
    queryKey: ['dns', domain],
    queryFn: () => getDns(domain!),
    enabled: domain != null,
  })
}
