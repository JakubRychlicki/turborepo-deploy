import type { RouterOutputs } from '@repo/api'

export type CategoryOption = {
  id: number
  name: string
}

export type Category = RouterOutputs['programCategory']['getAll']['categories'][number];