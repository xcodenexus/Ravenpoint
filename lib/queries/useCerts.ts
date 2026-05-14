import { useQuery } from '@tanstack/react-query'
import { getCerts } from '@/lib/services/cert-transparency'

export function useCerts(domain: string | null) {
  return useQuery({
    queryKey: ['certs', domain],
    queryFn: () => getCerts(domain!),
    enabled: domain != null,
  })
}
