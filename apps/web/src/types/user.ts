import type { RouterOutputs } from '@repo/api'

export type UserRow = RouterOutputs['user']['getAll']['users'][number];