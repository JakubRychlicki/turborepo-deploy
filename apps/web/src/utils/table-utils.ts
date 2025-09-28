import type { SortingState } from '@tanstack/react-table'

export function getSortParam(sorting: SortingState): string | undefined {
  const primary = sorting[0]
  if (!primary) return undefined
  
  const sortOrder = primary.desc ? 'desc' : 'asc'
  return `${primary.id}:${sortOrder}`
}
