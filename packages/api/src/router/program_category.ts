import { z } from 'zod'
import { prisma } from '@repo/database'
import { protectedProcedure, createTRPCRouter } from '../trpc.js'

export const programCategoryRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional()
      })
    )
    .query(async ({ input }) => {
      const { page, limit, search } = input

      const whereCondition = search ? { name: { contains: search } } : {}

      const [categories, meta] = await prisma.programCategory
        .paginate({
          where: whereCondition,
          orderBy: { name: 'asc' }
        })
        .withPages({
          limit,
          page
        })

      return {
        categories,
        meta
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const category = await prisma.programCategory.findUnique({
        where: { id: input.id },
        include: {
          programs: {
            select: {
              id: true,
              description: true,
              targetAudience: true,
              level: true
            }
          }
        }
      })

      if (!category) {
        throw new Error('Kategoria nie została znaleziona')
      }

      return category
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, 'Nazwa kategorii jest wymagana')
          .max(100, 'Nazwa kategorii jest zbyt długa')
      })
    )
    .mutation(async ({ input }) => {
      const category = await prisma.programCategory.create({
        data: {
          name: input.name
        }
      })

      return category
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z
          .string()
          .min(1, 'Nazwa kategorii jest wymagana')
          .max(100, 'Nazwa kategorii jest zbyt długa')
      })
    )
    .mutation(async ({ input }) => {
      const { id, name } = input

      const existingCategory = await prisma.programCategory.findUnique({
        where: { id }
      })

      if (!existingCategory) {
        throw new Error('Kategoria nie została znaleziona')
      }

      const category = await prisma.programCategory.update({
        where: { id },
        data: { name }
      })

      return category
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const existingCategory = await prisma.programCategory.findUnique({
        where: { id: input.id }
      })

      if (!existingCategory) {
        throw new Error('Kategoria nie została znaleziona')
      }

      const programsCount = await prisma.program.count({
        where: {
          categoryId: input.id
        }
      })

      if (programsCount > 0) {
        throw new Error(
          'Nie można usunąć kategorii, która jest przypisana do programów'
        )
      }

      await prisma.programCategory.delete({
        where: { id: input.id }
      })

      return { success: true, message: 'Kategoria została usunięta' }
    })
})
