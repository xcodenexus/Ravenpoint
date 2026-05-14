import { useQuery } from '@tanstack/react-query'
import { getEntities, getEntity } from '@/lib/services/entities'
import type { EntityType } from '@/lib/types/entity'

export function useEntities() {
  return useQuery({
    queryKey: ['entities'],
    queryFn: getEntities,
  })
}

export function useEntity(type: EntityType | null, value: string | null) {
  return useQuery({
    queryKey: ['entity', type, value],
    queryFn: () => getEntity(type!, value!),
    enabled: type != null && value != null,
  })
}
