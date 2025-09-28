import { z } from 'zod'
import { prisma } from '@repo/database'
import { protectedProcedure, createTRPCRouter } from '../trpc.js'

export const goalRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10)
      })
    )
    .query(async ({ input }) => {
      const { page, limit } = input

      const [goals, meta] = await prisma.goal
        .paginate({
          orderBy: { name: 'asc' }
        })
        .withPages({
          limit,
          page
        })

      return {
        goals,
        meta
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, 'Nazwa celu jest wymagana')
          .max(100, 'Nazwa celu jest zbyt długa')
      })
    )
    .mutation(async ({ input }) => {
      const goal = await prisma.goal.create({
        data: {
          name: input.name
        }
      })

      return goal
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z
          .string()
          .min(1, 'Nazwa celu jest wymagana')
          .max(100, 'Nazwa celu jest zbyt długa')
      })
    )
    .mutation(async ({ input }) => {
      const { id, name } = input

      const existingGoal = await prisma.goal.findUnique({
        where: { id }
      })

      if (!existingGoal) {
        throw new Error('Cel nie został znaleziony')
      }

      const goal = await prisma.goal.update({
        where: { id },
        data: { name }
      })

      return goal
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const existingGoal = await prisma.goal.findUnique({
        where: { id: input.id }
      })

      if (!existingGoal) {
        throw new Error('Cel nie został znaleziony')
      }

      const usersCount = await prisma.user.count({
        where: {
          goals: {
            some: {
              id: input.id
            }
          }
        }
      })

      if (usersCount > 0) {
        throw new Error(
          'Nie można usunąć celu, który jest przypisany do użytkowników'
        )
      }

      await prisma.goal.delete({
        where: { id: input.id }
      })

      return { success: true, message: 'Cel został usunięty' }
    })
})
