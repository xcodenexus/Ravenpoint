import { useQuery } from '@tanstack/react-query'
import { getGraph } from '@/lib/services/graph'

export function useGraph(investigationId: string | null) {
  return useQuery({
    queryKey: ['graph', investigationId],
    queryFn: () => getGraph(investigationId!),
    enabled: investigationId != null,
  })
}
