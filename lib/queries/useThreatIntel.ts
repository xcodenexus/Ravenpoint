import { useQuery } from '@tanstack/react-query'
import { getThreatIntel } from '@/lib/services/threat-intel'

export function useThreatIntel(ip: string | null) {
  return useQuery({
    queryKey: ['threat-intel', ip],
    queryFn: () => getThreatIntel(ip!),
    enabled: ip != null,
  })
}
