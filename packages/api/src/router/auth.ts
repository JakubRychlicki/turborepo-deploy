import type { TRPCRouterRecord } from '@trpc/server'

import { protectedProcedure, publicProcedure } from '../trpc.js'

export const authRouter = {
  healthCheck: publicProcedure.query(() => {
    return 'OK'
  })
} satisfies TRPCRouterRecord
