import { z } from 'zod'
import { prisma } from '@repo/database'
import { protectedProcedure, createTRPCRouter } from '../trpc.js'

export const programKeywordRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10)
      })
    )
    .query(async ({ input }) => {
      const { page, limit } = input

      const [keywords, meta] = await prisma.programKeyword
        .paginate({
          orderBy: { name: 'asc' }
        })
        .withPages({
          limit,
          page
        })

      return {
        keywords,
        meta
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, 'Nazwa słowa kluczowego jest wymagana')
          .max(100, 'Nazwa słowa kluczowego jest zbyt długa')
      })
    )
    .mutation(async ({ input }) => {
      const keyword = await prisma.programKeyword.create({
        data: {
          name: input.name
        }
      })

      return keyword
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z
          .string()
          .min(1, 'Nazwa słowa kluczowego jest wymagana')
          .max(100, 'Nazwa słowa kluczowego jest zbyt długa')
      })
    )
    .mutation(async ({ input }) => {
      const { id, name } = input

      const existingKeyword = await prisma.programKeyword.findUnique({
        where: { id }
      })

      if (!existingKeyword) {
        throw new Error('Słowo kluczowe nie zostało znalezione')
      }

      const keyword = await prisma.programKeyword.update({
        where: { id },
        data: { name }
      })

      return keyword
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const existingKeyword = await prisma.programKeyword.findUnique({
        where: { id: input.id }
      })

      if (!existingKeyword) {
        throw new Error('Słowo kluczowe nie zostało znalezione')
      }

      const programsCount = await prisma.program.count({
        where: {
          keywords: {
            some: {
              id: input.id
            }
          }
        }
      })

      if (programsCount > 0) {
        throw new Error(
          'Nie można usunąć słowa kluczowego, które jest przypisane do programów'
        )
      }

      await prisma.programKeyword.delete({
        where: { id: input.id }
      })

      return { success: true, message: 'Słowo kluczowe zostało usunięte' }
    })
})
