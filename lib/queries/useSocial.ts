import { useQuery } from '@tanstack/react-query'
import { getSocial } from '@/lib/services/social'

export function useSocial(username: string | null) {
  return useQuery({
    queryKey: ['social', username],
    queryFn: () => getSocial(username!),
    enabled: username != null,
  })
}
