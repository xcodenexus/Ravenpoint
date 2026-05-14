import { useQuery } from '@tanstack/react-query'
import { getBreach } from '@/lib/services/breach'

export function useBreach(email: string | null) {
  return useQuery({
    queryKey: ['breach', email],
    queryFn: () => getBreach(email!),
    enabled: email != null,
  })
}
