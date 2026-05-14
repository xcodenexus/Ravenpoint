import { useQuery } from '@tanstack/react-query'
import { getPivots } from '@/lib/services/pivots'
import type { EntityType } from '@/lib/types/entity'

export function usePivots(type: EntityType | null, value: string | null) {
  return useQuery({
    queryKey: ['pivots', type, value],
    queryFn: () => getPivots(type!, value!),
    enabled: type != null && value != null,
  })
}
