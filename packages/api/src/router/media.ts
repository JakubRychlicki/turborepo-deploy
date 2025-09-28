import { z } from 'zod'
import { prisma } from '@repo/database'
import { protectedProcedure, createTRPCRouter } from '../trpc.js'
import { TRPCError } from '@trpc/server'
import fs from 'fs'
import path from 'path'

const UPLOADS_ROOT = path.join(process.cwd(), 'uploads')

if (!fs.existsSync(UPLOADS_ROOT)) {
  fs.mkdirSync(UPLOADS_ROOT, { recursive: true })
}

export const mediaRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10)
    }))
    .query(async ({ input }) => {
      const { page, limit } = input

      const [media, meta] = await prisma.media
        .paginate({
          orderBy: { createdAt: 'desc' }
        })
        .withPages({
          limit,
          page
        })

      return {
        media,
        meta
      }
    }),


  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const file = await prisma.media.findUnique({
        where: { id: input.id }
      })
      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' })
      }
      return file
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const file = await prisma.media.findUnique({
        where: { id: input.id }
      })
      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' })
      }

      const filePath = path.join(UPLOADS_ROOT, file.path.replace('uploads/', ''))
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      return prisma.media.delete({
        where: { id: input.id }
      })
    })
})
