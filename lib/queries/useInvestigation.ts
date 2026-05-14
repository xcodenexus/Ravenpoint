import { useQuery } from '@tanstack/react-query'
import { getInvestigation, getInvestigations } from '@/lib/services/investigations'

export function useInvestigations() {
  return useQuery({
    queryKey: ['investigations'],
    queryFn: getInvestigations,
  })
}

export function useInvestigation(id: string | null) {
  return useQuery({
    queryKey: ['investigation', id],
    queryFn: () => getInvestigation(id!),
    enabled: id != null,
  })
}
